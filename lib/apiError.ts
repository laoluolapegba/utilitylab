/**
 * Standard error envelope for all API routes.
 * Every error response has the same shape so clients can handle errors uniformly.
 */

import { NextResponse } from "next/server";

export type ApiErrorPayload = {
    error: string;
    code: string;
    correlationId: string;
};

/** Returns a NextResponse with the standard error shape. */
export function apiError(
    code: string,
    message: string,
    status: number,
    correlationId: string,
): NextResponse<ApiErrorPayload> {
    return NextResponse.json(
        { error: message, code, correlationId },
        { status, headers: { "x-correlation-id": correlationId } },
    );
}
