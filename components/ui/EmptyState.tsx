import type { ReactNode } from 'react';
import { cn } from './cn';

type EmptyStateProps = {
  title: string;
  description?: string;
  icon?: ReactNode;
  className?: string;
};

export default function EmptyState({ title, description, icon, className }: EmptyStateProps) {
  return (
    <div className={cn('text-center text-gray-500 py-8', className)}>
      {icon && (
        <div className="bg-gray-100 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
          {icon}
        </div>
      )}
      <p className="text-base font-semibold text-gray-600">{title}</p>
      {description && <p className="text-sm text-gray-500 mt-1">{description}</p>}
    </div>
  );
}
