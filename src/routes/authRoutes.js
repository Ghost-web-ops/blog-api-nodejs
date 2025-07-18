// src/routes/authRoutes.js
import express from 'express';
const router = express.Router();
import passport from 'passport';
import jwt from 'jsonwebtoken';

// المسار الأول: بدء عملية تسجيل الدخول عبر Google
// عند زيارة هذا الرابط، سيتم تحويل المستخدم إلى صفحة تسجيل دخول Google

router.get('/auth/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

// المسار الثاني: الرابط الذي يعود إليه Google بعد تسجيل الدخول
router.get('/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/login',
    session: false, }), // نستخدم session: false لأننا سنعتمد على JWT
  (req, res) => {
    console.log("User from Google:", req.user);
    // إذا نجحت المصادقة، سيقوم passport بإضافة كائن user إلى الطلب (req)
    // الآن، نقوم بإنشاء توكن JWT خاص بنا لهذا المستخدم
    const token = jwt.sign(
      { userId: req.user.id },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );
    const frontendURL = process.env.CLIENT_REDIRECT_URL;
    const redirectUrl =`${frontendURL}/google-redirect?token=${token}`;
    // هنا يمكنك إعادة توجيه المستخدم إلى الواجهة الأمامية مع التوكن
    // (سنتعامل مع هذا الجزء لاحقًا في الفرونت اند)
        return res.redirect(redirectUrl);

  }
);

export default router;
