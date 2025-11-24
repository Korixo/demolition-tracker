import DemolitionTable from '../DemolitionTable';

export default function DemolitionTableExample() {
  const mockDemolitions = [
    {
      id: "1",
      propertyAddress: "123 Main Street, Downtown",
      demolitionDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
      status: "confirmed" as const,
    },
    {
      id: "2",
      propertyAddress: "456 Oak Avenue, Riverside District",
      demolitionDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
      status: "reminded" as const,
    },
    {
      id: "3",
      propertyAddress: "789 Pine Road, Westside",
      demolitionDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
      status: "pending" as const,
    },
  ];

  return <DemolitionTable demolitions={mockDemolitions} />;
}
