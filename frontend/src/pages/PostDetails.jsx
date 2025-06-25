import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
const API_URL = import.meta.env.VITE_API_URL;
import Post from "../components/post/Post";

function PostDetails() {
    const { postId } = useParams();
    const [post, setPost] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        async function fetchPost(nComments) {
            try {
                const res = await fetch(`${API_URL}/posts/${postId}?max=${nComments}`, {
                    headers: {
                        "Content-Type": "Application/json",
                        authorization: localStorage.getItem("jwt-token"),
                    },
                });
                if (res.status === 200) {
                    const data = await res.json();
                    setPost(data);
                } else if (res.status === 401) {
                    localStorage.removeItem("jwt-token");
                    navigate("/login");
                } else if (res.status === 404) {
                    navigate("/");
                }
            } catch (err) {
                console.log(err);
            }
        }
        fetchPost(50);
    }, [navigate, postId]);

    return (
        <>
            {post ? 
            <Post data={post} />
            : <span className="loader"></span>
            }
        </>
    );
}

export default PostDetails;