import { Link, usePage } from '@inertiajs/react';
import ApplicationLogo from '@/Components/ApplicationLogo';
import { LayoutDashboard, Users, Box, List, Truck, Component, History, Lock } from 'lucide-react';

export default function Sidebar({ isOpen, onClose }) {
    const { url } = usePage();
    const user = usePage().props.auth.user;

    const can = usePage().props.auth.can;

    const menuItems = [
        { name: 'Dashboard', icon: LayoutDashboard, route: 'dashboard.index', active: route().current('dashboard.index'), show: true },
        { name: 'Products', icon: Box, route: 'products.index', active: route().current('products.*'), show: can['products.view'] },
        { name: 'Categories', icon: List, route: 'categories.index', active: route().current('categories.*'), show: can['categories.view'] },
        { name: 'Scan Center', icon: Component, route: 'scanner.index', active: route().current('scanner.*'), show: can['products.view'] },
        { name: 'Movement Logs', icon: History, route: 'inventory.logs', active: route().current('inventory.logs'), show: can['inventory.view'] },
        { name: 'Suppliers', icon: Truck, route: 'suppliers.index', active: route().current('suppliers.*'), show: can['suppliers.view'] },
        { name: 'Users', icon: Users, route: 'users.index', active: route().current('users.*'), show: can['users.view'] },
        { name: 'Permissions', icon: Lock, route: 'permissions.index', active: route().current('permissions.*'), show: can['users.permissions'] },
    ].filter(item => item.show);

    if (!user) return null;

    return (
        <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-slate-900 border-r border-slate-800 text-white min-h-screen flex flex-col shrink-0 shadow-xl transition-all duration-300 md:static md:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'
            }`}>
            <div className="h-16 hidden md:flex items-center px-6 border-b border-slate-800 shrink-0 bg-slate-950/40">
                <Link href={route('dashboard.index', { slug: user?.slug })} className="flex items-center gap-3 group/logo">
                    <div className="h-12 w-12 rounded-xl flex items-center justify-center p-0 shadow-[0_0_20px_rgba(255,255,255,0.1)] ring-2 ring-slate-900 transition-transform group-hover/logo:scale-105 duration-300 overflow-hidden">
                        <ApplicationLogo className="block h-10 w-auto" />
                    </div>
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
                        href={route(item.route, { slug: user?.slug })}
                        onClick={() => onClose && onClose()}
                        className={`flex items-center px-3 py-2.5 rounded-lg text-sm font-medium transition-all group ${item.active
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
                <div className="flex items-center p-3 rounded-lg bg-slate-800/60 ring-1 ring-slate-700/50 min-w-0">
                    <div className="h-9 w-9 rounded-md bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold shrink-0 shadow-sm ring-2 ring-slate-900">
                        {user?.name?.charAt(0) || '?'}
                    </div>
                    <div className="ml-3 truncate flex-1 min-w-0">
                        <p className="text-sm font-medium text-white truncate">{user?.name || 'User'}</p>
                        <p className="text-xs text-indigo-300 truncate font-medium">{user?.role || 'Guest'}</p>
                    </div>
                </div>
            </div>
        </aside>
    );
}
