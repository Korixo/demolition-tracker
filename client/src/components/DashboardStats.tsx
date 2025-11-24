import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Building2, Clock, AlertCircle, CheckCircle } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  description?: string;
  testId: string;
}

function StatCard({ title, value, icon, description, testId }: StatCardProps) {
  return (
    <Card data-testid={testId}>
      <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <div className="text-muted-foreground">{icon}</div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold" data-testid={`${testId}-value`}>{value}</div>
        {description && (
          <p className="text-xs text-muted-foreground mt-1">{description}</p>
        )}
      </CardContent>
    </Card>
  );
}

interface DashboardStatsProps {
  totalProperties: number;
  upcomingDemolitions: number;
  alerts: number;
  completed: number;
}

export default function DashboardStats({
  totalProperties,
  upcomingDemolitions,
  alerts,
  completed,
}: DashboardStatsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <StatCard
        title="Total Properties"
        value={totalProperties}
        icon={<Building2 className="h-4 w-4" />}
        description="Properties tracked"
        testId="card-total-properties"
      />
      <StatCard
        title="Upcoming"
        value={upcomingDemolitions}
        icon={<Clock className="h-4 w-4" />}
        description="Next 30 days"
        testId="card-upcoming"
      />
      <StatCard
        title="Alerts"
        value={alerts}
        icon={<AlertCircle className="h-4 w-4" />}
        description="Require attention"
        testId="card-alerts"
      />
      <StatCard
        title="Completed"
        value={completed}
        icon={<CheckCircle className="h-4 w-4" />}
        description="This month"
        testId="card-completed"
      />
    </div>
  );
}
