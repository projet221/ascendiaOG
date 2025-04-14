import PropTypes from 'prop-types';

function SocialButton({ network, logo, handleClick, connected, handleDisconnect }) {
    return (
        connected ? (
            <div className="w-full flex flex-row gap-2">
                <button
                    disabled
                    className="w-5/6 bg-green-500 text-white py-3 rounded flex items-center justify-center space-x-2"
                >
                    Connecté sur {network}
                </button>
                <button
                    onClick={() => handleDisconnect(network)}
                    className="group w-1/6 bg-red-500 text-white py-2 rounded hover:bg-red-600 transition"
                >
                    <span className="group-hover:hidden">X</span> {/* Affiche "X" en état normal */}
                    <span className="group-hover:block hidden">Déconnecter</span> {/* Affiche "Déconnecter" au survol */}
                </button>
            </div>
        ) : (
            <button
                onClick={handleClick}
                className="w-full bg-gray-400 text-white py-3 rounded hover:bg-blue-600 transition flex items-center justify-center space-x-2"
            >
                <span>Se connecter avec {network} {logo}</span>
            </button>
        )
    );
}

SocialButton.propTypes = {
    network: PropTypes.string.isRequired,
    logo: PropTypes.node.isRequired,
    handleClick: PropTypes.func.isRequired,
    connected: PropTypes.bool.isRequired,
    handleDisconnect: PropTypes.func.isRequired,
};

export default SocialButton;
