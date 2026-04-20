import { Link, usePage } from '@inertiajs/react';
import ApplicationLogo from '@/Components/ApplicationLogo';
import { LayoutDashboard, Users, Box, List, Truck, Component, History } from 'lucide-react';
import ThemeToggle from '@/Components/ThemeToggle';

export default function Sidebar({ isOpen, onClose }) {
    const { url } = usePage();
    const user = usePage().props.auth.user;
    
    // Roles manager
    const canManageUsers = ['Super Admin', 'Admin'].includes(user.role);

    const menuItems = [
        { name: 'Dashboard', icon: LayoutDashboard, route: 'dashboard', active: url.startsWith('/dashboard') },
        { name: 'Products', icon: Box, route: 'products.index', active: url.startsWith('/products') },
        { name: 'Categories', icon: List, route: 'categories.index', active: url.startsWith('/categories') },
        { name: 'Scan Center', icon: Component, route: 'scanner.index', active: url === '/scan-center' },
        { name: 'Movement Logs', icon: History, route: 'inventory.logs', active: url.startsWith('/inventory/logs') },
        { name: 'Suppliers', icon: Truck, route: 'suppliers.index', active: url.startsWith('/suppliers') },
        ...(canManageUsers ? [{ name: 'Users', icon: Users, route: 'users.index', active: url.startsWith('/users') }] : []),
    ];

    return (
        <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-slate-900 border-r border-slate-800 text-white min-h-screen flex flex-col shrink-0 shadow-xl transition-all duration-300 md:static md:translate-x-0 ${
            isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}>
            <div className="h-20 flex items-center px-6 border-b border-slate-800 shrink-0 bg-slate-950/40">
                <Link href="/" className="flex items-center gap-3">
                    <ApplicationLogo className="block h-12 w-auto drop-shadow-[0_0_12px_rgba(99,102,241,0.6)] transition-transform hover:scale-110 duration-300" />
                    <div className="font-black text-xl tracking-[0.2em] text-white flex flex-col leading-none">
                        <span>ELEVATE</span>
                    </div>
                </Link>
            </div>

            <div className="flex-1 py-6 px-4 space-y-1.5 overflow-y-auto">
                <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4 px-3">
                    Menu
                </div>
                {menuItems.map((item) => (
                    <Link
                        key={item.name}
                        href={route(item.route)}
                        onClick={() => onClose && onClose()}
                        className={`flex items-center px-3 py-2.5 rounded-lg text-sm font-medium transition-all group ${
                            item.active
                                ? 'bg-indigo-600 text-white shadow-md'
                                : 'text-slate-400 hover:bg-slate-800/80 hover:text-white'
                        }`}
                    >
                        <item.icon className={`h-5 w-5 mr-3 shrink-0 transition-colors ${item.active ? 'text-indigo-200' : 'text-slate-500 group-hover:text-indigo-400'}`} />
                        {item.name}
                    </Link>
                ))}
            </div>
            
            <div className="p-4 border-t border-slate-800 bg-slate-900 space-y-4">
                <div className="px-1">
                    <ThemeToggle />
                </div>
                <div className="flex items-center p-3 rounded-lg bg-slate-800/60 ring-1 ring-slate-700/50 min-w-0">
                    <div className="h-9 w-9 rounded-md bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold shrink-0 shadow-sm ring-2 ring-slate-900">
                        {user.name.charAt(0)}
                    </div>
                    <div className="ml-3 truncate flex-1 min-w-0">
                        <p className="text-sm font-medium text-white truncate">{user.name}</p>
                        <p className="text-xs text-indigo-300 truncate font-medium">{user.role}</p>
                    </div>
                </div>
            </div>
        </aside>
    );
}
