import { useState } from 'react';
import { Icon } from '@iconify/react';

interface CopyButtonProps {
    value: string;
    className?: string;
}

export const CopyButton = ({ value, className = "" }: CopyButtonProps) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(value);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy text: ', err);
        }
    };

    return (
        <button
            onClick={handleCopy}
            className={`p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-white/10 transition-colors ${className}`}
            title="Copy to clipboard"
        >
            <Icon 
                icon={copied ? "solar:check-read-bold" : "solar:copy-linear"} 
                className={copied ? "text-emerald-500" : "text-gray-400"}
                width={16}
            />
        </button>
    );
};
