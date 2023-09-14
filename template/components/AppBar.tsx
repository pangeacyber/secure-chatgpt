"use client";
import { useAuth } from "@pangeacyber/react-auth";

import styles from "../app/page.module.css";
import Link from "next/link";
import React, { useEffect, useState } from "react";

type ServerSettings = {
  audit?: Boolean;
  redact?: Boolean;
  threatAnalysis?: Boolean;
};
const AppBar = () => {
  const [serverSettings, setServerSettings] = useState<ServerSettings>({});
  const { authenticated, getToken, login, logout } = useAuth();
  const token = authenticated ? getToken() : "";

  const basePath = process.env.__NEXT_ROUTER_BASEPATH || "";

  const getServerSettings = async () => {
    try {
      const response = await fetch(`${basePath}/api/openai/settings`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      return response.json();
    } catch (ex) {
      console.error(ex);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      const data = await getServerSettings();
      setServerSettings(data);
    };

    if (token) {
      fetchData();
    }
  }, [authenticated]);

  return (
    <header>
      <div className={styles.nav}>
        <div className={styles.navlink}>
          <Link href={"/"}>Home</Link>
        </div>

        {authenticated && (
          <div className={styles.navlink}>
            <Link href={"/chat"}>Secure ChatGPT</Link>
          </div>
        )}
      </div>
      <div className={styles["bar-actions"]}>
        {authenticated && (
          <>
            <div className={styles["server-settings"]}>
              <div>Audit: {serverSettings?.audit ? "Enabled" : "Disabled"}</div>
            </div>
            <div className={styles["server-settings"]}>
              <div>
                Redact: {serverSettings?.redact ? "Enabled" : "Disabled"}
              </div>
            </div>
            <div className={styles["server-settings"]}>
              <div>
                Threat Analysis:{" "}
                {serverSettings?.threatAnalysis ? "Enabled" : "Disabled"}
              </div>
            </div>
            <button
              className={styles["header-action"]}
              onClick={() => logout()}
            >
              Sign Out
            </button>
          </>
        )}
        {!authenticated && (
          <button className={styles["header-action"]} onClick={() => login()}>
            Sign In
          </button>
        )}
      </div>
    </header>
  );
};

export default AppBar;
