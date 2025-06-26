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
        setSignedIn(false);
    }

    return (
        <header className={styles.header}>
            <h1>Place<span>Holder</span></h1>
            <nav>
                {signedIn ? (
                    <>
                        <Link to="/search/users">
                            <img src={searchIcon} alt="Search" className={styles.icon} />
                        </Link>
                        <Link to="/">Home</Link>
                        <Link to="/new-post">New Post</Link>
                        <Link to="/profile">Profile</Link>
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