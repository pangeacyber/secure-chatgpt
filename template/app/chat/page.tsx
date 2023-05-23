"use client";
import { useState, useRef, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import styles from "../page.module.css";
import { useAuth } from "@pangeacyber/react-auth";
import pageWithAuthentication from "../../components/pageWithAuthentication";
import MessageRow from "../../components/MessageRow";

const initialState = {
  prompt: "",
  loading: false,
  messages: [],
};

const Chat = () => {
  const { getToken, user } = useAuth();
  const [localState, setLocalState] = useState(initialState);

  const messagesEndRef = useRef(null);

  const token = getToken();

  // Append the list with the given message
  const addToMessages = (message) => {
    setLocalState((prev) => ({
      ...prev,
      messages: [...prev.messages, message],
    }));
  };

  // Update the message with the given ID with the given content
  const updateMessagePrompt = (messageID, newPrompt) => {
    setLocalState((prev) => ({
      ...prev,
      messages: prev.messages.map((m) => {
        if (m.id === messageID) {
          return {
            ...m,
            message: newPrompt,
          };
        }
        return m;
      }),
    }));
  };

  const processResponse = (data) => {
    updateMessagePrompt(data?.prompt_id, data?.prompt);
    addToMessages({
      id: uuidv4(),
      user: "System",
      message: data?.result,
      maliciousURLs: data?.maliciousURLs,
    });
  };

  const submitData = async (msg) => {
    return await fetch("/api/openai/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ prompt: msg.prompt, prompt_id: msg.id }),
    });
  };

  const handleKeyDown = async (e) => {
    if (e.key === "Enter" && !localState.loading) {
      e.preventDefault();
      try {
        // Omitting message here so we show a loading ellipsis
        // When we receive the response, we will populate the message field
        // with redacted version of the prompt
        const userPrompt = {
          id: uuidv4(),
          user: user?.profile?.first_name || "User",
        };
        addToMessages(userPrompt);

        // Clean the prompt/input and set loading to true
        setLocalState((prev) => ({ ...prev, prompt: "", loading: true }));

        // prompt when submitting to the API
        const response = await submitData({
          ...userPrompt,
          prompt: localState.prompt,
        });

        const data = await response.json();

        if (response.status !== 200) {
          throw (
            data.error ||
            new Error(`Request failed with status ${response.status}`)
          );
        }

        processResponse(data);
      } catch (error) {
        console.error(error);
      }
      setLocalState((prev) => ({ ...prev, loading: false }));
    }
  };

  // We scroll to the bottom of the messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [localState.messages]);

  return (
    <main className={styles.main}>
      <div className={styles.messages}>
        {localState.messages.map((msg) => (
          <MessageRow key={msg.id} message={msg} />
        ))}
        <div ref={messagesEndRef} />
      </div>
      <div className={styles["user-prompt"]}>
        <input
          type="text"
          placeholder={
            localState.loading
              ? "PLEASE WAIT FOR THE PREVIOUS REQUEST TO COMPLETE"
              : "Enter a prompt"
          }
          value={localState.prompt}
          className={styles.entryBox}
          onChange={(e) =>
            setLocalState((prev) => ({ ...prev, prompt: e.target.value }))
          }
          onKeyDown={handleKeyDown}
          style={{ backgroundColor: localState.loading ? "#eee" : "#fff" }}
        />
      </div>
      <div className={styles["user-prompt"]}>
        Some large and serious disclaimer goes here!
      </div>
    </main>
  );
};

export default pageWithAuthentication(Chat);
