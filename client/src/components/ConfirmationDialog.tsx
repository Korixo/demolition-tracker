import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Sparkles, RefreshCw } from "lucide-react";
import { format } from "date-fns";

interface ExtractedData {
  propertyAddress: string;
  demolitionDate: Date;
  extractedText: string;
  imageUrl?: string;
}

interface ConfirmationDialogProps {
  open: boolean;
  onClose: () => void;
  extractedData: ExtractedData;
  onConfirm?: (data: ExtractedData) => void;
  onReject?: () => void;
  mode?: "new" | "update";
  propertyId?: string;
}

export default function ConfirmationDialog({
  open,
  onClose,
  extractedData,
  onConfirm,
  onReject,
  mode = "new",
  propertyId,
}: ConfirmationDialogProps) {
  const [address, setAddress] = useState(extractedData.propertyAddress);
  const [date, setDate] = useState<Date>(extractedData.demolitionDate);
  const [notes, setNotes] = useState("");

  const handleConfirm = () => {
    onConfirm?.({
      ...extractedData,
      propertyAddress: address,
      demolitionDate: date,
    });
    console.log(mode === "update" ? 'Updated demolition:' : 'Confirmed demolition:', { address, date, notes, propertyId });
    onClose();
  };

  const handleReject = () => {
    onReject?.();
    console.log('Rejected extraction');
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto" data-testid="dialog-confirmation">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {mode === "update" ? (
              <>
                <RefreshCw className="h-5 w-5 text-primary" />
                Update Property Information
              </>
            ) : (
              <>
                <Sparkles className="h-5 w-5 text-primary" />
                Confirm Extracted Information
              </>
            )}
          </DialogTitle>
          <DialogDescription>
            {mode === "update" 
              ? "Review and update the demolition details for this property."
              : "Review and edit the AI-extracted demolition details before saving."
            }
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {extractedData.imageUrl && (
            <div className="rounded-md border overflow-hidden">
              <img
                src={extractedData.imageUrl}
                alt="Uploaded notice"
                className="w-full h-auto max-h-64 object-contain bg-muted"
                data-testid="img-uploaded-notice"
              />
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="address">Property Details (Owner & Building)</Label>
            <Input
              id="address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="e.g., Storage Silo - Owner: John Smith"
              data-testid="input-address"
            />
          </div>

          <div className="space-y-2">
            <Label>Demolition Date & Time</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left font-normal"
                  data-testid="button-date-picker"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={(newDate) => newDate && setDate(newDate)}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-2">
            <Label htmlFor="extracted-text">Extracted Text</Label>
            <Textarea
              id="extracted-text"
              value={extractedData.extractedText}
              readOnly
              className="min-h-24 font-mono text-xs"
              data-testid="textarea-extracted-text"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Additional Notes (Optional)</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add any additional notes or comments..."
              data-testid="textarea-notes"
            />
          </div>
        </div>

        <DialogFooter className="flex gap-2 flex-wrap">
          <Button variant="outline" onClick={handleReject} data-testid="button-reject">
            Cancel
          </Button>
          <Button onClick={handleConfirm} data-testid="button-confirm">
            {mode === "update" ? "Update Property" : "Confirm & Save"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
