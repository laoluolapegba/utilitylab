"use client";

import { ReactNode, useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";

interface Props {
    children: ReactNode;
    redirectTo?: string; // optional override
}

export default function AuthGate({ children, redirectTo = "/auth" }: Props) {
    const [loading, setLoading] = useState(true);
    const [isAuthed, setIsAuthed] = useState(false);
    const router = useRouter();

    useEffect(() => {
        let isMounted = true;

        const checkUser = async () => {
            const { data } = await supabase.auth.getUser();
            const user = data.user;

            if (!isMounted) return;

            setIsAuthed(!!user);
            setLoading(false);

            // If not authed, route them to auth
            if (!user) {
                router.replace(redirectTo);
            }
        };

        checkUser();

        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, session) => {
            const authed = !!session?.user;
            setIsAuthed(authed);

            // if user signs out while on /app, send to auth
            if (!authed) {
                router.replace(redirectTo);
            }
        });

        return () => {
            isMounted = false;
            subscription.unsubscribe();
        };
    }, [router, redirectTo]);

    if (loading) {
        return <div className="text-sm text-slate-600">Checking session...</div>;
    }

    // While redirecting, render nothing (prevents flicker)
    if (!isAuthed) {
        return null;
    }

    return <>{children}</>;
}
