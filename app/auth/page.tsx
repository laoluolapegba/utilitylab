import { Suspense } from "react";
import AuthForm from "@/components/AuthForm";

export const metadata = {
    title: "Sign in — UtilityLab",
    description: "Sign in or create your free UtilityLab account.",
};

export default function AuthPage() {
    return (
        <Suspense fallback={null}>
            <AuthForm />
        </Suspense>
    );
}
