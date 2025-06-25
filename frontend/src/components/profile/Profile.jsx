import styles from "./profile.module.css";
import userIcon from "../../assets/user-icon.png";
import { useState } from "react";
const API_URL = import.meta.env.VITE_API_URL;

function Profile({ user }) {
    const [following, setFollowing] = useState(user.following);

    async function toggleFollow() {
        const res = await fetch(`${API_URL}/user/follow/${user.username}`, {
            // DELETE to unfollow, POST to follow
            method: following ? "DELETE" : "POST",
            headers: {
                authorization: localStorage.getItem("jwt-token"),
            },
        });
        if (res.status === 200) {
            setFollowing(!following);
        }
    }

    return (
        <div className={styles.profileContainer}>
            <div className={styles.profileUpper}>
                <img src={user.imgUrl ? user.imgUrl : userIcon} alt="User icon" />
                <div>
                    <div>
                        <h2>{user.username}</h2>
                        <button className={styles.followBtn} onClick={toggleFollow}>{following ? "Unfollow" : "Follow"}</button>
                    </div>
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
