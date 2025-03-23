import { useEffect, useState } from "react";

const DisplayBlogs = () => {
  const [blogs, setBlogs] = useState([]); // Initialize as empty array
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error handling

  useEffect(() => {
    fetch("/api/getBlogs")
      .then(res => res.json())
      .then(data => {
        setBlogs(data.blogs || []); // Ensure `blogs` is always an array
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching blogs:", err);
        setError("Failed to load blogs.");
        setLoading(false);
      });
  }, []);

  return (
    <div className="container">
      <h2>📝 Latest Blogs</h2>

      {loading && <p>Loading blogs...</p>}
      {error && <p className="error">{error}</p>}
      
      {!loading && blogs.length === 0 && <p>No blogs available.</p>}

      {!loading &&
        blogs.map(blog => (
          <div key={blog._id} className="blog-card">
            <h3>{blog.title}</h3>
            <p>{blog.description}</p>
            {blog.image && <img src={blog.image} alt="Blog" className="blog-image" />}
            <p>📅 {new Date(blog.scheduleDate).toLocaleDateString()}</p>
          </div>
        ))
      }

      <style jsx>{`
        .container { text-align: center; }
        .blog-card { border: 1px solid #ddd; padding: 10px; margin: 10px; border-radius: 5px; }
        .blog-image { width: 100%; max-width: 400px; border-radius: 5px; }
        .error { color: red; }
      `}</style>
    </div>
  );
};

export default DisplayBlogs;
