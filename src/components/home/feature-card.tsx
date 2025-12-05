import Link from "next/link";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface FeatureCardProps {
  href: string;
  icon: string;
  title: string;
  description: string;
  className?: string;
}

export function FeatureCard({ href, icon, title, description, className = "" }: FeatureCardProps) {
  return (
    <Link href={href}>
      <Card className={`hover:shadow-lg transition-shadow cursor-pointer w-64 ${className}`}>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">{icon} {title}</CardTitle>
          <CardDescription className="text-sm">
            {description}
          </CardDescription>
        </CardHeader>
      </Card>
    </Link>
  );
}
