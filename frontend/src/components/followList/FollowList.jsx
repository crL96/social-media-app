import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import styles from "./followList.module.css";
import userIcon from "../../assets/user-icon.png";
const API_URL = import.meta.env.VITE_API_URL;

function FollowList({ select, closeDialog }) {
    const [users, setUsers] = useState(null);
    const [selectedKey, setSelectedKey] = useState(select ? select : "following");
    const { username } = useParams();

    useEffect(() => {
        async function fetchUsers() {
            try {
                const res = await fetch(
                    username
                        ? `${API_URL}/user/follow/${username}`
                        : `${API_URL}/user/follow`,
                    {
                        headers: {
                            authorization: localStorage.getItem("jwt-token"),
                        },
                    }
                );
                if (res.status === 200) {
                    const data = await res.json();
                    setUsers(data);
                }
            } catch (err) {
                console.log(err);
            }
        }
        fetchUsers();
    }, [username]);
    
    function handleSelectFollowers() {
        setSelectedKey("followedBy");
    }

    function handleSelectFollowing() {
        setSelectedKey("following");
    }

    if (users === null) {
        return (
            <dialog>
                <span className="loader"></span>
            </dialog>
        );
    }

    return (
        <dialog open className={styles.dialog} id="dialog">
            <div className={styles.header}>
                <button onClick={handleSelectFollowing}>Following</button>
                <button onClick={handleSelectFollowers}>Followers</button>
            </div>
            <div className={styles.followList}>
                {users[selectedKey].map((user) => {
                    return (
                        <div onClick={closeDialog} key={user.username} className={styles.user}>
                            <Link to={`/app/profile/${user.username}`}>
                                <img
                                    src={
                                        user.imgUrl ? user.imgUrl : userIcon
                                    }
                                    alt="User icon"
                                />
                                <h4>{user.username}</h4>
                            </Link>
                        </div>
                    );
                })}
            </div>
            <button className={styles.closeBtn} onClick={closeDialog}>Close</button>
        </dialog>
    );
}

export default FollowList;
