import { useState } from 'react';
import ConfirmationDialog from '../ConfirmationDialog';
import { Button } from '@/components/ui/button';

export default function ConfirmationDialogExample() {
  const [open, setOpen] = useState(false);

  const mockData = {
    propertyAddress: "123 Main Street, Downtown",
    demolitionDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    extractedText: "MISSED PAYMENT NOTICE\n\nProperty: 123 Main Street\nDemolition Date: March 15, 2024\nTime: 10:00 AM\n\nPlease contact us immediately if you have questions.",
  };

  return (
    <>
      <Button onClick={() => setOpen(true)}>Open Confirmation Dialog</Button>
      <ConfirmationDialog
        open={open}
        onClose={() => setOpen(false)}
        extractedData={mockData}
      />
    </>
  );
}
