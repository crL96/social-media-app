import { useEffect } from "react";
const API_URL = import.meta.env.VITE_API_URL;
import { useNavigate } from "react-router-dom";
import "../App.css";
import styles from "./serverStarting.module.css";


// Due to the backend server shuting down with inactivity,
// this page waits for server to boot and then redirects user
function ServerStarting() {
    const navigate = useNavigate();

    useEffect(() => {
        function awaitStart() {
            fetch(`${API_URL}/`)
                .then((res) => {
                    if (res.status === 200) {
                        clearInterval(interval);
                        navigate("/home");
                    }
                })
        }
        awaitStart();
        const interval = setInterval(awaitStart, 5000);
    }, [navigate]);

    return (
        <div className="serverStarting">
            <header className={styles.header}>
                <h1>Place<span>Holder</span></h1>
            </header>
            <div className={styles.main}>
                <h2>Server is starting</h2>
                <p>
                    Due to this project being created for educational purposes it uses a free 
                    tier for publishing the backend that shuts down after inactivity, 
                    give it a little time to boot up. You will be redirected.
                </p>
                <span className="loader"></span>
            </div>
        </div>
    );
}

export default ServerStarting;