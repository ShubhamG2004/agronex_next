import { useEffect, useState } from "react";
import { useRouter } from "next/router";

const ReadMore = ({ id }) => {
  const router = useRouter();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) return;

    const fetchBlog = async () => {
      try {
        const response = await fetch(`/api/getBlog?id=${id}`);
        if (!response.ok) {
          const errorMessage = await response.text(); // Get the actual error message
          throw new Error(`Failed to fetch blog: ${errorMessage}`);
        }

        const data = await response.json();
        if (!data.blog) throw new Error("Invalid API response");

        setBlog(data.blog);
      } catch (error) {
        console.error("❌ Error fetching blog:", error);
        setError(error.message); // Set error message
        setBlog(null); // Prevent breaking UI
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [id]);

  if (loading) return <p className="text-center text-gray-500">Loading...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;
  if (!blog) return <p className="text-center text-red-500">Blog not found.</p>;

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-4xl font-bold text-green-600 mb-4">{blog.title}</h1>
      <p className="text-gray-500 mb-2">📅 {new Date(blog.date).toDateString()}</p>

      {blog.imageUrl && (
        <img src={blog.imageUrl} alt={blog.title} className="w-full rounded-lg mb-6 shadow-md" />
      )}

      <p className="text-lg text-gray-700">{blog.description}</p>

      <div className="mt-6 border-t pt-4 text-gray-800 leading-relaxed">{blog.content}</div>

      <button
        onClick={() => router.back()}
        className="mt-6 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
      >
        🔙 Back to Blogs
      </button>
    </div>
  );
};

export default ReadMore;
