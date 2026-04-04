import { useState, useRef, useEffect } from 'react';

interface DropdownMenuProps {
    onEdit?: () => void;
    onDelete?: () => void;
    onEditBalance?: () => void;
    onArchive?: () => void;
    onLogout?: () => void;
    onViewDescription?: () => void;
}

export const DropdownMenu = ({ onEdit, onDelete, onEditBalance, onArchive, onLogout, onViewDescription }: DropdownMenuProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div ref={ref} style={{ position: 'relative' }}>
            <button className='kebab' type="button" onClick={() => setIsOpen(prev => !prev)}>⋮</button>
            {isOpen && (
                <div className='kebab-menu'>
                    {onEdit && <button type="button" onClick={() => { onEdit(); setIsOpen(false); }}>Edit</button>}
                    {onDelete && <button type="button" onClick={() => { onDelete(); setIsOpen(false); }}>Delete</button>}
                    {onEditBalance && <button type="button" onClick={() => { onEditBalance(); setIsOpen(false); }}>Edit Balance</button>}
                    {onArchive && <button type="button" onClick={() => { onArchive(); setIsOpen(false); }}>Archive</button>}
                    {onViewDescription && <button type="button" onClick={() => { onViewDescription(); setIsOpen(false); }}>View Notes</button>}
                    {onLogout && 
                    <div>
                        <button type="button" onClick={() => { onLogout(); setIsOpen(false); }}>Logout</button>
                        <button type="button" onClick={() => {}}>Archived Funds</button>
                    </div>
                        
                    }
                </div>
            )}
        </div>
    );
}