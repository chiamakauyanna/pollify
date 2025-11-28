import { ButtonProps } from "@/Interfaces/interface";

const Button:  React.FC<ButtonProps> = ({className, onClick, children, type = "button", disabled = false}) => {
  return (
    <div>
      <button className={`py-3 rounded transition duration-500 ease-in-out ${className}`} onClick={onClick} type={type} disabled={disabled}>
        {children}
      </button>
    </div>
  )
}

export default Button