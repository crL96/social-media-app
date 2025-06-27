import { useState } from "react";
import { useNavigate } from "react-router-dom";
const API_URL = import.meta.env.VITE_API_URL;
import styles from "./forms.module.css";
import Header from "../components/header/Header";

function Signup() {
    const [errorMessages, setErrorMessages] = useState([]);
    const navigate = useNavigate();

    async function handleSignup(e) {
        try {
            e.preventDefault();

            const formData = new FormData(e.target);
            const data = Object.fromEntries(formData);

            const res = await fetch(`${API_URL}/auth/sign-up`, {
                method: "POST",
                headers: {
                    "Content-Type": "Application/json",
                },
                body: JSON.stringify(data),
            });
            // If sucessful, attempt to login user
            if (res.status === 200) {
                const loginRes = await fetch(`${API_URL}/auth/log-in`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "Application/json",
                    },
                    body: JSON.stringify({
                        email: data.email,
                        password: data.password,
                    }),
                });
                if (loginRes.status === 200) {
                    const resPayload = await loginRes.json();
                    localStorage.setItem("jwt-token", resPayload.token);
                    localStorage.setItem("currentUser", resPayload.username);
                    navigate("/");
                } else {
                    navigate("/login");
                }
            // If unsuccessful display validation error messages
            } else if (res.status === 400) {
                const payload = await res.json();
                setErrorMessages(payload.errors);
            }
        } catch (err) {
            console.log(err);
        }
    }

    async function handleGuestLogin() {
        try {
            const res = await fetch(`${API_URL}/auth/log-in/guest`);
            if (res.status === 200) {
                const resPayload = await res.json();
                localStorage.setItem("jwt-token", resPayload.token);
                localStorage.setItem("currentUser", resPayload.username);
                navigate("/");
            }
        } catch (err) {
            console.log(err);
        }
    }

    return (
        <>
            <Header />
            <main>
                <ul className={styles.errorList}>
                    {errorMessages.map((error, index) => {
                        return (
                            <li className={styles.errorMessage} key={index}>
                                {error.msg}
                            </li>
                        );
                    })}
                </ul>
                <form className={styles.form} onSubmit={handleSignup}>
                    <legend>Sign Up</legend>
                    <label htmlFor="username">Username: </label>
                    <input type="text" name="username" id="username" required />
                    <label htmlFor="email">Email: </label>
                    <input type="email" name="email" id="email" required />
                    <label htmlFor="password">Password: </label>
                    <input type="password" name="password" id="password" required />
                    <label htmlFor="confPassword">Confirm Password: </label>
                    <input type="password" name="confPassword" id="confPassword" required />
                    <button type="submit">Sign Up</button>
                </form>

                <button
                    type="button"
                    className={styles.guestBtn}
                    onClick={handleGuestLogin}
                >
                    Continue As Guest
                </button>
            </main>
        </>
    );
}

export default Signup;