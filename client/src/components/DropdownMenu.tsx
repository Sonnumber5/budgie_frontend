import { useState, useRef, useEffect } from 'react';

interface DropdownMenuProps {
    onEdit: () => void;
    onDelete: () => void;
}

export const DropdownMenu = ({ onEdit, onDelete }: DropdownMenuProps) => {
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
            <button type="button" onClick={() => setIsOpen(prev => !prev)}>⋮</button>
            {isOpen && (
                <div style={{
                    position: 'absolute',
                    right: 0,
                    background: 'white',
                    border: '1px solid #ccc',
                    borderRadius: '4px',
                    zIndex: 100,
                    minWidth: '100px',
                    display: 'flex',
                    flexDirection: 'column'
                }}>
                    <button type="button" onClick={() => { onEdit(); setIsOpen(false); }}>Edit</button>
                    <button type="button" onClick={() => { onDelete(); setIsOpen(false); }}>Delete</button>
                </div>
            )}
        </div>
    );
}