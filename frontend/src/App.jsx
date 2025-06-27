import { useState, useEffect } from "react";
import "./App.css";
const API_URL = import.meta.env.VITE_API_URL;
import Post from "./components/post/Post";
import Header from "./components/header/Header";
import ProfileSuggestions from "./components/profileSuggestions/ProfileSuggestions";
import { useNavigate } from "react-router-dom";

function App() {
    const [posts, setPosts] = useState([]);
    const navigate = useNavigate();

    if (!localStorage.getItem("jwt-token")) {
        navigate("/login");
    }

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
        <>
            <Header />
            <div className="mainContainer">
                <main>
                    {posts.map((post) => {
                        return <Post key={post.id} data={post} />;
                    })}
                </main>
                <ProfileSuggestions nProfiles={5}/>
            </div>
        </>
    );
}

export default App;
