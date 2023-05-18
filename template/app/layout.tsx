"use client";
import { AuthProvider } from "@pangeacyber/react-auth";
import AppBar from "../components/AppBar";

import "./globals.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const hostedLoginURL = process?.env?.NEXT_PUBLIC_AUTHN_HOSTED_LOGIN_URL || "";
  const authConfig = {
    clientToken: process?.env?.NEXT_PUBLIC_AUTHN_CLIENT_TOKEN || "",
    domain: process?.env?.NEXT_PUBLIC_PANGEA_DOMAIN || "",
  };

  if (!authConfig.clientToken || !authConfig.domain) {
    return (
      <html lang="en">
        <head />
        <body style={{ padding: "40px", textAlign: "center" }}>
          <h2>
            Please configure your environment variables. See the README for
            more...
          </h2>
        </body>
      </html>
    );
  }
  return (
    <html lang="en">
      <head />
      <body>
        <AuthProvider loginUrl={hostedLoginURL} config={authConfig}>
          <div className="container">
            <AppBar />
            <div className="content">{children}</div>
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
