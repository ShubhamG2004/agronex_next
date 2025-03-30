import { useState, useEffect } from 'react';
import { GeistSans, GeistMono } from 'geist/font';
import { useRouter } from "next/router";
import dynamic from 'next/dynamic';
import Navbar from "./Navbar";
import MiddlePage from "@/components/MiddlePage";
import ImageSlider from "./ImageSlider";
import Footer from "./footer";

// Lazy load components
const Blogcom = dynamic(() => import("../components/Blogcom"), { 
  loading: () => <p>Loading blogs...</p>,
  ssr: false 
});

const BlogUploader = dynamic(() => import("@/components/Blog-upload"), {
  ssr: false
});

export default function Home() {
  const [showSplash, setShowSplash] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 2000); // 2 seconds

    return () => clearTimeout(timer);
  }, []);

  if (showSplash) {
    return (
      <div className="flex items-center justify-center w-full h-screen bg-white">
        <img 
          src="/assets/logo.png" 
          alt="AgroNex Logo" 
          className="w-64 h-64 animate-pulse" // You can adjust size and animation
        />
      </div>
    );
  }

  return (
    <div className={`${GeistSans.variable} ${GeistMono.variable} font-sans`}>
      <main className="flex flex-col gap-0 row-start-2 items-center sm:items-start w-full">
        <Navbar />

        {/* Hero Section */}
        <section className="w-full h-[640px] relative">
          <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{ 
              backgroundImage: "url('/assets/background.png')",
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat"
            }}
          >
            <div className="absolute inset-0 bg-black/50"></div>
          </div>

          <div className="container mx-auto h-full flex items-center px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="max-w-2xl">
              <h1 className="text-yellow-500 text-4xl sm:text-5xl md:text-6xl font-bold leading-tight mb-4">
                <span className="text-5xl sm:text-6xl">Detect</span> the <span className="text-5xl sm:text-6xl">Disease</span><br />
                of the <span className="text-5xl sm:text-6xl">Plant</span> and <span className="text-5xl sm:text-6xl">Explore</span> IT
              </h1>
              
              <p className="text-yellow-500 text-xl sm:text-2xl font-bold mb-8">
                Harness the Power of Agronex to Accurately Detect Plant Diseases<br />
                and Gain In-Depth Knowledge from Expert Blogs!
              </p>

              <div className="flex flex-wrap gap-4 mt-4">
                <button
                  onClick={() => router.push("/image-uploader")}
                  className="flex items-center gap-2 px-6 py-2 bg-green-600 text-white font-bold rounded-md hover:bg-green-700 transition-colors duration-300"
                >
                  Diagnosis
                  <img src="/assets/share.png" alt="share" className="w-4 h-4" />
                </button>

                <button
                  onClick={() => router.push("/Blog-uploader")}
                  className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white font-bold rounded-md hover:bg-blue-700 transition-colors duration-300"
                >
                  Create Blog
                  <img src="/assets/share.png" alt="share" className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Rest of your sections */}
        <section className="w-full py-10 bg-white">
          <Blogcom />
        </section>

        <section className="w-full py-3 bg-gray-50">
          <MiddlePage />
        </section>

        <section className="w-full bg-white py-10">
          <ImageSlider />
        </section>

        <section className="w-full bg-gray-900">
          <Footer />
        </section>
      </main>
    </div>
  );
}

export async function getServerSideProps(context) {
  const { getSession } = await import("next-auth/react");
  const session = await getSession(context);

  if (!session) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }

  return {
    props: { session },
  };
}