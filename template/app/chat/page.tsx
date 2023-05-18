"use client";
import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import BeatLoader from "react-spinners/BeatLoader";
import styles from "../page.module.css";
import { useAuth } from "@pangeacyber/react-auth";
import pageWithAuthentication from "../../components/pageWithAuthentication";

const Chat = () => {
  const { getToken, user } = useAuth();
  const [prompt, setPrompt] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const token = getToken();

  const handleKeyDown = async (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      try {
        setMessages((prev) => [
          ...prev,
          {
            id: uuidv4(),
            user: user?.profile?.first_name || "User",
            message: prompt,
          },
        ]);
        setPrompt("");
        setLoading(true);
        const response = await fetch("/api/openai/generate", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ prompt }),
        });

        const data = await response.json();
        if (response.status !== 200) {
          throw (
            data.error ||
            new Error(`Request failed with status ${response.status}`)
          );
        }

        setLoading(false);
        setMessages((prev) => [
          ...prev,
          { id: uuidv4(), user: "System", message: data?.result },
        ]);
      } catch (error) {
        setLoading(false);
        console.error(error);
      }
    }
  };

  return (
    <main className={styles.main}>
      <div className={styles.messages}>
        {messages.map((message) => (
          <div
            className={`${styles.message} ${
              message.user === "System" ? styles.system : ""
            }`}
            key={message.id}
          >
            <div className={styles.messageuser}>{message.user}:</div>
            <div className={styles.messagecontent}>{message.message}</div>
          </div>
        ))}
        {loading && (
          <div className={`${styles.message} ${styles.system}`} key="loader">
            <div className={styles.messageuser}>System:</div>
            <div className={styles.messagecontent}>
              <BeatLoader color="#666" size={4} speedMultiplier={0.5} />
            </div>
          </div>
        )}
      </div>
      <div className={styles["user-prompt"]}>
        <input
          type="text"
          placeholder="Enter user prompt"
          value={prompt}
          className={styles.entryBox}
          onChange={(e) => setPrompt(e.target.value)}
          onKeyDown={handleKeyDown}
        />
      </div>
      <div className={styles["user-prompt"]}>
        Some large and serious disclaimer goes here!
      </div>
    </main>
  );
};

export default pageWithAuthentication(Chat);
