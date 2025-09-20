export interface Customer {
    id: string;
    name: string;
    postcode: string;
    houseNumber: string;
    street: string;
    city: string;
    phone: string;
    email: string;
    reference: string;
    date: string;
    time: string;
}

export interface CurtainMeasurement {
    id: number;
    room: string;
    colorNumber: string;
    // Stofsoort
    type: 'Overgordijn' | 'Inbetween' | 'Vitrage';
    pleatType: string; // Plooi-type, als tekstinvoer voor flexibiliteit
    runnerDistance?: string;
    headerSize: string; // Hoofdje in cm
    // Montage
    mounting: 'Wand' | 'Plafond';
    hemType: 'Enkel' | 'Dubbel' | 'Loodveter'; // Zoom
    unit: 'Stel' | 'Stuks'; // Stel / stuks
    width: string;
    height: string;
    notes: string;
    photo?: string;
}

export interface FloorMeasurement {
    id: number;
    room: string;
    colorNumber: string;
    type: 'Laminaat' | 'PVC' | 'Tapijt' | 'Vloerbedekking' | 'Vinyl' | 'Marmoleum' | 'Hout';
    length: string;
    width: string;
    skirting: boolean; // Plinten
    underlayment: 'Beton' | 'Hout' | 'Anders'; // Soort ondervloer
    notes: string;
    photo?: string;
}

export interface WindowDecorationMeasurement {
    id: number;
    room: string;
    colorNumber: string;
    type: 'Rolgordijn' | 'Jaloezie' | 'Plissé' | 'Duette' | 'Vouwgordijn' | 'Shutters' | 'Geweven Hout' | 'Fractions';
    mounting: 'In de dag' | 'Op de dag';
    width: string;
    height: string;
    mountingHeight: string;
    controlSide: 'Links' | 'Rechts';
    controlHeight?: string;
    notes: string;
    photo?: string;
}

export interface Project {
    id: string;
    customer: Customer;
    curtains: CurtainMeasurement[];
    floors: FloorMeasurement[];
    windowDecorations: WindowDecorationMeasurement[];
}

export interface Appointment {
    id: string;
    projectId: string;
    date: string; // YYYY-MM-DD
    time: string; // HH:mm
    customerName: string;
    customerAddress: string;
}

export interface Settings {
    notificationsEnabled: boolean;
    preparationTime: number; // in minutes
}