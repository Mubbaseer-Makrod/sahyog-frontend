import { cn } from './cn';

type StatusBadgeProps = {
  status: 'available' | 'sold';
  label: string;
  className?: string;
};

export default function StatusBadge({ status, label, className }: StatusBadgeProps) {
  const classes = status === 'available'
    ? 'bg-green-100 text-green-700'
    : 'bg-orange-100 text-orange-700';

  return (
    <span
      className={cn('inline-flex px-3 py-1 text-[11px] font-semibold rounded-full', classes, className)}
    >
      {label}
    </span>
  );
}
