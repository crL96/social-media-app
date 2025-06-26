import App from "./App";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import PostDetails from "./pages/PostDetails";
import NewPost from "./pages/NewPost";
import ProfileDetails from "./pages/ProfileDetails";
import SearchUsers from "./pages/SearchUsers";

const routes = [
    {
        path: "/",
        element: <App />,
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
        path: "post/:postId",
        element: <PostDetails />,
    },
    {
        path: "new-post",
        element: <NewPost />,
    },
    {
        path: "profile",
        element: <ProfileDetails />,
    },
    {
        path: "profile/:username",
        element: <ProfileDetails />,
    },
    {
        path: "search/users",
        element: <SearchUsers />,
    },
];

export default routes;
