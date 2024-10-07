interface CustomButtonProps {
    children: React.ReactNode;
    onClick: () => void;
    disabled: boolean;
}

export function CustomButton({ children, onClick, disabled = false }: CustomButtonProps) {
    const bgColor = disabled ? 'bg-gray-400' : 'bg-blue-600';
    return (
        <div>
        <button
            className={`px-4 py-2 text-white rounded-lg ${bgColor} outline outline-gray-500`}
            onClick={onClick}
            disabled={disabled}
        >
            <div className="flex justify-center">
            <span>{children}</span>
            </div>
        </button>
        </div>
    );
}
  
