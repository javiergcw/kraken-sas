import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

interface IconBackProps {
    onClick?: () => void;
    size?: number;
    className?: string;
}

export const IconBack: React.FC<IconBackProps> = ({ onClick, size = 24, className = "" }) => {
    const router = useRouter();

    const handleBack = () => {
        if (onClick) {
            onClick();
        } else {
            router.back();
        }
    };

    return (
        <ArrowLeft
            size={size}
            className={`cursor-pointer ${className}`}
            onClick={handleBack}
        />
    );
};
