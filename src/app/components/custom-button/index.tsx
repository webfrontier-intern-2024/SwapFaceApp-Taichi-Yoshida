interface CustomButtonProps {
    children: React.ReactNode;
    onClick: () => void;
    disabled: boolean;
    lightColor : string;
    darkColor:string;
}

export function CustomButton({ children, onClick, disabled = false, lightColor, darkColor }: CustomButtonProps) {
    const bgLightColor = disabled ? 'bg-gray-500' : lightColor;
    const bgdDarkColor = disabled ? 'bg-gray-600' : darkColor;
    return (
        <button className={`group relative h-12 overflow-hidden overflow-x-hidden rounded-md ${bgLightColor} px-4 py-2 text-neutral-50`} onClick={onClick} disabled={disabled}>
            <span className="relative z-10">{children}</span>
            <span className="absolute inset-0 overflow-hidden rounded-md">
                <span className={`absolute left-0 aspect-square w-full origin-center -translate-x-full rounded-full ${bgdDarkColor} transition-all duration-500 group-hover:-translate-x-0 group-hover:scale-150`}>
                </span>
            </span>
        </button>
    );
}