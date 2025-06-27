import styles from "./profileCard.module.css";
import userIcon from "../../assets/user-icon.png";
import { Link } from "react-router-dom";

function ProfileCard({ user }) {
    return (
        <div className={styles.profileCard}>
                <Link to={`/app/profile/${user.username}`}>
                    <div className={styles.profileUpper}>
                        <img src={user.imgUrl ? user.imgUrl : userIcon} alt="User icon" />
                        <h2>{user.username}</h2>
                    </div>
                    <div className={styles.profileLower}>
                        {user.desc && user.desc.length > 30
                            ? user.desc.substring(0, 30) + "..."
                            : user.desc}
                        <p>Followers: {user._count.followedBy}</p>
                    </div>
                </Link>
            </div>
    );
}

export default ProfileCard;
