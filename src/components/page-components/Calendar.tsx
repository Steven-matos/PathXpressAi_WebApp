"use client";

import { useState } from "react";
import {
  Calendar as BigCalendar,
  luxonLocalizer,
  Views,
} from "react-big-calendar";
import { DateTime } from "luxon";
import AddRouteModal from "../AddRouteModal";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import EventDetailsModal from "../EventDetailsModal";
import { useTranslation } from "../../context/TranslationContext";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";

// Set Luxon locale based on current language
const localizer = luxonLocalizer(DateTime);

interface CalendarEvent {
  title: string;
  start: Date;
  end: Date;
  street: string;
  city: string;
  state: string;
  zip: string;
  address: string;
}

export default function Calendar() {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(
    null
  );
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const { t, setLang } = useTranslation();
  const lang = useSelector((state: RootState) => state.language.lang);
  const username = useSelector((state: RootState) => state.user.name);
  const routes = useSelector((state: RootState) => state.routes.tomorrow);

  const handleSelectSlot = (slotInfo: any) => {
    setSelectedDate(slotInfo.start);
    setIsModalOpen(true);
  };

  const handleAddEvent = (event: {
    title: string;
    start: Date;
    end: Date;
    street: string;
    city: string;
    state: string;
    zip: string;
  }) => {
    const newEvent: CalendarEvent = {
      title: event.title,
      start: event.start,
      end: event.end,
      street: event.street,
      city: event.city,
      state: event.state,
      zip: event.zip,
      address: `${event.street}, ${event.city}, ${event.state}, ${event.zip}`,
    };

    setEvents((prevEvents) => [...prevEvents, newEvent]);
    setIsModalOpen(false);
  };

  const handleAddButtonClick = () => {
    setSelectedDate(new Date());
    setIsModalOpen(true);
  };

  const handleSelectEvent = (event: CalendarEvent) => {
    setSelectedEvent(event);
    setIsEventModalOpen(true);
  };

  const eventStyleGetter = (
    event: CalendarEvent,
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

  const title = t("title");
  const addRoute = t("addRoute");

  const messages = {
    allDay: t("allDay"),
    previous: t("previous"),
    next: t("next"),
    today: t("today"),
    month: t("month"),
    week: t("week"),
    day: t("day"),
    agenda: t("agenda"),
    date: t("date"),
    time: t("time"),
    event: t("event"),
    noEventsInRange: t("noEventsInRange"),
    showMore: (total: number) => `+ ${t("showMore")} (${total})`,
    dateFormat: "dd",
    dayFormat: "dddd",
    weekdayFormat: "dddd",
    timeFormat: "HH:mm",
  };

  return (
    <div className="flex flex-col max-w-4xl mx-auto mt-8 p-6 bg-white shadow-lg rounded-lg h-[80vh]">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">{title}</h2>
        <Button onClick={handleAddButtonClick}>
          <Plus className="mr-2 h-4 w-4" /> {addRoute}
        </Button>
      </div>
      <div className="flex-grow overflow-hidden">
        <BigCalendar
          className="h-full"
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          defaultView={Views.MONTH}
          views={[Views.MONTH, Views.WEEK, Views.DAY, Views.AGENDA]}
          onNavigate={(date) => setSelectedDate(date)}
          onSelectSlot={handleSelectSlot}
          selectable
          eventPropGetter={eventStyleGetter}
          onSelectEvent={handleSelectEvent}
          tooltipAccessor={(event) => `${event.title}\n${event.address}`}
          messages={messages}
          style={{ height: 500 }}
        />
      </div>
      <AddRouteModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAddRoute={handleAddEvent}
        defaultDate={selectedDate}
      />
      <EventDetailsModal
        isOpen={isEventModalOpen}
        onClose={() => setIsEventModalOpen(false)}
        event={selectedEvent}
      />
    </div>
  );
}
