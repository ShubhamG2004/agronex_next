export default function Blogcom() {
  return (
    <div className="w-full bg-white py-5 mb-0 pb-0">
      {/* Title */}
      <h1 className="text-5xl font-bold text-center text-green-900 mb-5">
        Explore The Blogs
      </h1>

      {/* Full-Width Two-Column Layout */}
      <div className="w-full flex flex-col md:flex-row items-center">
        {/* Left Section - Full-Width Image with Left Margin */}
        <div className="w-full md:w-1/2 h-[450px] ml-3 overflow-hidden"> 
          <img 
            src="/assets/blog-image.png" 
            alt="Blogging" 
            className="w-full h-full object-cover rounded-lg shadow-xl"
          />
        </div>

        {/* Right Section - Blog Content with Dark Green Theme */}
        <div className="w-full md:w-1/2 p-4 md:p-8">
          <div className="w-full p-6 md:p-10 bg-green-900 text-green-100 rounded-lg shadow-lg">
            <h2 className="text-2xl font-semibold mb-3 text-green-300">
              Why Blogging Matters?
            </h2>
            <p className="text-base leading-relaxed mb-4">
              Creating and uploading blogs is a powerful way to <strong>share knowledge, build credibility, and connect with a wider audience</strong>. 
              It helps in <strong>educating users, providing expert insights, and showcasing innovations</strong>. Well-written blogs also 
              <strong>boost SEO rankings, drive traffic, and enhance online visibility</strong>, making them essential for digital success.
            </p>

            <h2 className="text-2xl font-semibold mb-3 text-green-400">
              Effortless Blog Creation & Upload
            </h2>
            <p className="text-base leading-relaxed">
              With an intuitive platform, you can <strong>easily create, format, and publish engaging blogs</strong> with images, videos, and structured content. 
              Using <strong>relevant keywords and SEO strategies</strong>, your blog can <strong>reach the right audience and drive engagement</strong>. 
              Regularly updating blogs <strong>establishes authority and keeps your audience informed</strong>, ensuring long-term growth.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
