import Keywords from "react-keywords";
import BeatLoader from "react-spinners/BeatLoader";
import styles from "../app/page.module.css";

const DEFANGVALUE = "hxxp";

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
          <Keywords value={DEFANGVALUE} color="red" render={highlight}>
            {message.message}
          </Keywords>
        ) : (
          <BeatLoader color="#666" size={4} speedMultiplier={0.5} />
        )}
      </div>
    </div>
  );
};

export default MessageRow;
