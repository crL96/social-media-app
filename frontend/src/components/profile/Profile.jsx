import styles from "./profile.module.css";
import userIcon from "../../assets/user-icon.png";

function Profile({ user }) {
    return (
        <div className={styles.profileContainer}>
            <div className={styles.profileUpper}>
                <img src={user.imgUrl ? user.imgUrl : userIcon} alt="User icon" />
                <div>
                    <h2>{user.username}</h2>
                    <p>{user.desc}</p>
                </div>
            </div>
            <div className={styles.profileLower}>
                <p>Posts: {user._count.posts}</p>
                <p>Followers: {user._count.followedBy}</p>
                <p>Following: {user._count.following}</p>
            </div>
        </div>
    );
}

export default Profile;
