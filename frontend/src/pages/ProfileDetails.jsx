import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
const API_URL = import.meta.env.VITE_API_URL;
import Header from "../components/header/Header";
import Profile from "../components/profile/Profile";
import Post from "../components/post/Post";
import styles from "./profileDetails.module.css";

function ProfileDetails() {
    const { username } = useParams();
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    if (user) {
        user
    }

    useEffect(() => {
        async function fetchUser() {
            try {
                const res = await fetch(`${API_URL}/user/profile/${username}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "Application/json",
                        authorization: localStorage.getItem("jwt-token"),
                    },
                });
                if (res.status === 200) {
                    const data = await res.json();
                    setUser(data);
                } else {
                    navigate("/");
                }
            } catch (err) {
                console.log(err);
                navigate("/");
            }
        }
        fetchUser();
    }, [navigate, username]);

    if (user === null) {
        return (
            <p>Test</p>
        );
    }

    return (
        <>
            <Header />
            <main className={styles.main}>
                {user ? (
                    <>
                        <Profile user={user} />
                        <h2>Posts</h2>
                        {user.posts.map((post) => {
                            return <Post key={post.id} data={post} />
                        })}
                    </>
                ) : (
                    <span className="loader"></span>
                )}
            </main>
        </>
    );
}

export default ProfileDetails;
