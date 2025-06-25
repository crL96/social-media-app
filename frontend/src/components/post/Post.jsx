import styles from "./post.module.css";
import userIcon from "../../assets/user-icon.png";
import Comment from "../comment/Comment";

function Post({ data }) {
    const formattedTime = new Date(data.timestamp).toLocaleString("en-GB");

    console.log(data);

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
                    <button>Add a comment</button>
                </div>
                {data.comments.map((comment) => {
                    return (
                        <Comment key={comment.id} data={comment} />
                    );
                })}
            </div>
        </div>
    );
}

export default Post;
