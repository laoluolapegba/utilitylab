import AuthGate from "@/components/AuthGate";
import ImageUpload from "@/components/products/image-to-text/ImageUpload";
import AppNavbar from "@/components/Navbar";

export default function Home() {
    return (
        <AuthGate>
            <div
                className="min-h-screen bg-cover bg-center bg-no-repeat bg-fixed relative"
                style={{ backgroundImage: "url('/bg-sunrise.jpg')" }}
            >
                {/* App navbar (auth-aware) */}
                <AppNavbar />

                {/* Optional subtle overlay for readability */}
                <div className="absolute inset-0 bg-white/10 backdrop-blur-0"></div>

                <div className="relative z-10 flex items-start justify-center pt-16 pb-24 px-4">
                    <div className="w-full max-w-4xl">
                        <div className="mb-8 text-center">
                            <h1 className="text-4xl font-semibold text-white drop-shadow-lg">
                                Image → Text
                            </h1>
                            <p className="mt-2 text-white/90 text-sm backdrop-blur-sm px-4 py-1 rounded-xl inline-block">
                                Transform images into clean, usable text instantly.
                            </p>
                        </div>

                        <div className="rounded-3xl border border-white/30 bg-white/25 backdrop-blur-2xl shadow-2xl p-8">
                            <ImageUpload />
                        </div>
                    </div>
                </div>
            </div>
        </AuthGate>
    );
}
