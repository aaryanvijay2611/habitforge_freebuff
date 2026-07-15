import { cn } from '@/utils/cn';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
}

export function Card({ children, className, hover = false }: CardProps) {
  return (
    <div
      className={cn(
        'rounded-xl border border-gray-800 bg-gray-900/60 backdrop-blur-sm p-5',
        hover && 'transition-all duration-200 hover:border-gray-700 hover:bg-gray-900/80',
        className
      )}
    >
      {children}
    </div>
  );
}
