import { RouterProvider, createBrowserRouter } from "react-router-dom";
import routes from "~react-pages"; 
import PrivateRoute from "./components/PrivateRoute";


const protectedRoutes = ["Dashboard"]; 

const modifiedRoutes = routes.map(route => {
    if (protectedRoutes.includes(route.path)) {
        return {
            ...route,
            element: <PrivateRoute>{route.element}</PrivateRoute> 
        };
    }
    return route;
});


const router = createBrowserRouter(modifiedRoutes);
function App() {
    return <RouterProvider router={router} />;
}

export default App;
