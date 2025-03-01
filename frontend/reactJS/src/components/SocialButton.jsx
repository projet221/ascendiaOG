import React from 'react';
import {useNavigate} from 'react-router-dom';

function SocialButton({network, logo, handleClick}) {
    
    return (
        <button
            onClick={handleClick}
            className="w-full bg-gray-400 text-white py-3 rounded hover:bg-blue-600 transition flex items-center justify-center space-x-2"
        >
            <span>Se connecter avec {network} {logo}</span>
        </button>
    );
}

export default SocialButton;
