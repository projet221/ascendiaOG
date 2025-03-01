const InputField = ({type, placeholder, name, onChange}) => {
    return (
        <input
            type={type}
            name={name}
            onChange={onChange}
            className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder={placeholder}
        />
    );
};

export default InputField;
