import type { ReactNode } from 'react';
import { cn } from './cn';

type PageHeaderProps = {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
  className?: string;
};

export default function PageHeader({ title, subtitle, actions, className }: PageHeaderProps) {
  return (
    <div className={cn('flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3', className)}>
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold">
          <span className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent">
            {title}
          </span>
        </h1>
        {subtitle && <p className="text-sm sm:text-base text-gray-600 mt-1">{subtitle}</p>}
        <div className="mt-2 h-1 w-12 bg-gradient-to-r from-emerald-500 to-green-500 rounded-full" />
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
  );
}
