import express from "express"; // استيراد مكتبة إكسبريس
const router = express.Router(); // استيراد راوتر إكسبريس
import pool from "../db.js"; //  <- استيراد الاتصال بقاعدة البيانات
import auth from "../middleware/auth.js"; // استيراد الميدل وير للتحقق من التوكن

router.get("/", async (req, res) => {
  try {
    const allPosts = await pool.query(
      `SELECT 
         posts.id, posts.title, posts.content, posts.created_at,posts.user_id,
         users.username AS author
       FROM posts
       LEFT JOIN users ON posts.user_id = users.id
       ORDER BY posts.created_at DESC`
    );
    res.json(allPosts.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Server error" });
  }
});
// GET /api/posts/:id - جلب مقال واحد
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params; // <-- استخلاص الـ id من الرابط

    const post = await pool.query(
  `SELECT 
     posts.id, posts.title, posts.content, posts.created_at, posts.user_id, 
     users.username AS author
   FROM posts
   LEFT JOIN users ON posts.user_id = users.id
   WHERE posts.id = $1`,
  [id]
);

    // التحقق مما إذا كان المقال موجودًا
    if (post.rows.length === 0) {
      return res.status(404).json({ error: 'Post not found' });
    }

    res.json(post.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Server error" });
  }
});
router.post("/",auth, async (req, res) => {
  try {
    const { title, content } = req.body;
    const { userId } = req.user; // الحصول على userId من التوكن
    console.log();
    if (!title || !content) {
      return res
        .status(400)
        .json({ error: "Please provide title, conten" });
    }

    const newPost = await pool.query(
      "INSERT INTO posts (title, content, user_id) VALUES ($1, $2, $3) RETURNING *",
      [title, content, userId]
    );

    res.status(201).json(newPost.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Server error" });
  }
});
// src/routes/postRoutes.js
// ... الكود السابق ...

// PUT /api/posts/:id - تعديل مقال (محمي)
router.put('/:id', auth, async (req, res) => {
  try {
    const { id: postId } = req.params;
    const { userId } = req.user;
    const { title, content } = req.body;

    if (!title || !content) {
      return res.status(400).json({ error: 'Title and content are required.' });
    }

    // نتأكد من هوية صاحب المقال
    const post = await pool.query('SELECT user_id FROM posts WHERE id = $1', [postId]);
    if (post.rows.length === 0) {
      return res.status(404).json({ error: 'Post not found' });
    }
    if (post.rows[0].user_id !== userId) {
      return res.status(403).json({ error: 'User not authorized to edit this post' });
    }

    // إذا كان هو الصاحب، نقوم بالتعديل
    const updatedPost = await pool.query(
      'UPDATE posts SET title = $1, content = $2 WHERE id = $3 RETURNING *',
      [title, content, postId]
    );

    res.json(updatedPost.rows[0]);

  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Server error" });
  }
});
// src/routes/postRoutes.js
// ... الكود السابق ...

// PATCH /api/posts/:id - تعديل جزئي لمقال (محمي)
router.patch('/:id', auth, async (req, res) => {
  try {
    const { id: postId } = req.params;
    const { userId } = req.user;
    const { title, content } = req.body;

    // 1. نتأكد من هوية صاحب المقال
    const postResult = await pool.query('SELECT * FROM posts WHERE id = $1', [postId]);
    if (postResult.rows.length === 0) {
      return res.status(404).json({ error: 'Post not found' });
    }
    const currentPost = postResult.rows[0];
    if (currentPost.user_id !== userId) {
      return res.status(403).json({ error: 'User not authorized to edit this post' });
    }

    // 2. نحدد القيم الجديدة (إذا لم يتم إرسال قيمة جديدة، نستخدم القيمة القديمة)
    const newTitle = title || currentPost.title;
    const newContent = content || currentPost.content;

    // 3. نقوم بالتعديل
    const updatedPost = await pool.query(
      'UPDATE posts SET title = $1, content = $2 WHERE id = $3 RETURNING *',
      [newTitle, newContent, postId]
    );

    res.json(updatedPost.rows[0]);

  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Server error" });
  }
});

// DELETE /api/posts/:id - حذف مقال (محمي)
router.delete('/:id', auth, async (req, res) => {
  try {
    const { id: postId } = req.params;
    const { userId } = req.user;

    // أولاً، نتأكد من هو صاحب المقال
    const post = await pool.query('SELECT user_id FROM posts WHERE id = $1', [postId]);

    if (post.rows.length === 0) {
      return res.status(404).json({ error: 'Post not found' });
    }

    // ثانياً، نتأكد أن المستخدم الحالي هو صاحب المقال
    if (post.rows[0].user_id !== userId) {
      return res.status(403).json({ error: 'User not authorized to delete this post' });
    }

    // إذا كان هو الصاحب، نقوم بالحذف
    await pool.query('DELETE FROM posts WHERE id = $1', [postId]);

    res.status(200).json({ message: 'Post deleted successfully' });

  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Server error" });
  }
});

export default router; // تصدير الراوتر
