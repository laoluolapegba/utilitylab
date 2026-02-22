import { Shield, Lock, Eye, Trash2 } from "lucide-react";

const privacyFeatures = [
    {
        icon: Shield,
        title: "Zero Storage",
        description: "Files are processed and immediately deleted. Nothing stays on our servers."
    },
    {
        icon: Lock,
        title: "End-to-End Encryption",
        description: "Your data is encrypted during transmission and processing."
    },
    {
        icon: Eye,
        title: "No Tracking",
        description: "We don't monitor your usage or collect personal analytics data."
    },
    {
        icon: Trash2,
        title: "Instant Deletion",
        description: "All processing happens in memory. Data is never written to disk."
    }
];

export default function PrivacySection() {
    return (
        <section className="py-20 lg:py-28 bg-white">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="max-w-5xl mx-auto">
                    {/* Header */}
                    <div className="text-center mb-16">
                        <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-[#566AF0]/10 mb-6">
                            <Shield className="w-10 h-10 text-[#566AF0]" />
                        </div>
                        <h2 className="text-3xl font-bold tracking-tight text-[#0F172A] sm:text-4xl lg:text-5xl mb-6">
                            Privacy First, Always
                        </h2>
                        <p className="text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto">
                            Your data never touches our servers permanently. We process, return results, and immediately delete. No storage, no tracking, no exceptions.
                        </p>
                    </div>

                    {/* Features Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {privacyFeatures.map((feature, index) => {
                            const Icon = feature.icon;
                            return (
                                <div
                                    key={index}
                                    className="flex gap-5 p-6 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors duration-200"
                                >
                                    <div className="flex-shrink-0">
                                        <div className="w-12 h-12 rounded-lg bg-white flex items-center justify-center shadow-sm">
                                            <Icon className="w-6 h-6 text-[#566AF0]" />
                                        </div>
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold text-[#0F172A] mb-2">
                                            {feature.title}
                                        </h3>
                                        <p className="text-slate-600 leading-relaxed">
                                            {feature.description}
                                        </p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Trust Badge */}
                    <div className="mt-12 text-center">
                        <div className="inline-flex items-center gap-2 px-6 py-3 bg-green-50 border border-green-200 rounded-full">
                            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                            <span className="text-sm font-semibold text-green-700">
                                GDPR Compliant • No Data Retention • 100% Private
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}