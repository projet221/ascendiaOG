import BarreHaut from "../components/BarreHaut.jsx";
import AccueilUtilisateur from "../components/AcceuilUtilisateur.jsx";
import AccueilInvite from "../components/AcceuilInvite.jsx";

const Index = () => {

    const token = localStorage.getItem("token");

    return (
        token ?
            <div className="flex items-center justify-center min-h-screen bg-gray-100">
                <div className="grid item-center bg-white p-8 rounded-lg shadow-md w-96">
                    < BarreHaut />
                    <AccueilUtilisateur />
                </div>
            </div>
            :
            <div>
                <AccueilInvite />
            </div>
    )
};

export default Index;
