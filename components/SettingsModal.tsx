
import React, { useState, useEffect } from 'react';
import { Settings } from '../types';

interface SettingsModalProps {
    settings: Settings;
    onClose: () => void;
    onSettingsChange: (settings: Settings) => void;
}

type PermissionStatus = 'granted' | 'denied' | 'prompt';

const SettingsModal: React.FC<SettingsModalProps> = ({ settings, onClose, onSettingsChange }) => {
    const [localSettings, setLocalSettings] = useState(settings);
    const [notificationPermission, setNotificationPermission] = useState<PermissionStatus>('prompt');
    const [locationPermission, setLocationPermission] = useState<PermissionStatus>('prompt');

    useEffect(() => {
        setNotificationPermission(Notification.permission as PermissionStatus);
        navigator.permissions.query({ name: 'geolocation' }).then(result => {
            setLocationPermission(result.state as PermissionStatus);
        });
    }, []);

    const handleToggleNotifications = async () => {
        let finalPermission = notificationPermission;
        if (notificationPermission !== 'granted') {
            finalPermission = await Notification.requestPermission() as PermissionStatus;
            setNotificationPermission(finalPermission);
        }

        if (locationPermission !== 'granted') {
            try {
                await new Promise((resolve, reject) => navigator.geolocation.getCurrentPosition(resolve, reject, { timeout: 5000 }));
                setLocationPermission('granted');
            } catch (error) {
                setLocationPermission('denied');
            }
        }
        
        const newEnabledState = !localSettings.notificationsEnabled;
        if (finalPermission === 'granted' && newEnabledState) {
            updateSetting('notificationsEnabled', true);
        } else {
            updateSetting('notificationsEnabled', false);
        }
    };
    
    const updateSetting = <K extends keyof Settings>(key: K, value: Settings[K]) => {
        const newSettings = { ...localSettings, [key]: value };
        setLocalSettings(newSettings);
        onSettingsChange(newSettings);
    };

    const PermissionIndicator: React.FC<{ status: PermissionStatus, name: string }> = ({ status, name }) => (
        <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">{name}</span>
            <span className={`px-2 py-0.5 rounded-full font-semibold ${
                status === 'granted' ? 'bg-green-100 text-green-800' :
                status === 'denied' ? 'bg-red-100 text-red-800' :
                'bg-yellow-100 text-yellow-800'
            }`}>
                {status === 'granted' ? 'Toegestaan' : status === 'denied' ? 'Geweigerd' : 'Nodig'}
            </span>
        </div>
    );

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-2xl w-full max-w-md">
                <div className="p-6 border-b flex justify-between items-center">
                    <h2 className="text-2xl font-bold text-brand-dark">Instellingen</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-3xl leading-none">&times;</button>
                </div>

                <div className="p-6 space-y-6">
                    <div>
                        <h3 className="text-lg font-semibold text-brand-dark mb-2">Notificaties</h3>
                        <div className="bg-gray-50 p-4 rounded-lg space-y-4">
                            <div className="flex items-center justify-between">
                                <label htmlFor="notifications-enabled" className="font-medium text-gray-800">
                                    Vertreknotificaties
                                </label>
                                <div 
                                    onClick={handleToggleNotifications}
                                    className={`relative inline-flex items-center h-6 rounded-full w-11 cursor-pointer transition-colors ${
                                        localSettings.notificationsEnabled ? 'bg-brand-DEFAULT' : 'bg-gray-300'
                                    }`}
                                >
                                    <span className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform ${
                                        localSettings.notificationsEnabled ? 'translate-x-6' : 'translate-x-1'
                                    }`}/>
                                </div>
                            </div>
                            <p className="text-sm text-gray-500">
                                Ontvang een melding wanneer het tijd is om te vertrekken. De reistijd wordt berekend op basis van de actuele verkeersinformatie.
                            </p>
                            {localSettings.notificationsEnabled && (
                                <div className="border-t pt-3 mt-3 space-y-2">
                                    <PermissionIndicator status={notificationPermission} name="Notificaties" />
                                    <PermissionIndicator status={locationPermission} name="Locatie" />
                                </div>
                            )}
                        </div>
                    </div>
                    
                    <div>
                        <h3 className="text-lg font-semibold text-brand-dark mb-2">Tijdsinstellingen</h3>
                         <div className="bg-gray-50 p-4 rounded-lg">
                            <label htmlFor="prep-time" className="block font-medium text-gray-800">
                                Voorbereidingstijd (minuten)
                            </label>
                            <p className="text-sm text-gray-500 mb-2">
                                Extra tijd vóór de geschatte vertrektijd.
                            </p>
                            <input
                                id="prep-time"
                                type="number"
                                value={localSettings.preparationTime}
                                onChange={(e) => updateSetting('preparationTime', parseInt(e.target.value, 10) || 0)}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-DEFAULT focus:ring-brand-DEFAULT sm:text-sm"
                                min="0"
                            />
                         </div>
                    </div>
                </div>

                <div className="p-4 bg-gray-50 border-t flex justify-end">
                    <button onClick={onClose} className="px-6 py-2 bg-brand-DEFAULT text-white font-semibold rounded-md hover:bg-brand-dark transition-colors">
                        Sluiten
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SettingsModal;
