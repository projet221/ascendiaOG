import { RouterProvider, createBrowserRouter } from "react-router-dom";
import routes from "~react-pages"; // Routes générées automatiquement
import PrivateRoute from "./components/PrivateRoute";

// Liste des routes protégées
const protectedRoutes = ["inscription","connexion"]; // Ajoute tes pages ici

// Ajoute la protection aux routes concernées
const modifiedRoutes = routes.map(route => {
    if (!(protectedRoutes.includes(route.path))) {
        return {
            ...route,
            element: <PrivateRoute>{route.element}</PrivateRoute> // Passe le composant de la route dans PrivateRoute
        };
    }
    return route;
});


const router = createBrowserRouter(modifiedRoutes);
function App() {
    return <RouterProvider router={router} />;
}

export default App;
