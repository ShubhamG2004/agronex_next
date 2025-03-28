import { useRouter } from 'next/router';
import { useEffect, useState, useRef } from 'react';
import Navbar from '../Navbar';

export default function EditBlogPage() {
    const router = useRouter();
    const { id } = router.query; 
    const [blog, setBlog] = useState({ title: '', description: '', content: '', imageUrl: null });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const fileInputRef = useRef(null);
    const [contentHeight, setContentHeight] = useState('150px'); 

    useEffect(() => {
        if (!id) return;

        const fetchBlog = async () => {
            try {
                const res = await fetch(`/api/blogs/${id}`);
                if (!res.ok) throw new Error("Failed to fetch blog");

                const data = await res.json();
                setBlog({ ...data.blog, imageUrl: data.blog.imageUrl || null });
            } catch (err) {
                setError("Error fetching blog.");
            } finally {
                setLoading(false);
            }
        };

        fetchBlog();
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setBlog((prev) => ({ ...prev, [name]: value }));
    };

    const handleImageClick = () => {
        fileInputRef.current.click();
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setBlog((prev) => ({ ...prev, imageUrl: file })); // Store the file object
        }
    };

    const handleContentChange = (e) => {
        setBlog((prev) => ({ ...prev, content: e.target.value }));
        setContentHeight(`${Math.max(150, e.target.scrollHeight)}px`); // Adjust height dynamically
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        const formData = new FormData();
        formData.append('title', blog.title);
        formData.append('description', blog.description);
        formData.append('content', blog.content);

        if (blog.imageUrl && typeof blog.imageUrl !== 'string') {
            formData.append('image', blog.imageUrl);  // New file upload
        } else if (blog.imageUrl) {
            formData.append('imageUrl', blog.imageUrl);  // Existing URL
        }

        try {
            const res = await fetch(`/api/blogs/${id}`, {
                method: 'PUT',
                body: formData,
            });

            if (!res.ok) throw new Error("Failed to update blog");

            alert("Blog updated successfully");
            router.push(`/blogs/${id}`);
        } catch (error) {
            alert("Error updating blog");
            console.error(error);
        }
    };

    if (loading) return <p className="text-center text-gray-600">Loading...</p>;
    if (error) return <p className="text-center text-red-600">{error}</p>;

    return (
        <div className="w-full min-h-screen bg-gray-100">
            <Navbar />
            <div className="flex justify-center mt-6">
                <div className="w-full max-w-4xl bg-white shadow-lg rounded-lg overflow-hidden p-6">
                    <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">Edit Blog</h1>
                    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        
                        {/* Left Section - Image, Title, and Update Button */}
                        <div className="flex flex-col items-center">
                            {/* Clickable Image for Upload */}
                            <div 
                                className="w-full max-h-[250px] cursor-pointer overflow-hidden rounded-lg"
                                onClick={handleImageClick}
                            >
                                <img 
                                    src={blog.imageUrl ? 
                                        (typeof blog.imageUrl === 'string' ? blog.imageUrl : URL.createObjectURL(blog.imageUrl)) 
                                        : "/default-image.jpg"} 
                                    alt="Blog Image" 
                                    className="w-full object-cover rounded-lg"
                                />
                            </div>
                            <input 
                                type="file" 
                                ref={fileInputRef} 
                                className="hidden" 
                                accept="image/*" 
                                onChange={handleImageChange} 
                            />

                            <label className="block text-gray-700 font-semibold mt-4">Title</label>
                            <input 
                                type="text" 
                                name="title" 
                                value={blog.title} 
                                onChange={handleChange} 
                                className="w-full p-2 border rounded-lg"
                                required
                            />

                            <button 
                                type="submit" 
                                className="mt-6 px-4 py-2 bg-green-500 text-white font-semibold rounded-lg hover:bg-green-600 transition"
                            >
                                Save Changes
                            </button>
                        </div>

                        {/* Right Section - Description & Content */}
                        <div className="flex flex-col">
                            <label className="block text-gray-700 font-semibold">Description</label>
                            <textarea 
                                name="description" 
                                value={blog.description} 
                                onChange={handleChange} 
                                className="w-full p-2 border rounded-lg"
                                required
                            />

                            <label className="block text-gray-700 font-semibold mt-4">Content</label>
                            <textarea 
                                name="content" 
                                value={blog.content} 
                                onChange={handleContentChange} 
                                className="w-full p-2 border rounded-lg transition-all"
                                style={{ height: contentHeight }} // Dynamic height
                                required
                            />

                            <button 
                                type="button" 
                                onClick={() => router.push(`/blogs/${id}`)} 
                                className="mt-6 px-4 py-2 bg-gray-500 text-white font-semibold rounded-lg hover:bg-gray-600 transition"
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
