"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Plus } from "lucide-react"; // Icon for the + button

export default function BlogEditor() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [scheduleDate, setScheduleDate] = useState("");
  const [status, setStatus] = useState("draft");

  // Handle Image Upload
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file)); // Show preview instantly
    }
  };

  // Submit Blog (Save to Database)
  const handleSubmit = () => {
    if (!title || !content) {
      alert("Title and Content are required!");
      return;
    }

    const blogData = {
      title,
      description,
      content,
      image: preview,
      scheduleDate,
      status,
      createdAt: new Date().toISOString(),
    };

    console.log("Blog Submitted: ", blogData);
    alert(`Blog ${status === "published" ? "Published" : "Saved as Draft"}`);
  };

  return (
    
    <div className="max-w-5xl mx-auto p-8 bg-gray-900 text-white rounded-lg shadow-lg">
      <h1 className="text-4xl font-bold text-yellow-400 text-center mb-6">Write a Blog</h1>

      {/* Image Upload Section (Appears First) */}
      <div className="w-full mb-6">
        {preview ? (
          <motion.img
            src={preview}
            alt="Preview"
            className="w-full h-64 object-cover rounded-lg mb-4"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          />
        ) : (
          <label className="w-full flex flex-col items-center justify-center border-2 border-dashed border-gray-500 p-6 rounded-lg cursor-pointer hover:bg-gray-800 transition">
            <Plus size={50} className="text-gray-400" />
            <span className="text-gray-400 mt-2">Click to upload image</span>
            <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
          </label>
        )}
      </div>

      {/* Title Input */}
      <input
        type="text"
        placeholder="Enter Blog Title"
        className="w-full p-3 bg-gray-800 border border-gray-600 rounded-lg mb-4 text-lg"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      {/* Description Input */}
      <textarea
        placeholder="Enter Short Description (Optional)"
        className="w-full p-3 bg-gray-800 border border-gray-600 rounded-lg mb-4 text-lg"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

      {/* Content Input */}
      <textarea
        placeholder="Write your blog content here..."
        className="w-full p-3 bg-gray-800 border border-gray-600 rounded-lg h-48 mb-4 text-lg"
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />

      {/* Schedule Date */}
      <div className="mb-4">
        <label className="block text-sm font-semibold mb-2">Schedule Post (Optional)</label>
        <input
          type="datetime-local"
          className="w-full p-3 bg-gray-800 border border-gray-600 rounded-lg text-lg"
          value={scheduleDate}
          onChange={(e) => setScheduleDate(e.target.value)}
        />
      </div>

      {/* Buttons */}
      <div className="flex justify-between mt-6">
        <motion.button
          whileHover={{ scale: 1.05 }}
          className="w-1/2 px-6 py-3 bg-yellow-500 text-black font-bold rounded-lg mr-2"
          onClick={() => {
            setStatus("draft");
            handleSubmit();
          }}
        >
          Save as Draft
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.05 }}
          className="w-1/2 px-6 py-3 bg-green-500 text-white font-bold rounded-lg ml-2"
          onClick={() => {
            setStatus("published");
            handleSubmit();
          }}
        >
          Publish Now
        </motion.button>
      </div>
    </div>
  );
}
