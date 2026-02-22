import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function CTASection() {
    return (
        <section className="py-20 lg:py-28 bg-gradient-to-br from-[#566AF0] to-[#4355d6] relative overflow-hidden">
            {/* Decorative Elements */}
            <div className="absolute inset-0 opacity-10">
                <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
                <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />
            </div>

            <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl mb-6">
                        Ready to Save Hours of Work?
                    </h2>
                    <p className="text-xl text-white/90 mb-10 leading-relaxed max-w-2xl mx-auto">
                        Join thousands of users who have already streamlined their workflows with Utility Lab's powerful tools.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Link
                            href="/auth?mode=signup"
                            className="inline-flex items-center gap-2 rounded-full bg-white px-8 py-4 text-base font-semibold text-[#566AF0] transition-all hover:translate-y-[-2px] hover:shadow-2xl"
                        >
                            Get Started Free
                            <ArrowRight className="h-5 w-5" />
                        </Link>
                        <Link
                            href="/app/image-to-text"
                            className="inline-flex items-center gap-2 rounded-full bg-white/10 backdrop-blur-sm border-2 border-white/30 px-8 py-4 text-base font-semibold text-white transition-all hover:bg-white/20"
                        >
                            Try Image to Text
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
}