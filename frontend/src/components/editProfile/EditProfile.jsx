import styles from "./editProfile.module.css";
import { useState } from "react";
const API_URL = import.meta.env.VITE_API_URL;

function EditProfile({ user, closeFn }) {
    const [errorMessages, setErrorMessages] = useState([]);
    const [desc, setDesc] = useState(user.desc);
    const [imgUrl, setImgUrl] = useState(user.imgUrl);

    async function handleSubmit(e) {
        try {
            e.preventDefault();

            let imgUrlValue = imgUrl;
            if (imgUrl === "") {
                imgUrlValue = null;
            }

            const res = await fetch(`${API_URL}/user/profile`, {
                method: "PUT",
                headers: {
                    "Content-Type": "Application/json",
                    authorization: localStorage.getItem("jwt-token"),
                },
                body: JSON.stringify({
                    desc,
                    imgUrlValue,
                }),
            });
            if (res.status === 200) {
                closeFn();
            } else if (res.status === 400) {
                const payload = await res.json();
                setErrorMessages(payload.errors);
            }
        } catch (err) {
            console.log(err);
        }
    }

    return (
        <dialog open className={styles.dialog}>
            <h2>Update Profile</h2>

            <ul className={styles.errorList}>
                {errorMessages.map((error, index) => {
                    return (
                        <li className={styles.errorMessage} key={index}>
                            {error.msg}
                        </li>
                    );
                })}
            </ul>

            <form onSubmit={handleSubmit}>
                <label htmlFor="desc">Description: </label>
                <textarea name="desc" id="desc" value={desc} rows={4} onChange={(e) => setDesc(e.target.value)} />
                <label htmlFor="imgUrl">Profile Image URL/Link: </label>
                <input type="text" name="imgUrl" id="imgUrl" value={imgUrl} onChange={(e) => setImgUrl(e.target.value)} />
                <button type="submit">Submit</button>
            </form>
            <button onClick={closeFn}>Cancel</button>
        </dialog>
    );
}

export default EditProfile;