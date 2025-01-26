"use client";

import { useState } from "react";
import { Calendar as BigCalendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import AddEventModal from "./AddEventModal";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { Button } from "./ui/button";
import { Plus } from "lucide-react";
import EventDetailsModal from "./EventDetailsModal";

moment.locale("en-GB");
const localizer = momentLocalizer(moment);

// Define types for events
interface Event {
  title: string;
  start: Date;
  end: Date;
  address: string;
}

interface AddEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddEvent: (event: {
    title: string;
    start: Date;
    end: Date;
    address: string;
  }) => void;
}

export default function Calendar() {
  const [events, setEvents] = useState<Event[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [address, setAddress] = useState("");

  const handleSelectSlot = (slotInfo: any) => {
    setDate(slotInfo.start.toISOString().split("T")[0]);
    console.log(date);
    setIsModalOpen(true);
  };

  const handleAddEvent = (newEvent: {
    title: string;
    start: Date;
    end: Date;
    address: string;
  }) => {
    setEvents([...events, newEvent]);
    setIsModalOpen(false);
  };

  const handleAddButtonClick = () => {
    setIsModalOpen(true);
  };

  const handleSelectEvent = (event: Event) => {
    setSelectedEvent(event);
    setIsEventModalOpen(true);
  };

  const eventStyleGetter = (
    event: Event,
    start: Date,
    end: Date,
    isSelected: boolean
  ) => {
    return {
      style: {
        backgroundColor: "#3174ad",
        borderRadius: "0px",
        opacity: 0.8,
        color: "white",
        border: "0px",
        display: "block",
      },
    };
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleAddEvent({
      title,
      start: new Date(`${date}T${start}`),
      end: new Date(`${date}T${end}`),
      address,
    });
    setTitle("");
    setDate("");
    setStart("");
    setEnd("");
    setAddress("");
  };

  return (
    <div className="h-[600px] relative">
      <Button onClick={handleAddButtonClick} className="absolute right-0">
        <Plus className="mr-2 h-4 w-4" /> Add Route
      </Button>
      <BigCalendar
        className="pt-12"
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        onSelectSlot={handleSelectSlot}
        selectable
        eventPropGetter={eventStyleGetter}
        onSelectEvent={handleSelectEvent}
        tooltipAccessor={(event) => `${event.title}\n${event.address}`}
      />
      <AddEventModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAddEvent={handleAddEvent}
      />
      <EventDetailsModal
        isOpen={isEventModalOpen}
        onClose={() => setIsEventModalOpen(false)}
        event={selectedEvent}
      />
    </div>
  );
}
