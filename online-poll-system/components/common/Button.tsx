import { ButtonProps } from "@/Interfaces/interface";

const Button:  React.FC<ButtonProps> = ({className, onClick, children, type = "button", disabled = false}) => {
  return (
    <div>
      <button className={`lg:px-4 md:px-2 px-4 rounded transition duration-500 ease-in-out text-sm ${className}`} onClick={onClick} type={type} disabled={disabled}>
        {children}
      </button>
    </div>
  )
}

export default Button