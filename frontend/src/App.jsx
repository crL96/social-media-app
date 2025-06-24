import { useState, useEffect } from "react";
import "./App.css";
const API_URL = import.meta.env.VITE_API_URL;
import Post from "./components/post/Post";
import { useNavigate } from "react-router-dom";

function App() {
    const [posts, setPosts] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        async function fetchPosts(n) {
            try {
                const res = await fetch(`${API_URL}/posts?max=${n}`, {
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
                    navigate("/login");
                }
            } catch (err) {
                console.log(err);
            }
        }
        fetchPosts(15);
    }, [navigate]);

    return (
        <>
            {posts.map((post) => {
                return <Post key={post.id} data={post} />;
            })}
        </>
    );
}

export default App;
