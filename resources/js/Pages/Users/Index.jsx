import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, usePage, router } from '@inertiajs/react';
import { useState } from 'react';
import { Plus, Edit, Trash2, Mail, User, ShieldCheck, UserCheck, Smartphone } from 'lucide-react';
import Modal from '@/Components/Modal';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import DangerButton from '@/Components/DangerButton';
import Swal from 'sweetalert2';

export default function Index({ users }) {
    const { auth, flash } = usePage().props;
    
    // Core accounts protection is now handled dynamically via Permissions page.
    const isProtected = (email) => false;
    
    // Modal states
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    
    const [selectedUser, setSelectedUser] = useState(null);

    // Form handlers
    const { data, setData, post, put, delete: destroy, processing, errors, reset, clearErrors } = useForm({
        name: '',
        email: '',
        role: 'Staff',
    });

    const openCreateModal = () => {
        clearErrors();
        reset();
        setIsCreateModalOpen(true);
    };

    const openEditModal = (user) => {
        clearErrors();
        setSelectedUser(user);
        setData({
            name: user.name,
            email: user.email,
            role: user.role,
        });
        setIsEditModalOpen(true);
    };

    const openDeleteModal = (user) => {
        Swal.fire({
            title: 'Delete User?',
            text: `Are you sure you want to permanently delete ${user.name}? This action cannot be reversed.`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#4f46e5',
            cancelButtonColor: '#ef4444',
            confirmButtonText: 'Yes, Delete'
        }).then((result) => {
            if (result.isConfirmed) {
                router.delete(route('users.destroy', user.id));
            }
        });
    };

    const handleCreate = (e) => {
        e.preventDefault();
        post(route('users.store'), {
            onSuccess: () => {
                setIsCreateModalOpen(false);
                reset();
            },
        });
    };

    const handleEdit = (e) => {
        e.preventDefault();
        put(route('users.update', selectedUser.id), {
            onSuccess: () => {
                setIsEditModalOpen(false);
                reset();
                setSelectedUser(null);
            },
        });
    };



    // Role styling helpers
    const getRoleBadgeColor = (role) => {
        switch(role) {
            case 'Super Admin': return 'bg-red-100 text-red-700 border-red-200';
            case 'Admin': return 'bg-purple-100 text-purple-700 border-purple-200';
            case 'Manager': return 'bg-blue-100 text-blue-700 border-blue-200';
            default: return 'bg-gray-100 text-gray-700 border-gray-200';
        }
    };

    return (
        <AuthenticatedLayout header="User Management">
            <Head title="Users" />

            <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-8">
                <div>
                    <h3 className="text-2xl font-bold text-slate-800">Staff & Users</h3>
                    <p className="text-slate-500 mt-1">Manage platform access, roles, and staff details.</p>
                </div>
                {auth.can['users.create'] && (
                    <PrimaryButton 
                        onClick={openCreateModal} 
                        className="w-full md:w-auto h-11 px-6 bg-indigo-600 border-transparent hover:bg-indigo-700 flex items-center justify-center gap-2 shadow-sm transition-all active:scale-95"
                    >
                        <Plus className="w-5 h-5" />
                        New User
                    </PrimaryButton>
                )}
            </div>



            {/* Desktop View - Table */}
            <div className="hidden md:block bg-white rounded-3xl border border-slate-200 shadow-sm overflow-x-auto text-sm">
                <table className="w-full text-left border-collapse min-w-[800px] lg:min-w-full">
                    <thead className="bg-slate-50/50">
                        <tr>
                            <th className="px-6 py-5 text-xs font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100 italic">User Profile</th>
                            <th className="px-6 py-5 text-xs font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100 italic">Role</th>
                            <th className="px-6 py-5 text-xs font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100 italic">Status</th>
                            <th className="px-6 py-5 text-right text-xs font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100 italic">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {users.map((u) => (
                            <tr key={u.id} className="hover:bg-slate-50/30 transition-colors group">
                                <td className="px-6 py-6 whitespace-nowrap">
                                    <div className="flex items-center gap-4">
                                        <div className="h-12 w-12 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 font-black text-lg group-hover:bg-indigo-600 group-hover:text-white transition-all shadow-sm">
                                            {u.name.charAt(0).toUpperCase()}
                                        </div>
                                        <div>
                                            <p className="font-bold text-slate-800 text-base leading-none">{u.name}</p>
                                            <p className="text-slate-400 font-medium text-xs mt-1">{u.email}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-6">
                                    <span className={`px-3 py-1 inline-flex text-[10px] font-black uppercase tracking-widest rounded-lg border ${getRoleBadgeColor(u.role)}`}>
                                        {u.role}
                                    </span>
                                </td>
                                <td className="px-6 py-6 whitespace-nowrap">
                                    <div className="flex items-center gap-2 text-green-600 font-bold text-xs uppercase tracking-wide">
                                        <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></div>
                                        Active
                                    </div>
                                </td>
                                <td className="px-6 py-6 text-right">
                                    <div className="flex justify-end gap-2">
                                        {auth.can['users.edit'] && (
                                            <button 
                                                onClick={() => !isProtected(u.email) && openEditModal(u)}
                                                disabled={isProtected(u.email)}
                                                className={`h-10 w-10 flex items-center justify-center rounded-xl border transition-all ${isProtected(u.email) ? 'bg-slate-50 border-slate-100 text-slate-200' : 'border-slate-200 text-slate-400 hover:text-indigo-600 hover:border-indigo-200 hover:bg-indigo-50'}`}
                                                title={isProtected(u.email) ? "Master account cannot be edited." : "Edit User"}
                                            >
                                                <Edit className="w-5 h-5" />
                                            </button>
                                        )}
                                        {auth.can['users.delete'] && auth.user.id !== u.id && u.role !== 'Super Admin' && (
                                            <button 
                                                onClick={() => !isProtected(u.email) && openDeleteModal(u)}
                                                disabled={isProtected(u.email)}
                                                className={`h-10 w-10 flex items-center justify-center rounded-xl border transition-all ${isProtected(u.email) ? 'bg-slate-50 border-slate-100 text-slate-200' : 'border-slate-200 text-slate-400 hover:text-red-600 hover:border-red-200 hover:bg-red-50'}`}
                                                title={isProtected(u.email) ? "Master account cannot be deleted." : "Delete User"}
                                            >
                                                <Trash2 className="w-5 h-5" />
                                            </button>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Mobile View - Cards */}
            <div className="md:hidden space-y-4">
                {users.map((u) => (
                    <div key={u.id} className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm transition-all active:scale-[0.98]">
                        <div className="flex justify-between items-start mb-6">
                            <div className="flex items-center gap-4">
                                <div className="h-12 w-12 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 font-black text-lg">
                                    {u.name.charAt(0).toUpperCase()}
                                </div>
                                <div>
                                    <p className="font-bold text-slate-800 text-lg leading-tight">{u.name}</p>
                                    <span className={`mt-1 px-2.5 py-0.5 inline-flex text-[9px] font-black uppercase tracking-widest rounded-md border ${getRoleBadgeColor(u.role)}`}>
                                        {u.role}
                                    </span>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                {auth.can['users.edit'] && (
                                    <button 
                                        onClick={() => !isProtected(u.email) && openEditModal(u)}
                                        disabled={isProtected(u.email)}
                                        className={`h-10 w-10 flex items-center justify-center rounded-xl transition-all ${isProtected(u.email) ? 'bg-slate-50 text-slate-200' : 'bg-indigo-50 text-indigo-600 border border-indigo-100'}`}
                                    >
                                        <Edit className="w-5 h-5" />
                                    </button>
                                )}
                                {auth.can['users.delete'] && auth.user.id !== u.id && u.role !== 'Super Admin' && (
                                    <button 
                                        onClick={() => !isProtected(u.email) && openDeleteModal(u)}
                                        disabled={isProtected(u.email)}
                                        className={`h-10 w-10 flex items-center justify-center rounded-xl transition-all ${isProtected(u.email) ? 'bg-slate-50 text-slate-200' : 'bg-red-50 text-red-600 border border-red-100'}`}
                                    >
                                        <Trash2 className="w-5 h-5" />
                                    </button>
                                )}
                            </div>
                        </div>

                        <div className="space-y-3 pt-5 border-t border-slate-50">
                            <div className="flex items-center text-sm text-slate-600 gap-4 group">
                                <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center shrink-0 border border-slate-100 group-hover:bg-indigo-50 group-hover:border-indigo-100 transition-all">
                                    <Mail className="w-4 h-4 text-slate-400 group-hover:text-indigo-500" />
                                </div>
                                <span className="font-medium text-slate-700 truncate">{u.email}</span>
                            </div>
                            <div className="flex items-center text-sm text-slate-600 gap-4 group">
                                <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center shrink-0 border border-slate-100 group-hover:bg-green-50 group-hover:border-green-100 transition-all">
                                    <UserCheck className="w-4 h-4 text-green-500" />
                                </div>
                                <span className="font-bold text-green-600 tracking-wide uppercase text-xs">Active Status</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {users.length === 0 && (
                <div className="py-20 text-center bg-white rounded-3xl border border-slate-200 shadow-sm">
                    <User className="w-12 h-12 text-slate-200 mx-auto mb-4" />
                    <p className="text-slate-400 italic">No users found in the system.</p>
                </div>
            )}

            {/* Create Modal */}
            <Modal show={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)}>
                <form onSubmit={handleCreate} className="p-6">
                    <h2 className="text-lg font-bold text-slate-900 mb-6">Create New User</h2>

                    <div className="mt-4">
                        <InputLabel htmlFor="name" value="Full Name" />
                        <TextInput
                            id="name"
                            className="mt-1 block w-full"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            required
                        />
                        <InputError className="mt-2" message={errors.name} />
                    </div>

                    <div className="mt-4">
                        <InputLabel htmlFor="email" value="Email Address" />
                        <TextInput
                            id="email"
                            type="email"
                            className="mt-1 block w-full"
                            value={data.email}
                            onChange={(e) => setData('email', e.target.value)}
                            required
                        />
                        <InputError className="mt-2" message={errors.email} />
                    </div>

                    <div className="mt-4">
                        <InputLabel htmlFor="role" value="Access Role" />
                        <select
                            id="role"
                            className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
                            value={data.role}
                            onChange={(e) => setData('role', e.target.value)}
                            required
                        >
                            <option value="Staff">Staff</option>
                            <option value="Manager">Manager</option>
                            <option value="Admin">Admin</option>
                        </select>
                        <InputError className="mt-2" message={errors.role} />
                    </div>
                    
                    <p className="mt-4 text-xs text-slate-500 bg-slate-50 p-2 rounded border border-slate-100">
                        The user's default password will be <strong className="text-slate-700">password123</strong>. They should change this upon their first login.
                    </p>

                    <div className="mt-6 flex justify-end gap-3">
                        <SecondaryButton onClick={() => setIsCreateModalOpen(false)}>Cancel</SecondaryButton>
                        <PrimaryButton disabled={processing}>Create User</PrimaryButton>
                    </div>
                </form>
            </Modal>

            {/* Edit Modal */}
            <Modal show={isEditModalOpen} onClose={() => setIsEditModalOpen(false)}>
                <form onSubmit={handleEdit} className="p-6">
                    <h2 className="text-lg font-bold text-slate-900 mb-6">Edit User: {selectedUser?.name}</h2>

                    <div className="mt-4">
                        <InputLabel htmlFor="edit_name" value="Full Name" />
                        <TextInput
                            id="edit_name"
                            className="mt-1 block w-full"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            required
                        />
                        <InputError className="mt-2" message={errors.name} />
                    </div>

                    <div className="mt-4">
                        <InputLabel htmlFor="edit_email" value="Email Address" />
                        <TextInput
                            id="edit_email"
                            type="email"
                            className={`mt-1 block w-full ${isProtected(selectedUser?.email) ? 'bg-slate-100 italic text-slate-500' : ''}`}
                            value={data.email}
                            onChange={(e) => setData('email', e.target.value)}
                            required
                            disabled={isProtected(selectedUser?.email)}
                        />
                        {isProtected(selectedUser?.email) && (
                            <p className="mt-1 text-[10px] text-amber-600 font-medium tracking-tight uppercase">Master account email cannot be changed</p>
                        )}
                        <InputError className="mt-2" message={errors.email} />
                    </div>

                    {selectedUser?.role !== 'Super Admin' && (
                        <div className="mt-4">
                            <InputLabel htmlFor="edit_role" value="Access Role" />
                            <select
                                id="edit_role"
                                className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
                                value={data.role}
                                onChange={(e) => setData('role', e.target.value)}
                                required
                            >
                                <option value="Staff">Staff</option>
                                <option value="Manager">Manager</option>
                                <option value="Admin">Admin</option>
                            </select>
                            <InputError className="mt-2" message={errors.role} />
                        </div>
                    )}

                    <div className="mt-6 flex justify-end gap-3">
                        <SecondaryButton onClick={() => setIsEditModalOpen(false)}>Cancel</SecondaryButton>
                        <PrimaryButton disabled={processing}>Save Changes</PrimaryButton>
                    </div>
                </form>
            </Modal>



        </AuthenticatedLayout>
    );
}
