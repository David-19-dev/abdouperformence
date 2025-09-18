import React, { useState } from 'react';
import CalendarView from '../../components/CalendarView';
import BookingModal from '../../components/BookingModal';

const CalendarManager: React.FC = () => {
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleSelectEvent = (event: any) => {
    setSelectedBooking(event.resource.booking);
    setSelectedSlot(null);
    setIsModalOpen(true);
  };

  const handleSelectSlot = (slotInfo: { start: Date; end: Date }) => {
    setSelectedSlot(slotInfo);
    setSelectedBooking(null);
    setIsModalOpen(true);
  };

  const handleBookingUpdate = () => {
    setRefreshKey(prev => prev + 1);
    setIsModalOpen(false);
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Calendrier des Réservations</h1>
        <p className="text-gray-600 mt-1">
          Gérez vos réservations avec une vue calendrier interactive
        </p>
      </div>

      <CalendarView
        key={refreshKey}
        onSelectEvent={handleSelectEvent}
        onSelectSlot={handleSelectSlot}
      />

      <BookingModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        booking={selectedBooking}
        selectedSlot={selectedSlot}
        onBookingUpdate={handleBookingUpdate}
      />
    </div>
  );
};

export default CalendarManager;