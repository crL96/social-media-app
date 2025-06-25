import { useState } from "react";
import styles from "./addComment.module.css";
const API_URL = import.meta.env.VITE_API_URL;

function AddComment({ postId }) {
    const [errorMessages, setErrorMessages] = useState([]);

    async function handleSubmit(e) {
        e.preventDefault();

        const formData = new FormData(e.target);
        const comment = Object.fromEntries(formData);

        try {
            const response = await fetch(`${API_URL}/posts/${postId}/comments`, {
                method: "POST",
                headers: {
                    "Content-Type": "Application/JSON",
                    authorization: localStorage.getItem("jwt-token"),
                },
                body: JSON.stringify(comment),
            });
            if (response.status === 200) {
                setErrorMessages([]);
                e.target.reset()
                // window.location.reload();
            } else if (response.status === 400) {
                const data = await response.json()
                setErrorMessages(data.errors)
            } else {
                console.log(response);
                setErrorMessages([{ msg: "Something went wrong, please try again" }])
            }
        } catch (error) {
            console.log(error);
            setErrorMessages([{ msg: "Something went wrong, please try again" }])
        }
    }

    return (
        <div className={styles.div}>
            <h3 className={styles.header}>Add Comment</h3>
            {errorMessages.length !== 0 ? (
                <ul>
                    {errorMessages.map((error, index) => {
                        return (
                            <li key={index}>{error.msg}</li>
                        );
                    })}
                </ul>
            ): null }
            <form onSubmit={handleSubmit} className={styles.form}>
                <label htmlFor="text">Comment: </label>
                <textarea name="text" id="text" rows="4"></textarea>
                <button type="submit">Submit</button>
            </form>
        </div>
    );
}

export default AddComment;