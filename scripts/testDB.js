const connectMongo = require("../lib/connectMongo");
const Blog = require("../models/Blog");

async function testDB() {
  try {
    await connectMongo();
    const testBlog = await Blog.create({
      title: "Test Blog",
      description: "This is a test blog entry",
      content: "Testing MongoDB connection",
      image: "https://via.placeholder.com/600",
      status: "published",
      author: "test@example.com",
    });

    console.log("✅ Blog saved successfully:", testBlog);
    process.exit(0);
  } catch (error) {
    console.error("❌ Error saving blog:", error);
    process.exit(1);
  }
}

testDB();
