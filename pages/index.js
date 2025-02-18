import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import { getSession, useSession,signOut } from "next-auth/react";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function Home() {

  const{data:session} = useSession();

  function handleSignOut(){
    signOut();
  }
  return (
    <div
      className={`${geistSans.variable} ${geistMono.variable} grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]`}
    >
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <h1 className="text-4xl font-bold">Next.js + Tailwind CSS</h1>
        {session ? Authuser({session,handleSignOut}):Guest()};
      </main>
      
    </div>
  );
}

// Guest
function Guest(){
  return(
  <main className="conatiner mx-auto text-center py-20">
    <h1 className="text-3xl font-bold underline">Welcome Guest</h1>
    <div className="flex justify-center">
      <Link href="/login"><span className="mt-5p px-10 py-1 rounded-sm-bg-indigo-500 text-gray">Sign in</span></Link>
    </div>
  </main>
  );
}
// Authorize User
function Authuser({session,handleSignOut})
{
  return(
    <main className="conatiner mx-auto text-center py-20">
      <h1 className="text-3xl font-bold underline">Welcome User</h1>
      <div className="details">
        <h5>{session.user.name}</h5>
        <h5>{session.user.email}</h5>
      </div>

      <div className="flex justify-center">
        <button onClick={handleSignOut} className="mt-5 px-10 py-1 rounded-sm bg-indigo-500 bg-gray-50">Sign Out</button>
      </div>

      <div className="flex justify-center">
        <Link href="/profile"><span className="mt-5p px-10 py-1 rounded-sm-bg-indigo-500 text-gray">Profile</span></Link>
      </div>
    </main>
    );
}

export async function getServersideProps(context){
  const session = await getSession(context);
  if(!session){
    return{
      redirect:{
        destination:"/login",
        permanent:false,
      }
    }
  }
  return{
    props:{session},
  };
}