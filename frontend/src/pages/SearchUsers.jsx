import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/header/Header";
import ProfileCard from "../components/profileCard/ProfileCard";
import ProfileSuggestions from "../components/profileSuggestions/ProfileSuggestions";
import "../App.css";
import styles from "./searchUsers.module.css";
const API_URL = import.meta.env.VITE_API_URL;

function SearchUsers() {
    const [searchResults, setSearchResults] = useState([]);
    const navigate = useNavigate();

    async function handleSearch(e) {
        e.preventDefault();

        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData);

        try {
            const res = await fetch(`${API_URL}/user/search/${data.searchterm}`, {
                headers: {
                    authorization: localStorage.getItem("jwt-token"),
                },
            });
            if (res.status === 200) {
                const data = await res.json();
                setSearchResults(data.users);
            } else if (res.status === 401) {
                localStorage.removeItem("jwt-token");
                localStorage.removeItem("currentUser");
                navigate("/login");
            }
        } catch (err) {
            console.log(err);
        }

    }

    return (
        <>
            <Header />
            <div className="mainContainer">
                <main>
                    <form className={styles.form} onSubmit={handleSearch}>
                        {/* <label htmlFor="search">Search: </label> */}
                        <input type="text" name="searchterm" id="searchterm" />
                        <button>Search</button>
                    </form>
                    <div className={styles.searchResults}>
                        {searchResults.map((user) => {
                            return (
                                <ProfileCard key={user.username} user={user} />
                            );
                        })}
                    </div>
                </main>
                <ProfileSuggestions nProfiles={5}/>
            </div>
        </>
    );
}

export default SearchUsers;