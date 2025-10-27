import { LucideIcon } from "lucide-react";
import { Button } from "@/components/reservation/button";

interface AppleEmptyStateProps {
    icon: LucideIcon;
    title: string;
    description: string;
    buttonText: string;
    onButtonClick: () => void;
    helpText?: string;
    onHelpClick?: () => void;
}

export function AppleEmptyState({
    icon: Icon,
    title,
    description,
    buttonText,
    onButtonClick,
    helpText = "¿Necesitas ayuda?",
    onHelpClick
}: AppleEmptyStateProps) {
    return (
        <div className="flex flex-col items-center justify-center h-[calc(100vh-200px)] space-y-6">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                <Icon className="w-8 h-8 text-gray-400" />
            </div>
            <div className="text-center space-y-2">
                <h2 className="text-2xl font-semibold text-gray-900">{title}</h2>
                <p className="text-gray-500 max-w-md">
                    {description}
                </p>
            </div>
            <Button 
                onClick={onButtonClick}
                className="bg-black hover:bg-gray-800 text-white px-8 py-2 rounded-full"
            >
                {buttonText}
            </Button>
            {onHelpClick && (
                <div className="pt-4">
                    <Button 
                        variant="ghost" 
                        onClick={onHelpClick}
                        className="text-gray-500 hover:text-gray-900"
                    >
                        {helpText}
                    </Button>
                </div>
            )}
        </div>
    );
} 