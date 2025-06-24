import App from "./App";
import Signup from "./pages/Signup";
import Login from "./pages/Login";

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
];

export default routes;
