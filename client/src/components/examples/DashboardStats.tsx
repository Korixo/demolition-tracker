import DashboardStats from '../DashboardStats';

export default function DashboardStatsExample() {
  return (
    <DashboardStats
      totalProperties={24}
      upcomingDemolitions={8}
      alerts={3}
      completed={12}
    />
  );
}
