import { Card, CardContent } from "@/components/ui/card";
import { Building2, Clock, AlertCircle } from "lucide-react";

interface QuickStatsProps {
  totalProperties: number;
  urgent: number;
  upcoming: number;
}

export default function QuickStats({ totalProperties, urgent, upcoming }: QuickStatsProps) {
  return (
    <div className="grid gap-3 md:grid-cols-3">
      <Card className="hover-elevate">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/20">
              <Building2 className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wide">Total</p>
              <p className="text-2xl font-bold" data-testid="stat-total">{totalProperties}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="hover-elevate border-destructive/50">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-destructive/20">
              <AlertCircle className="h-5 w-5 text-destructive" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wide">Urgent</p>
              <p className="text-2xl font-bold text-destructive" data-testid="stat-urgent">{urgent}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="hover-elevate">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-amber-500/20">
              <Clock className="h-5 w-5 text-amber-400" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wide">Upcoming</p>
              <p className="text-2xl font-bold" data-testid="stat-upcoming">{upcoming}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
