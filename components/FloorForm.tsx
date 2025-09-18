import React from 'react';
import { FloorMeasurement } from '../types';
import PlusIcon from './icons/PlusIcon';
import TrashIcon from './icons/TrashIcon';
import CameraIcon from './icons/CameraIcon';

interface FloorFormProps {
    floors: FloorMeasurement[];
    setFloors: React.Dispatch<React.SetStateAction<FloorMeasurement[]>>;
}

const FloorForm: React.FC<FloorFormProps> = ({ floors, setFloors }) => {
    
    const handleChange = <K extends keyof FloorMeasurement,>(index: number, field: K, value: FloorMeasurement[K]) => {
        const newFloors = [...floors];
        newFloors[index] = { ...newFloors[index], [field]: value };
        setFloors(newFloors);
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

    const addFloor = () => {
        setFloors([...floors, { id: Date.now(), room: '', colorNumber: '', type: 'Laminaat', length: '', width: '', skirting: false, underlayment: 'Beton', notes: '' }]);
    };

    const removeFloor = (id: number) => {
        if (floors.length > 1) {
            setFloors(floors.filter(f => f.id !== id));
        }
    };

    const calculateArea = (length: string, width: string): string | null => {
        const l = parseFloat(length);
        const w = parseFloat(width);
        if (!isNaN(l) && !isNaN(w) && l > 0 && w > 0) {
            return (l * w).toFixed(2);
        }
        return null;
    };

    const calculatePerimeter = (length: string, width: string): string | null => {
        const l = parseFloat(length);
        const w = parseFloat(width);
        if (!isNaN(l) && !isNaN(w) && l > 0 && w > 0) {
            return ((l + w) * 2).toFixed(2);
        }
        return null;
    };

    return (
        <div className="space-y-8">
            {floors.map((floor, index) => {
                const area = calculateArea(floor.length, floor.width);
                const perimeter = calculatePerimeter(floor.length, floor.width);
                return (
                    <div key={floor.id} className="p-4 border border-gray-200 rounded-lg relative">
                        {floors.length > 1 && (
                            <button onClick={() => removeFloor(floor.id)} className="absolute top-2 right-2 text-gray-400 hover:text-red-600 transition-colors">
                                <TrashIcon />
                            </button>
                        )}
                        <h3 className="font-semibold text-lg mb-4 text-brand-dark">Meting #{index + 1}</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="md:col-span-2">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Ruimte</label>
                                        <input type="text" value={floor.room} onChange={(e) => handleChange(index, 'room', e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-DEFAULT focus:ring-brand-DEFAULT sm:text-sm" placeholder="Slaapkamer"/>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Kleurnummer</label>
                                        <input type="text" value={floor.colorNumber} onChange={(e) => handleChange(index, 'colorNumber', e.target.value)} maxLength={8} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-DEFAULT focus:ring-brand-DEFAULT sm:text-sm" placeholder="Bijv. 1234AB"/>
                                    </div>
                                </div>
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700">Type Vloer</label>
                                <select value={floor.type} onChange={(e) => handleChange(index, 'type', e.target.value as FloorMeasurement['type'])} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-DEFAULT focus:ring-brand-DEFAULT sm:text-sm">
                                    <option>Laminaat</option>
                                    <option>PVC</option>
                                    <option>Tapijt</option>
                                    <option>Vloerbedekking</option>
                                    <option>Vinyl</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Lengte (m)</label>
                                <input type="number" value={floor.length} onChange={(e) => handleChange(index, 'length', e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-DEFAULT focus:ring-brand-DEFAULT sm:text-sm" placeholder="4.5"/>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Breedte (m)</label>
                                <input type="number" value={floor.width} onChange={(e) => handleChange(index, 'width', e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-DEFAULT focus:ring-brand-DEFAULT sm:text-sm" placeholder="3.2"/>
                            </div>

                            {(area || perimeter) && (
                                <div className="md:col-span-2 -mt-2">
                                    <div className="bg-brand-light p-2 rounded-md flex flex-wrap gap-x-4 gap-y-1">
                                        {area && (
                                            <p className="text-sm font-medium text-brand-dark">
                                                Oppervlakte: <span className="font-bold">{area} m²</span>
                                            </p>
                                        )}
                                        {perimeter && (
                                            <p className="text-sm font-medium text-brand-dark">
                                                Omtrek: <span className="font-bold">{perimeter} m</span>
                                            </p>
                                        )}
                                    </div>
                                </div>
                            )}

                            <div className="md:col-span-2 grid grid-cols-2 gap-4 items-center">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Ondervloer</label>
                                    <select value={floor.underlayment} onChange={(e) => handleChange(index, 'underlayment', e.target.value as FloorMeasurement['underlayment'])} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-DEFAULT focus:ring-brand-DEFAULT sm:text-sm">
                                        <option>Beton</option>
                                        <option>Hout</option>
                                        <option>Anders</option>
                                    </select>
                                </div>
                                <div className="relative flex items-end h-full pb-1">
                                    <div className="flex h-5 items-center">
                                        <input id={`skirting-${floor.id}`} name="skirting" type="checkbox" checked={floor.skirting} onChange={(e) => handleChange(index, 'skirting', e.target.checked)} className="h-4 w-4 rounded border-gray-300 text-brand-DEFAULT focus:ring-brand-DEFAULT"/>
                                    </div>
                                    <div className="ml-3 text-sm">
                                        <label htmlFor={`skirting-${floor.id}`} className="font-medium text-gray-700">Plinten</label>
                                    </div>
                                </div>
                            </div>

                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700">Opmerkingen / Schets</label>
                                <textarea value={floor.notes} onChange={(e) => handleChange(index, 'notes', e.target.value)} rows={3} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-DEFAULT focus:ring-brand-DEFAULT sm:text-sm" placeholder="Bijv. L-vormige kamer, afmetingen deel 1: 2.0x3.2, deel 2: 2.5x1.8"></textarea>
                            </div>
                             <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700">Foto</label>
                                {floor.photo ? (
                                    <div className="mt-1 flex items-center space-x-4">
                                        <img src={floor.photo} alt="Voorbeeld" className="h-24 w-auto rounded-md object-cover border"/>
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
                                        <label htmlFor={`floor-photo-${floor.id}`} className="cursor-pointer inline-flex items-center space-x-2 px-4 py-2 bg-white text-gray-700 font-semibold rounded-md border border-gray-300 hover:bg-gray-50 transition-colors">
                                            <CameraIcon />
                                            <span>Foto Toevoegen</span>
                                        </label>
                                        <input 
                                            id={`floor-photo-${floor.id}`}
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
                )
            })}
             <div className="flex justify-start mt-4">
                <button onClick={addFloor} className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-brand-dark font-semibold rounded-md hover:bg-gray-200 transition-colors">
                    <PlusIcon />
                    <span>Vloermeting Toevoegen</span>
                </button>
            </div>
        </div>
    );
};

export default FloorForm;