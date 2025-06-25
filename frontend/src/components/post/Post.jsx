import { useState } from "react";
import styles from "./post.module.css";
import userIcon from "../../assets/user-icon.png";
import Comment from "../comment/Comment";
import AddComment from "../addComment/AddComment";
import { Link } from "react-router-dom";

function Post({ data }) {
    const [showAddComment, setShowAddComment] = useState(false);

    const formattedTime = new Date(data.timestamp).toLocaleString("en-GB");

    function toggleShowAddComment() {
        if (showAddComment) {
            setShowAddComment(false);
        } else {
            setShowAddComment(true);
        }
    }

    return (
        <div className={[styles.post, "post"].join(" ")}>
            <div className={styles.header}>
                <img src={data.author.imgUrl ? data.author.imgUrl : userIcon} alt="User icon" />
                <h2>{data.author.username}</h2>
            </div>
            <p>{data.text}</p>
            <div className={styles.footer}>
                <div>
                    <p className={styles.likes}>Likes: {data._count.likes}</p>
                    <p className={styles.commentsNumber}>Comments: {data._count.comments}</p>
                </div>
                <p className={styles.timestamp}>{formattedTime}</p>
            </div>
            <div className={styles.comments}>
                <div className={styles.commentsHeader}>
                    <h3>Comments</h3>
                    <button onClick={toggleShowAddComment}>
                        {showAddComment ? ("Hide") : ("Add a comment")}
                    </button>
                </div>
                {/* Show Add comment box only if showAddComment true */}
                {showAddComment ? (
                    <AddComment postId={data.id}/>
                ) : null}
                
                {data.comments.map((comment) => {
                    return (
                        <Comment key={comment.id} data={comment} />
                    );
                })}
                {/* If there are more comments than are displayed, display link */}
                {data._count.comments > data.comments.length ? (
                    <Link to={`/post/${data.id}`}>Show all comments</Link>
                ) : null}
            </div>
        </div>
    );
}

export default Post;
