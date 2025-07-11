import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
const API_URL = import.meta.env.VITE_API_URL;
import Profile from "../components/profile/Profile";
import Post from "../components/post/Post";

function ProfileDetails() {
    const { username } = useParams();
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        async function fetchUser() {
            try {
                const res = await fetch(
                    username
                        ? `${API_URL}/user/profile/${username}`
                        : `${API_URL}/user/profile`,
                    {
                        method: "GET",
                        headers: {
                            "Content-Type": "Application/json",
                            authorization: localStorage.getItem("jwt-token"),
                        },
                    }
                );
                if (res.status === 200) {
                    const data = await res.json();
                    setUser(data);
                } else if (res.status === 401) {
                    localStorage.removeItem("jwt-token");
                    localStorage.removeItem("currentUser");
                    navigate("/login");
                } else {
                    navigate("/home");
                }
            } catch (err) {
                console.log(err);
                navigate("/home");
            }
        }
        fetchUser();
    }, [navigate, username]);

    return (
        <>
            <main>
                {user ? (
                    <>
                        <Profile user={user} currentUserStatus={!username} />
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
