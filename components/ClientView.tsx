import React, { useState, useMemo } from 'react';
import { Customer } from '../types';

interface ClientViewProps {
    clients: Customer[];
    onSelectClient: (clientId: string) => void;
}

const ClientView: React.FC<ClientViewProps> = ({ clients, onSelectClient }) => {
    const [searchTerm, setSearchTerm] = useState('');

    const filteredClients = useMemo(() => {
        if (!searchTerm) {
            return clients;
        }
        const lowercasedTerm = searchTerm.toLowerCase();
        return clients.filter(client =>
            client.name.toLowerCase().includes(lowercasedTerm) ||
            client.postcode.toLowerCase().includes(lowercasedTerm) ||
            client.city.toLowerCase().includes(lowercasedTerm) ||
            client.street.toLowerCase().includes(lowercasedTerm)
        );
    }, [clients, searchTerm]);
    
    const sortedClients = useMemo(() => {
        return [...filteredClients].sort((a, b) => a.name.localeCompare(b.name));
    }, [filteredClients]);

    return (
        <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-lg shadow-lg p-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 border-b pb-4">
                    <h2 className="text-2xl font-bold text-brand-dark mb-3 sm:mb-0">Klantenoverzicht</h2>
                    <div className="relative w-full sm:w-64">
                        <input
                            type="text"
                            placeholder="Zoek op naam, postcode, plaats..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-DEFAULT"
                        />
                        <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>
                </div>
                
                <div className="space-y-4">
                    {sortedClients.length > 0 ? (
                        sortedClients.map(client => (
                            <div key={client.id} className="p-4 border rounded-lg flex flex-col sm:flex-row justify-between sm:items-center gap-4 hover:bg-gray-50 transition-colors">
                                <div>
                                    <p className="font-semibold text-lg text-brand-dark">{client.name}</p>
                                    <p className="text-sm text-gray-600">{client.street} {client.houseNumber}, {client.postcode} {client.city}</p>
                                    <p className="text-sm text-gray-600">{client.phone} {client.phone && client.email ? '•' : ''} {client.email}</p>
                                </div>
                                <button
                                    onClick={() => onSelectClient(client.id)}
                                    className="px-4 py-2 bg-brand-DEFAULT text-white font-bold rounded-lg shadow-md hover:bg-brand-dark transition-colors duration-300 w-full sm:w-auto flex-shrink-0"
                                >
                                    Start Opmeting
                                </button>
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-12 text-gray-500">
                            <h3 className="text-xl font-semibold mb-2">Geen klanten gevonden</h3>
                            <p>Voeg een nieuwe klant toe via het opmeetformulier, of pas uw zoekterm aan.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ClientView;
