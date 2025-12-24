import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import type { DetailAttributeConfig } from "@/lib/tableFormConfig";

interface ModelAttributePanelProps {
  title: string;
  attributes: DetailAttributeConfig[];
  data?: Record<string, any> | null;
}

const formatValue = (value: any, format?: DetailAttributeConfig["format"]) => {
  if (value === undefined || value === null || value === "") return "Not provided";
  if (Array.isArray(value)) return value.join(", ");
  if (typeof value === "number" && format === "currency") return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(value as number);
  if (typeof value === "number" && format === "number") return new Intl.NumberFormat().format(value as number);
  return String(value);
};

export function ModelAttributePanel({ title, attributes, data }: ModelAttributePanelProps) {
  if (!attributes || attributes.length === 0) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold">{title}</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-3">
        {attributes.map((attr, index) => {
          const rawValue = attr.source === "custom"
            ? data?.customAttributes?.[attr.key] ?? data?.[attr.key]
            : data?.[attr.key] ?? data?.customAttributes?.[attr.key];
          const value = formatValue(rawValue, attr.format);

          return (
            <div key={attr.key} className="space-y-1">
              <div className="flex items-center justify-between gap-2">
                <div className="text-sm font-medium text-muted-foreground">{attr.label}</div>
                {attr.badge && <Badge variant="outline">Schema</Badge>}
              </div>
              <div className="text-base font-semibold">{value}</div>
              {attr.description && (
                <div className="text-xs text-muted-foreground">{attr.description}</div>
              )}
              {index < attributes.length - 1 && <Separator className="mt-2" />}
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
