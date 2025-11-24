import ReminderSidebar from '../ReminderSidebar';

export default function ReminderSidebarExample() {
  const mockReminders = [
    {
      id: "1",
      propertyAddress: "123 Main Street, Downtown",
      demolitionDate: new Date(Date.now() + 2 * 60 * 60 * 1000),
      reminderType: "3h" as const,
    },
    {
      id: "2",
      propertyAddress: "456 Oak Avenue, Riverside",
      demolitionDate: new Date(Date.now() + 24 * 60 * 60 * 1000),
      reminderType: "1h" as const,
    },
    {
      id: "3",
      propertyAddress: "789 Pine Road, Westside",
      demolitionDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
      reminderType: "3h" as const,
    },
  ];

  return <ReminderSidebar reminders={mockReminders} />;
}
