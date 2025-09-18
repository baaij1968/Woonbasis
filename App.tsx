
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import Header from './components/Header';
import MeasurementForm from './components/MeasurementForm';
import ReviewModal from './components/ReviewModal';
import SettingsModal from './components/SettingsModal';
import CalendarView from './components/CalendarView';
import ClientView from './components/ClientView';
import { Customer, CurtainMeasurement, FloorMeasurement, WindowDecorationMeasurement, Project, Appointment, Settings } from './types';
import { getTravelTime } from './services/trafficService';

// Initial state for new forms
const initialCustomer: Customer = {
    id: '',
    name: '',
    postcode: '',
    houseNumber: '',
    street: '',
    city: '',
    phone: '',
    email: '',
    reference: '',
    date: new Date().toISOString().split('T')[0],
    time: new Date().toLocaleTimeString('nl-NL', { hour: '2-digit', minute: '2-digit' }),
};

const initialCurtainMeasurement: CurtainMeasurement = {
    id: Date.now(),
    room: '',
    colorNumber: '',
    type: 'Overgordijn',
    pleatType: 'Enkele plooi',
    headerSize: '',
    mounting: 'Wand',
    hemType: 'Loodveter',
    unit: 'Stel',
    width: '',
    height: '',
    notes: '',
};

const initialFloorMeasurement: FloorMeasurement = {
    id: Date.now(),
    room: '',
    colorNumber: '',
    type: 'Laminaat',
    length: '',
    width: '',
    skirting: false,
    underlayment: 'Beton',
    notes: '',
};

const initialWindowDecorationMeasurement: WindowDecorationMeasurement = {
    id: Date.now(),
    room: '',
    colorNumber: '',
    type: 'Rolgordijn',
    mounting: 'In de dag',
    width: '',
    height: '',
    controlSide: 'Links',
    notes: '',
};

const initialSettings: Settings = {
    notificationsEnabled: false,
    preparationTime: 15,
};

type View = 'form' | 'calendar' | 'clients';

const App: React.FC = () => {
    // Main state
    const [view, setView] = useState<View>('form');
    const [projects, setProjects] = useState<Project[]>([]);
    const [settings, setSettings] = useState<Settings>(initialSettings);

    // Form state
    const [customer, setCustomer] = useState<Customer>(initialCustomer);
    const [curtains, setCurtains] = useState<CurtainMeasurement[]>([initialCurtainMeasurement]);
    const [floors, setFloors] = useState<FloorMeasurement[]>([initialFloorMeasurement]);
    const [windowDecorations, setWindowDecorations] = useState<WindowDecorationMeasurement[]>([initialWindowDecorationMeasurement]);
    
    // UI State
    const [isReviewModalOpen, setReviewModalOpen] = useState(false);
    const [isSettingsModalOpen, setSettingsModalOpen] = useState(false);
    const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(null);
    const [editingProjectId, setEditingProjectId] = useState<string | null>(null);

    // Load data from localStorage on mount
    useEffect(() => {
        try {
            const savedProjects = localStorage.getItem('woonbasis_projects');
            if (savedProjects) {
                setProjects(JSON.parse(savedProjects));
            }
            const savedSettings = localStorage.getItem('woonbasis_settings');
            if (savedSettings) {
                setSettings(JSON.parse(savedSettings));
            }
        } catch (error) {
            console.error("Failed to load data from localStorage", error);
        }
    }, []);

    // Save projects to localStorage
    useEffect(() => {
        try {
            localStorage.setItem('woonbasis_projects', JSON.stringify(projects));
        } catch (error) {
            console.error("Failed to save projects to localStorage", error);
        }
    }, [projects]);

    // Save settings to localStorage
    useEffect(() => {
        try {
            localStorage.setItem('woonbasis_settings', JSON.stringify(settings));
        } catch (error) {
            console.error("Failed to save settings to localStorage", error);
        }
    }, [settings]);

    // Derived state for clients and appointments
    const clients = useMemo(() => {
        const clientMap = new Map<string, Customer>();
        projects.forEach(p => {
            if (p.customer.id && !clientMap.has(p.customer.id)) {
                clientMap.set(p.customer.id, p.customer);
            }
        });
        return Array.from(clientMap.values());
    }, [projects]);

    const appointments = useMemo(() => {
        return projects.map(p => ({
            id: p.id,
            projectId: p.id,
            date: p.customer.date,
            time: p.customer.time,
            customerName: p.customer.name,
            customerAddress: `${p.customer.street} ${p.customer.houseNumber}, ${p.customer.city}`
        })).filter(a => a.date && a.time);
    }, [projects]);

    const resetForm = useCallback(() => {
        setCustomer(initialCustomer);
        setCurtains([{...initialCurtainMeasurement, id: Date.now()}]);
        setFloors([{...initialFloorMeasurement, id: Date.now()}]);
        setWindowDecorations([{...initialWindowDecorationMeasurement, id: Date.now()}]);
        setSelectedCustomerId(null);
        setEditingProjectId(null);
    }, []);

    const handleSaveAndSchedule = () => {
        let customerToSave = { ...customer };

        if (editingProjectId) {
            // Update existing project
            const updatedProjects = projects.map(p => {
                if (p.id === editingProjectId) {
                    return { 
                        ...p, 
                        customer: customerToSave, 
                        curtains: curtains.filter(c => c.room || c.width || c.height),
                        floors: floors.filter(f => f.room || f.length || f.width),
                        windowDecorations: windowDecorations.filter(d => d.room || d.width || d.height)
                    };
                }
                return p;
            });
            setProjects(updatedProjects);
            alert('Project succesvol bijgewerkt!');
        } else {
            // Create new project
            if (!selectedCustomerId) {
                // This is a new customer, give them a unique ID.
                customerToSave.id = crypto.randomUUID();
            }
            
            const newProject: Project = {
                id: crypto.randomUUID(), // Project always gets a new unique ID
                customer: customerToSave,
                curtains: curtains.filter(c => c.room || c.width || c.height),
                floors: floors.filter(f => f.room || f.length || f.width),
                windowDecorations: windowDecorations.filter(d => d.room || d.width || d.height),
            };

            setProjects(prevProjects => [...prevProjects, newProject]);
            alert('Project opgeslagen en ingepland!');
        }
        
        resetForm();
        setView('calendar');
    };

    const handleSelectClient = (clientId: string) => {
        const client = clients.find(c => c.id === clientId);
        if (client) {
            resetForm();
            setCustomer({ 
                ...client, 
                date: new Date().toISOString().split('T')[0],
                time: new Date().toLocaleTimeString('nl-NL', { hour: '2-digit', minute: '2-digit' }),
                reference: ''
            });
            setSelectedCustomerId(clientId);
            setView('form');
        }
    };

    const handleUnlinkCustomer = () => {
        resetForm();
    };

    const handleSelectAppointment = (appointment: Appointment) => {
        const project = projects.find(p => p.id === appointment.projectId);
        if (project) {
            setCustomer(project.customer);
            setCurtains(project.curtains.length > 0 ? project.curtains : [{...initialCurtainMeasurement, id: Date.now()}]);
            setFloors(project.floors.length > 0 ? project.floors : [{...initialFloorMeasurement, id: Date.now()}]);
            setWindowDecorations(project.windowDecorations.length > 0 ? project.windowDecorations : [{...initialWindowDecorationMeasurement, id: Date.now()}]);
            setEditingProjectId(project.id);
            setSelectedCustomerId(project.customer.id);
            setView('form');
        }
    };

    const handleCancelEdit = () => {
        resetForm();
        setView('form');
    };
    
    // Notification logic
    useEffect(() => {
        if (!settings.notificationsEnabled || !('Notification' in window)) return;

        const checkAppointments = async () => {
            const now = new Date();
            for (const appt of appointments) {
                const apptDateTime = new Date(`${appt.date}T${appt.time}`);
                if (isNaN(apptDateTime.getTime()) || apptDateTime < now) continue;

                const travelTime = await getTravelTime(appt.customerAddress);
                const prepTime = settings.preparationTime;
                const departureTime = new Date(apptDateTime.getTime() - (travelTime + prepTime) * 60000);

                const timeToDeparture = departureTime.getTime() - now.getTime();

                // Notify if it's time to leave (within a 1-minute window before departure)
                if (timeToDeparture > 0 && timeToDeparture <= 60000) {
                    const notificationKey = `notif_${appt.id}`;
                    if (!sessionStorage.getItem(notificationKey)) {
                         new Notification('Tijd om te vertrekken!', {
                            body: `Vertrek nu voor je afspraak met ${appt.customerName} om ${appt.time}. Reistijd: ${travelTime} min.`,
                        });
                        sessionStorage.setItem(notificationKey, 'true');
                    }
                }
            }
        };

        if (Notification.permission === 'granted') {
             const intervalId = setInterval(checkAppointments, 30000); // Check every 30 seconds
             return () => clearInterval(intervalId);
        }

    }, [appointments, settings.notificationsEnabled, settings.preparationTime]);


    const renderView = () => {
        switch (view) {
            case 'form':
                return (
                    <MeasurementForm
                        customer={customer}
                        setCustomer={setCustomer}
                        curtains={curtains}
                        setCurtains={setCurtains}
                        floors={floors}
                        setFloors={setFloors}
                        windowDecorations={windowDecorations}
                        setWindowDecorations={setWindowDecorations}
                        onReview={() => setReviewModalOpen(true)}
                        onSaveAndSchedule={handleSaveAndSchedule}
                        selectedCustomerId={selectedCustomerId}
                        onUnlinkCustomer={handleUnlinkCustomer}
                        editingProjectId={editingProjectId}
                        onCancelEdit={handleCancelEdit}
                    />
                );
            case 'calendar':
                return <CalendarView appointments={appointments} onSelectAppointment={handleSelectAppointment} />;
            case 'clients':
                return <ClientView clients={clients} onSelectClient={handleSelectClient} />;
            default:
                return null;
        }
    };

    return (
        <div className="bg-brand-light min-h-screen pb-16">
            <Header 
                currentView={view} 
                setView={setView}
                onOpenSettings={() => setSettingsModalOpen(true)}
            />
            <main className="container mx-auto px-3 sm:px-6 md:px-8 py-6 sm:py-8">
                {renderView()}
            </main>
            {isReviewModalOpen && (
                <ReviewModal
                    customer={customer}
                    curtains={curtains}
                    floors={floors}
                    windowDecorations={windowDecorations}
                    onClose={() => setReviewModalOpen(false)}
                />
            )}
            {isSettingsModalOpen && (
                <SettingsModal
                    settings={settings}
                    onClose={() => setSettingsModalOpen(false)}
                    onSettingsChange={setSettings}
                />
            )}
        </div>
    );
};

export default App;
