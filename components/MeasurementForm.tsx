
import React, { useState } from 'react';
import { Customer, CurtainMeasurement, FloorMeasurement, WindowDecorationMeasurement } from '../types';
import CustomerInfoForm from './CustomerInfoForm';
import CurtainForm from './CurtainForm';
import FloorForm from './FloorForm';
import WindowDecorationForm from './WindowDecorationForm';

interface MeasurementFormProps {
    customer: Customer;
    setCustomer: React.Dispatch<React.SetStateAction<Customer>>;
    curtains: CurtainMeasurement[];
    setCurtains: React.Dispatch<React.SetStateAction<CurtainMeasurement[]>>;
    floors: FloorMeasurement[];
    setFloors: React.Dispatch<React.SetStateAction<FloorMeasurement[]>>;
    windowDecorations: WindowDecorationMeasurement[];
    setWindowDecorations: React.Dispatch<React.SetStateAction<WindowDecorationMeasurement[]>>;
    onReview: () => void;
    onSaveAndSchedule: () => void;
    selectedCustomerId: string | null;
    onUnlinkCustomer: () => void;
    editingProjectId: string | null;
    onCancelEdit: () => void;
}

type ActiveTab = 'curtains' | 'floors' | 'windowDecorations';
type CustomerErrors = Partial<Record<keyof Customer, boolean>>;


const MeasurementForm: React.FC<MeasurementFormProps> = ({
    customer, setCustomer,
    curtains, setCurtains,
    floors, setFloors,
    windowDecorations, setWindowDecorations,
    onReview,
    onSaveAndSchedule,
    selectedCustomerId,
    onUnlinkCustomer,
    editingProjectId,
    onCancelEdit
}) => {
    const [activeTab, setActiveTab] = useState<ActiveTab>('curtains');
    const [errors, setErrors] = useState<CustomerErrors>({});

    const validateForm = (): boolean => {
        const newErrors: CustomerErrors = {};
        const requiredFields: (keyof Customer)[] = ['name', 'postcode', 'houseNumber', 'street', 'city', 'date', 'time'];
        let isValid = true;
        
        requiredFields.forEach(field => {
            if (!customer[field] || String(customer[field]).trim() === '') {
                newErrors[field] = true;
                isValid = false;
            }
        });

        setErrors(newErrors);
        return isValid;
    };

    const handleSaveClick = () => {
        if (validateForm()) {
            onSaveAndSchedule();
        }
    };

    return (
        <div className="max-w-4xl mx-auto">
            <CustomerInfoForm 
                customer={customer} 
                setCustomer={setCustomer}
                selectedCustomerId={selectedCustomerId}
                onUnlinkCustomer={onUnlinkCustomer}
                errors={errors}
            />

            {Object.keys(errors).length > 0 && (
                 <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-md mt-6" role="alert">
                    <p className="font-bold">Niet alles is ingevuld</p>
                    <p>Controleer de rood omrande velden en probeer het opnieuw.</p>
                </div>
            )}

            <div className="bg-white rounded-lg shadow-lg mt-8 overflow-hidden">
                <div className="border-b border-gray-200">
                    <nav className="-mb-px flex" aria-label="Tabs">
                        <button
                            onClick={() => setActiveTab('curtains')}
                            className={`w-1/3 py-4 px-1 text-center border-b-2 font-medium text-sm transition-colors duration-200 ${
                                activeTab === 'curtains'
                                    ? 'border-brand-DEFAULT text-brand-dark'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            }`}
                        >
                            Gordijnen
                        </button>
                        <button
                            onClick={() => setActiveTab('floors')}
                            className={`w-1/3 py-4 px-1 text-center border-b-2 font-medium text-sm transition-colors duration-200 ${
                                activeTab === 'floors'
                                    ? 'border-brand-DEFAULT text-brand-dark'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            }`}
                        >
                            Vloeren
                        </button>
                         <button
                            onClick={() => setActiveTab('windowDecorations')}
                            className={`w-1/3 py-4 px-1 text-center border-b-2 font-medium text-sm transition-colors duration-200 ${
                                activeTab === 'windowDecorations'
                                    ? 'border-brand-DEFAULT text-brand-dark'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            }`}
                        >
                            Raamdecoratie
                        </button>
                    </nav>
                </div>

                <div className="p-4 sm:p-6">
                    {activeTab === 'curtains' && <CurtainForm curtains={curtains} setCurtains={setCurtains} />}
                    {activeTab === 'floors' && <FloorForm floors={floors} setFloors={setFloors} />}
                    {activeTab === 'windowDecorations' && <WindowDecorationForm windowDecorations={windowDecorations} setWindowDecorations={setWindowDecorations} />}
                </div>
            </div>

            <div className="mt-8 flex flex-col-reverse sm:flex-row sm:justify-end gap-3">
                <button
                    onClick={handleSaveClick}
                    className={`px-6 py-3 sm:py-2 text-white font-bold rounded-lg shadow-md transition-colors duration-300 ${
                        editingProjectId 
                            ? 'bg-green-600 hover:bg-green-700' 
                            : selectedCustomerId 
                                ? 'bg-brand-dark' 
                                : 'bg-brand-DEFAULT hover:bg-brand-dark'
                    }`}
                >
                    {editingProjectId ? 'Wijzigingen Opslaan' : (selectedCustomerId ? 'Nieuw Project Inplannen' : 'Project Opslaan & Inplannen')}
                </button>
                 <button
                    onClick={onReview}
                    className="px-6 py-3 sm:py-2 bg-white text-brand-dark border border-brand-DEFAULT font-semibold rounded-lg shadow-sm hover:bg-gray-50 transition-colors duration-300"
                >
                    Bekijk Overzicht
                </button>
                 {editingProjectId && (
                    <button
                        onClick={onCancelEdit}
                        className="px-6 py-3 sm:py-2 bg-gray-200 text-gray-800 font-semibold rounded-lg shadow-sm hover:bg-gray-300 transition-colors duration-300"
                    >
                        Annuleren
                    </button>
                )}
            </div>
        </div>
    );
};

export default MeasurementForm;
