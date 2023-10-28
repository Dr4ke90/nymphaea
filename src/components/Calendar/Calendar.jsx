import React, { useRef, useState, useMemo } from "react";
import { Calendar, Views, dateFnsLocalizer } from "react-big-calendar";
import format from "date-fns/format";
import startOfWeek from "date-fns/startOfWeek";
import getDay from "date-fns/getDay";
import { ro } from "date-fns/locale";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "./calendar.css";
import EventComponent from "../EventComponent/EventComponent";
import { startOfDay, isSameDay } from "date-fns";

const locales = {
  "ro-RO": require("date-fns/locale/ro"),
};

const localizer = dateFnsLocalizer({
  format,
  startOfWeek,
  getDay,
  locales,
});

const workHours = {
  start: 8,
  end: 20,
};

export default function BigCalendar({
  appointments,
  edit,
  cancel,
  finish,
  toggleModalFisa,
  setCurrentAppointment,
}) {
  const [clickCount, setClickCount] = useState(0);
  const clickTimer = useRef(null);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState("month");

  const handleSlotClick = (slotInfo) => {
    const clickedDate = startOfDay(slotInfo.start);
    clearTimeout(clickTimer.current);

    if (isSameDay(clickedDate, currentDate) && clickCount === 1) {
      if (view !== Views.DAY) {
        setView(Views.DAY);
      }
      setClickCount(0);
    } else {
      setClickCount(1);

      clickTimer.current = setTimeout(() => {
        setClickCount(0);
      }, 1000);

      setCurrentDate(clickedDate);
    }
  };



  const eventPropGetter = (event, start, end, isSelected) => {
    let style = {
      backgroundColor: event.color,
      color: "black",
      fontSize: "13px",
    };

    if (event.status === "Anulat") {
      style = {
        ...style,
        border: "2px solid red",
        color: "black",
      };
    }

    if (event.status === "Terminat") {
      style = {
        ...style,
        textDecoration: "line-through red",
      };
    }

    return {
      style,
    };
  };

  const events = appointments.map((event) => ({
    ...event,
    title: `${event.cod} - ${event.numeClient}`,
    start: new Date(`${event.data}T${event.ora}`),
    end: new Date(
      new Date(`${event.data}T${event.ora}`).getTime() +
        event.timp * 60 * 60 * 1000
    ),
    color: event.color,
    edit: edit,
    cancel: cancel,
    finish: finish,
    description: event.descriere,
  }));

  const handleNavigate = (newDate, view) => {
    setCurrentDate(newDate);
    setView(view);
  };

  const handleSelectEvent = (event) => {
    setCurrentAppointment(event);
  };

  const MyEventComponent = useMemo(() => {
    return ({ event }) => <EventComponent event={event} view={view} />;
  }, [view]);

  return (
    <div className="calendar">
      <Calendar
        localizer={localizer}
        startAccessor="start"
        endAccessor="end"
        style={{ height: "470px", marginTop: "10px" }}
        min={new Date(0, 0, 0, workHours.start)}
        max={new Date(0, 0, 0, workHours.end)}
        formats={{
          timeGutterFormat: (date) => format(date, "HH:mm", { locale: ro }),
        }}
        events={events}
        components={{
          event: MyEventComponent,
        }}
        eventPropGetter={eventPropGetter}
        selectable
        onView={(newView) => setView(newView)}
        view={view}
        date={currentDate}
        onSelectSlot={handleSlotClick}
        onNavigate={handleNavigate}
        onSelectEvent={handleSelectEvent}
        onDoubleClickEvent={toggleModalFisa}
      />
    </div>
  );
}
