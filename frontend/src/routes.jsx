import App from "./App";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import PostDetails from "./pages/PostDetails";
import NewPost from "./pages/NewPost";

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
        element: <NewPost />
    },
];

export default routes;
