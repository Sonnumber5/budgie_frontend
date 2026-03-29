import { useState, useRef, useEffect } from 'react';

interface DropdownMenuProps {
    onEdit: () => void;
    onDelete?: () => void;
    onEditBalance?: () => void;
    onArchive?: () => void;
}

export const DropdownMenu = ({ onEdit, onDelete, onEditBalance, onArchive }: DropdownMenuProps) => {
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
                    <button type="button" onClick={() => { onEdit(); setIsOpen(false); }}>Edit</button>
                    {onDelete && <button type="button" onClick={() => { onDelete(); setIsOpen(false); }}>Delete</button>}
                    {onEditBalance && <button type="button" onClick={() => { onEditBalance(); setIsOpen(false); }}>Edit Balance</button>}
                    {onArchive && <button type="button" onClick={() => { onArchive(); setIsOpen(false); }}>Archive</button>}
                </div>
            )}
        </div>
    );
}