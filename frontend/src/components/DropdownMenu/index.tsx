import { useState, useRef, useEffect } from "react";
import "./styles.css";

interface DropdownMenuProps {
    onEdit: () => void;
    onInactivate: () => void;
    onDelete: () => void;
}

export default function DropdownMenu({ onEdit, onInactivate, onDelete }: DropdownMenuProps) {
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    const handleClickOutside = (event: MouseEvent) => {
        if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
            setIsOpen(false);
        }
    };

    const handleAction = (action: () => void) => {
        action();
        setIsOpen(false);
    };

    useEffect(() => {
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <div className="dropdown" ref={menuRef}>
            <button className="dropdown-toggle" onClick={toggleMenu}>⋮</button>
            {isOpen && (
                <div className="dropdown-menu">
                    <button className="dropdown-item" onClick={() => handleAction(onEdit)}>Editar</button>
                    <button className="dropdown-item" onClick={() => handleAction(onInactivate)}>Inativar</button>
                    <button className="dropdown-item" onClick={() => handleAction(onDelete)}>Excluir</button>
                </div>
            )}
        </div>
    );
}