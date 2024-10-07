interface CustomButtonProps {
    children: React.ReactNode;
    onClick: () => void;
}
  
export function CustomButton({ children, onClick }: CustomButtonProps) {
    return (
        <div>
        <button
            className="px-4 py-2 bg-blue-600 text-white rounded-lg"
            onClick={onClick}
        >
            <div className="flex justify-center">
            <span>{children}</span>
            </div>
        </button>
        </div>
    );
}
  
