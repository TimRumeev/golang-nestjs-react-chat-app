import UserProvider from "@/context/auth.context";
import '../styles/globals.css';
import type { AppProps } from 'next/app';
import LoginPage from "./login";
import Home from ".";
import RootLayout from "@/app/layout";

export default function MyApp({ Component, pageProps }: AppProps) {
  // If it's an error page (status code >= 400), return without RootLayout
  if (pageProps.statusCode && pageProps.statusCode >= 400) {
    return <Component {...pageProps} />;
  }
  <UserProvider>
      <LoginPage></LoginPage>
      <Home></Home>
  </UserProvider>
  return (
    <UserProvider>
        <Component {...pageProps} />

    </UserProvider>
  );
} 