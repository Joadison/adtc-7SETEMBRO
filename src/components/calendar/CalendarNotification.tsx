"use client";

import { useEffect, useState } from "react";
import { Bell, X, Calendar } from "lucide-react";
import { useCalendarNotifications } from "@/hooks/useCalendarNotifications";
import { parseISO } from "date-fns";
import { usePathname, useRouter } from "next/navigation";

export function CalendarNotification() {
    const { events, requestPermission, hasPermission } = useCalendarNotifications();
    const [showPrompt, setShowPrompt] = useState(false);
    const [recentEvents, setRecentEvents] = useState<any[]>([]);
    const [isMobile, setIsMobile] = useState(false);
    const router = useRouter();    
    const pathname = usePathname();

    const isCalendarPage = pathname === "/calendar";

    useEffect(() => {
        const checkMobile = () => {
        setIsMobile(window.innerWidth <= 768);
        };
        
        checkMobile();
        window.addEventListener('resize', checkMobile);
        
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    useEffect(() => {
        if ('Notification' in window && Notification.permission === 'default') {
        setShowPrompt(true);
        }
    }, []);

    const handleRequestPermission = async () => {
        const granted = await requestPermission();
        if (granted) {
        setShowPrompt(false);
        }
    };

    useEffect(() => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        const recent = events
            .filter(event => {
                const eventDate = parseISO(event.start);
                return eventDate >= today && eventDate < tomorrow;
            })
            .sort((a, b) => parseISO(a.start).getTime() - parseISO(b.start).getTime())
            .slice(0, 3);

        console.log(recent)

        setRecentEvents(recent);
    }, [events]);

    if (isCalendarPage) {
        return null;
    }

    if (showPrompt) {
        return (
        <div className={`fixed ${isMobile ? 'bottom-0 left-0 right-0' : 'top-20 right-4'} z-50 max-w-md mx-auto ${isMobile ? 'p-4' : ''}`}>
            <div className="bg-white rounded-lg shadow-lg border border-blue-200 p-4">
            <div className="flex items-start gap-3">
                <Bell className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                <h3 className="font-semibold text-gray-900">
                    Receber notificações da agenda?
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                    Saiba com antecedência sobre seus eventos
                </p>
                <div className="flex gap-2 mt-3">
                    <button
                    onClick={handleRequestPermission}
                    className="flex-1 bg-blue-500 text-white px-3 py-2 rounded-lg text-sm font-medium hover:bg-blue-600 transition-colors"
                    >
                    Permitir
                    </button>
                    <button
                    onClick={() => setShowPrompt(false)}
                    className="flex-1 bg-gray-100 text-gray-700 px-3 py-2 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors"
                    >
                    Agora não
                    </button>
                </div>
                </div>
                <button
                onClick={() => setShowPrompt(false)}
                className="text-gray-400 hover:text-gray-600"
                >
                <X className="w-4 h-4" />
                </button>
            </div>
            </div>
        </div>
        );
    }

    if (hasPermission && recentEvents.length > 0    ) {
        return (
        <div className={`fixed ${isMobile ? 'bottom-20 left-4' : 'top-32 right-4'} z-50`}>
            <button
            onClick={() => router.push("/calendar")}
            className="bg-transparent rounded-full shadow-lg p-3 hover:bg-white hover:shadow-xl transition-shadow flex items-center gap-2"
            >
            <Calendar className="w-5 h-5 text-blue-400" />
            {recentEvents.length > 0 && (
                <span className="bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {recentEvents.length}
                </span>
            )}
            </button>
        </div>
        );
    }

    if (!hasPermission) {
        return (
        <button
            onClick={handleRequestPermission}
            className={`fixed ${isMobile ? 'bottom-20 right-4' : 'top-20 right-4'} z-50 bg-blue-500 text-white rounded-full p-3 shadow-lg hover:bg-blue-600 transition-colors`}
        >
            <Bell className="w-5 h-5" />
        </button>
        );
    }

    return null;
}