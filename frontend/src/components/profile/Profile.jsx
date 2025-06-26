import styles from "./profile.module.css";
import userIcon from "../../assets/user-icon.png";
import { useState } from "react";
const API_URL = import.meta.env.VITE_API_URL;
import EditProfile from "../editProfile/EditProfile";
import FollowList from "../followList/FollowList";

function Profile({ user, currentUserStatus }) {
    const [following, setFollowing] = useState(user.following);
    const [showFollowList, setShowFollowList] = useState([false, "following"]);
    const [showEditProfile, setShowEditProfile] = useState(false);

    async function toggleFollow() {
        const res = await fetch(`${API_URL}/user/follow/${user.username}`, {
            // DELETE to unfollow, POST to follow
            method: following ? "DELETE" : "POST",
            headers: {
                authorization: localStorage.getItem("jwt-token"),
            },
        });
        if (res.status === 200) {
            if (following) {
                user._count.followedBy--;
            } else {
                user._count.followedBy++;
            }
            setFollowing(!following);
        }
    }

    function openFollowList(e) {
        if (e.target.textContent.startsWith("Followers")) {
            setShowFollowList([true, "followedBy"]);
        } else {
            setShowFollowList([true, "following"]);
        }
    }

    function closeFollowList() {
        setShowFollowList([false, "following"]);
    }

    function toggleEditProfile() {
        setShowEditProfile(!showEditProfile);
    }

    return (
        <>
            {showEditProfile ? (
                <EditProfile user={user} closeFn={toggleEditProfile} />
            ) : null }
            <main className={styles.main}>
                <div className={styles.profileContainer}>
                    <div className={styles.profileUpper}>
                        <img src={user.imgUrl ? user.imgUrl : userIcon} alt="User icon" />
                        <div>
                            <div>
                                <h2>{user.username}</h2>
                                {currentUserStatus ? (
                                    <button onClick={toggleEditProfile} className={styles.editBtn}>Edit</button>
                                ) : (
                                    <button className={styles.followBtn} onClick={toggleFollow}>{following ? "Unfollow" : "Follow"}</button>
                                )}
                            </div>
                            <p>{user.desc}</p>
                        </div>
                    </div>
                    <div className={styles.profileLower}>
                        <p>Posts<br />{user._count.posts}</p>
                        <button onClick={openFollowList}>Followers<br />{user._count.followedBy}</button>
                        <button onClick={openFollowList}>Following<br />{user._count.following}</button>
                    </div>
                </div>
            </main>
            {showFollowList[0] ? (
                <FollowList select={showFollowList[1]} closeDialog={closeFollowList}/> 
            ) : null}
        </>
    );
};


export default Profile;
