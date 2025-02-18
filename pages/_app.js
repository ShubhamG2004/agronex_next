import "@/styles/globals.css";
import { SessionProvider } from 'next-auth/react';
import { useSession, signIn, signOut } from "next-auth/react";


export default function App({ Component, pageProps }) {
  return (
    <SessionProvider session={pageProps.session}>
      <Component {...pageProps} />
    </SessionProvider>
  )
}
