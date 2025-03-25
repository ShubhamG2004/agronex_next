import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";

const BlogDetails = () => {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);

  useEffect(() => {
    const fetchBlog = async () => {
      const response = await fetch(`/api/getBlog/${id}`);
      const data = await response.json();
      setBlog(data.blog);
    };

    fetchBlog();
  }, [id]);

  if (!blog) return <p>Loading...</p>;

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-3xl font-bold">{blog.title}</h2>
      <img src={blog.imageUrl} alt="Blog Image" className="w-full h-60 object-cover rounded-md my-4" />
      <p className="text-gray-700">{blog.content}</p>
    </div>
  );
};

export default BlogDetails;
