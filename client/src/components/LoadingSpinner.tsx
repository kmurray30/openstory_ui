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
      {/* Animated spinning circle with blue glow */}
      <div
        className={`${sizeClasses[size]} animate-spin rounded-full border-4 border-slate-700 border-t-primary-500 shadow-lg shadow-primary-900/50`}
        role="status"
        aria-label="Loading"
      />
      
      {/* Optional loading text */}
      {text && (
        <p className="text-slate-400 text-sm">{text}</p>
      )}
    </div>
  );
}

