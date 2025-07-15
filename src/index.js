// src/index.js

import "dotenv/config"; // استيراد متغيرات البيئة
import express from "express";
import cors from "cors";
import userRoutes from "./routes/userRoutes.js"; // استيراد مسارات المستخدمين
import postRoutes from "./routes/postRoutes.js"; // استيراد مسارات المشاركات
import authRoutes from "./routes/authRoutes.js"; // استيراد مسارات المصادقة
import passport from "passport"; // استيراد مكتبة Passport للمصادقة
import "./passport-setup.js"; // استيراد إعدادات Passport
// إعداد السيرفر
const app = express();
const port = process.env.PORT || 4000;
app.use(cors());
app.use(express.json());
app.use(passport.initialize()); 
app.use(express.urlencoded({ extended: true }));
app.use("/api", userRoutes);
app.use("/api/posts", postRoutes);
app.use('/api', authRoutes);


// إعداد الاتصال بقاعدة البيانات

// Route تجريبي
app.get("/", (req, res) => {
  res.send("Blog API is running!");
});

// تشغيل السيرفر
app.listen(port, () => {
  console.log(`Server is listening on http://localhost:${port}`);
});
