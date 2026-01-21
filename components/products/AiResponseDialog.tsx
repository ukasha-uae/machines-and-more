'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { CheckCircle2 } from 'lucide-react';

interface AiResponseDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  response: string;
}

export default function AiResponseDialog({
  open,
  onOpenChange,
  response,
}: AiResponseDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <div className="flex items-center gap-2 text-green-600 mb-2">
            <CheckCircle2 className="h-6 w-6" />
            <DialogTitle>Request Submitted Successfully!</DialogTitle>
          </div>
          <DialogDescription>
            Thank you for your interest. Here's what our sales team will say:
          </DialogDescription>
        </DialogHeader>

        <div className="bg-gray-50 p-4 rounded-lg border mt-4">
          <h4 className="font-semibold mb-2">AI-Generated Response Preview:</h4>
          <div className="whitespace-pre-wrap text-sm text-gray-700">
            {response}
          </div>
        </div>

        <div className="flex justify-end mt-4">
          <Button onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
