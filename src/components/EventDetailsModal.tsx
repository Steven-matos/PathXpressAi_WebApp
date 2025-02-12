import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

interface Event {
  id: string;
  title: string;
  start: Date;
  end: Date;
  address: string;
  date: Date;
}

interface EventDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  event: Event | null;
}

export default function EventDetailsModal({ isOpen, onClose, event }: EventDetailsModalProps) {
  if (!event) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{event.title}</DialogTitle>
        </DialogHeader>
        <div className="mt-4">
          <p>
            <strong>Date:</strong> {event.date.toLocaleDateString()}
          </p>
          <p>
            <strong>Start:</strong> {event.start.toLocaleTimeString()}
          </p>
          <p>
            <strong>End:</strong> {event.end.toLocaleTimeString()}
          </p>
          <p>
            <strong>Address:</strong> {event.address}
          </p>
        </div>
        <div className="mt-4 flex justify-end">
          <Button onClick={onClose}>Close</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

