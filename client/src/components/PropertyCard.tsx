import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Building2, Clock, Navigation, AlertCircle, Trash2, Upload, MapPin } from "lucide-react";
import { formatDistanceToNow, format, differenceInHours } from "date-fns";

interface PropertyCardProps {
  id: string;
  ownerName?: string;
  buildingName: string;
  location?: string;
  demolitionDate: Date;
  imageUrl?: string;
  onNavigate?: (id: string) => void;
  onDelete?: (id: string) => void;
  onReupload?: (id: string) => void;
}

export default function PropertyCard({
  id,
  ownerName,
  buildingName,
  location,
  demolitionDate,
  imageUrl,
  onNavigate,
  onDelete,
  onReupload,
}: PropertyCardProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  
  const isPast = demolitionDate < new Date();
  const hoursUntil = differenceInHours(demolitionDate, new Date());
  const isUrgent = hoursUntil <= 24 && hoursUntil > 0;
  const timeUntil = isPast ? "OVERDUE" : formatDistanceToNow(demolitionDate, { addSuffix: true });

  const handleDelete = () => {
    onDelete?.(id);
    console.log('Deleted property:', id);
    setShowDeleteDialog(false);
  };

  const handleReupload = () => {
    onReupload?.(id);
    console.log('Re-upload image for property:', id);
  };

  const handleNavigate = () => {
    onNavigate?.(id);
    console.log('Navigate to property:', id);
  };

  return (
    <>
      <Card 
        className={`overflow-hidden hover-elevate transition-all ${
          isUrgent ? 'border-destructive/50 shadow-lg shadow-destructive/20 animate-pulse' : ''
        } ${isPast ? 'border-destructive' : ''}`}
        data-testid={`card-property-${id}`}
      >
        <CardContent className="p-4 space-y-3">
          {isUrgent && (
            <div className="flex items-center gap-2 text-destructive text-sm font-medium">
              <AlertCircle className="h-4 w-4" />
              <span>DEMOLITION IMMINENT</span>
            </div>
          )}

          <div className="flex items-start justify-between gap-3">
            <div className="space-y-1 flex-1 min-w-0">
              <div className="flex items-center gap-2 text-xs text-muted-foreground uppercase tracking-wider">
                <Building2 className="h-3 w-3" />
                <span>Building</span>
              </div>
              <h3 className="text-lg font-semibold truncate" data-testid={`text-building-${id}`}>
                {buildingName}
              </h3>
              {ownerName && (
                <div className="text-sm text-muted-foreground">
                  Owner: {ownerName}
                </div>
              )}
            </div>
            {location && (
              <Badge variant="outline" className="flex items-center gap-1" data-testid={`badge-location-${id}`}>
                <MapPin className="h-3 w-3" />
                {location}
              </Badge>
            )}
          </div>

          <div className="space-y-2 pt-2 border-t border-border/50">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Demolition Date:</span>
              <span className="font-medium font-mono" data-testid={`text-date-${id}`}>
                {format(demolitionDate, "MMM dd, HH:mm")}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span className={`text-sm font-medium ${
                isPast ? 'text-destructive' : isUrgent ? 'text-amber-400' : 'text-muted-foreground'
              }`} data-testid={`text-countdown-${id}`}>
                {timeUntil}
              </span>
            </div>
          </div>

          <div className="flex gap-2 pt-2">
            {(isUrgent || isPast) && (
              <Button
                className="flex-1"
                variant={isPast ? "destructive" : "default"}
                onClick={handleNavigate}
                data-testid={`button-navigate-${id}`}
              >
                <Navigation className="h-4 w-4 mr-2" />
                Go to Property
              </Button>
            )}
            {!(isUrgent || isPast) && (
              <>
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={handleReupload}
                  data-testid={`button-reupload-${id}`}
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Re-upload
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setShowDeleteDialog(true)}
                  data-testid={`button-delete-${id}`}
                >
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </>
            )}
            {(isUrgent || isPast) && (
              <Button
                variant="outline"
                size="icon"
                onClick={() => setShowDeleteDialog(true)}
                data-testid={`button-delete-urgent-${id}`}
              >
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent data-testid={`dialog-delete-${id}`}>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Property Notice?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete the demolition notice for <strong>{buildingName}</strong>
              {ownerName && <> owned by <strong>{ownerName}</strong></>}? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel data-testid={`button-cancel-delete-${id}`}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              data-testid={`button-confirm-delete-${id}`}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
