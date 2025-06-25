import styles from "./comment.module.css";
import userIcon from "../../assets/user-icon.png";
import { Link } from "react-router-dom";

function Comment({ data }) {
    const formattedTime = new Date(data.timestamp).toLocaleString("en-GB");
    
    return (
        <div className={[styles.comment, "comment"].join(" ")}>
            <div className={styles.header}>
                <img src={data.author.imgUrl ? data.author.imgUrl : userIcon} alt="User icon" />
                <Link className="profileLink" to={`/profile/${data.author.username}`}>
                    <h4>{data.author.username}</h4>
                </Link>
            </div>
            <p>{data.text}</p>
            <p>{formattedTime}</p>
        </div>
    );
}

export default Comment;