function Button({ children, className = "text-white bg-green-600 font-bold py-3 px-4 rounded w-full hover:bg-green-700 transition-all cursor-pointer", ...props }) {
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
