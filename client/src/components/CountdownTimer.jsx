import React, { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';
import { motion } from 'framer-motion';

const CountdownTimer = ({ targetDate }) => {
    const calculateTimeLeft = () => {
        const difference = +new Date(targetDate) - +new Date();
        let timeLeft = {};

        if (difference > 0) {
            timeLeft = {
                days: Math.floor(difference / (1000 * 60 * 60 * 24)),
                hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
                minutes: Math.floor((difference / 1000 / 60) % 60),
                seconds: Math.floor((difference / 1000) % 60)
            };
        }

        return timeLeft;
    };

    const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft(calculateTimeLeft());
        }, 1000);

        return () => clearInterval(timer);
    }, [targetDate]);

    const timerComponents = [];

    Object.keys(timeLeft).forEach((interval) => {
        const value = timeLeft[interval];
        if (value === undefined || isNaN(value)) return;

        timerComponents.push(
            <div key={interval} className="flex flex-col items-center min-w-[20px]">
                <span className="text-sm font-black text-indigo-600 font-mono leading-none">
                    {value < 10 ? `0${value}` : value}
                </span>
                <span className="text-[8px] font-bold text-slate-400 uppercase tracking-tighter mt-0.5">
                    {interval.charAt(0)}
                </span>
            </div>
        );
    });

    return (
        <div className="flex items-center gap-3 bg-white px-3 py-1.5 rounded-xl border border-indigo-100 shadow-sm shadow-indigo-100/30">
            <div className="flex items-center gap-1.5">
                <Clock size={12} className="text-indigo-500 animate-pulse" />
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mr-1">Time Left:</span>
            </div>
            <div className="flex items-center gap-2">
                {timerComponents.length ? (
                    timerComponents.reduce((prev, curr, idx) => [prev, <span key={`sep-${idx}`} className="text-slate-300 font-bold">:</span>, curr])
                ) : (
                    <span className="text-xs font-bold text-red-500 uppercase">Expired</span>
                )}
            </div>
        </div>
    );
};

export default CountdownTimer;
