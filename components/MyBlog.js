import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';

export default function MyBlogsPage() {
    const { data: session } = useSession();
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (session?.user?.email) {
            fetch(`/api/blogs?email=${session.user.email}`)
                .then(res => res.json())
                .then(data => {
                    console.log("Fetched Blogs:", data);
                    if (data.blogs && data.blogs.length > 0) {
                        setBlogs(data.blogs);
                    } else {
                        setError("No blogs found.");
                    }
                    setLoading(false);
                })
                .catch(err => {
                    console.error("Error fetching blogs:", err);
                    setError("Error fetching blogs.");
                    setLoading(false);
                });
        }
    }, [session]);

    if (!session) return <p className="text-center text-gray-600">Please log in to view your blogs.</p>;
    if (loading) return <p className="text-center text-gray-600">Loading...</p>;
    if (error) return <p className="text-center text-gray-600">{error}</p>;

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold text-center">My Blogs</h1>
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {blogs.map((blog) => (
                    <div key={blog._id} className="bg-white shadow-md rounded-lg p-4">
                        <img src={blog.imageUrl} alt={blog.title} className="w-full h-40 object-cover rounded-md" />
                        <h2 className="text-xl font-semibold mt-2">{blog.title}</h2>
                        <p className="text-gray-600 mt-1">{blog.description}</p>
                        <p className="text-sm text-gray-500 mt-1">Status: {blog.status}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}
