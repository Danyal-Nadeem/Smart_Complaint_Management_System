import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Check } from 'lucide-react';
import { clsx } from 'clsx';

const CustomDropdown = ({
    options,
    value,
    onChange,
    placeholder = 'Select option',
    className,
    labelClassName
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    // Close when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const selectedOption = options.find(opt =>
        (typeof opt === 'string' ? opt : opt.value) === value
    );

    const getLabel = (opt) => typeof opt === 'string' ? opt : opt.label;
    const getValue = (opt) => typeof opt === 'string' ? opt : opt.value;

    return (
        <div className="relative w-full" ref={dropdownRef}>
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className={clsx(
                    "w-full flex items-center justify-between px-5 py-3 rounded-xl border bg-white transition-all text-sm font-bold group",
                    isOpen ? "border-indigo-600 ring-4 ring-indigo-50 shadow-sm" : "border-slate-100 hover:border-slate-300",
                    className
                )}
            >
                <span className={clsx(
                    "truncate",
                    selectedOption ? "text-slate-900" : "text-slate-400"
                )}>
                    {selectedOption ? getLabel(selectedOption) : placeholder}
                </span>
                <ChevronDown
                    size={16}
                    className={clsx(
                        "text-slate-400 group-hover:text-indigo-600 transition-all",
                        isOpen && "rotate-180 text-indigo-600"
                    )}
                />
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.15, ease: "easeOut" }}
                        className="absolute z-[100] w-full mt-2 bg-white rounded-2xl border border-slate-100 shadow-2xl shadow-slate-200/50 p-2 max-h-60 overflow-y-auto"
                    >
                        {options.map((opt, idx) => {
                            const optValue = getValue(opt);
                            const optLabel = getLabel(opt);
                            const isSelected = optValue === value;

                            return (
                                <button
                                    key={idx}
                                    type="button"
                                    onClick={() => {
                                        onChange(optValue);
                                        setIsOpen(false);
                                    }}
                                    className={clsx(
                                        "w-full flex items-center justify-between px-4 py-2.5 rounded-xl text-xs font-bold transition-all mb-1 last:mb-0",
                                        isSelected
                                            ? "bg-indigo-50 text-indigo-700"
                                            : "text-slate-600 hover:bg-slate-50 hover:text-slate-950"
                                    )}
                                >
                                    <span>{optLabel}</span>
                                    {isSelected && <Check size={14} />}
                                </button>
                            );
                        })}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default CustomDropdown;
