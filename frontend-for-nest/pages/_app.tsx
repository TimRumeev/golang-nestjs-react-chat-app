import '../styles/globals.css';
import type { AppProps } from 'next/app';

export default function MyApp({ Component, pageProps }: AppProps) {
  // If it's an error page (status code >= 400), return without RootLayout
  if (pageProps.statusCode && pageProps.statusCode >= 400) {
    return <Component {...pageProps} />;
  }

  return (
      <Component {...pageProps} />
  );
}