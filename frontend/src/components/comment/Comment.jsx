import styles from "./comment.module.css";
import userIcon from "../../assets/user-icon.png";
import { Link } from "react-router-dom";
import { useState } from "react";
const API_URL = import.meta.env.VITE_API_URL;

function Comment({ data }) {
    const formattedTime = new Date(data.timestamp).toLocaleString("en-GB");
    const ownerStatus = localStorage.getItem("currentUser") === data.author.username;
    const [deleted, setDeleted] = useState(false);

    async function handleDelete() {
        try {
            const res = await fetch(`${API_URL}/posts/postId/comments/${data.id}`, {
                method: "DELETE",
                headers: {
                    authorization: localStorage.getItem("jwt-token"),
                },
            });
            if (res.status === 200) {
                setDeleted(true);
            }
        } catch (err) {
            console.log(err)
        }
    }

    // Enables removing the comment after deletion without fetching new data
    // Fully removed with next data update/fetch
    if (deleted) return null;

    return (
        <div className={[styles.comment, "comment"].join(" ")}>
            <div className={styles.header}>
                <div>
                    <img src={data.author.imgUrl ? data.author.imgUrl : userIcon} alt="User icon" />
                    <Link
                        className="profileLink"
                        to={
                            ownerStatus
                                ? "/app/profile"
                                : `/app/profile/${data.author.username}`
                        }
                    >
                        <h4>{data.author.username}</h4>
                    </Link>
                </div>
                {ownerStatus ? (
                    <button className={styles.deleteBtn} onClick={handleDelete}>
                        Delete
                    </button>
                ): null}
            </div>
            <p>{data.text}</p>
            <p>{formattedTime}</p>
        </div>
    );
}

export default Comment;