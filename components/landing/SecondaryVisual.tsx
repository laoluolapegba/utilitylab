export default function SecondaryVisual() {
    return (
        <section className="py-16 md:py-20 bg-white">
            <div className="max-w-[1280px] mx-auto px-6 lg:px-20">
                {/* Purple Gradient Container */}
                <div className="relative rounded-[32px] bg-gradient-to-br from-[#4c1d95] via-[#6d28d9] to-[#8b5cf6] overflow-hidden shadow-2xl shadow-purple-900/20">
                    {/* Animated Blobs */}
                    <div className="absolute top-[-30%] right-[-10%] w-[50%] h-[100%] bg-[#ec4899] blur-[80px] rounded-full opacity-30 mix-blend-screen animate-blob"></div>
                    <div className="absolute bottom-[-30%] left-[-10%] w-[50%] h-[100%] bg-[#f97316] blur-[80px] rounded-full opacity-30 mix-blend-screen animate-blob animation-delay-2000"></div>

                    {/* Inner Content */}
                    <div className="relative z-10 p-6 md:p-10">
                        {/* App Screenshot Mockup */}
                        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
                            {/* Window Toolbar */}
                            <div className="h-10 bg-slate-50 border-b border-slate-100 px-4 flex items-center gap-2">
                                <div className="flex gap-2">
                                    <div className="w-3 h-3 rounded-full bg-[#ff5f57]"></div>
                                    <div className="w-3 h-3 rounded-full bg-[#febc2e]"></div>
                                    <div className="w-3 h-3 rounded-full bg-[#28c840]"></div>
                                </div>
                            </div>

                            {/* Content */}
                            <div className="aspect-[16/7] p-6 md:p-10 flex gap-6 bg-white">
                                {/* Sidebar */}
                                <div className="hidden md:block w-64 space-y-3">
                                    <div className="h-10 bg-blue-50 rounded-lg"></div>
                                    <div className="h-10 bg-slate-100 rounded-lg"></div>
                                    <div className="h-10 bg-slate-100 rounded-lg"></div>
                                </div>

                                {/* Main Area */}
                                <div className="flex-1 grid md:grid-cols-3 gap-4">
                                    {/* Image Cards */}
                                    {[1, 2, 3].map((i) => (
                                        <div key={i} className="aspect-[4/3] bg-gradient-to-br from-slate-100 to-slate-50 rounded-xl border border-slate-200 flex items-center justify-center">
                                            <div className="w-12 h-12 bg-slate-200 rounded-lg"></div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
