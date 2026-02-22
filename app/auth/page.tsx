import MarketingNavbar from "@/components/landing/MarketingNavbar";
import AuthForm from "@/components/AuthForm";

export default function AuthPage() {
  return (
    <>
      <MarketingNavbar />
      <main className="min-h-screen bg-slate-50">
        <div className="max-w-3xl mx-auto px-4 py-10">
          <AuthForm />
        </div>
      </main>
    </>
  );
}
