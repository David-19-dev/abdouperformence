import React, { useState, useEffect } from 'react';
// @ts-ignore
import { Calendar, momentLocalizer, View } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Calendar as CalendarIcon, Clock, User, Phone, Mail, MapPin } from 'lucide-react';

const localizer = momentLocalizer(moment);

interface BookingEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  resource: {
    booking: any;
    status: string;
    clientName: string;
    clientPhone: string;
    clientEmail: string;
    sessionType: string;
    goal: string;
    message?: string;
  };
}

interface CalendarViewProps {
  onSelectSlot?: (slotInfo: { start: Date; end: Date }) => void;
  onSelectEvent?: (event: BookingEvent) => void;
}

const CalendarView: React.FC<CalendarViewProps> = ({ onSelectSlot, onSelectEvent }) => {
  const [events, setEvents] = useState<BookingEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<View>('week');

  useEffect(() => {
    // Écouter les changements en temps réel sur la collection bookings
    const q = query(collection(db, 'bookings'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      try {
        const bookings = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));

        console.log('Firestore bookings:', bookings);

        const filteredBookings = bookings.filter((booking: any) => booking.status !== 'cancelled');

        const calendarEvents: BookingEvent[] = filteredBookings.map((booking: any) => {
          const startDateTime = new Date(`${booking.preferredDate}T${booking.preferredTime}`);
          const endDateTime = new Date(startDateTime.getTime() + 60 * 60 * 1000); // +1 heure

          return {
            id: booking.id,
            title: `${booking.contactInfo.name} - ${getSessionTypeLabel(booking.sessionType)}`,
            start: startDateTime,
            end: endDateTime,
            resource: {
              booking,
              status: booking.status,
              clientName: booking.contactInfo.name,
              clientPhone: booking.contactInfo.phone,
              clientEmail: booking.contactInfo.email,
              sessionType: booking.sessionType,
              goal: booking.goal,
              message: booking.message
            }
          };
        });

        console.log('Mapped calendar events:', calendarEvents);

        setEvents(calendarEvents);
        setLoading(false);
      } catch (error) {
        console.error('Error processing bookings:', error);
        setLoading(false);
      }
    }, (error) => {
      console.error('Error listening to bookings:', error);
      setLoading(false);
    });

    // Nettoyer l'écouteur lors du démontage du composant
    return () => unsubscribe();
  }, []);

  const getSessionTypeLabel = (type: string) => {
    const types: { [key: string]: string } = {
      'personal': 'Coaching Personnel',
      'group': 'Cours Collectif',
      'evaluation': 'Évaluation'
    };
    return types[type] || type;
  };

  const getGoalLabel = (goal: string) => {
    const goals: { [key: string]: string } = {
      'weight-loss': 'Perte de poids',
      'muscle-gain': 'Prise de masse',
      'fitness': 'Remise en forme',
      'performance': 'Performance sportive',
      'rehabilitation': 'Rééducation',
      'wellness': 'Bien-être général'
    };
    return goals[goal] || goal;
  };

  const eventStyleGetter = (event: BookingEvent) => {
    let backgroundColor = '#3174ad';
    
    switch (event.resource.status) {
      case 'pending':
        backgroundColor = '#f59e0b'; // Orange
        break;
      case 'confirmed':
        backgroundColor = '#10b981'; // Vert
        break;
      case 'completed':
        backgroundColor = '#6b7280'; // Gris
        break;
      case 'cancelled':
        backgroundColor = '#ef4444'; // Rouge
        break;
    }

    return {
      style: {
        backgroundColor,
        borderRadius: '5px',
        opacity: 0.8,
        color: 'white',
        border: '0px',
        display: 'block'
      }
    };
  };

  const CustomEvent = ({ event }: { event: BookingEvent }) => (
    <div className="p-1">
      <div className="font-medium text-xs">{event.resource.clientName}</div>
      <div className="text-xs opacity-90">{getSessionTypeLabel(event.resource.sessionType)}</div>
      <div className="text-xs opacity-75">{event.start.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}</div>
    </div>
  );

  const CustomToolbar = ({ label, onNavigate, onView }: { label: string; onNavigate: (action: string) => void; onView: (view: string) => void }) => (
    <div className="flex items-center justify-between mb-4 p-4 bg-white rounded-lg shadow">
      <div className="flex items-center space-x-4">
        <button
          onClick={() => onNavigate('PREV')}
          className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
        >
          ←
        </button>
        <h2 className="text-lg font-semibold">{label}</h2>
        <button
          onClick={() => onNavigate('NEXT')}
          className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
        >
          →
        </button>
        <button
          onClick={() => onNavigate('TODAY')}
          className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Aujourd'hui
        </button>
      </div>
      
      <div className="flex space-x-2">
        {['month', 'week', 'day'].map(viewName => (
          <button
            key={viewName}
            onClick={() => onView(viewName)}
            className={`px-3 py-1 rounded ${
              view === viewName 
                ? 'bg-red-600 text-white' 
                : 'bg-gray-200 hover:bg-gray-300'
            }`}
          >
            {viewName === 'month' ? 'Mois' : viewName === 'week' ? 'Semaine' : 'Jour'}
          </button>
        ))}
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
      </div>
    );
  }

  return (
    <div className="h-full">
      {/* Légende des statuts */}
      <div className="mb-4 p-4 bg-white rounded-lg shadow">
        <h3 className="font-semibold mb-2">Légende des statuts :</h3>
        <div className="flex flex-wrap gap-4">
          <div className="flex items-center">
            <div className="w-4 h-4 bg-yellow-500 rounded mr-2"></div>
            <span className="text-sm">En attente</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-green-500 rounded mr-2"></div>
            <span className="text-sm">Confirmé</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-gray-500 rounded mr-2"></div>
            <span className="text-sm">Terminé</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-red-500 rounded mr-2"></div>
            <span className="text-sm">Annulé</span>
          </div>
        </div>
      </div>

      {/* Calendrier */}
      <div className="bg-white rounded-lg shadow p-4" style={{ height: '600px' }}>
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          style={{ height: '100%' }}
          onSelectEvent={onSelectEvent}
          onSelectSlot={onSelectSlot}
          selectable
          eventPropGetter={eventStyleGetter}
          components={{
            event: CustomEvent,
            toolbar: CustomToolbar
          }}
          view={view}
          onView={setView}
          step={30}
          timeslots={2}
          min={new Date(0, 0, 0, 6, 0, 0)} // 6h00
          max={new Date(0, 0, 0, 21, 0, 0)} // 21h00
          formats={{
            timeGutterFormat: 'HH:mm',
            eventTimeRangeFormat: ({ start, end }: { start: Date; end: Date }) =>
              `${moment(start).format('HH:mm')} - ${moment(end).format('HH:mm')}`,
            dayHeaderFormat: 'dddd DD/MM',
            dayRangeHeaderFormat: ({ start, end }: { start: Date; end: Date }) =>
              `${moment(start).format('DD/MM')} - ${moment(end).format('DD/MM/YYYY')}`
          }}
          messages={{
            next: 'Suivant',
            previous: 'Précédent',
            today: 'Aujourd\'hui',
            month: 'Mois',
            week: 'Semaine',
            day: 'Jour',
            agenda: 'Agenda',
            date: 'Date',
            time: 'Heure',
            event: 'Événement',
            noEventsInRange: 'Aucune réservation dans cette période',
            showMore: (total: number) => `+ ${total} de plus`
          }}
        />
      </div>
    </div>
  );
};

export default CalendarView;