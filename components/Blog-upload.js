import { useState } from "react";

export default function BlogUploader() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [content, setContent] = useState("");
  const [scheduleDate, setScheduleDate] = useState("");
  const [status, setStatus] = useState("draft");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);

    // Image preview
    const reader = new FileReader();
    reader.onloadend = () => setPreview(reader.result);
    if (file) reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("content", content);
    formData.append("scheduleDate", scheduleDate);
    formData.append("status", status);
    if (image) formData.append("image", image);

    const response = await fetch("/api/uploadBlog", {
      method: "POST",
      body: formData, // FormData allows file uploads
    });

    const data = await response.json();
    alert(data.message);
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-3xl font-bold mb-4 text-center">Upload a Blog</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full p-2 border rounded"
          required
        />
        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full p-2 border rounded"
        />
        <textarea
          placeholder="Content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full p-2 border rounded"
          required
        />
        <input
          type="date"
          value={scheduleDate}
          onChange={(e) => setScheduleDate(e.target.value)}
          className="w-full p-2 border rounded"
        />
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="w-full p-2 border rounded"
        >
          <option value="draft">Draft</option>
          <option value="published">Published</option>
        </select>

        {/* Image Upload */}
        <label className="block w-full p-4 border-dashed border-2 text-center cursor-pointer">
          <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
          <span className="text-gray-500">Click to select an image</span>
        </label>

        {/* Image Preview */}
        {preview && (
          <div className="mt-4">
            <img src={preview} alt="Preview" className="w-full h-40 object-cover rounded" />
          </div>
        )}

        <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded">
          Upload Blog
        </button>
      </form>
    </div>
  );
}
