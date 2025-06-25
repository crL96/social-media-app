import { useState } from "react";
import styles from "./post.module.css";
import userIcon from "../../assets/user-icon.png";
import likeIcon from "../../assets/like-icon.svg";
import likeActiveIcon from "../../assets/like-active-icon.svg";
import Comment from "../comment/Comment";
import AddComment from "../addComment/AddComment";
import { Link } from "react-router-dom";
const API_URL = import.meta.env.VITE_API_URL;

function Post({ data }) {
    const [showAddComment, setShowAddComment] = useState(false);
    const [liked, setLiked] = useState(data.liked);

    const formattedTime = new Date(data.timestamp).toLocaleString("en-GB");

    function toggleShowAddComment() {
        if (showAddComment) {
            setShowAddComment(false);
        } else {
            setShowAddComment(true);
        }
    }

    async function toggleLike() {
        const res = await fetch(`${API_URL}/posts/${data.id}/like`, {
            // DELETE to unlike, POST to like
            method: liked ? "DELETE" : "POST",
            headers: {
                authorization: localStorage.getItem("jwt-token"),
            },
        });
        if (res.status === 200) {
            if (liked) {
                data._count.likes--;
            } else {
                data._count.likes++;
            }
            setLiked(!liked);
        }
    }

    return (
        <div className={[styles.post, "post"].join(" ")}>
            <div className={styles.header}>
                <img src={data.author.imgUrl ? data.author.imgUrl : userIcon} alt="User icon" />
                <Link className="profileLink" to={`/profile/${data.author.username}`}>
                    <h2>{data.author.username}</h2>
                </Link>
            </div>
            <p>{data.text}</p>
            <div className={styles.footer}>
                <div>
                    <img 
                        onClick={toggleLike}
                        className={styles.likeIcon}
                        src={liked ? likeActiveIcon : likeIcon}
                        alt="heart: press to like/unlike"
                    />
                    <p className={styles.likes}>Likes: {data._count.likes}</p>
                    <p className={styles.commentsNumber}>Comments: {data._count.comments}</p>
                </div>
                <p className={styles.timestamp}>{formattedTime}</p>
            </div>
            
            {/* If comments is undefined, this means we dont want to render comment content */}
            {data.comments === undefined ? null : (
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
            )}
        </div>
    );
}

export default Post;
