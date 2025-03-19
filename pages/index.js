import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import { getSession, useSession, signOut } from "next-auth/react";
import { useRouter } from "next/router";
import Navbar from "../components/Navbar";


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function Home() {
  const { data: session } = useSession();
  const router = useRouter();

  function handleSignOut() {
    signOut();
  }

  function handleSearchClick() {
    router.push("/image-uploader");
  }

  return (
    <div>
      
      <main className="flex flex-col gap-0 row-start-2 items-center sm:items-start w-full">
        <Navbar />
        <div className="w-full h-[550px] relative">
          {/* Background Image with Black Overlay */}
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: "url('/assets/background.png')", backgroundSize: "cover" }}
          >
            <div className="absolute inset-0 bg-black opacity-50"></div>
          </div>

          {/* Left-Side Content (Outside Overlay) */}
          <div className="absolute left-[70px] top-1/2 transform -translate-y-1/2 flex flex-col gap-2">
            {/* First Line */}
            <h1 className="text-yellow-500 text-5xl font-bold">
              <span className="text-6xl">Detect</span> the <span className="text-6xl">Disease</span> 
            </h1>

            {/* Second Line */}
            <h1 className="text-yellow-500 text-5xl font-bold">
              of the <span className="text-6xl">Plant</span> and <span className="text-6xl">Explore</span> IT
            </h1>

            {/* Harness the Power of Agronex to Accurately Detect Plant Diseases and Gain In-Depth Knowledge from Expert Blogs! */}
            <h1 className="text-yellow-500 text-3xl font-bold">
              Harness the Power of Agronex to Accurately Detect Plant Diseases
            </h1>
            <h1 className="text-yellow-500 text-3xl font-bold">
             and Gain In-Depth Knowledge from Expert Blogs!
            </h1>
            {/* Third Line - Buttons */}
            <div className="flex gap-4 mt-4">
              <button className="px-6 py-2 bg-green-600 text-white font-semibold rounded-md hover:bg-green-700">
                Diagnosis
              </button>
              <button className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700">
                Create Blog
              </button>
            </div>
          </div>
        </div>

        {session ? (
          <Authuser session={session} handleSignOut={handleSignOut} />
        ) : (
          <Guest />
        )}
      </main>

    </div>
  );
}

// Guest Component
function Guest() {
  return (
    <main className="container mx-auto text-center py-20">
      <h1 className="text-3xl font-bold underline">Welcome Guest</h1>
      <div className="flex justify-center">
        <Link href="/login" className="mt-5 px-10 py-1 rounded-sm bg-indigo-500 text-white">
          Sign in
        </Link>
      </div>
    </main>
  );
}

// Authorized User Component
function Authuser({ session, handleSignOut }) {
  return (
    <main className="container mx-auto text-center py-20">
      <h1 className="text-3xl font-bold underline">Welcome User</h1>
      <div className="details">
        <h5>{session.user.name}</h5>
        <h5>{session.user.email}</h5>
      </div>

      <div className="flex justify-center">
        <button
          onClick={handleSignOut}
          className="mt-5 px-10 py-1 rounded-sm bg-indigo-500 text-white"
        >
          Sign Out
        </button>
      </div>

      <div className="flex justify-center">
        <Link href="/profile" className="mt-5 px-10 py-1 rounded-sm bg-indigo-500 text-white">
          Profile
        </Link>
      </div>
    </main>
  );
}

// Fixing getServerSideProps
export async function getServerSideProps(context) {
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
