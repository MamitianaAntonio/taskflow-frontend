import "./Input.css";

const Input = ({ placeholder, type, value, onChange, className }) => {
  return (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className={`input 
        w-full px-4 py-3 rounded-md text-[1.7vh] outline-none
        bg-(--bg-primary) text-(--text-primary) 
        border border-(--border-color)
        disabled:opacity-50 disabled:cursor-not-allowed
        transition-all duration-200 
        ${className}`}
    />
  );
};

export default Input;
