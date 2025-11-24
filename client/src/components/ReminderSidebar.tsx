import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Bell, MapPin, Clock, X } from "lucide-react";
import { formatDistanceToNow, format, isToday, isTomorrow, isThisWeek } from "date-fns";

interface Reminder {
  id: string;
  propertyAddress: string;
  demolitionDate: Date;
  reminderType: "3h" | "1h";
}

interface ReminderSidebarProps {
  reminders: Reminder[];
  onDismiss?: (id: string) => void;
}

function groupReminders(reminders: Reminder[]) {
  const groups = {
    today: [] as Reminder[],
    tomorrow: [] as Reminder[],
    thisWeek: [] as Reminder[],
    later: [] as Reminder[],
  };

  reminders.forEach((reminder) => {
    if (isToday(reminder.demolitionDate)) {
      groups.today.push(reminder);
    } else if (isTomorrow(reminder.demolitionDate)) {
      groups.tomorrow.push(reminder);
    } else if (isThisWeek(reminder.demolitionDate)) {
      groups.thisWeek.push(reminder);
    } else {
      groups.later.push(reminder);
    }
  });

  return groups;
}

function ReminderItem({ reminder, onDismiss }: { reminder: Reminder; onDismiss?: (id: string) => void }) {
  return (
    <Card className="hover-elevate" data-testid={`reminder-${reminder.id}`}>
      <CardContent className="p-4">
        <div className="flex gap-3">
          <div className="flex-shrink-0 pt-1">
            <Bell className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="flex-1 min-w-0 space-y-2">
            <div className="flex items-start justify-between gap-2">
              <p className="text-sm font-medium line-clamp-2" data-testid={`text-reminder-address-${reminder.id}`}>
                {reminder.propertyAddress}
              </p>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 flex-shrink-0"
                onClick={() => {
                  onDismiss?.(reminder.id);
                  console.log('Dismissed reminder:', reminder.id);
                }}
                data-testid={`button-dismiss-${reminder.id}`}
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
            <div className="flex flex-col gap-1 text-xs text-muted-foreground">
              <div className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                <span>{format(reminder.demolitionDate, "PPp")}</span>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-xs">
                  {reminder.reminderType} before
                </Badge>
                <span className="text-muted-foreground">
                  {formatDistanceToNow(reminder.demolitionDate, { addSuffix: true })}
                </span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function ReminderSidebar({ reminders, onDismiss }: ReminderSidebarProps) {
  const grouped = groupReminders(reminders);

  return (
    <div className="space-y-6" data-testid="sidebar-reminders">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Upcoming Reminders</h2>
        <Badge variant="secondary" data-testid="badge-reminder-count">
          {reminders.length}
        </Badge>
      </div>

      {reminders.length === 0 && (
        <Card>
          <CardContent className="p-6 text-center">
            <Bell className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
            <p className="text-sm text-muted-foreground">No upcoming reminders</p>
          </CardContent>
        </Card>
      )}

      {grouped.today.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-sm font-medium text-muted-foreground">Today</h3>
          <div className="space-y-2">
            {grouped.today.map((reminder) => (
              <ReminderItem key={reminder.id} reminder={reminder} onDismiss={onDismiss} />
            ))}
          </div>
        </div>
      )}

      {grouped.tomorrow.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-sm font-medium text-muted-foreground">Tomorrow</h3>
          <div className="space-y-2">
            {grouped.tomorrow.map((reminder) => (
              <ReminderItem key={reminder.id} reminder={reminder} onDismiss={onDismiss} />
            ))}
          </div>
        </div>
      )}

      {grouped.thisWeek.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-sm font-medium text-muted-foreground">This Week</h3>
          <div className="space-y-2">
            {grouped.thisWeek.map((reminder) => (
              <ReminderItem key={reminder.id} reminder={reminder} onDismiss={onDismiss} />
            ))}
          </div>
        </div>
      )}

      {grouped.later.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-sm font-medium text-muted-foreground">Later</h3>
          <div className="space-y-2">
            {grouped.later.map((reminder) => (
              <ReminderItem key={reminder.id} reminder={reminder} onDismiss={onDismiss} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
