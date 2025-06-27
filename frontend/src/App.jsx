import "./App.css";
import Header from "./components/header/Header";
import ProfileSuggestions from "./components/profileSuggestions/ProfileSuggestions";
import { useNavigate, Outlet } from "react-router-dom";

function App() {
    const navigate = useNavigate();

    if (!localStorage.getItem("jwt-token")) {
        navigate("/login");
    }

    return (
        <>
            <Header />
            <div className="mainContainer">
                <Outlet />
                <ProfileSuggestions nProfiles={5}/>
            </div>
        </>
    );
}

export default App;
