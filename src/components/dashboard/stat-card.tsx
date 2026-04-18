import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

interface StatCardProps {
  title: string;
  value: string | number;
  description?: string;
  className?: string;
}

export function StatCard({ title, value, description, className }: StatCardProps) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardDescription>{title}</CardDescription>
        <CardTitle className={`text-3xl ${className || ""}`}>
          {value}
        </CardTitle>
        {description && (
          <p className="text-sm text-slate-500">{description}</p>
        )}
      </CardHeader>
    </Card>
  );
}
