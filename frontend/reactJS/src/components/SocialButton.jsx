import PropTypes from 'prop-types';

function SocialButton({ network, logo, handleClick,connected }) {
    return (
        connected ? (
            <button
                disabled={true}
                className="w-full bg-green-500 text-white py-3 rounded flex items-center justify-center space-x-2"

            >Connecté sur {network}</button>
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

// Définition des PropTypes
SocialButton.propTypes = {
    network: PropTypes.string.isRequired,
    logo: PropTypes.node.isRequired,
    handleClick: PropTypes.func.isRequired,
    connected: PropTypes.bool.isRequired,
};

export default SocialButton;
