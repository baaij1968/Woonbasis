import React, { useState } from 'react';
import { Customer } from '../types';
import { lookupPostcode } from '../services/postcodeService';

type CustomerErrors = Partial<Record<keyof Customer, boolean>>;

interface CustomerInfoFormProps {
    customer: Customer;
    setCustomer: React.Dispatch<React.SetStateAction<Customer>>;
    selectedCustomerId: string | null;
    onUnlinkCustomer: () => void;
    errors: CustomerErrors;
}

const CustomerInfoForm: React.FC<CustomerInfoFormProps> = ({ customer, setCustomer, selectedCustomerId, onUnlinkCustomer, errors }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setCustomer(prev => ({ ...prev, [name]: value }));
    };

    const handlePostcodeLookup = async () => {
        if (!customer.postcode || !customer.houseNumber) return;
        setIsLoading(true);
        setError(null);
        try {
            const address = await lookupPostcode(customer.postcode, customer.houseNumber);
            setCustomer(prev => ({
                ...prev,
                street: address.street,
                city: address.city
            }));
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Adres niet gevonden.');
            setCustomer(prev => ({ ...prev, street: '', city: ''}));
        } finally {
            setIsLoading(false);
        }
    };
    
    const isLookupDisabled = !/^[1-9][0-9]{3}\s?[A-Z]{2}$/i.test(customer.postcode) || !customer.houseNumber;
    
    const getInputClassName = (fieldName: keyof Customer, isReadOnly = false) => {
        let baseClasses = "mt-1 block w-full rounded-md shadow-sm focus:border-brand-DEFAULT focus:ring-brand-DEFAULT sm:text-sm";
        if (errors[fieldName]) {
            baseClasses += " border-red-500 ring-1 ring-red-500";
        } else {
            baseClasses += " border-gray-300";
        }
        if (isReadOnly) {
            baseClasses += " bg-gray-50";
        }
        return baseClasses;
    };


    return (
        <div className="bg-white p-6 rounded-lg shadow-lg">
            {selectedCustomerId && (
                <div className="bg-blue-100 border-l-4 border-blue-500 text-blue-700 p-4 rounded-md mb-6 flex justify-between items-center">
                    <div>
                        <p className="font-bold">Bestaande klant geselecteerd</p>
                        <p>U bent bezig met een opmeting voor: <span className="font-semibold">{customer.name}</span>.</p>
                    </div>
                    <button 
                        onClick={onUnlinkCustomer}
                        className="text-sm font-semibold text-blue-600 hover:text-blue-800 border-b border-blue-600"
                    >
                        Andere klant
                    </button>
                </div>
            )}
            <h2 className="text-2xl font-bold text-brand-dark mb-6 border-b pb-4">Klant- & Afspraakgegevens</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">Naam *</label>
                    <input type="text" name="name" id="name" value={customer.name} onChange={handleChange} className={getInputClassName('name')} placeholder="Jan de Vries"/>
                </div>

                <div className="grid grid-cols-3 gap-x-2">
                    <div className="col-span-2">
                        <label htmlFor="postcode" className="block text-sm font-medium text-gray-700">Postcode *</label>
                        <input type="text" name="postcode" id="postcode" value={customer.postcode} onChange={handleChange} className={getInputClassName('postcode')} placeholder="1234 AB"/>
                    </div>
                    <div>
                        <label htmlFor="houseNumber" className="block text-sm font-medium text-gray-700">Huisnr *</label>
                        <input type="text" name="houseNumber" id="houseNumber" value={customer.houseNumber} onChange={handleChange} className={getInputClassName('houseNumber')} placeholder="1A"/>
                    </div>
                </div>

                <div className="md:col-span-2">
                    <button 
                        onClick={handlePostcodeLookup} 
                        disabled={isLookupDisabled || isLoading}
                        className="w-full sm:w-auto px-4 py-2 bg-brand-DEFAULT text-white font-semibold rounded-lg shadow-sm hover:bg-brand-dark transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center"
                    >
                        {isLoading ? (
                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                        ) : null}
                        {isLoading ? 'Bezig met zoeken...' : 'Zoek Adres'}
                    </button>
                    {error && <p className="text-sm text-red-600 mt-2">{error}</p>}
                </div>

                <div>
                    <label htmlFor="street" className="block text-sm font-medium text-gray-700">Straat *</label>
                    <input type="text" name="street" id="street" value={customer.street} onChange={handleChange} className={getInputClassName('street', true)} readOnly placeholder="Wordt automatisch gevuld"/>
                </div>
                <div>
                    <label htmlFor="city" className="block text-sm font-medium text-gray-700">Plaats *</label>
                    <input type="text" name="city" id="city" value={customer.city} onChange={handleChange} className={getInputClassName('city', true)} readOnly placeholder="Wordt automatisch gevuld"/>
                </div>
                
                <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Telefoon</label>
                    <input type="tel" name="phone" id="phone" value={customer.phone} onChange={handleChange} className={getInputClassName('phone')} placeholder="06-12345678"/>
                </div>
                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                    <input type="email" name="email" id="email" value={customer.email} onChange={handleChange} className={getInputClassName('email')} placeholder="jan.devries@email.com"/>
                </div>
                 <div className="grid grid-cols-2 gap-4">
                     <div>
                        <label htmlFor="date" className="block text-sm font-medium text-gray-700">Meetdatum *</label>
                        <input type="date" name="date" id="date" value={customer.date} onChange={handleChange} className={getInputClassName('date')}/>
                    </div>
                     <div>
                        <label htmlFor="time" className="block text-sm font-medium text-gray-700">Tijd *</label>
                        <input type="time" name="time" id="time" value={customer.time} onChange={handleChange} className={getInputClassName('time')}/>
                    </div>
                 </div>
                <div>
                    <label htmlFor="reference" className="block text-sm font-medium text-gray-700">Referentie / Projectnr.</label>
                    <input type="text" name="reference" id="reference" value={customer.reference} onChange={handleChange} className={getInputClassName('reference')} placeholder="Order 12345"/>
                </div>
            </div>
        </div>
    );
};

export default CustomerInfoForm;