import Highlighter from "react-highlight-words";
import BeatLoader from "react-spinners/BeatLoader";
import styles from "../app/page.module.css";

const MessageRow = ({ message }) => {
  const highlight = (txt) => (
    <>
      <span style={{ color: "red", background: "transparent" }}>{txt}</span>
    </>
  );
  return (
    <div
      className={`${styles.message} ${
        message.user === "System" ? styles.system : ""
      }`}
    >
      <div className={styles.messageuser}>{message.user}:</div>
      <div className={styles.messagecontent}>
        {message.message ? (
          <Highlighter
            highlightStyle={{
              color: "red",
              backgroundColor: "transparent",
            }}
            searchWords={["hxxp", "hxxps", "fxp"]}
            autoEscape={true}
            textToHighlight={message.message}
          />
        ) : (
          <BeatLoader color="#666" size={4} speedMultiplier={0.5} />
        )}
      </div>
    </div>
  );
};

export default MessageRow;
