import React from "react";

interface RepCounterProps {
    count: number;
}

export function RepCounter({ count }: RepCounterProps) {
    return (
        <div className="absolute top-4 left-4 z-50 p-4 sm:p-6 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-md rounded-xl sm:rounded-2xl shadow-xl border border-zinc-200 dark:border-zinc-800 transition-all duration-300">
            <div className="flex flex-col items-center">
                <span className="text-xs sm:text-sm font-semibold text-zinc-500 uppercase tracking-wider mb-1">
                    Reps
                </span>
                <h1 className="text-4xl sm:text-6xl font-black text-blue-600 dark:text-blue-500 font-mono tracking-tighter">
                    {count}
                </h1>
            </div>
        </div>
    );
}
