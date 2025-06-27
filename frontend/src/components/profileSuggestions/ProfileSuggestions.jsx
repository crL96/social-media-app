import { useState, useEffect } from "react";
const API_URL = import.meta.env.VITE_API_URL;
import userIcon from "../../assets/user-icon.png";
import styles from "./profileSuggestions.module.css";
import { Link } from "react-router-dom";

function ProfileSuggestions({ nProfiles }) {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        async function fetchUsers(nMax) {
            try {
                const res = await fetch(`${API_URL}/user/suggested?max=${nMax}`, {
                    headers: {
                        authorization: localStorage.getItem("jwt-token"),
                    },
                });
                if (res.status === 200) {
                    const data = await res.json();
                    setUsers(data);
                }
            } catch (err) {
                console.log(err);
            }
        }
        fetchUsers(nProfiles);
    }, [nProfiles]);

    if (users.length === 0) {
        return (
            <div className="profileSuggestions">
                <h3>Suggestions</h3>
                <span className="loader"></span>
            </div>
        );
    }

    return (
        <div className="profileSuggestions">
            <h3>Suggestions</h3>
            {users.map((user) => {
                return (
                    <div key={user.username} className={styles.user}>
                        <Link to={`/profile/${user.username}`}>
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
    );
}

export default ProfileSuggestions;