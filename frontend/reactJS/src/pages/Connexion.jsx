import Login from "../components/Login.jsx";

const Connexion = () => {

    return (
        <div>
            <div className="flex items-center justify-center min-h-screen bg-gray-100">
                <div className="grid item-center bg-white p-8 rounded-lg shadow-md ">
                    <Login />
                </div>
            </div>
        </div>
    );
};

export default Connexion;
