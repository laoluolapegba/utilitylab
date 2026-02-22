import { Check, Sparkles } from "lucide-react";
import SmartCTA from "@/components/SmartCTA";

const plans = [
    {
        name: "Free",
        price: "0",
        period: "forever",
        description: "Perfect for trying it out",
        features: [
            "3 conversions per day",
            "All file formats supported",
            "Standard processing speed",
            "Basic text extraction",
            "Copy to clipboard"
        ],
        cta: "Get Started",
        authenticatedRoute: "/dashboard/image-to-text",
        unauthenticatedRoute: "/auth?mode=signup",
        popular: false
    },
    {
        name: "Pro",
        price: "12",
        period: "month",
        description: "For power users",
        badge: "Coming Soon",
        features: [
            "Unlimited conversions",
            "All file formats supported",
            "Priority processing",
            "Advanced text extraction",
            "Batch processing (50 files)",
            "API access",
            "Export to multiple formats",
            "Priority support"
        ],
        cta: "Notify Me",
        authenticatedRoute: "#",
        unauthenticatedRoute: "#",
        popular: true,
        disabled: true
    }
];

export default function PricingSection() {
    return (
        <section className="py-20 lg:py-28 bg-slate-50">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <span className="block text-[#566AF0] mb-3 text-sm font-bold uppercase tracking-wider">
                        Pricing
                    </span>
                    <h2 className="text-3xl font-bold tracking-tight text-[#0F172A] sm:text-4xl lg:text-5xl mb-6">
                        Simple, Fair Pricing
                    </h2>
                    <p className="text-lg text-slate-600 leading-relaxed">
                        Start free. Upgrade when you need more. No hidden fees.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                    {plans.map((plan, index) => (
                        <div
                            key={index}
                            className={`relative bg-white rounded-3xl p-8 border-2 transition-all duration-300 ${plan.popular
                                    ? "border-[#566AF0] shadow-2xl scale-105"
                                    : "border-slate-200 hover:border-slate-300 hover:shadow-lg"
                                }`}
                        >
                            {/* Popular Badge */}
                            {plan.popular && (
                                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                                    <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#566AF0] to-[#4355d6] rounded-full text-white text-sm font-semibold shadow-lg">
                                        <Sparkles className="w-4 h-4" />
                                        {plan.badge}
                                    </div>
                                </div>
                            )}

                            {/* Plan Header */}
                            <div className="mb-6">
                                <h3 className="text-lg font-semibold text-slate-600 mb-2">
                                    {plan.name}
                                </h3>
                                <div className="flex items-baseline gap-2 mb-2">
                                    <span className="text-5xl font-bold text-[#0F172A]">
                                        ${plan.price}
                                    </span>
                                    <span className="text-slate-600">/{plan.period}</span>
                                </div>
                                <p className="text-slate-600">{plan.description}</p>
                            </div>

                            {/* Features List */}
                            <ul className="space-y-3 mb-8">
                                {plan.features.map((feature, idx) => (
                                    <li key={idx} className="flex items-start gap-3">
                                        <div className="flex-shrink-0 w-5 h-5 rounded-full bg-green-100 flex items-center justify-center mt-0.5">
                                            <Check className="w-3 h-3 text-green-600" />
                                        </div>
                                        <span className="text-slate-700">{feature}</span>
                                    </li>
                                ))}
                            </ul>

                            {/* CTA Button */}
                            {plan.disabled ? (
                                <button
                                    disabled
                                    className="w-full py-4 rounded-full bg-slate-100 text-slate-400 font-semibold cursor-not-allowed"
                                >
                                    {plan.cta}
                                </button>
                            ) : (
                                <SmartCTA
                                    authenticatedRoute={plan.authenticatedRoute}
                                    unauthenticatedRoute={plan.unauthenticatedRoute}
                                    authenticatedText="Start Using Free Plan"
                                    unauthenticatedText={plan.cta}
                                    variant="primary"
                                    showArrow={false}
                                    className="w-full"
                                />
                            )}
                        </div>
                    ))}
                </div>

                {/* Additional Info */}
                <div className="mt-12 text-center">
                    <p className="text-slate-600 mb-4">
                        All plans include GDPR compliance and zero data retention
                    </p>
                    <div className="flex items-center justify-center gap-6 text-sm text-slate-500">
                        <span>✓ No credit card required</span>
                        <span>✓ Cancel anytime</span>
                        <span>✓ 30-day money back</span>
                    </div>
                </div>
            </div>
        </section>
    );
}