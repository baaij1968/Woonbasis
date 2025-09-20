import React from 'react';
import { WindowDecorationMeasurement } from '../types';
import PlusIcon from './icons/PlusIcon';
import TrashIcon from './icons/TrashIcon';
import CameraIcon from './icons/CameraIcon';

interface WindowDecorationFormProps {
    windowDecorations: WindowDecorationMeasurement[];
    setWindowDecorations: React.Dispatch<React.SetStateAction<WindowDecorationMeasurement[]>>;
}

const WindowDecorationForm: React.FC<WindowDecorationFormProps> = ({ windowDecorations, setWindowDecorations }) => {

    const handleChange = <K extends keyof WindowDecorationMeasurement,>(index: number, field: K, value: WindowDecorationMeasurement[K]) => {
        const newDecorations = [...windowDecorations];
        newDecorations[index] = { ...newDecorations[index], [field]: value };
        setWindowDecorations(newDecorations);
    };

    const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
        if (e.target.files && e.target.files[0]) {
            const reader = new FileReader();
            reader.onload = (event) => {
                if (event.target?.result) {
                    handleChange(index, 'photo', event.target.result as string);
                }
            };
            reader.readAsDataURL(e.target.files[0]);
            e.target.value = '';
        }
    };

    const addDecoration = () => {
        setWindowDecorations([...windowDecorations, {
            id: Date.now(),
            room: '',
            colorNumber: '',
            type: 'Rolgordijn',
            mounting: 'In de dag',
            width: '',
            height: '',
            mountingHeight: '',
            controlSide: 'Links',
            controlHeight: '',
            notes: ''
        }]);
    };

    const removeDecoration = (id: number) => {
        if (windowDecorations.length > 1) {
            setWindowDecorations(windowDecorations.filter(d => d.id !== id));
        }
    };

    return (
        <div className="space-y-8">
            {windowDecorations.map((deco, index) => (
                <div key={deco.id} className="p-4 border border-gray-200 rounded-lg relative">
                    {windowDecorations.length > 1 && (
                        <button onClick={() => removeDecoration(deco.id)} className="absolute top-2 right-2 text-gray-400 hover:text-red-600 transition-colors">
                            <TrashIcon />
                        </button>
                    )}
                    <h3 className="font-semibold text-lg mb-4 text-brand-dark">Meting #{index + 1}</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="md:col-span-2">
                             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Ruimte</label>
                                    <input type="text" value={deco.room} onChange={(e) => handleChange(index, 'room', e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-DEFAULT focus:ring-brand-DEFAULT sm:text-sm" placeholder="Keuken" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Leverancier en kleurnummer</label>
                                    <input type="text" value={deco.colorNumber} onChange={(e) => handleChange(index, 'colorNumber', e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-DEFAULT focus:ring-brand-DEFAULT sm:text-sm" placeholder="Bijv. Luxaflex / 9001"/>
                                </div>
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Type</label>
                            <select value={deco.type} onChange={(e) => handleChange(index, 'type', e.target.value as WindowDecorationMeasurement['type'])} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-DEFAULT focus:ring-brand-DEFAULT sm:text-sm">
                                <option>Rolgordijn</option>
                                <option>Jaloezie</option>
                                <option>Plissé</option>
                                <option>Duette</option>
                                <option>Vouwgordijn</option>
                                <option>Shutters</option>
                                <option>Geweven Hout</option>
                                <option>Fractions</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Montage</label>
                            <select value={deco.mounting} onChange={(e) => handleChange(index, 'mounting', e.target.value as WindowDecorationMeasurement['mounting'])} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-DEFAULT focus:ring-brand-DEFAULT sm:text-sm">
                                <option>In de dag</option>
                                <option>Op de dag</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Breedte (cm)</label>
                            <input type="number" value={deco.width} onChange={(e) => handleChange(index, 'width', e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-DEFAULT focus:ring-brand-DEFAULT sm:text-sm" placeholder="120.5" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Hoogte (cm)</label>
                            <input type="number" value={deco.height} onChange={(e) => handleChange(index, 'height', e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-DEFAULT focus:ring-brand-DEFAULT sm:text-sm" placeholder="180" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Montagehoogte (cm)</label>
                            <input type="number" value={deco.mountingHeight} onChange={(e) => handleChange(index, 'mountingHeight', e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-DEFAULT focus:ring-brand-DEFAULT sm:text-sm" placeholder="220" />
                        </div>
                        <div>
                             <label className="block text-sm font-medium text-gray-700">Bedieningszijde</label>
                            <select value={deco.controlSide} onChange={(e) => handleChange(index, 'controlSide', e.target.value as WindowDecorationMeasurement['controlSide'])} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-DEFAULT focus:ring-brand-DEFAULT sm:text-sm">
                                <option>Links</option>
                                <option>Rechts</option>
                            </select>
                        </div>
                        {deco.type === 'Fractions' && (
                             <div>
                                <label className="block text-sm font-medium text-gray-700">Bedieningshoogte (cm)</label>
                                 <input type="number" value={deco.controlHeight || ''} onChange={(e) => handleChange(index, 'controlHeight', e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-DEFAULT focus:ring-brand-DEFAULT sm:text-sm" placeholder="150"/>
                            </div>
                        )}
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700">Opmerkingen</label>
                            <textarea value={deco.notes} onChange={(e) => handleChange(index, 'notes', e.target.value)} rows={3} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-DEFAULT focus:ring-brand-DEFAULT sm:text-sm" placeholder="Bijv. Kettinglengte 150cm"></textarea>
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700">Foto</label>
                            {deco.photo ? (
                                <div className="mt-1 flex items-center space-x-4">
                                    <img src={deco.photo} alt="Voorbeeld" className="h-24 w-auto rounded-md object-cover border" />
                                    <button
                                        onClick={() => handleChange(index, 'photo', undefined)}
                                        className="flex items-center space-x-2 px-3 py-1.5 bg-red-100 text-red-700 font-semibold rounded-md hover:bg-red-200 transition-colors text-sm"
                                    >
                                        <TrashIcon />
                                        <span>Verwijderen</span>
                                    </button>
                                </div>
                            ) : (
                                <div className="mt-1">
                                    <label htmlFor={`deco-photo-${deco.id}`} className="cursor-pointer inline-flex items-center space-x-2 px-4 py-2 bg-white text-gray-700 font-semibold rounded-md border border-gray-300 hover:bg-gray-50 transition-colors">
                                        <CameraIcon />
                                        <span>Foto Toevoegen</span>
                                    </label>
                                    <input
                                        id={`deco-photo-${deco.id}`}
                                        type="file"
                                        accept="image/*"
                                        capture="environment"
                                        className="hidden"
                                        onChange={(e) => handlePhotoChange(e, index)}
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            ))}
            <div className="flex justify-start mt-4">
                <button onClick={addDecoration} className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-brand-dark font-semibold rounded-md hover:bg-gray-200 transition-colors">
                    <PlusIcon />
                    <span>Raamdecoratie Toevoegen</span>
                </button>
            </div>
        </div>
    );
};

export default WindowDecorationForm;