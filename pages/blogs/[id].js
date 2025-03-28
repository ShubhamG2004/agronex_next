import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Navbar from '../Navbar';

export default function BlogDetailsPage() {
    const router = useRouter();
    const { id } = router.query; 
    const [blog, setBlog] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!id) return;

        const fetchBlog = async () => {
            try {
                const res = await fetch(`/api/blogs/${id}`);
                if (!res.ok) throw new Error("Failed to fetch blog");

                const data = await res.json();
                setBlog(data.blog);
            } catch (err) {
                setError("Error fetching blog.");
            } finally {
                setLoading(false);
            }
        };

        fetchBlog();
    }, [id]);

    const handleEdit = () => {
        router.push(`/edit-blog/${id}`); // Redirect to edit page
    };

    const handleDelete = async () => {
        if (!confirm("Are you sure you want to delete this blog?")) return;

        try {
            const res = await fetch(`/api/blogs/${id}`, { 
                method: 'DELETE',
            });

            if (!res.ok) throw new Error("Failed to delete blog");

            alert("Blog deleted successfully");
            router.push('/blogs'); // Redirect to blogs page
        } catch (error) {
            alert("Error deleting blog");
        }
    };

    if (loading) return <p className="text-center text-gray-600">Loading...</p>;
    if (error) return <p className="text-center text-red-600">{error}</p>;
    if (!blog) return <p className="text-center text-gray-600">Blog not found.</p>;

    return (
        <div className="w-full">
            <Navbar />
            <div className="flex justify-center mt-6">
                <div className="w-full max-w-4xl bg-white shadow-lg rounded-lg overflow-hidden p-6">
                    <div className="flex justify-center mt-4">
                        <img 
                            src={blog.imageUrl || "/default-image.jpg"} 
                            alt={blog.title} 
                            className="w-full max-h-[300px] object-cover rounded-lg" 
                        />
                    </div>
                    <p className="text-lg text-gray-700 mt-4 text-justify leading-relaxed">
                        {new Date(blog.scheduleDate).toLocaleDateString("en-GB", { 
                            weekday: 'long', 
                            day: '2-digit', 
                            month: '2-digit', 
                            year: 'numeric' 
                        })}
                    </p>
                    <h1 className="text-3xl font-bold text-center text-gray-800">{blog.title}</h1>
                    <p className="text-lg text-gray-700 mt-4 text-justify leading-relaxed">{blog.description}</p>
                    <p className="text-lg text-gray-700 mt-4 text-justify leading-relaxed">{blog.content}</p>
                    
                    {/* Edit & Delete Buttons */}
                    <div className="flex justify-between mt-6">
                        <button 
                            onClick={handleEdit} 
                            className="px-4 py-2 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition"
                        >
                            Edit
                        </button>
                        <button 
                            onClick={handleDelete} 
                            className="px-4 py-2 bg-red-500 text-white font-semibold rounded-lg hover:bg-red-600 transition"
                        >
                            Delete
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
