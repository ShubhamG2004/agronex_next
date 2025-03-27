import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';

export default function MyBlogsPage() {
    const { data: session, status } = useSession();
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (status === "loading") return;
        if (!session) return;

        const fetchBlogs = async () => {
            try {
                const res = await fetch('/api/myblogs');
                if (!res.ok) throw new Error("Failed to fetch blogs");

                const data = await res.json();
                if (data.blogs.length > 0) {
                    setBlogs(data.blogs);
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

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold text-center">My Blogs</h1>
            {blogs.length === 0 ? (
                <p className="text-center text-gray-600 mt-4">You haven't written any blogs yet.</p>
            ) : (
                <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {blogs.map((blog) => (
                        <div key={blog._id} className="bg-white shadow-md rounded-lg h-[400px] flex flex-col">
                            {/* Image Container with padding */}
                            <div className="h-[200px] w-full p-2">
                                <img
                                    src={blog.imageUrl || "/default-image.jpg"} 
                                    alt={blog.title} 
                                    className="w-full h-full object-cover rounded-lg"
                                />
                            </div>

                            {/* Text Content */}
                            <div className="p-3 flex-1 flex flex-col justify-between">
                                <h2 className="text-lg font-semibold text-gray-800 overflow-hidden line-clamp-3">
                                    {blog.title}
                                </h2>
                                <p className="text-sm text-gray-600 mt-1 overflow-hidden line-clamp-5">
                                    {blog.description}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
