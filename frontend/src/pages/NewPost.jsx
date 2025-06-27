import { useState } from "react";
import styles from "./forms.module.css";
import { useNavigate } from 'react-router-dom';
const API_URL = import.meta.env.VITE_API_URL;

function NewPost() {
    const [errorMessage, setErrorMessage] = useState();
    const navigate = useNavigate();

    async function handleSubmit(e) {
        e.preventDefault()

        const formData = new FormData(e.target);
        const post = Object.fromEntries(formData);

        try {
            const response = await fetch(`${API_URL}/posts`, {
                method: "POST",
                headers: {
                    "Content-Type": "Application/JSON",
                    Authorization: localStorage.getItem("jwt-token")
                },
                body: JSON.stringify(post),
            });
            if (response.status === 200) {
                navigate("/");
            } else if (response.status === 401) {
                localStorage.removeItem("jwt-token");
                localStorage.removeItem("currentUser");
                navigate("/login");
            } else if (response.status === 400) {
                const data = await response.json()
                setErrorMessage(data.errors[0].msg)
            } else {
                setErrorMessage("Something went wrong, please try again")
            }
        } catch (error) {
            console.log(error)
            setErrorMessage("Something went wrong, please try again")
        }

    }

    return (
        <>
            <main>
                <p className={styles.errorMessage}>{errorMessage}</p>
                <div className={styles.div}>
                    <form onSubmit={handleSubmit} className={styles.form}>
                        <legend>New Post</legend>
                        <label htmlFor="text">What's on your mind?</label>
                        <textarea name="text" id="text" rows="5"></textarea>
                        <button type="submit">Post</button>
                    </form>
                </div>
            </main>
        </>
    );
}

export default NewPost;