import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import { AuthProvider } from "@pangeacyber/react-auth";

export default function App({ Component, pageProps }: AppProps) {
  const hostedLoginURL = process?.env?.NEXT_PUBLIC_AUTHN_HOSTED_LOGIN_URL || "";
  const authConfig = {
      clientToken: process?.env?.NEXT_PUBLIC_AUTHN_CLIENT_TOKEN || "",
      domain: process?.env?.NEXT_PUBLIC_PANGEA_DOMAIN || "",
  };

  return (
    <AuthProvider config={authConfig} loginUrl={hostedLoginURL}>
      <Component {...pageProps} />
    </AuthProvider>
  )
}
