import styles from "./comment.module.css";
import userIcon from "../../assets/user-icon.png";

function Comment({ data }) {
    const formattedTime = new Date(data.timestamp).toLocaleString("en-GB");
    
    return (
        <div className={[styles.comment, "comment"].join(" ")}>
            <div className={styles.header}>
                <img src={data.author.imgUrl ? data.author.imgUrl : userIcon} alt="User icon" />
                <h4>{data.author.username}</h4>
            </div>
            <p>{data.text}</p>
            <p>{formattedTime}</p>
        </div>
    );
}

export default Comment;