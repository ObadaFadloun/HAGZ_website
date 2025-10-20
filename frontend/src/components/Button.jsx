function Button({ children, className = "", ...props }) {
  return (
    <button
      type="submit"
      className={`font-bold p-3 rounded cursor-pointer transform transition duration-500 ease-in-out hover:scale-105 ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

export default Button;
