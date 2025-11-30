import { Badge } from "@/components/ui/badge";

interface PageHeaderProps {
  title: string;
  description?: string;
  badge?: {
    text: string;
    variant: "js" | "arch" | "intro" | "default" | "secondary" | "outline";
  };
}

export function PageHeader({ title, description, badge }: PageHeaderProps) {
  return (
    <div className="space-y-2 pb-4 border-b mb-8">
      <div className="flex items-center gap-3">
        <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
        {badge && <Badge variant={badge.variant}>{badge.text}</Badge>}
      </div>
      {description && (
        <p className="text-lg text-muted-foreground max-w-3xl">{description}</p>
      )}
    </div>
  );
}
