import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
const API_URL = import.meta.env.VITE_API_URL;
import Header from "../components/header/Header";
import Post from "../components/post/Post";
import FollowList from "../components/followList/FollowList";
import EditProfile from "../components/editProfile/EditProfile";
import styles from "./userProfile.module.css";
import userIcon from "../assets/user-icon.png";

function UserProfile() {
    const [user, setUser] = useState(null);
    const [showFollowList, setShowFollowList] = useState([false, "following"]);
    const [showEditProfile, setShowEditProfile] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        async function fetchUser() {
            try {
                const res = await fetch(`${API_URL}/user/profile`, {
                    headers: {
                        authorization: localStorage.getItem("jwt-token"),
                    },
                });
                if (res.status === 200) {
                    const data = await res.json();
                    setUser(data);
                }
            } catch (err) {
                console.log(err);
                navigate("/");
            }
        }
        fetchUser();
    }, [navigate]);

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

    if (user === null) {
        return (
            <>
                <Header />
                <span className="loader"></span>
            </>
        );
    }

    return (
        <>
            <Header />
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
                                <button onClick={toggleEditProfile} className={styles.editBtn}>Edit</button>
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
                
                <div className={styles.postsContainer}>
                    <h2>Posts</h2>
                    {user.posts.map((post) => {
                        return <Post key={post.id} data={post} />
                    })}
                </div>
            </main>
            {showFollowList[0] ? (
                <FollowList select={showFollowList[1]} closeDialog={closeFollowList}/> 
            ) : null}
        </>
    );
}

export default UserProfile;
