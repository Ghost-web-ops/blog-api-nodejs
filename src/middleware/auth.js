// src/middleware/auth.js
import jwt from "jsonwebtoken"; // استيراد مكتبة JWT

 export default function(req, res, next) {
  // 1. احصل على التوكن من الـ header
  const token = req.header('Authorization');

  // 2. تحقق مما إذا كان التوكن غير موجود
  if (!token) {
    return res.status(401).json({ error: 'Access denied. No token provided.' });
  }

  // 3. تحقق من صحة التوكن
  try {
    // Bearer eyJhbGciOiJI...
    const justToken = token.split(' ')[1];
    const decoded = jwt.verify(justToken, process.env.JWT_SECRET);
console.error('JWT verification error:', err); 
    // أضف بيانات المستخدم (payload) إلى كائن الطلب (req)
    req.user = decoded; 
    next(); // انتقل إلى الدالة التالية (منطق المسار)
  } catch (ex) {
    res.status(400).json({ error: 'Invalid token.' });
  }
};  