import ApplicationLogo from '@/Components/ApplicationLogo';
import { Link, usePage } from '@inertiajs/react';

export default function GuestLayout({ children }) {
    const { app } = usePage().props;
    const bgSrc = app.is_production ? `${app.url}/bg.png` : '/bg.png';

    return (
        <div className="flex h-screen bg-white font-sans overflow-hidden">
            {/* Left Column - Image underlay */}
            <div className="hidden lg:flex lg:w-1/2 relative bg-slate-900 overflow-hidden items-end p-16 pb-24 h-full">
                <img
                    src={bgSrc}
                    className="absolute inset-0 w-full h-full object-cover opacity-85 hover:scale-105 transition-transform duration-[20s] ease-out"
                    alt="Interior Design aesthetic"
                />
                {/* Gradient overlay for premium feel and text readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/20 to-transparent"></div>

                <div className="relative text-white max-w-xl z-10 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-300 fill-mode-both">
                    <h2 className="text-4xl font-extrabold mb-4 tracking-tight">ELEVATE INTERIORS</h2>
                    <p className="text-slate-300 text-lg leading-relaxed font-medium">
                        The premium standard for modern inventory tracking and structural stock management.
                    </p>
                </div>
            </div>

            {/* Right Column - Form */}
            <div className="w-full lg:w-1/2 h-full flex flex-col justify-center items-center p-8 sm:p-12 lg:p-12 bg-white relative drop-shadow-2xl">

                <div className="w-full max-w-md animate-in fade-in slide-in-from-bottom-4 duration-700">
                    <div className="flex justify-center mb-6">
                        <Link href="/">
                            <ApplicationLogo className="h-36 w-auto" />
                        </Link>
                    </div>

                    {children}
                </div>
            </div>
        </div>
    );
}
