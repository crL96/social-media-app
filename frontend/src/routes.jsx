import App from "./App";
import Signup from "./pages/Signup";

const routes = [
    {
        path: "/",
        element: <App />,
    },
    {
        path: "signup",
        element: <Signup />,
    },
];

export default routes;
