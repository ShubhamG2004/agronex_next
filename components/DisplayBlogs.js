import { useEffect, useState } from "react";

const DisplayBlogs = () => {
  const [blogs, setBlogs] = useState([]);
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [categories, setCategories] = useState(["all"]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch("/api/getBlogs");
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        
        if (!data.blogs || !Array.isArray(data.blogs)) {
          throw new Error("Invalid blogs data format");
        }

        // Sort blogs by date (newest first)
        const sortedBlogs = [...data.blogs].sort((a, b) => {
          return new Date(b.createdAt) - new Date(a.createdAt);
        });

        const validCategories = sortedBlogs
          .map(blog => blog?.category)
          .filter(category => typeof category === "string" && category.trim() !== "")
          .map(category => category.trim());

        const uniqueCategories = [...new Set(validCategories)];
        setCategories(["all", ...uniqueCategories]);
        setBlogs(sortedBlogs); // Set the sorted blogs
      } catch (err) {
        console.error("Error fetching blogs:", err);
        setError(err.message || "Failed to load blogs");
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  const filteredBlogs = selectedCategory === "all" 
    ? blogs 
    : blogs.filter(blog => blog?.category === selectedCategory);

  const searchedBlogs = searchQuery
    ? filteredBlogs.filter(blog => 
        blog.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        blog.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        blog.content.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : filteredBlogs;

  const formatCategoryName = (category) => {
    if (!category || typeof category !== "string") return "All";
    return category.charAt(0).toUpperCase() + category.slice(1).toLowerCase();
  };

  const formatDate = (dateString) => {
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric"
      });
    } catch {
      return "";
    }
  };

  if (error) {
    return (
      <div className="max-w-[1800px] mx-auto px-4 text-center text-red-500">
        Error: {error}
      </div>
    );
  }

  return (
    <div className="max-w-[2500px]   py-2">
      {selectedBlog ? (
        <div className="bg-white p-8 rounded-xl shadow-xl relative mx-auto max-w-4xl">
        <button
          onClick={() => setSelectedBlog(null)}
          className="mb-6 text-blue-500 hover:underline flex items-center gap-1 text-lg"
        >
          <span>←</span> Back to Blogs
        </button>
        
        {selectedBlog.imageUrl && (
          <img
            src={selectedBlog.imageUrl}
            alt={selectedBlog.title || "Blog cover"}
            className="w-full h-80 object-cover rounded-lg mb-8"
            loading="lazy"
          />
        )}
        
        <div className="flex justify-between items-start mb-8">
          <div>
            <span className="bg-green-100 text-green-800 text-sm font-medium px-3 py-1 rounded-full mb-3 inline-block">
              {formatCategoryName(selectedBlog.category)}
            </span>
            <h2 className="text-3xl font-bold text-gray-800 mb-2">{selectedBlog.title}</h2>
          </div>
          <span className="text-gray-500 whitespace-nowrap">
            {formatDate(selectedBlog.createdAt)}
          </span>
        </div>
        
        <div 
          className="prose max-w-none text-gray-700 text-lg space-y-6 whitespace-pre-line"
          dangerouslySetInnerHTML={{ __html: selectedBlog.content }} 
        />

      
        {selectedBlog.userId && (
          <div className="mt-12 pt-8 border-t border-gray-200 flex items-center gap-4">
            {selectedBlog.userId.image && (
              <img
                src={selectedBlog.userId.image}
                alt={selectedBlog.userId.fullName || "Author"}
                className="w-12 h-12 rounded-full"
                loading="lazy"
              />
            )}
            <div>
              <p className="font-semibold text-lg text-gray-800">
                {selectedBlog.userId.fullName || "Unknown Author"}
              </p>
              <p className="text-gray-500">Author</p>
            </div>
          </div>
        )}
      </div>
      ) : (
        <>
          

          {/* Search Bar */}
          <div className="mb-8 max-w-3xl mx-auto">
            <div className="relative">
              <input
                type="text"
                placeholder="Search blogs..."
                className="w-full px-5 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none text-lg"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <div className="absolute right-4 top-3.5 text-gray-400">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
          </div>

          {/* Category Filter with Compact Design */}
          <div className="relative max-w-[80%] mx-auto">
            {/* Left Scroll Button (only show if needed) */}
            <button 
              onClick={() => {
                const container = document.getElementById('categoryContainer');
                container.scrollBy({ left: -150, behavior: 'smooth' });
              }}
              className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white p-1 rounded-full shadow-sm hover:bg-gray-50"
              aria-label="Scroll left"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            {/* Compact Category Container */}
            <div 
              id="categoryContainer"
              className="flex overflow-x-hidden space-x-2 px-6 py-1"
            >
              {categories.map(category => (
                <button
                  key={category || "all"}
                  onClick={() => setSelectedCategory(category)}
                  className={`flex-shrink-0 px-3 py-1 rounded-full text-xm font-medium whitespace-nowrap ${
                    selectedCategory === category
                      ? "bg-green-600 text-white"
                      : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                  }`}
                >
                  {formatCategoryName(category)}
                </button>
              ))}
            </div>

            {/* Right Scroll Button (only show if needed) */}
            <button 
              onClick={() => {
                const container = document.getElementById('categoryContainer');
                container.scrollBy({ left: 150, behavior: 'smooth' });
              }}
              className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white p-1 rounded-full shadow-sm hover:bg-gray-50"
              aria-label="Scroll right"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          <h1 className="mt-3 text-2xl font-bold text-green-500 mb-5 text-center">
            📝 Latest Blogs
          </h1>

          {loading ? (
            <div className="text-center py-16 ">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
              <p className="mt-3 text-gray-600 text-lg">Loading blogs...</p>
            </div>
          ) : searchedBlogs.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-gray-500 text-lg">
                No blogs found matching your search.
              </p>
              {(searchQuery || selectedCategory !== "all") && (
                <button
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedCategory("all");
                  }}
                  className="mt-3 text-green-600 hover:underline text-lg"
                >
                  Clear filters
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {searchedBlogs.map((blog) => (
                  <div 
                    key={blog._id}
                    className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition flex flex-col h-full min-w-[220px]"
                  >
                    {blog.imageUrl && (
                      <img
                        src={blog.imageUrl}
                        alt={blog.title || "Blog cover"}
                        className="w-full h-40 object-cover rounded-md mb-3"  // Reduced height
                        loading="lazy"
                      />
                    )}
                    
                    <span className="bg-green-100 text-green-800 text-xs font-medium px-2 py-0.5 rounded-full self-start mb-2">
                      {formatCategoryName(blog.category)}
                    </span>
                    
                    <h3 className="text-lg font-semibold mb-2 line-clamp-2">{blog.title}</h3>
                    <p className="text-gray-600 text-sm line-clamp-3 mb-3 flex-grow">  
                      {blog.description}
                    </p>
                    
                    <div className="mt-auto flex justify-between items-center">
                      <button
                        onClick={() => setSelectedBlog(blog)}
                        className="text-green-600 hover:text-green-800 text-sm font-medium hover:underline"  // Text-only button
                      >
                        Read more
                      </button>
                      <span className="text-gray-500 text-xs">
                        {formatDate(blog.createdAt)}
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