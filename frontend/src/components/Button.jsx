function Button({ children, className = "text-white bg-gradient-to-r from-green-600 to-green-800 font-bold py-3 px-4 rounded w-full hover:bg-green-700 cursor-pointer transform transition duration-500 ease-in-out hover:scale-105 hover:shadow-xl", ...props }) {
  return (
    <button
      type="submit"
      className={`${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

export default Button;
