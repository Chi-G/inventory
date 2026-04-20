import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, usePage, router } from '@inertiajs/react';
import { useState } from 'react';
import Modal from '@/Components/Modal';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import { Truck, Plus, Edit, Trash2, Mail, Phone, User } from 'lucide-react';
import Swal from 'sweetalert2';

export default function Index({ suppliers }) {
    const { flash } = usePage().props;
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedSupplier, setSelectedSupplier] = useState(null);

    const { data, setData, post, put, processing, errors, reset, clearErrors } = useForm({
        name: '',
        contact_person: '',
        email: '',
        phone: '',
    });

    const openCreateModal = () => {
        clearErrors();
        reset();
        setIsCreateModalOpen(true);
    };

    const openEditModal = (supplier) => {
        clearErrors();
        setSelectedSupplier(supplier);
        setData({
            name: supplier.name,
            contact_person: supplier.contact_person || '',
            email: supplier.email || '',
            phone: supplier.phone || '',
        });
        setIsEditModalOpen(true);
    };

    const handleCreate = (e) => {
        e.preventDefault();
        post(route('suppliers.store'), {
            onSuccess: () => {
                setIsCreateModalOpen(false);
                reset();
            },
        });
    };

    const handleEdit = (e) => {
        e.preventDefault();
        put(route('suppliers.update', selectedSupplier.id), {
            onSuccess: () => {
                setIsEditModalOpen(false);
                reset();
                setSelectedSupplier(null);
            },
        });
    };

    const handleDelete = (id) => {
        Swal.fire({
            title: 'Delete Supplier?',
            text: "This vendor and their details will be permanently removed.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#4f46e5',
            cancelButtonColor: '#ef4444',
            confirmButtonText: 'Yes, delete it!'
        }).then((result) => {
            if (result.isConfirmed) {
                router.delete(route('suppliers.destroy', id));
            }
        });
    };

    return (
        <AuthenticatedLayout header="Suppliers">
            <Head title="Suppliers" />

            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">Vendors & Suppliers</h1>
                    <p className="text-slate-500 mt-1">Manage your furniture and materials supply network.</p>
                </div>
                <PrimaryButton onClick={openCreateModal} className="h-11 px-6 bg-slate-900 border-transparent hover:bg-slate-800 flex items-center gap-2">
                    <Plus className="w-5 h-5" />
                    Add Supplier
                </PrimaryButton>
            </div>



            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50/50">
                                <th className="px-6 py-5 text-xs font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100">Supplier Name</th>
                                <th className="px-6 py-5 text-xs font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100">Contact Details</th>
                                <th className="px-6 py-5 text-xs font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {suppliers.map((supplier) => (
                                <tr key={supplier.id} className="hover:bg-slate-50/30 transition-colors group">
                                    <td className="px-6 py-6">
                                        <div className="flex items-center gap-3">
                                            <div className="h-10 w-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-500 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                                                <Truck className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <p className="font-bold text-slate-800">{supplier.name}</p>
                                                <p className="text-xs text-slate-500 mt-0.5">Verified Vendor</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-6">
                                        <div className="space-y-1">
                                            {supplier.contact_person && (
                                                <div className="flex items-center text-sm text-slate-600 gap-2">
                                                    <User className="w-3.5 h-3.5 text-slate-400" />
                                                    {supplier.contact_person}
                                                </div>
                                            )}
                                            {supplier.email && (
                                                <div className="flex items-center text-sm text-slate-600 gap-2">
                                                    <Mail className="w-3.5 h-3.5 text-slate-400" />
                                                    {supplier.email}
                                                </div>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-6 py-6 text-right">
                                        <div className="flex justify-end gap-2">
                                            <button 
                                                onClick={() => openEditModal(supplier)}
                                                className="h-9 w-9 flex items-center justify-center rounded-lg border border-slate-200 text-slate-400 hover:text-indigo-600 hover:border-indigo-200 hover:bg-indigo-50 transition-all"
                                            >
                                                <Edit className="w-4 h-4" />
                                            </button>
                                            <button 
                                                onClick={() => handleDelete(supplier.id)}
                                                className="h-9 w-9 flex items-center justify-center rounded-lg border border-slate-200 text-slate-400 hover:text-red-600 hover:border-red-200 hover:bg-red-50 transition-all"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {suppliers.length === 0 && (
                                <tr>
                                    <td colSpan="3" className="px-6 py-20 text-center text-slate-400 italic">
                                        No suppliers registered in the system yet.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Create/Edit Modals (combined or separate as per your style) */}
            <Modal show={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)}>
                <form onSubmit={handleCreate} className="p-8">
                    <h2 className="text-xl font-bold text-slate-900 mb-6">New Vendor Register</h2>
                    
                    <div className="grid grid-cols-1 gap-5">
                        <div>
                            <InputLabel htmlFor="name" value="Company / Brand Name" />
                            <TextInput
                                id="name"
                                className="mt-1 block w-full h-11"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                placeholder="e.g. Italian Marble Co."
                                required
                            />
                            <InputError className="mt-2" message={errors.name} />
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <InputLabel htmlFor="contact_person" value="Contact Person" />
                                <TextInput
                                    id="contact_person"
                                    className="mt-1 block w-full h-11"
                                    value={data.contact_person}
                                    onChange={(e) => setData('contact_person', e.target.value)}
                                />
                            </div>
                            <div>
                                <InputLabel htmlFor="phone" value="Phone Number" />
                                <TextInput
                                    id="phone"
                                    className="mt-1 block w-full h-11"
                                    value={data.phone}
                                    onChange={(e) => setData('phone', e.target.value)}
                                />
                            </div>
                        </div>

                        <div>
                            <InputLabel htmlFor="email" value="Email Address" />
                            <TextInput
                                id="email"
                                type="email"
                                className="mt-1 block w-full h-11"
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                            />
                            <InputError className="mt-2" message={errors.email} />
                        </div>
                    </div>

                    <div className="mt-10 flex justify-end gap-3">
                        <SecondaryButton onClick={() => setIsCreateModalOpen(false)}>Cancel</SecondaryButton>
                        <PrimaryButton disabled={processing} className="bg-slate-900 h-11 px-8">Save Vendor</PrimaryButton>
                    </div>
                </form>
            </Modal>

            {/* Edit Modal */}
            <Modal show={isEditModalOpen} onClose={() => setIsEditModalOpen(false)}>
                <form onSubmit={handleEdit} className="p-8">
                    <h2 className="text-xl font-bold text-slate-900 mb-6 font-display">Update Vendor Details</h2>
                    
                    <div className="grid grid-cols-1 gap-5">
                        <div>
                            <InputLabel htmlFor="edit_name" value="Company Name" />
                            <TextInput
                                id="edit_name"
                                className="mt-1 block w-full h-11"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                required
                            />
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <InputLabel htmlFor="edit_contact" value="Contact Person" />
                                <TextInput
                                    id="edit_contact"
                                    className="mt-1 block w-full h-11"
                                    value={data.contact_person}
                                    onChange={(e) => setData('contact_person', e.target.value)}
                                />
                            </div>
                            <div>
                                <InputLabel htmlFor="edit_phone" value="Phone" />
                                <TextInput
                                    id="edit_phone"
                                    className="mt-1 block w-full h-11"
                                    value={data.phone}
                                    onChange={(e) => setData('phone', e.target.value)}
                                />
                            </div>
                        </div>

                        <div>
                            <InputLabel htmlFor="edit_email" value="Email" />
                            <TextInput
                                id="edit_email"
                                type="email"
                                className="mt-1 block w-full h-11"
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="mt-10 flex justify-end gap-3">
                        <SecondaryButton onClick={() => setIsEditModalOpen(false)}>Cancel</SecondaryButton>
                        <PrimaryButton disabled={processing} className="bg-indigo-600 h-11 px-8 border-transparent">Update Supplier</PrimaryButton>
                    </div>
                </form>
            </Modal>
        </AuthenticatedLayout>
    );
}
