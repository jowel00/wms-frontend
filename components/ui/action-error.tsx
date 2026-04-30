import { AlertCircle } from 'lucide-react';

interface ActionErrorProps {
  message: string | null;
}

export function ActionError({ message }: ActionErrorProps) {
  if (!message) return null;
  return (
    <div className="flex items-center gap-3 mb-4 px-4 py-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm font-medium">
      <AlertCircle className="h-4 w-4 shrink-0" />
      {message}
    </div>
  );
}
