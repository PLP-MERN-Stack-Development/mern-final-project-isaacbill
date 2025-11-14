require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db"); // ✅ this now works
const postsRoutes = require("./routes/posts");
const categoriesRoutes = require("./routes/categories");
const authRoutes = require("./routes/auth");
const commentsRoutes = require("./routes/comments");
const errorHandler = require("./middleware/errorHandler");
const path = require("path");

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors({
  origin: "https://mern-blog-ilio.onrender.com", // Replace with your deployed frontend URL
  credentials: true
}));

// static uploads
app.use("/uploads", express.static(path.join(__dirname, "uploads")));


app.use("/api/posts", postsRoutes);
app.use("/api/categories", categoriesRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/comments", commentsRoutes);

app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ✅ Call connectDB and then start the server
connectDB(process.env.MONGO_URI).then(() => {
  app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
});

// Health check
app.get('/health', (req, res) => res.json({ status: 'ok', uptime: process.uptime() }));

// Global error handler (last middleware)
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({ error: process.env.NODE_ENV === 'production' ? 'Internal Server Error' : err.message });
});

const helmet = require('helmet');
app.use(helmet());


