import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Building2, Clock, MapPin, Calendar, AlertCircle } from "lucide-react";
import { formatDistanceToNow, format, differenceInHours } from "date-fns";

interface PropertyDetailDialogProps {
  open: boolean;
  onClose: () => void;
  property: {
    id: string;
    ownerName?: string;
    buildingName: string;
    demolitionDate: Date;
    location?: string;
    imageUrl?: string;
  };
}

export default function PropertyDetailDialog({
  open,
  onClose,
  property,
}: PropertyDetailDialogProps) {
  const isPast = property.demolitionDate < new Date();
  const hoursUntil = differenceInHours(property.demolitionDate, new Date());
  const isUrgent = hoursUntil <= 24 && hoursUntil > 0;
  const timeUntil = isPast ? "OVERDUE" : formatDistanceToNow(property.demolitionDate, { addSuffix: true });

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto" data-testid={`dialog-detail-${property.id}`}>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl">
            <Building2 className="h-6 w-6 text-primary" />
            {property.buildingName}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {isUrgent && (
            <div className="flex items-center gap-2 px-4 py-3 rounded-lg bg-destructive/20 border border-destructive/50 text-destructive">
              <AlertCircle className="h-5 w-5" />
              <span className="font-medium">DEMOLITION IMMINENT - {timeUntil.toUpperCase()}</span>
            </div>
          )}

          {property.imageUrl && (
            <div className="rounded-lg border overflow-hidden bg-muted">
              <img
                src={property.imageUrl}
                alt={`Demolition notice for ${property.buildingName}`}
                className="w-full h-auto"
                data-testid={`img-property-${property.id}`}
              />
            </div>
          )}

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground uppercase tracking-wide">
                <Building2 className="h-4 w-4" />
                <span>Owner</span>
              </div>
              <p className="text-lg font-semibold" data-testid={`text-owner-${property.id}`}>
                {property.ownerName || "Unknown"}
              </p>
            </div>

            {property.location && (
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground uppercase tracking-wide">
                  <MapPin className="h-4 w-4" />
                  <span>Location</span>
                </div>
                <p className="text-lg font-semibold" data-testid={`text-location-${property.id}`}>
                  {property.location}
                </p>
              </div>
            )}

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground uppercase tracking-wide">
                <Calendar className="h-4 w-4" />
                <span>Demolition Date</span>
              </div>
              <p className="text-lg font-semibold font-mono" data-testid={`text-demo-date-${property.id}`}>
                {format(property.demolitionDate, "PPP 'at' HH:mm")}
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground uppercase tracking-wide">
                <Clock className="h-4 w-4" />
                <span>Time Remaining</span>
              </div>
              <p className={`text-lg font-semibold ${
                isPast ? 'text-destructive' : isUrgent ? 'text-amber-400' : ''
              }`} data-testid={`text-time-remaining-${property.id}`}>
                {timeUntil}
              </p>
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t">
            <Button onClick={onClose} data-testid={`button-close-detail-${property.id}`}>
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
