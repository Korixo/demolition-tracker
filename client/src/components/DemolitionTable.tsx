import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Edit, Trash2 } from "lucide-react";
import { format } from "date-fns";

interface Demolition {
  id: string;
  propertyAddress: string;
  demolitionDate: Date;
  status: "pending" | "confirmed" | "reminded" | "completed";
}

interface DemolitionTableProps {
  demolitions: Demolition[];
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
}

const statusColors = {
  pending: "bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 border-yellow-500/20",
  confirmed: "bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20",
  reminded: "bg-purple-500/10 text-purple-700 dark:text-purple-400 border-purple-500/20",
  completed: "bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20",
};

export default function DemolitionTable({ demolitions, onEdit, onDelete }: DemolitionTableProps) {
  return (
    <div className="border rounded-md" data-testid="table-demolitions">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Property Address</TableHead>
            <TableHead>Demolition Date</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {demolitions.length === 0 && (
            <TableRow>
              <TableCell colSpan={4} className="text-center text-muted-foreground py-8">
                No demolitions found
              </TableCell>
            </TableRow>
          )}
          {demolitions.map((demolition) => (
            <TableRow key={demolition.id} className="hover-elevate" data-testid={`row-demolition-${demolition.id}`}>
              <TableCell className="font-medium" data-testid={`cell-address-${demolition.id}`}>
                {demolition.propertyAddress}
              </TableCell>
              <TableCell data-testid={`cell-date-${demolition.id}`}>
                {format(demolition.demolitionDate, "PPP")}
              </TableCell>
              <TableCell>
                <Badge className={statusColors[demolition.status]} data-testid={`badge-status-${demolition.id}`}>
                  {demolition.status}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      onEdit?.(demolition.id);
                      console.log('Edit clicked:', demolition.id);
                    }}
                    data-testid={`button-edit-${demolition.id}`}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      onDelete?.(demolition.id);
                      console.log('Delete clicked:', demolition.id);
                    }}
                    data-testid={`button-delete-${demolition.id}`}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
