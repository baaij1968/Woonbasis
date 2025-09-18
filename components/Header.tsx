
import React, { useState, useEffect, useRef } from 'react';
import TrashIcon from './icons/TrashIcon';
import UploadIcon from './icons/UploadIcon';
import FormIcon from './icons/FormIcon';
import CalendarIcon from './icons/CalendarIcon';
import SettingsIcon from './icons/SettingsIcon';
import UsersIcon from './icons/UsersIcon';

type View = 'form' | 'calendar' | 'clients';

interface HeaderProps {
    currentView: View;
    setView: (view: View) => void;
    onOpenSettings: () => void;
}


const Header: React.FC<HeaderProps> = ({ currentView, setView, onOpenSettings }) => {
    const [customLogo, setCustomLogo] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        const savedLogo = localStorage.getItem('woonbasis_logo');
        if (savedLogo) {
            setCustomLogo(savedLogo);
        }
    }, []);

    const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const reader = new FileReader();
            reader.onload = (event) => {
                if (event.target?.result) {
                    const logoUrl = event.target.result as string;
                    setCustomLogo(logoUrl);
                    localStorage.setItem('woonbasis_logo', logoUrl);
                }
            };
            reader.readAsDataURL(e.target.files[0]);
        }
    };

    const handleRemoveLogo = (e: React.MouseEvent) => {
        e.stopPropagation();
        setCustomLogo(null);
        localStorage.removeItem('woonbasis_logo');
        if(fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const triggerFileUpload = () => {
        fileInputRef.current?.click();
    };

    const NavButton: React.FC<{
        view: View,
        label: string,
        icon: React.ReactNode
    }> = ({ view, label, icon }) => (
        <button
            onClick={() => setView(view)}
            className={`flex items-center space-x-2 px-3 py-2 rounded-md transition-colors duration-200 text-sm font-semibold ${
                currentView === view
                    ? 'bg-white text-brand-dark shadow-sm'
                    : 'bg-white/20 text-white hover:bg-white/30'
            }`}
        >
            {icon}
            <span className="hidden sm:inline">{label}</span>
        </button>
    );

    return (
        <header className="bg-brand-dark shadow-md">
            <div className="container mx-auto px-4 sm:px-6 md:px-8 py-3 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                    <div 
                        className="relative group w-10 h-10 bg-white/20 rounded-md flex items-center justify-center p-1.5 cursor-pointer"
                        onClick={triggerFileUpload}
                        title="Klik om logo te wijzigen"
                    >
                        {customLogo ? (
                            <img src={customLogo} alt="Woonbasis Logo" className="w-full h-full object-contain rounded-sm" />
                        ) : (
                            <svg viewBox="0 0 24 24" fill="currentColor" className="text-white">
                                <path d="M12 2.09961L1 12H4V22H10V16H14V22H20V12H23L12 2.09961Z"></path>
                            </svg>
                        )}
                        <div className="absolute inset-0 bg-black bg-opacity-60 rounded-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            {customLogo ? (
                                <button onClick={handleRemoveLogo} className="text-white hover:text-red-400 p-1" title="Logo verwijderen">
                                    <TrashIcon />
                                </button>
                            ) : (
                                 <div className="text-white">
                                    <UploadIcon />
                                 </div>
                            )}
                           
                        </div>
                         <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/png, image/jpeg, image/svg+xml"
                            className="hidden"
                            onChange={handleLogoUpload}
                        />
                    </div>
                    <h1 className="text-xl md:text-2xl font-bold text-white tracking-wide hidden sm:block">
                        Woonbasis Opmeet App
                    </h1>
                </div>

                <div className="flex items-center space-x-2">
                    <NavButton view="form" label="Formulier" icon={<FormIcon />} />
                    <NavButton view="calendar" label="Agenda" icon={<CalendarIcon />} />
                    <NavButton view="clients" label="Klanten" icon={<UsersIcon />} />
                     <button
                        onClick={onOpenSettings}
                        className="p-2 rounded-md bg-white/20 text-white hover:bg-white/30 transition-colors"
                        aria-label="Instellingen"
                        title="Instellingen"
                    >
                        <SettingsIcon />
                    </button>
                </div>
            </div>
        </header>
    );
};

export default Header;
