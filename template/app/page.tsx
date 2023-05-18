"use client";

import { useAuth } from "@pangeacyber/react-auth";
import styles from "./page.module.css";
import Link from "next/link";

export default function Home() {
  const { authenticated } = useAuth();

  return (
    <main className={styles.main}>
      <div>
        <div className={styles.card}>
          <h2>
            Welcome to Secure ChatGPT starter app powered by{" "}
            <a href="https://pangea.cloud/">Pangea</a>
          </h2>
          {authenticated && <p>Please navigate to the  <Link href={"/chat"}>Secure ChatGPT</Link></p>}
          {!authenticated && <p>Please sign in to see the chat page.</p>}
        </div>
      </div>
    </main>
  );
}
