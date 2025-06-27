import { useState, useEffect } from "react";
const API_URL = import.meta.env.VITE_API_URL;
import Post from "../components/post/Post";
import { useNavigate } from "react-router-dom";

function Home() {
    const [posts, setPosts] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        async function fetchPosts(n, nComments) {
            try {
                const res = await fetch(`${API_URL}/posts?max=${n}&comments=${nComments}`, {
                    headers: {
                        "Content-Type": "Application/json",
                        authorization: localStorage.getItem("jwt-token"),
                    },
                });
                if (res.status === 200) {
                    const data = await res.json();
                    setPosts(data);
                } else if (res.status === 401) {
                    localStorage.removeItem("jwt-token");
                    localStorage.removeItem("currentUser");
                    navigate("/login");
                }
            } catch (err) {
                console.log(err);
            }
        }
        fetchPosts(15, 2);
    }, [navigate]);

    return (
        <main>
            {posts.map((post) => {
                return <Post key={post.id} data={post} />;
            })}
            {posts.length === 0 ? (
                <p>
                    Looks like you're not following anyone who has
                    posted anything
                </p>
            ) : null}
        </main>
    );
}

export default Home;
