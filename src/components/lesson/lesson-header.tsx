import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

interface LessonHeaderProps {
  title: string;
  description: string;
}

export function LessonHeader({ title, description }: LessonHeaderProps) {
  return (
    <>
      <Link href="/">
        <Button variant="ghost" className="mb-6 pl-0 hover:bg-transparent hover:text-slate-900">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Lessons
        </Button>
      </Link>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-2xl">{title}</CardTitle>
          <CardDescription className="text-lg">{description}</CardDescription>
        </CardHeader>
      </Card>
    </>
  );
}
