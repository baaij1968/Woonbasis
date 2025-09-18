import React from 'react';
import { CurtainMeasurement } from '../types';
import PlusIcon from './icons/PlusIcon';
import TrashIcon from './icons/TrashIcon';
import CameraIcon from './icons/CameraIcon';

interface CurtainFormProps {
    curtains: CurtainMeasurement[];
    setCurtains: React.Dispatch<React.SetStateAction<CurtainMeasurement[]>>;
}

const CurtainForm: React.FC<CurtainFormProps> = ({ curtains, setCurtains }) => {
    
    const handleChange = <K extends keyof CurtainMeasurement,>(index: number, field: K, value: CurtainMeasurement[K]) => {
        const newCurtains = [...curtains];
        newCurtains[index] = { ...newCurtains[index], [field]: value };
        setCurtains(newCurtains);
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

    const addCurtain = () => {
        setCurtains([...curtains, { 
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
            notes: '' 
        }]);
    };

    const removeCurtain = (id: number) => {
        if (curtains.length > 1) {
            setCurtains(curtains.filter(c => c.id !== id));
        }
    };

    return (
        <div className="space-y-8">
            {curtains.map((curtain, index) => (
                <div key={curtain.id} className="p-4 border border-gray-200 rounded-lg relative">
                     {curtains.length > 1 && (
                        <button onClick={() => removeCurtain(curtain.id)} className="absolute top-2 right-2 text-gray-400 hover:text-red-600 transition-colors">
                            <TrashIcon />
                        </button>
                     )}
                    <h3 className="font-semibold text-lg mb-4 text-brand-dark">Meting #{index + 1}</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="md:col-span-3">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Ruimte</label>
                                    <input type="text" value={curtain.room} onChange={(e) => handleChange(index, 'room', e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-DEFAULT focus:ring-brand-DEFAULT sm:text-sm" placeholder="Woonkamer"/>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Kleurnummer</label>
                                    <input type="text" value={curtain.colorNumber} onChange={(e) => handleChange(index, 'colorNumber', e.target.value)} maxLength={8} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-DEFAULT focus:ring-brand-DEFAULT sm:text-sm" placeholder="Bijv. 1234AB"/>
                                </div>
                            </div>
                        </div>
                         <div>
                            <label className="block text-sm font-medium text-gray-700">Stofsoort</label>
                            <select value={curtain.type} onChange={(e) => handleChange(index, 'type', e.target.value as CurtainMeasurement['type'])} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-DEFAULT focus:ring-brand-DEFAULT sm:text-sm">
                                <option>Overgordijn</option>
                                <option>Inbetween</option>
                                <option>Vitrage</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Plooi-type</label>
                            <select value={curtain.pleatType} onChange={(e) => handleChange(index, 'pleatType', e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-DEFAULT focus:ring-brand-DEFAULT sm:text-sm">
                                <option>Enkele plooi</option>
                                <option>Dubbele plooi</option>
                                <option>Wave plooi</option>
                                <option>Retourplooi</option>
                                <option>Platte plooi</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Hoofdje (cm)</label>
                             <input type="number" value={curtain.headerSize} onChange={(e) => handleChange(index, 'headerSize', e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-DEFAULT focus:ring-brand-DEFAULT sm:text-sm" placeholder="1.5"/>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Montage</label>
                            <select value={curtain.mounting} onChange={(e) => handleChange(index, 'mounting', e.target.value as CurtainMeasurement['mounting'])} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-DEFAULT focus:ring-brand-DEFAULT sm:text-sm">
                                <option>Wand</option>
                                <option>Plafond</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Zoom</label>
                            <select value={curtain.hemType} onChange={(e) => handleChange(index, 'hemType', e.target.value as CurtainMeasurement['hemType'])} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-DEFAULT focus:ring-brand-DEFAULT sm:text-sm">
                                <option>Enkel</option>
                                <option>Dubbel</option>
                                <option>Loodveter</option>
                            </select>
                        </div>
                         <div>
                            <label className="block text-sm font-medium text-gray-700">Aantal</label>
                            <select value={curtain.unit} onChange={(e) => handleChange(index, 'unit', e.target.value as CurtainMeasurement['unit'])} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-DEFAULT focus:ring-brand-DEFAULT sm:text-sm">
                                <option>Stel</option>
                                <option>Stuks</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Breedte (cm)</label>
                            <input type="number" value={curtain.width} onChange={(e) => handleChange(index, 'width', e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-DEFAULT focus:ring-brand-DEFAULT sm:text-sm" placeholder="250.5"/>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Hoogte (cm)</label>
                            <input type="number" value={curtain.height} onChange={(e) => handleChange(index, 'height', e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-DEFAULT focus:ring-brand-DEFAULT sm:text-sm" placeholder="260"/>
                        </div>
                        <div className="md:col-span-3">
                            <label className="block text-sm font-medium text-gray-700">Opmerkingen</label>
                            <textarea value={curtain.notes} onChange={(e) => handleChange(index, 'notes', e.target.value)} rows={3} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-DEFAULT focus:ring-brand-DEFAULT sm:text-sm" placeholder="Bijv. verwarmingsbuis links"></textarea>
                        </div>
                        <div className="md:col-span-3">
                            <label className="block text-sm font-medium text-gray-700">Foto</label>
                            {curtain.photo ? (
                                <div className="mt-1 flex items-center space-x-4">
                                    <img src={curtain.photo} alt="Voorbeeld" className="h-24 w-auto rounded-md object-cover border"/>
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
                                    <label htmlFor={`curtain-photo-${curtain.id}`} className="cursor-pointer inline-flex items-center space-x-2 px-4 py-2 bg-white text-gray-700 font-semibold rounded-md border border-gray-300 hover:bg-gray-50 transition-colors">
                                        <CameraIcon />
                                        <span>Foto Toevoegen</span>
                                    </label>
                                    <input 
                                        id={`curtain-photo-${curtain.id}`}
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
                <button onClick={addCurtain} className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-brand-dark font-semibold rounded-md hover:bg-gray-200 transition-colors">
                    <PlusIcon />
                    <span>Gordijnmeting Toevoegen</span>
                </button>
            </div>
        </div>
    );
};

export default CurtainForm;