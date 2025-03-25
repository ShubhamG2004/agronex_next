import { useEffect, useState } from "react";

const DisplayBlogs = () => {
  const [blogs, setBlogs] = useState([]);
  const [selectedBlog, setSelectedBlog] = useState(null);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await fetch("/api/getBlogs");
        const data = await response.json();
        setBlogs(data.blogs);
      } catch (error) {
        console.error("Error fetching blogs:", error);
      }
    };

    fetchBlogs();
  }, []);

  return (
    <div className="max-w-5xl mx-auto p-6">
      {selectedBlog ? (
        /** Full Blog View */
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <button
            onClick={() => setSelectedBlog(null)}
            className="mb-4 text-blue-500 hover:underline"
          >
            ← Back to Blogs
          </button>
          {selectedBlog.imageUrl && (
            <img
              src={selectedBlog.imageUrl}
              alt="Blog Image"
              className="w-full h-60 object-cover rounded-md mb-4"
            />
          )}
          <h2 className="text-3xl font-bold mb-4">{selectedBlog.title}</h2>
          <p className="text-gray-700 whitespace-pre-line">{selectedBlog.content}</p>
        </div>
      ) : (
        /** Blog List View */
        <>
          <h2 className="text-3xl font-bold text-green-600 mb-6 text-center">📝 Latest Blogs</h2>
          {blogs.length === 0 ? (
            <p className="text-center text-gray-500">No blogs available.</p>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {blogs.map((blog) => (
                <div key={blog._id} className="bg-white p-5 rounded-lg shadow-lg hover:shadow-xl transition">
                  {blog.imageUrl && (
                    <img
                      src={blog.imageUrl}
                      alt="Blog Image"
                      className="w-full h-40 object-cover rounded-md mb-4"
                    />
                  )}
                  <h3 className="text-xl font-semibold mb-2">{blog.title}</h3>
                  <p className="text-gray-600 line-clamp-3">{blog.description}</p>
                  <button
                    onClick={() => setSelectedBlog(blog)}
                    className="mt-3 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                  >
                    Read More
                  </button>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default DisplayBlogs;
