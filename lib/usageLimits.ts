"use client";

import { supabase } from "@/lib/supabaseClient";

const ANON_USAGE_KEY = "utilitylab:anon-usage:v1";
const DAILY_LIMIT = 3;

type UsageSnapshot = {
    date: string;
    count: number;
};

function todayUTC(): string {
    return new Date().toISOString().slice(0, 10);
}

function readSnapshot(): UsageSnapshot {
    if (typeof window === "undefined") {
        return { date: todayUTC(), count: 0 };
    }

    const raw = window.localStorage.getItem(ANON_USAGE_KEY);
    if (!raw) {
        return { date: todayUTC(), count: 0 };
    }

    try {
        const parsed = JSON.parse(raw) as Partial<UsageSnapshot>;
        const date = parsed.date ?? todayUTC();
        const count = typeof parsed.count === "number" ? parsed.count : 0;

        if (date !== todayUTC()) {
            return { date: todayUTC(), count: 0 };
        }

        return { date, count };
    } catch {
        return { date: todayUTC(), count: 0 };
    }
}

function writeSnapshot(snapshot: UsageSnapshot) {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(ANON_USAGE_KEY, JSON.stringify(snapshot));
}

export type UsageLimitState = {
    loading: boolean;
    isAuthenticated: boolean;
    usedToday: number;
    limit: number;
    remaining: number;
    limitReached: boolean;
};

export async function getUsageLimitState(): Promise<UsageLimitState> {
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (user) {
        return {
            loading: false,
            isAuthenticated: true,
            usedToday: 0,
            limit: DAILY_LIMIT,
            remaining: DAILY_LIMIT,
            limitReached: false,
        };
    }

    const snapshot = readSnapshot();
    writeSnapshot(snapshot);

    return {
        loading: false,
        isAuthenticated: false,
        usedToday: snapshot.count,
        limit: DAILY_LIMIT,
        remaining: Math.max(0, DAILY_LIMIT - snapshot.count),
        limitReached: snapshot.count >= DAILY_LIMIT,
    };
}

export async function recordAnonymousUsage(): Promise<UsageLimitState> {
    const state = await getUsageLimitState();

    if (state.isAuthenticated) {
        return state;
    }

    const snapshot = readSnapshot();
    const next = {
        date: todayUTC(),
        count: Math.min(DAILY_LIMIT, snapshot.count + 1),
    };

    writeSnapshot(next);

    return {
        ...state,
        usedToday: next.count,
        remaining: Math.max(0, DAILY_LIMIT - next.count),
        limitReached: next.count >= DAILY_LIMIT,
    };
}
