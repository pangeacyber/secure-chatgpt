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
  promptLoading: false,
  messages: [],
};

const Chat = () => {
  const { getToken, user } = useAuth();
  const [localState, setLocalState] = useState(initialState);

  const messagesEndRef = useRef(null);

  const token = getToken();

  const basePath = process.env.__NEXT_ROUTER_BASEPATH || "";

  // Append the list with the given message
  const addToMessages = (message) => {
    setLocalState((prev) => {
      return {
        ...prev,
        messages: [...prev.messages, message],
      };
    });
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

  const redactData = async (msg) => {
    return await fetch(`${basePath}/api/redact`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ prompt: msg.prompt, prompt_id: msg.id }),
    });
  };

  const submitData = async (msg) => {
    return await fetch(`${basePath}/api/openai/generate`, {
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
        // Clean the prompt/input and set loading to true
        setLocalState((prev) => ({ ...prev, prompt: "", loading: true }));

        // Omitting message here so we show a loading ellipsis
        // When we receive the response, we will populate the message field
        // with redacted version of the prompt
        const id = uuidv4();
        const userPrompt = {
          id,
          user: user?.profile?.first_name || "User",
        };

        addToMessages(userPrompt);

        let redactedData = { prompt: localState.prompt };

        // Call the redact function
        const redactResponse = await redactData({
          prompt: localState.prompt,
        });

        if (redactResponse.status !== 200) {
          const errorContent = await redactResponse.text();
          console.error(errorContent, redactResponse.status);
          addToMessages({
            id: uuidv4(),
            user: "System",
            message: `${errorContent} | Status: ${redactResponse.status}`,
            maliciousURLs: [],
          });
        } else {
          redactedData = await redactResponse.json();
          // Update the message with the redacted prompt
          updateMessagePrompt(id, redactedData?.prompt);

          // Add the prompt when submitting to the API
          setLocalState((prev) => ({ ...prev, promptLoading: true }));

          const promptResponse = await submitData({
            ...userPrompt,
            prompt: redactedData?.prompt,
          });

          let promptData;
          if (promptResponse.status === 200) {
            promptData = await promptResponse.json();
            addToMessages({
              id: uuidv4(),
              user: "System",
              message: promptData?.result,
              maliciousURLs: promptData?.maliciousURLs,
            });
          } else {
            const errorContent = await promptResponse.text();
            console.error(errorContent, promptResponse.status);
            addToMessages({
              id: uuidv4(),
              user: "System",
              message: `${errorContent} | Status: ${promptResponse.status}`,
              maliciousURLs: [],
            });
          }
        }
      } catch (error) {
        // Add the error as a message so users can see it
        addToMessages({
          id: uuidv4(),
          user: "System",
          message: error.message || "Something went wrong",
          maliciousURLs: [],
        });
      } finally {
        setLocalState((prev) => ({
          ...prev,
          loading: false,
          promptLoading: false,
        }));
      }
    }
  };

  // We scroll to the bottom of the messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [localState.messages]);

  return (
    <main className={styles.main}>
      <div className={styles.messages}>
        <>
          {localState.messages.map((msg) => (
            <MessageRow key={msg.id} message={msg} />
          ))}
          {localState.promptLoading && (
            <MessageRow key="loader" message={{ user: "System" }} />
          )}
        </>
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
          style={{
            backgroundColor: localState.loading ? "#eee" : "#fff",
          }}
        />
      </div>
      <div className={styles["user-prompt"]}>&lt;disclaimer&gt;</div>
    </main>
  );
};

export default pageWithAuthentication(Chat);
