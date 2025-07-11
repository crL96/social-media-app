import { Link } from "react-router-dom";
import styles from "./header.module.css";
import { useEffect, useState } from "react";
import searchIcon from "../../assets/search-icon.svg";

function Header() {
    const [signedIn, setSignedIn] = useState(false);

    useEffect(() => {
        if (localStorage.getItem("jwt-token")) {
            setSignedIn(true);
        } else {
            setSignedIn(false);
        }
    }, []);

    function handleLogout() {
        localStorage.removeItem("jwt-token");
        localStorage.removeItem("currentUser");
        setSignedIn(false);
    }

    return (
        <header className={styles.header}>
            <h1>Post<span>IT</span></h1>
            <nav>
                {signedIn ? (
                    <>
                        <Link to="/app/search/users">
                            <img src={searchIcon} alt="Search" className={styles.icon} />
                        </Link>
                        <Link to="/app/home">Home</Link>
                        <Link to="/app/new-post">New Post</Link>
                        <Link to="/app/profile">Profile</Link>
                        <Link to="/login" onClick={handleLogout}>Log Out</Link>
                    </>
                ) : (
                    <>
                        <Link to="/login">Log In</Link>
                        <Link to="/signup">Sign Up</Link>
                    </>
                )}
            </nav>
        </header>
    );
}

export default Header;