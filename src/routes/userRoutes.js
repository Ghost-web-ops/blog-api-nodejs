// src/routes/userRoutes.js

import express from "express"; // استيراد مكتبة إكسبريس
const router = express.Router(); // استيراد راوتر إكسبريس
import pool from "../db.js"; //  <- استيراد الاتصال بقاعدة البيانات
import bcrypt from "bcryptjs"; //  <- استيراد مكتبة تشفير كلمة المرور
import jwt from "jsonwebtoken"; //  <- استيراد مكتبة JWT

//  POST /api/register
router.post("/register", async (req, res) => {
  try {
    // 1. استخلاص البيانات من جسم الطلب
    const { username, email, password } = req.body;

    // 2. التحقق من وجود كل البيانات
    if (!username || !email || !password) {
      return res
        .status(400)
        .json({ error: "Please provide username, email, and password" });
    }

    // 3. التحقق مما إذا كان الإيميل أو اسم المستخدم موجودًا بالفعل
    const existingUser = await pool.query(
      "SELECT * FROM users WHERE email = $1 OR username = $2",
      [email, username]
    );

    if (existingUser.rows.length > 0) {
      return res
        .status(409)
        .json({ error: "Username or email already exists" });
    }

    // 4. تشفير كلمة المرور
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // 5. حفظ المستخدم الجديد في قاعدة البيانات
    const newUser = await pool.query(
      "INSERT INTO users (username, email, password_hash) VALUES ($1, $2, $3) RETURNING id, username, email, created_at",
      [username, email, passwordHash]
    );

    // 6. إرسال رد ناجح
    res.status(201).json(newUser.rows[0]);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Server error" });
  }
});
// src/routes/userRoutes.js

// ... الكود السابق لـ router.post('/register', ...)
// <-- لا تنس استيراد هذه الحزمة

//  POST /api/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log(`1. Login attempt for email: ${email}`);

    if (!email || !password) {
      return res.status(400).json({ error: 'Please provide email and password' });
    }

    const userResult = await pool.query('SELECT * FROM users WHERE email = $1', [email]);

    if (userResult.rows.length === 0) {
      console.log('2. User not found in database.');
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const user = userResult.rows[0];
    console.log('2. User found in database:', user.username);
    console.log('3. Comparing passwords...');
    console.log('   - Hashed password from DB:', user.password_hash);

    const validPassword = await bcrypt.compare(password, user.password_hash);
    console.log('4. Password comparison result:', validPassword);

    if (!validPassword) {
      console.log('5. Password does not match.');
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    console.log('5. Password matches! Creating token...');
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.status(200).json({ token });

  } catch (error) {
    console.error("Login Error:", error.message);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
