import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

export default function MyBlogsPage() {
    const { data: session, status } = useSession();
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showAll, setShowAll] = useState(false);
    const router = useRouter();

    useEffect(() => {
        if (status === "loading") return;
        if (!session) return;

        const fetchBlogs = async () => {
            try {
                const res = await fetch('/api/myblogs');
                if (!res.ok) throw new Error("Failed to fetch blogs");

                const data = await res.json();
                if (data.blogs.length > 0) {
                    // Sort blogs by date (newest first)
                    const sortedBlogs = data.blogs.sort((a, b) => 
                        new Date(b.createdAt) - new Date(a.createdAt)
                    );
                    setBlogs(sortedBlogs);
                } else {
                    setError("No blogs found.");
                }
            } catch (err) {
                console.error("Error fetching blogs:", err);
                setError("Error fetching blogs.");
            } finally {
                setLoading(false);
            }
        };

        fetchBlogs();
    }, [session, status]);

    if (status === "loading") return <p className="text-center text-gray-600">Loading session...</p>;
    if (!session) return <p className="text-center text-gray-600">Please log in to view your blogs.</p>;
    if (loading) return <p className="text-center text-gray-600">Loading...</p>;
    if (error) return <p className="text-center text-gray-600">{error}</p>;

    // Get the blogs to display (either first 4 or all)
    const displayedBlogs = showAll ? blogs : blogs.slice(0, 4);

    return (
        <div className="container mx-auto px-4 py-8 max-w-6xl">
            {blogs.length === 0 ? (
                <div className="text-center">
                    <p className="text-gray-600 mb-4">You haven't written any blogs yet.</p>
                    <button 
                        onClick={() => router.push('/blogs/create')}
                        className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
                    >
                        Create Your First Blog
                    </button>
                </div>
            ) : (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {displayedBlogs.map((blog) => (
                            <div 
                                key={blog._id} 
                                className="bg-white shadow-md rounded-lg overflow-hidden flex flex-col cursor-pointer hover:shadow-lg transition"
                                onClick={() => router.push(`/blogs/${blog._id}`)}
                            >
                                <div className="h-48 w-full">
                                    <img
                                        src={blog.imageUrl || "/default-image.jpg"} 
                                        alt={blog.title} 
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <div className="p-4 flex-1 flex flex-col">
                                    <h2 className="text-xl font-semibold text-gray-800 mb-2 line-clamp-2">
                                        {blog.title}
                                    </h2>
                                    <p className="text-gray-600 mb-4 line-clamp-3">
                                        {blog.description}
                                    </p>
                                    <div className="mt-auto text-sm text-gray-500">
                                        {new Date(blog.createdAt).toLocaleDateString()}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {blogs.length > 4 && (
                        <div className="text-center mt-8">
                            <button
                                onClick={() => setShowAll(!showAll)}
                                className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition"
                            >
                                {showAll ? 'Show Less' : 'View More Blogs'}
                            </button>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}