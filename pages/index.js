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
        <div
          className="w-full h-96 bg-cover bg-center flex items-center justify-center"
          style={{ backgroundImage: "url('/assets/background.png')" }}
        >
          <input
            type="text"
            placeholder="Search..."
            className="w-80 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            onClick={handleSearchClick}
            readOnly
          />
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
