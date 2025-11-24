import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Building2, Calendar, Edit, Trash2, Clock } from "lucide-react";
import { formatDistanceToNow, format } from "date-fns";

interface DemolitionCardProps {
  id: string;
  propertyAddress: string;
  demolitionDate: Date;
  status: "pending" | "confirmed" | "reminded" | "completed";
  imageUrl?: string;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
}

const statusColors = {
  pending: "bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 border-yellow-500/20",
  confirmed: "bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20",
  reminded: "bg-purple-500/10 text-purple-700 dark:text-purple-400 border-purple-500/20",
  completed: "bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20",
};

export default function DemolitionCard({
  id,
  propertyAddress,
  demolitionDate,
  status,
  imageUrl,
  onEdit,
  onDelete,
}: DemolitionCardProps) {
  const isPast = demolitionDate < new Date();
  const timeUntil = isPast ? "Past due" : formatDistanceToNow(demolitionDate, { addSuffix: true });

  return (
    <Card className="overflow-hidden hover-elevate" data-testid={`card-demolition-${id}`}>
      {imageUrl && (
        <div className="aspect-video w-full bg-muted relative overflow-hidden">
          <img
            src={imageUrl}
            alt={propertyAddress}
            className="object-cover w-full h-full"
            data-testid={`img-property-${id}`}
          />
        </div>
      )}
      {!imageUrl && (
        <div className="aspect-video w-full bg-muted flex items-center justify-center">
          <Building2 className="h-12 w-12 text-muted-foreground" />
        </div>
      )}
      
      <CardHeader className="space-y-2">
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-lg line-clamp-2" data-testid={`text-address-${id}`}>
            {propertyAddress}
          </CardTitle>
          <Badge className={statusColors[status]} data-testid={`badge-status-${id}`}>
            {status}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        <div className="flex items-center gap-2 text-sm">
          <Calendar className="h-4 w-4 text-muted-foreground" />
          <span className="font-medium" data-testid={`text-date-${id}`}>
            {format(demolitionDate, "PPP")}
          </span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <Clock className="h-4 w-4 text-muted-foreground" />
          <span className={isPast ? "text-destructive" : "text-muted-foreground"} data-testid={`text-countdown-${id}`}>
            {timeUntil}
          </span>
        </div>
      </CardContent>

      <CardFooter className="flex justify-between gap-2 flex-wrap">
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            onEdit?.(id);
            console.log('Edit clicked for:', id);
          }}
          data-testid={`button-edit-${id}`}
        >
          <Edit className="h-4 w-4 mr-2" />
          Edit
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            onDelete?.(id);
            console.log('Delete clicked for:', id);
          }}
          data-testid={`button-delete-${id}`}
        >
          <Trash2 className="h-4 w-4 mr-2" />
          Delete
        </Button>
      </CardFooter>
    </Card>
  );
}
