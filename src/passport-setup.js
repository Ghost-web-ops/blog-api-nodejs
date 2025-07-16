// src/passport-setup.js
import passport from 'passport';
import GoogleStrategy from 'passport-google-oauth20';
import pool from './db.js'; // استيراد الاتصال بقاعدة البيانات

passport.use(new GoogleStrategy({
    // 1. خيارات استراتيجية Google
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_UR // الرابط الذي سيعود إليه Google
  },
  async (accessToken, refreshToken, profile, done) => {
    // 2. هذه الدالة تعمل بعد أن يسجل المستخدم دخوله بنجاح في Google
    const { id, displayName, emails } = profile;
    const email = emails[0].value;

    try {
      // 3. تحقق مما إذا كان المستخدم موجودًا في قاعدة بياناتنا
      const userResult = await pool.query('SELECT * FROM users WHERE email = $1', [email]);

      if (userResult.rows.length > 0) {
        // المستخدم موجود، قم بإرجاعه
        return done(null, userResult.rows[0]);
      } else {
        // المستخدم غير موجود، قم بإنشاء حساب جديد له
        const newUser = await pool.query(
          // نستخدم اسم Google كـ username وكلمة مرور عشوائية لأنها لن تستخدم
          'INSERT INTO users (username, email, password_hash) VALUES ($1, $2, $3) RETURNING *',
          [displayName, email, 'google_oauth_user']
        );
        return done(null, newUser.rows[0]);
      }
    } catch (err) {
      return done(err, null);
    }
  }
));