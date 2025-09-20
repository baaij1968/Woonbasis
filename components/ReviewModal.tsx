import React from 'react';
import { Customer, CurtainMeasurement, FloorMeasurement, WindowDecorationMeasurement } from '../types';
import ClipboardIcon from './icons/ClipboardIcon';
import PrintIcon from './icons/PrintIcon';

interface ReviewModalProps {
    customer: Customer;
    curtains: CurtainMeasurement[];
    floors: FloorMeasurement[];
    windowDecorations: WindowDecorationMeasurement[];
    onClose: () => void;
}

const ReviewModal: React.FC<ReviewModalProps> = ({ customer, curtains, floors, windowDecorations, onClose }) => {
    
    const copyToClipboard = () => {
        const data = {
            klant: customer,
            gordijnen: curtains,
            vloeren: floors,
            raamdecoratie: windowDecorations
        };
        navigator.clipboard.writeText(JSON.stringify(data, null, 2));
        alert('Gegevens gekopieerd naar klembord!');
    };

    const handlePrint = () => {
        window.print();
    };
    
    const calculateArea = (length: string, width: string): string => {
        const l = parseFloat(length);
        const w = parseFloat(width);
        if (!isNaN(l) && !isNaN(w)) {
            return (l * w).toFixed(2) + ' m²';
        }
        return '-';
    };

    const calculatePerimeter = (length: string, width: string): string => {
        const l = parseFloat(length);
        const w = parseFloat(width);
        if (!isNaN(l) && !isNaN(w)) {
            return ((l + w) * 2).toFixed(2) + ' m';
        }
        return '-';
    };

    const formatDateForDisplay = (dateStr: string) => {
        if (!dateStr || !/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return '-';
        const date = new Date(dateStr + 'T00:00:00'); // Neutralize timezone
        return date.toLocaleDateString('nl-NL', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    };
    
    const fullAddress = customer.street ? `${customer.street} ${customer.houseNumber}, ${customer.postcode} ${customer.city}` : '-';

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50 print:bg-white print:p-0">
            <div className="bg-white rounded-lg shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col print:shadow-none print:max-h-full print:rounded-none">
                <div className="p-6 border-b flex justify-between items-center print:hidden">
                    <h2 className="text-2xl font-bold text-brand-dark">Overzicht Opmeting</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-3xl leading-none">&times;</button>
                </div>

                <div id="print-content" className="overflow-y-auto p-6 space-y-8">
                    {/* Customer Info */}
                    <div className="border-b pb-4">
                        <h3 className="text-xl font-semibold text-brand-dark mb-3">Klantgegevens</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2 text-sm">
                            <p><strong>Naam:</strong> {customer.name}</p>
                            <p><strong>Adres:</strong> {fullAddress}</p>
                            <p><strong>Telefoon:</strong> {customer.phone || '-'}</p>
                            <p><strong>Email:</strong> {customer.email || '-'}</p>
                            <p><strong>Referentie:</strong> {customer.reference || '-'}</p>
                            <p><strong>Meetdatum:</strong> {formatDateForDisplay(customer.date)}</p>
                        </div>
                    </div>

                    {/* Curtains */}
                    <div>
                        <h3 className="text-xl font-semibold text-brand-dark mb-3">Gordijnmetingen</h3>
                        {curtains.filter(c => c.room || c.width || c.height).length > 0 ? (
                        <div className="space-y-4">
                            {curtains.filter(c => c.room || c.width || c.height).map((curtain, index) => (
                                <div key={index} className="p-3 border rounded-md bg-gray-50 text-sm break-inside-avoid">
                                    <p className="font-bold text-base mb-2">Meting #{index + 1}: {curtain.room || 'N.v.t.'}{curtain.colorNumber && <span className="font-normal text-gray-600"> (Leverancier/kleur: {curtain.colorNumber})</span>}</p>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-1">
                                        <p><strong>Stofsoort:</strong> {curtain.type}</p>
                                        <p><strong>Plooi:</strong> {curtain.pleatType}</p>
                                        {curtain.pleatType === 'Wave plooi' && curtain.runnerDistance && (
                                            <p><strong>Runnerafstand:</strong> {curtain.runnerDistance} cm</p>
                                        )}
                                        <p><strong>Hoofdje:</strong> {curtain.headerSize ? `${curtain.headerSize} cm` : '-'}</p>
                                        <p><strong>Montage:</strong> {curtain.mounting}</p>
                                        <p><strong>Zoom:</strong> {curtain.hemType}</p>
                                        <p><strong>Aantal:</strong> {curtain.unit}</p>
                                        <p><strong>Breedte:</strong> {curtain.width ? `${curtain.width} cm` : '-'}</p>
                                        <p><strong>Hoogte:</strong> {curtain.height ? `${curtain.height} cm` : '-'}</p>
                                    </div>
                                    {curtain.notes && <p className="mt-2 col-span-full"><strong>Opmerkingen:</strong> {curtain.notes}</p>}
                                    {curtain.photo && (
                                        <div className="mt-3 col-span-full">
                                            <p className="font-semibold">Foto:</p>
                                            <img src={curtain.photo} alt={`Foto voor ${curtain.room}`} className="mt-1 max-h-48 w-auto rounded-md border"/>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                        ) : (<p className="text-sm text-gray-500">Geen gordijnmetingen ingevoerd.</p>)}
                    </div>

                    {/* Floors */}
                    <div>
                        <h3 className="text-xl font-semibold text-brand-dark mb-3">Vloermetingen</h3>
                        {floors.filter(f => f.room || f.length || f.width).length > 0 ? (
                        <div className="space-y-4">
                            {floors.filter(f => f.room || f.length || f.width).map((floor, index) => (
                                <div key={index} className="p-3 border rounded-md bg-gray-50 text-sm break-inside-avoid">
                                    <p className="font-bold text-base mb-2">Meting #{index + 1}: {floor.room || 'N.v.t.'}{floor.colorNumber && <span className="font-normal text-gray-600"> (Leverancier/kleur: {floor.colorNumber})</span>}</p>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-1">
                                        <p className="sm:col-span-2 md:col-span-3"><strong>Type vloer:</strong> {floor.type}</p>
                                        <p><strong>Afmeting (L×B):</strong> {floor.length && floor.width ? `${floor.length}m × ${floor.width}m` : '-'}</p>
                                        <p><strong>Oppervlakte:</strong> {calculateArea(floor.length, floor.width)}</p>
                                        <p><strong>Omtrek:</strong> {calculatePerimeter(floor.length, floor.width)}</p>
                                        <p><strong>Ondervloer:</strong> {floor.underlayment}</p>
                                        <p><strong>Plinten:</strong> {floor.skirting ? 'Ja' : 'Nee'}</p>
                                    </div>
                                    {floor.notes && <p className="mt-2 col-span-full"><strong>Opmerkingen:</strong> {floor.notes}</p>}
                                    {floor.photo && (
                                        <div className="mt-3 col-span-full">
                                            <p className="font-semibold">Foto:</p>
                                            <img src={floor.photo} alt={`Foto voor ${floor.room}`} className="mt-1 max-h-48 w-auto rounded-md border"/>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                        ) : (<p className="text-sm text-gray-500">Geen vloermetingen ingevoerd.</p>)}
                    </div>
                    
                    {/* Window Decorations */}
                    <div>
                        <h3 className="text-xl font-semibold text-brand-dark mb-3">Raamdecoratie</h3>
                        {windowDecorations.filter(d => d.room || d.width || d.height).length > 0 ? (
                        <div className="space-y-4">
                            {windowDecorations.filter(d => d.room || d.width || d.height).map((deco, index) => (
                                <div key={index} className="p-3 border rounded-md bg-gray-50 text-sm break-inside-avoid">
                                    <p className="font-bold text-base mb-2">Meting #{index + 1}: {deco.room || 'N.v.t.'}{deco.colorNumber && <span className="font-normal text-gray-600"> (Leverancier/kleur: {deco.colorNumber})</span>}</p>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-1">
                                        <p><strong>Type:</strong> {deco.type}</p>
                                        <p><strong>Montage:</strong> {deco.mounting}</p>
                                        <p><strong>Afmeting (B×H):</strong> {deco.width && deco.height ? `${deco.width}cm × ${deco.height}cm` : '-'}</p>
                                        <p><strong>Montagehoogte:</strong> {deco.mountingHeight ? `${deco.mountingHeight} cm` : '-'}</p>
                                        <p><strong>Bediening:</strong> {deco.controlSide}</p>
                                        {deco.type === 'Fractions' && deco.controlHeight && (
                                            <p><strong>Bedieningshoogte:</strong> {deco.controlHeight} cm</p>
                                        )}
                                    </div>
                                    {deco.notes && <p className="mt-2 col-span-full"><strong>Opmerkingen:</strong> {deco.notes}</p>}
                                    {deco.photo && (
                                        <div className="mt-3 col-span-full">
                                            <p className="font-semibold">Foto:</p>
                                            <img src={deco.photo} alt={`Foto voor ${deco.room}`} className="mt-1 max-h-48 w-auto rounded-md border"/>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                        ) : (<p className="text-sm text-gray-500">Geen raamdecoratie ingevoerd.</p>)}
                    </div>
                </div>

                <div className="p-4 bg-gray-50 border-t flex justify-end space-x-3 print:hidden">
                    <button onClick={copyToClipboard} className="flex items-center space-x-2 px-4 py-2 bg-gray-200 text-gray-800 font-semibold rounded-md hover:bg-gray-300 transition-colors">
                        <ClipboardIcon />
                        <span>Kopieer JSON</span>
                    </button>
                    <button onClick={handlePrint} className="flex items-center space-x-2 px-4 py-2 bg-brand-DEFAULT text-white font-semibold rounded-md hover:bg-brand-dark transition-colors">
                        <PrintIcon />
                        <span>Afdrukken</span>
                    </button>
                </div>
            </div>
             <style>
                {`
                @media print {
                    body > *:not(.fixed) {
                        display: none;
                    }
                    .fixed {
                        position: static;
                    }
                    #print-content {
                        overflow: visible;
                    }
                    .break-inside-avoid {
                        break-inside: avoid;
                    }
                }
                `}
            </style>
        </div>
    );
};

export default ReviewModal;