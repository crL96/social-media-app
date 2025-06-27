import App from "./App";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import PostDetails from "./pages/PostDetails";
import NewPost from "./pages/NewPost";
import ProfileDetails from "./pages/ProfileDetails";
import SearchUsers from "./pages/SearchUsers";
import ServerStarting from "./pages/ServerStarting";
import Home from "./pages/Home";

const routes = [
    {
        path: "/app",
        element: <App />,
        children: [
            { path: "home", element: <Home /> },
            { path: "new-post", element: <NewPost /> },
            { path: "profile", element: <ProfileDetails /> },
            { path: "profile/:username", element: <ProfileDetails /> },
            { path: "post/:postId", element: <PostDetails /> },
            { path: "search/users", element: <SearchUsers /> },
        ],
    },
    {
        path: "signup",
        element: <Signup />,
    },
    {
        path: "login",
        element: <Login />,
    },
    {
        path: "/",
        element: <ServerStarting />,
    },
];

export default routes;
