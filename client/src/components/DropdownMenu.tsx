import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import { useSavingsFundContext } from '../context/SavingsFundContext';

interface DropdownMenuProps {
    onEdit?: () => void;
    onDelete?: () => void;
    onEditBalance?: () => void;
    onArchive?: () => void;
    onUnArchive?: () => void;
    onLogout?: () => void;
    onViewDescription?: () => void;
}

// Renders a kebab-menu button that opens a portal-based dropdown with optional action buttons.
export const DropdownMenu = ({ onEdit, onDelete, onEditBalance, onArchive, onLogout, onViewDescription, onUnArchive }: DropdownMenuProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const [menuPos, setMenuPos] = useState({ top: 0, left: 0 });
    const { fetchArchivedSavingsFunds } = useSavingsFundContext();
    const ref = useRef<HTMLDivElement>(null);
    const btnRef = useRef<HTMLButtonElement>(null);
    const menuRef = useRef<HTMLDivElement>(null);

    const navigate = useNavigate();


    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (
                ref.current && !ref.current.contains(e.target as Node) &&
                menuRef.current && !menuRef.current.contains(e.target as Node)
            ) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Calculates the button's position and toggles the dropdown open or closed.
    const handleOpen = () => {
        if (btnRef.current) {
            const rect = btnRef.current.getBoundingClientRect();
            const menuHeight = 80; // approximate menu height
            const spaceBelow = window.innerHeight - rect.bottom;
            
            if (spaceBelow < menuHeight) {
                // not enough space below, open upward
                setMenuPos({ top: rect.top - menuHeight, left: rect.right });
            } else {
                // enough space below, open downward
                setMenuPos({ top: rect.bottom, left: rect.right });
            }
        }
        setIsOpen(prev => !prev);
    };

    return (
        <div ref={ref} style={{ position: 'relative' }}>
            <button ref={btnRef} className='kebab' type="button" onClick={handleOpen}>⋮</button>
            {isOpen && createPortal(
                <div ref={menuRef} className='kebab-menu' style={{ top: menuPos.top, left: menuPos.left }}>
                    {onEdit && <button type="button" onClick={() => { onEdit(); setIsOpen(false); }}>Edit</button>}
                    {onDelete && <button type="button" onClick={() => { onDelete(); setIsOpen(false); }}>Delete</button>}
                    {onEditBalance && <button type="button" onClick={() => { onEditBalance(); setIsOpen(false); }}>Edit Balance</button>}
                    {onArchive && <button type="button" onClick={() => { onArchive(); setIsOpen(false); }}>Archive</button>}
                    {onUnArchive && <button type="button" onClick={() => { onUnArchive(); setIsOpen(false); }}>Unarchive</button>}
                    {onViewDescription && <button type="button" onClick={() => { onViewDescription(); setIsOpen(false); }}>View Notes</button>}
                    {onLogout &&
                    <div>
                        <button type="button" onClick={() => { onLogout(); setIsOpen(false); }}>Logout</button>
                        <button type="button" onClick={() => { navigate('/archived-savings-funds'); fetchArchivedSavingsFunds() }}>Archived Funds</button>
                    </div>

                    }
                </div>,
                document.body
            )}
        </div>
    );
}
