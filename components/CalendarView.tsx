
import React, { useState } from 'react';
import { Appointment } from '../types';

interface CalendarViewProps {
    appointments: Appointment[];
    onSelectAppointment: (appointment: Appointment) => void;
}

const CalendarView: React.FC<CalendarViewProps> = ({ appointments, onSelectAppointment }) => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());

    const daysOfWeek = ['Ma', 'Di', 'Wo', 'Do', 'Vr', 'Za', 'Zo'];

    const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const lastDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);

    const startingDayOfWeek = (firstDayOfMonth.getDay() + 6) % 7; // 0 for Monday, 6 for Sunday
    const daysInMonth = lastDayOfMonth.getDate();

    const calendarDays = [];
    for (let i = 0; i < startingDayOfWeek; i++) {
        calendarDays.push(null);
    }
    for (let i = 1; i <= daysInMonth; i++) {
        calendarDays.push(new Date(currentDate.getFullYear(), currentDate.getMonth(), i));
    }
    while (calendarDays.length % 7 !== 0) {
        calendarDays.push(null);
    }

    const appointmentsByDate: { [key: string]: Appointment[] } = {};
    appointments.forEach(appt => {
        const date = new Date(appt.date + 'T00:00:00'); // Neutralize timezone
        const dateKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
        if (!appointmentsByDate[dateKey]) {
            appointmentsByDate[dateKey] = [];
        }
        appointmentsByDate[dateKey].push(appt);
        appointmentsByDate[dateKey].sort((a, b) => a.time.localeCompare(b.time));
    });

    const changeMonth = (offset: number) => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + offset, 1));
        setSelectedDate(null);
    };
    
    const selectedDateString = selectedDate 
        ? `${selectedDate.getFullYear()}-${String(selectedDate.getMonth() + 1).padStart(2, '0')}-${String(selectedDate.getDate()).padStart(2, '0')}`
        : null;

    const appointmentsForSelectedDay = selectedDateString ? appointmentsByDate[selectedDateString] || [] : [];

    return (
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-4 sm:p-6">
            <div className="flex justify-between items-center mb-4">
                <button onClick={() => changeMonth(-1)} className="px-3 py-1 text-sm sm:text-base rounded-md bg-gray-200 hover:bg-gray-300">‹ Vorige</button>
                <h2 className="text-lg sm:text-xl font-bold text-brand-dark text-center">
                    {currentDate.toLocaleString('nl-NL', { month: 'long', year: 'numeric' })}
                </h2>
                <button onClick={() => changeMonth(1)} className="px-3 py-1 text-sm sm:text-base rounded-md bg-gray-200 hover:bg-gray-300">Volgende ›</button>
            </div>
            <div className="grid grid-cols-7 gap-1 text-center font-semibold text-gray-600 text-xs sm:text-base">
                {daysOfWeek.map(day => <div key={day} className="py-2">{day}</div>)}
            </div>
            <div className="grid grid-cols-7 gap-1">
                {calendarDays.map((day, index) => {
                    if (!day) return <div key={index} className="border rounded-md bg-gray-50 min-h-[6rem] sm:min-h-[8rem]"></div>;
                    
                    const year = day.getFullYear();
                    const month = String(day.getMonth() + 1).padStart(2, '0');
                    const date = String(day.getDate()).padStart(2, '0');
                    const dateString = `${year}-${month}-${date}`;

                    const dailyAppointments = appointmentsByDate[dateString] || [];
                    const hasAppointments = dailyAppointments.length > 0;
                    const isToday = day.toDateString() === new Date().toDateString();
                    const isSelected = selectedDate?.toDateString() === day.toDateString();

                    return (
                        <div 
                            key={index} 
                            onClick={() => setSelectedDate(day)}
                            className={`border rounded-md min-h-[6rem] sm:min-h-[8rem] p-1.5 text-left flex flex-col cursor-pointer transition-colors ${
                                isSelected ? 'bg-brand-DEFAULT text-white shadow-inner' : 'hover:bg-brand-light'
                            } ${isToday && !isSelected ? 'bg-blue-50' : ''}`}
                        >
                            <span className={`font-bold text-sm ${isSelected ? 'text-white' : 'text-gray-800'}`}>{day.getDate()}</span>
                            
                             {hasAppointments && (
                                <div className="flex-1 overflow-y-auto mt-1 space-y-1 pr-1 text-[11px] leading-tight"> 
                                    {dailyAppointments.map(appt => (
                                        <div 
                                            key={appt.id} 
                                            className={`p-1 rounded truncate ${
                                                isSelected 
                                                    ? 'bg-white/20 text-white' 
                                                    : 'bg-brand-light text-brand-dark'
                                            }`}
                                            title={`${appt.time} - ${appt.customerName}`}
                                        >
                                            <span className="font-semibold">{appt.time}</span> {appt.customerName}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            {selectedDate && (
                <div className="mt-6">
                     <h3 className="text-lg font-semibold text-brand-dark border-b pb-2 mb-3">
                        Afspraken op {selectedDate.toLocaleDateString('nl-NL', { weekday: 'long', day: 'numeric', month: 'long' })}
                     </h3>
                     {appointmentsForSelectedDay.length > 0 ? (
                        <ul className="space-y-2">
                           {appointmentsForSelectedDay.map(appt => (
                                <li 
                                    key={appt.id}
                                    onClick={() => onSelectAppointment(appt)}
                                    className="p-3 bg-gray-50 rounded-md flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 cursor-pointer hover:bg-gray-100 transition-colors"
                                >
                                    <div>
                                        <span className="font-bold text-brand-dark">{appt.time}</span>
                                        <span className="ml-0 sm:ml-4 text-gray-700 block sm:inline">{appt.customerName}</span>
                                    </div>
                                    <span className="text-sm text-brand-DEFAULT font-semibold self-end sm:self-auto mt-1 sm:mt-0">Bekijk Details &rarr;</span>
                                </li>
                           ))}
                        </ul>
                     ) : (
                        <p className="text-gray-500">Geen afspraken voor deze dag.</p>
                     )}
                </div>
            )}
        </div>
    );
};

export default CalendarView;
