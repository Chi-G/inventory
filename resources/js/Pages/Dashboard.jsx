import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, usePage } from '@inertiajs/react';
import {
    Box,
    ArrowUpRight,
    ArrowDownRight,
    AlertTriangle,
    DollarSign,
    TrendingUp,
    Package,
    History,
    ChevronRight,
    Search,
    Truck,
    Users
} from 'lucide-react';
import { motion } from 'framer-motion';
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer
} from 'recharts';

export default function Dashboard({ stats, recentMovements, stockStatus, trends }) {
    const kpis = [
        {
            name: 'Total Products',
            value: stats.total_products,
            icon: Box,
            color: 'text-indigo-600',
            bg: 'bg-indigo-50',
            borderColor: 'border-indigo-100',
            description: 'Unique catalog entries'
        },
        {
            name: 'Inventory Value',
            value: `₦${stats.inventory_value.toLocaleString()}`,
            icon: DollarSign,
            color: 'text-emerald-600',
            bg: 'bg-emerald-50',
            borderColor: 'border-emerald-100',
            description: 'Based on retail price'
        },
        {
            name: 'Low Stock Alert',
            value: stats.low_stock_count,
            icon: AlertTriangle,
            color: 'text-amber-600',
            bg: 'bg-amber-50',
            borderColor: 'border-amber-100',
            description: 'Needs urgent attention'
        },
        {
            name: 'Active Suppliers',
            value: stats.total_suppliers,
            icon: Truck,
            color: 'text-purple-600',
            bg: 'bg-purple-50',
            borderColor: 'border-purple-100',
            description: 'Verified partners'
        }
    ];

    const containerVariants = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 }
    };

    return (
        <AuthenticatedLayout header="Warehouse Overview">
            <Head title="Dashboard" />

            <div className="flex flex-col gap-8">
                {/* Header Welcome */}
                <div className="flex justify-between items-end">
                    <div>
                        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Dashboard</h1>
                        <p className="text-slate-500 mt-1 font-medium">Real-time status of your interior inventory ecosystem.</p>
                    </div>
                    <div className="hidden sm:flex gap-3">
                        {usePage().props.auth.can['scanner.index'] && (
                            <Link
                                href={route('scanner.index', { slug: usePage().props.auth.user.slug })}
                                className="h-11 px-6 bg-slate-900 text-white rounded-xl font-bold flex items-center gap-2 hover:bg-indigo-600 transition-all shadow-lg shadow-slate-200"
                            >
                                <Search className="w-4 h-4" />
                                Quick Scan
                            </Link>
                        )}
                    </div>
                </div>

                {/* KPI Grid */}
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="show"
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-6"
                >
                    {kpis.map((kpi, i) => (
                        <motion.div
                            key={i}
                            variants={itemVariants}
                            className={`bg-white p-6 rounded-[2rem] border ${kpi.borderColor} shadow-sm hover:shadow-md transition-all group overflow-hidden`}
                        >
                            <div className="flex justify-between items-start mb-4">
                                <div className={`h-12 w-12 rounded-2xl ${kpi.bg} ${kpi.color} flex items-center justify-center transition-transform group-hover:scale-110 duration-300`}>
                                    <kpi.icon className="w-6 h-6" />
                                </div>
                                <div className="h-8 w-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-300 group-hover:text-indigo-500 transition-colors">
                                    <TrendingUp className="w-4 h-4" />
                                </div>
                            </div>
                            <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest truncate">{kpi.name}</h3>
                            <p className="text-xl sm:text-2xl lg:text-3xl font-black text-slate-900 mt-1 break-all line-clamp-1">{kpi.value}</p>
                            <p className="text-xs text-slate-400 mt-2 font-medium truncate">{kpi.description}</p>
                        </motion.div>
                    ))}
                </motion.div>

                {/* Trends Chart */}
                <motion.div
                    variants={itemVariants}
                    initial="hidden"
                    animate="show"
                    className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm transition-colors"
                >
                    <div className="flex justify-between items-center mb-8 px-2">
                        <div>
                            <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                                <TrendingUp className="w-5 h-5 text-indigo-500" />
                                Inventory Velocity
                            </h2>
                            <p className="text-sm text-slate-400 font-medium">Last 30-day stock inflow vs outflow</p>
                        </div>
                    </div>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={trends} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorIn" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.1} />
                                        <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                                    </linearGradient>
                                    <linearGradient id="colorOut" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#ef4444" stopOpacity={0.1} />
                                        <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis
                                    dataKey="date"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 600 }}
                                    dy={10}
                                    interval="preserveStartEnd"
                                />
                                <YAxis
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 600 }}
                                />
                                <Tooltip
                                    contentStyle={{
                                        borderRadius: '1rem',
                                        border: 'none',
                                        boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
                                        fontFamily: 'inherit',
                                        fontWeight: 'bold'
                                    }}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="in"
                                    stroke="#10b981"
                                    strokeWidth={3}
                                    fillOpacity={1}
                                    fill="url(#colorIn)"
                                    name="Stock In"
                                />
                                <Area
                                    type="monotone"
                                    dataKey="out"
                                    stroke="#ef4444"
                                    strokeWidth={3}
                                    fillOpacity={1}
                                    fill="url(#colorOut)"
                                    name="Stock Out"
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Recent Activity */}
                    <div className="lg:col-span-2 flex flex-col gap-6">
                        <div className="flex justify-between items-center px-2">
                            <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                                <History className="w-5 h-5 text-indigo-500" />
                                Recent Activity
                            </h2>
                            <Link href={route('inventory.logs', { slug: usePage().props.auth.user.slug })} className="text-sm font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1 transition-colors">
                                View full audit
                                <ChevronRight className="w-4 h-4" />
                            </Link>
                        </div>

                        <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden transition-colors">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead>
                                        <tr className="bg-slate-50 border-b border-slate-100">
                                            <th className="px-8 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Movement</th>
                                            <th className="px-8 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Product</th>
                                            <th className="px-8 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest text-right">Quantity</th>
                                            <th className="px-8 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-50">
                                        {recentMovements.map((move) => (
                                            <tr key={move.id} className="hover:bg-slate-50/50 transition-colors group">
                                                <td className="px-8 py-5">
                                                    <div className="flex flex-col">
                                                        <span className="text-sm font-bold text-slate-700">
                                                            {move.type === 'IN' ? 'Stock Added' : move.type === 'OUT' ? 'Stock Removed' : 'Adjustment'}
                                                        </span>
                                                        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">
                                                            {new Date(move.created_at).toLocaleTimeString()}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="px-8 py-5">
                                                    <div className="flex items-center gap-3">
                                                        <div className="h-9 w-9 rounded-xl bg-slate-100 flex items-center justify-center shrink-0">
                                                            <Package className="w-4 h-4 text-slate-400" />
                                                        </div>
                                                        <span className="text-sm font-bold text-slate-800 truncate max-w-[150px]">{move.product.name}</span>
                                                    </div>
                                                </td>
                                                <td className="px-8 py-5 text-right">
                                                    <span className={`text-base font-black ${move.type === 'IN' ? 'text-emerald-600' : 'text-red-500'}`}>
                                                        {move.type === 'OUT' ? '-' : '+'}{move.quantity}
                                                    </span>
                                                </td>
                                                <td className="px-8 py-5">
                                                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${move.type === 'IN' ? 'bg-emerald-50 text-emerald-600' : move.type === 'OUT' ? 'bg-red-50 text-red-600' : 'bg-amber-50 text-amber-600'
                                                        }`}>
                                                        Completed
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                        {recentMovements.length === 0 && (
                                            <tr className="py-20 h-64">
                                                <td colSpan="4" className="text-center text-slate-400">
                                                    <p className="font-medium">No activity to display yet.</p>
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                    {/* Stock Health & Summary */}
                    <div className="flex flex-col gap-6">
                        <h2 className="text-xl font-bold text-slate-800 px-2">Stock Health</h2>

                        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm flex flex-col gap-6 transition-colors">
                            <div className="flex flex-col gap-4">
                                <div className="flex justify-between items-end">
                                    <span className="text-sm font-bold text-slate-500">Inventory Status</span>
                                    <span className="text-xs font-black text-indigo-600">{stats.total_products} Skus total</span>
                                </div>
                                <div className="h-3 w-full bg-slate-100 rounded-full flex overflow-hidden">
                                    <div
                                        className="h-full bg-emerald-500 transition-all duration-1000"
                                        style={{ width: `${(stockStatus.healthy / stats.total_products) * 100}%` }}
                                    ></div>
                                    <div
                                        className="h-full bg-amber-500 transition-all duration-1000"
                                        style={{ width: `${(stockStatus.low_stock / stats.total_products) * 100}%` }}
                                    ></div>
                                    <div
                                        className="h-full bg-red-500 transition-all duration-1000"
                                        style={{ width: `${(stockStatus.out_of_stock / stats.total_products) * 100}%` }}
                                    ></div>
                                </div>
                            </div>

                            <div className="space-y-4 pt-2">
                                <div className="flex items-center justify-between p-4 bg-emerald-50 rounded-2xl border border-emerald-100">
                                    <div className="flex items-center gap-3">
                                        <div className="h-2 w-2 rounded-full bg-emerald-500"></div>
                                        <span className="text-sm font-bold text-emerald-800">Healthy Stock</span>
                                    </div>
                                    <span className="text-lg font-black text-emerald-600">{stockStatus.healthy}</span>
                                </div>
                                <div className="flex items-center justify-between p-4 bg-amber-50 rounded-2xl border border-amber-100">
                                    <div className="flex items-center gap-3">
                                        <div className="h-2 w-2 rounded-full bg-amber-500"></div>
                                        <span className="text-sm font-bold text-amber-800">Low Stock Limit</span>
                                    </div>
                                    <span className="text-lg font-black text-amber-600">{stockStatus.low_stock}</span>
                                </div>
                                <div className="flex items-center justify-between p-4 bg-red-50 rounded-2xl border border-red-100">
                                    <div className="flex items-center gap-3">
                                        <div className="h-2 w-2 rounded-full bg-red-500"></div>
                                        <span className="text-sm font-bold text-red-800">Out of Stock</span>
                                    </div>
                                    <span className="text-lg font-black text-red-600">{stockStatus.out_of_stock}</span>
                                </div>
                            </div>

                            <div className="mt-4 pt-6 border-t border-slate-100">
                                <div className="flex items-center gap-4 text-slate-500">
                                    <Users className="w-5 h-5 text-indigo-500" />
                                    <div>
                                        <p className="text-[10px] font-bold uppercase tracking-widest leading-none">Users Active</p>
                                        <p className="text-base font-black text-slate-800">{stats.total_users}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
