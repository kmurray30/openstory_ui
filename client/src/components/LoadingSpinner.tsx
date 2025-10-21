/**
 * Loading Spinner Component
 * 
 * A reusable loading indicator displayed while waiting for data.
 */

interface LoadingSpinnerProps {
  size?: 'small' | 'medium' | 'large';
  text?: string;
}

export default function LoadingSpinner({ size = 'medium', text }: LoadingSpinnerProps) {
  // Size classes for the spinner
  const sizeClasses = {
    small: 'h-6 w-6',
    medium: 'h-12 w-12',
    large: 'h-16 w-16',
  };

  return (
    <div className="flex flex-col items-center justify-center gap-3">
      {/* Animated spinning circle */}
      <div
        className={`${sizeClasses[size]} animate-spin rounded-full border-4 border-gray-200 border-t-primary-600`}
        role="status"
        aria-label="Loading"
      />
      
      {/* Optional loading text */}
      {text && (
        <p className="text-gray-600 text-sm">{text}</p>
      )}
    </div>
  );
}

