import { FaSpinner } from 'react-icons/fa';
import { cn } from './cn';

type LoadingStateProps = {
  label: string;
  className?: string;
};

export default function LoadingState({ label, className }: LoadingStateProps) {
  return (
    <div className={cn('text-center py-10', className)}>
      <FaSpinner className="animate-spin text-green-600 text-3xl mx-auto mb-2" />
      <p className="text-gray-500 text-sm">{label}</p>
    </div>
  );
}
