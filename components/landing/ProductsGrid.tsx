import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { products } from "@/lib/products";

export default function ProductsGrid() {
    return (
        <section id="products" className="py-20 lg:py-28 bg-slate-50">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <span className="block text-[#566AF0] mb-3 text-sm font-bold uppercase tracking-wider">
                        Our Products
                    </span>
                    <h2 className="text-3xl font-bold tracking-tight text-[#0F172A] sm:text-4xl lg:text-5xl mb-6">
                        Tools Built for Productivity
                    </h2>
                    <p className="text-lg text-slate-600 leading-relaxed">
                        Each tool solves one problem exceptionally well. Start with what you need today, expand as you grow.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
                    {products.map((product) => {
                        const Icon = product.icon;
                        return (
                            <div
                                key={product.id}
                                className="group relative bg-white rounded-2xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100 hover:border-slate-200"
                            >
                                {/* Status Badge */}
                                {product.status === "coming-soon" && (
                                    <div className="absolute top-4 right-4 px-3 py-1 bg-slate-100 text-slate-600 text-xs font-semibold rounded-full uppercase tracking-wide">
                                        Coming Soon
                                    </div>
                                )}

                                {/* Icon with Gradient */}
                                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${product.color} p-3 mb-6 group-hover:scale-110 transition-transform duration-300`}>
                                    <Icon className="w-full h-full text-white" />
                                </div>

                                {/* Content */}
                                <h3 className="text-xl font-bold text-[#0F172A] mb-3 group-hover:text-[#566AF0] transition-colors">
                                    {product.name}
                                </h3>
                                <p className="text-slate-600 mb-6 leading-relaxed">
                                    {product.description}
                                </p>

                                {/* Features List */}
                                <ul className="space-y-2 mb-6">
                                    {product.features.map((feature, idx) => (
                                        <li key={idx} className="flex items-center gap-2 text-sm text-slate-600">
                                            <div className="w-1.5 h-1.5 rounded-full bg-[#566AF0]" />
                                            {feature}
                                        </li>
                                    ))}
                                </ul>

                                {/* CTA */}
                                {product.status === "live" ? (
                                    <Link
                                        href={product.href}
                                        className="inline-flex items-center gap-2 text-[#566AF0] font-semibold hover:gap-3 transition-all"
                                    >
                                        Try it now
                                        <ArrowRight className="w-4 h-4" />
                                    </Link>
                                ) : (
                                    <button
                                        disabled
                                        className="inline-flex items-center gap-2 text-slate-400 font-semibold cursor-not-allowed"
                                    >
                                        Coming soon
                                    </button>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
