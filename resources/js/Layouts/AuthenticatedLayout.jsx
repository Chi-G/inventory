import { useState, useEffect } from 'react';
import Sidebar from '@/Layouts/Sidebar';
import Dropdown from '@/Components/Dropdown';
import { usePage } from '@inertiajs/react';
import Swal from 'sweetalert2';

const Toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 5000,
    timerProgressBar: true,
});

export default function AuthenticatedLayout({ header, children }) {
    const { auth, flash } = usePage().props;
    const user = auth.user;
    const [sidebarOpen, setSidebarOpen] = useState(false);

    useEffect(() => {
        if (flash?.success) {
            Toast.fire({ icon: 'success', title: flash.success });
        }
        if (flash?.error) {
            Toast.fire({ icon: 'error', title: flash.error });
        }
    }, [flash]);

    return (
        <div className="min-h-screen bg-slate-50 flex font-sans">
            {/* Sidebar Desktop & Mobile */}
            <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

            <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
                {/* Header Navbar */}
                <header className="h-16 bg-white border-b border-slate-200 flex items-center px-4 sm:px-6 lg:px-8 shrink-0 z-10 w-full relative sm:drop-shadow-sm justify-between">
                    {/* Mobile Menu Button */}
                    <div className="flex items-center">
                        <button
                            onClick={() => setSidebarOpen(!sidebarOpen)}
                            className="md:hidden p-2 -ml-2 rounded-md text-slate-400 hover:text-slate-500 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        >
                            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        </button>

                        {/* Page title injected from props or just use header */}
                        {header && (
                            <div className="ml-2 md:ml-0 font-semibold text-slate-800 text-lg sm:text-xl truncate">
                                {header}
                            </div>
                        )}
                    </div>

                    <div className="flex items-center gap-4">
                        {/* Top Right Profile Dropdown */}
                        <div className="relative">
                            <Dropdown>
                                <Dropdown.Trigger>
                                    <span className="inline-flex rounded-md cursor-pointer">
                                        <button
                                            type="button"
                                            className="inline-flex items-center rounded-full bg-white p-1 pe-3 text-sm font-medium text-slate-600 hover:bg-slate-50 focus:outline-none transition-colors border border-slate-200 shadow-sm"
                                        >
                                            <div className="h-8 w-8 rounded-full bg-slate-800 text-white flex items-center justify-center font-bold mr-2 text-xs">
                                                {user.name.charAt(0)}
                                            </div>
                                            <span className="hidden sm:inline-block truncate max-w-[120px]">
                                                {user.name.split(' ')[0]}
                                            </span>
                                            <svg className="-me-0.5 ms-2 h-4 w-4 text-slate-400 hidden sm:block" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                                            </svg>
                                        </button>
                                    </span>
                                </Dropdown.Trigger>
                                <Dropdown.Content align="right" width="48">
                                    <div className="px-4 py-3 sm:hidden border-b border-gray-100">
                                        <p className="text-sm leading-5 text-gray-900">{user.name}</p>
                                        <p className="text-xs leading-5 text-gray-500 truncate">{user.email}</p>
                                    </div>
                                    <Dropdown.Link href={route('profile.edit')}>Profile Settings</Dropdown.Link>
                                    <Dropdown.Link href={route('logout')} method="post" as="button">Log Out</Dropdown.Link>
                                </Dropdown.Content>
                            </Dropdown>
                        </div>
                    </div>
                </header>

                {/* Mobile sidebar underlay overlay */}
                {sidebarOpen && (
                    <div
                        className="fixed inset-0 z-20 bg-slate-900/50 backdrop-blur-sm transition-opacity md:hidden"
                        onClick={() => setSidebarOpen(false)}
                    ></div>
                )}

                <main className="flex-1 overflow-y-auto w-full relative bg-slate-50 pb-10">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}
