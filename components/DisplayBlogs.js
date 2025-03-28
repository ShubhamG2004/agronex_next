import { useEffect, useState } from "react";

const DisplayBlogs = () => {
  const [blogs, setBlogs] = useState([]);
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/getBlogs");
        if (!response.ok) throw new Error("Failed to fetch blogs");

        const data = await response.json();
        if (!data.blogs) throw new Error("No blogs data found");

        // Extract unique categories from blogs
        const uniqueCategories = [...new Set(data.blogs.map(blog => blog.category))];
        setCategories(["all", ...uniqueCategories]);
        setBlogs(data.blogs);
      } catch (error) {
        console.error("Error fetching blogs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  // Filter blogs by selected category
  const filteredBlogs = selectedCategory === "all" 
    ? blogs 
    : blogs.filter(blog => blog.category === selectedCategory);

  return (
    <div className="max-w-5xl mx-auto p-6">
      {selectedBlog ? (
        /** Full Blog View */
        <div className="bg-white p-6 rounded-lg shadow-lg relative">
          <button
            onClick={() => setSelectedBlog(null)}
            className="mb-4 text-blue-500 hover:underline flex items-center"
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
          
          <div className="flex justify-between items-start mb-4">
            <div>
              <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded">
                {selectedBlog.category}
              </span>
              <h2 className="text-3xl font-bold mt-2">{selectedBlog.title}</h2>
            </div>
            <span className="text-gray-500 text-sm">
              {new Date(selectedBlog.createdAt).toLocaleDateString()}
            </span>
          </div>
          
          <div 
            className="prose max-w-none text-gray-700" 
            dangerouslySetInnerHTML={{ __html: selectedBlog.content }} 
          />

          {selectedBlog.userId && (
            <div className="mt-8 pt-4 border-t border-gray-200 flex items-center gap-4">
              {selectedBlog.userId.image && (
                <img
                  src={selectedBlog.userId.image}
                  alt={selectedBlog.userId.fullName}
                  className="w-10 h-10 rounded-full"
                />
              )}
              <div>
                <p className="font-semibold">{selectedBlog.userId.fullName}</p>
                <p className="text-gray-500 text-sm">Author</p>
              </div>
            </div>
          )}
        </div>
      ) : (
        /** Blog List View */
        <>
          <h2 className="text-3xl font-bold text-green-600 mb-6 text-center">📝 Latest Blogs</h2>
          
          {/* Category Filter */}
          <div className="flex flex-wrap gap-2 mb-8 justify-center">
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium ${
                  selectedCategory === category
                    ? "bg-green-500 text-white"
                    : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                }`}
              >
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="text-center">Loading blogs...</div>
          ) : filteredBlogs.length === 0 ? (
            <p className="text-center text-gray-500">
              No blogs available in {selectedCategory === "all" ? "any" : "this"} category.
            </p>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredBlogs.map((blog) => (
                <div 
                  key={blog._id} 
                  className="bg-white p-5 rounded-lg shadow-lg hover:shadow-xl transition flex flex-col"
                >
                  {blog.imageUrl && (
                    <img
                      src={blog.imageUrl}
                      alt="Blog Image"
                      className="w-full h-40 object-cover rounded-md mb-4"
                    />
                  )}
                  
                  <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded self-start mb-2">
                    {blog.category}
                  </span>
                  
                  <h3 className="text-xl font-semibold mb-2">{blog.title}</h3>
                  <p className="text-gray-600 line-clamp-3 mb-4">{blog.description}</p>
                  
                  <div className="mt-auto flex justify-between items-center">
                    <button
                      onClick={() => setSelectedBlog(blog)}
                      className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 text-sm"
                    >
                      Read More
                    </button>
                    
                    <span className="text-gray-500 text-xs">
                      {new Date(blog.createdAt).toLocaleDateString()}
                    </span>
                  </div>
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