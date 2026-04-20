import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, usePage, Link } from '@inertiajs/react';
import { useState } from 'react';
import Modal from '@/Components/Modal';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import { List, Plus, Edit, Trash2, ChevronRight, Layers } from 'lucide-react';
import { router } from '@inertiajs/react';
import Swal from 'sweetalert2';

export default function Index({ categories, parentCategories }) {
    const { flash } = usePage().props;
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState(null);

    const { data, setData, post, put, delete: destroy, processing, errors, reset, clearErrors } = useForm({
        name: '',
        description: '',
        parent_id: '',
    });

    const openCreateModal = () => {
        clearErrors();
        reset();
        setIsCreateModalOpen(true);
    };

    const openEditModal = (category) => {
        clearErrors();
        setSelectedCategory(category);
        setData({
            name: category.name,
            description: category.description || '',
            parent_id: category.parent_id || '',
        });
        setIsEditModalOpen(true);
    };

    const handleCreate = (e) => {
        e.preventDefault();
        post(route('categories.store'), {
            onSuccess: () => {
                setIsCreateModalOpen(false);
                reset();
            },
        });
    };

    const handleEdit = (e) => {
        e.preventDefault();
        put(route('categories.update', selectedCategory.id), {
            onSuccess: () => {
                setIsEditModalOpen(false);
                reset();
                setSelectedCategory(null);
            },
        });
    };

    const handleDelete = (id) => {
        Swal.fire({
            title: 'Are you sure?',
            text: "This category will be permanently deleted!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#4f46e5',
            cancelButtonColor: '#ef4444',
            confirmButtonText: 'Yes, delete it!'
        }).then((result) => {
            if (result.isConfirmed) {
                router.delete(route('categories.destroy', id));
            }
        });
    };

    return (
        <AuthenticatedLayout header="Categories">
            <Head title="Categories" />

            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">Product Categories</h1>
                    <p className="text-slate-500 mt-1">Organize your interior inventory by type and style.</p>
                </div>
                <PrimaryButton onClick={openCreateModal} className="h-11 px-6 bg-indigo-600 hover:bg-indigo-700 flex items-center gap-2">
                    <Plus className="w-5 h-5" />
                    New Category
                </PrimaryButton>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {categories.data.map((category) => (
                    <div key={category.id} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all group overflow-hidden relative">
                         <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                            <button onClick={() => openEditModal(category)} className="p-2 bg-slate-50 hover:bg-indigo-50 text-slate-400 hover:text-indigo-600 rounded-lg border border-slate-100 transition-colors">
                                <Edit className="w-4 h-4" />
                            </button>
                         </div>
                        
                        <div className="flex items-center gap-2 mb-4">
                            <div className="h-10 w-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                                {category.parent_id ? <Layers className="w-5 h-5" /> : <List className="w-5 h-5" />}
                            </div>
                            {category.parent && (
                                <div className="flex items-center text-xs font-medium text-slate-400">
                                    <span>{category.parent.name}</span>
                                    <ChevronRight className="w-3 h-3 mx-1" />
                                </div>
                            )}
                        </div>
                        
                        <h3 className="text-lg font-bold text-slate-800 mb-2 truncate">{category.name}</h3>
                        <p className="text-sm text-slate-500 line-clamp-2 min-h-[2.5rem]">
                            {category.description || 'No description provided.'}
                        </p>
                        
                        <div className="mt-6 pt-4 border-t border-slate-50 flex justify-between items-center">
                            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                                {category.children_count || 0} Sub-categories
                            </span>
                            <span className="text-[10px] px-2 py-1 rounded-md font-bold uppercase bg-emerald-50 text-emerald-600">
                                Main Category
                            </span>
                        </div>
                    </div>
                ))}

                {categories.data.length === 0 && (
                    <div className="col-span-full py-20 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-center">
                        <div className="h-16 w-16 bg-white rounded-2xl shadow-sm border border-slate-100 flex items-center justify-center mb-4">
                            <List className="w-8 h-8 text-slate-300" />
                        </div>
                        <h3 className="text-lg font-semibold text-slate-600">No categories yet</h3>
                        <p className="text-slate-400 mt-1 max-w-xs">Start by adding your first product category to organize your warehouse.</p>
                        <PrimaryButton onClick={openCreateModal} className="mt-6 bg-slate-800">Add Category</PrimaryButton>
                    </div>
                )}
            </div>
            
            {/* Pagination */}
            {categories.links && categories.links.length > 3 && (
                <div className="mt-8 flex justify-center gap-2">
                    {categories.links.map((link, i) => (
                        <Link
                            key={i}
                            href={link.url || '#'}
                            preserveScroll
                            preserveState
                            dangerouslySetInnerHTML={{ __html: link.label }}
                            className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                                link.active 
                                    ? 'bg-indigo-600 text-white shadow-md' 
                                    : 'text-slate-500 hover:bg-white hover:text-indigo-600 border border-transparent hover:border-indigo-100'
                            } ${!link.url ? 'opacity-50 cursor-not-allowed' : ''}`}
                        />
                    ))}
                </div>
            )}

            {/* Create Modal */}
            <Modal show={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)}>
                <form onSubmit={handleCreate} className="p-8">
                    <h2 className="text-xl font-bold text-slate-900 mb-6">Create New Category</h2>
                    
                    <div className="space-y-5">
                        <div>
                            <InputLabel htmlFor="name" value="Category Name" className="text-slate-600" />
                            <TextInput
                                id="name"
                                className="mt-1 block w-full bg-slate-50 border-slate-200 focus:bg-white"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                placeholder="e.g. Living Room Furniture"
                                required
                            />
                            <InputError className="mt-2" message={errors.name} />
                        </div>

                        <div>
                            <InputLabel htmlFor="parent_id" value="Parent Category (Optional)" className="text-slate-600" />
                            <select
                                id="parent_id"
                                className="mt-1 block w-full rounded-xl border-slate-200 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 bg-slate-50 focus:bg-white"
                                value={data.parent_id}
                                onChange={(e) => setData('parent_id', e.target.value)}
                            >
                                <option value="">None (Make this a Top-Level Category)</option>
                                {parentCategories.map(parent => (
                                    <option key={parent.id} value={parent.id}>{parent.name}</option>
                                ))}
                            </select>
                            <InputError className="mt-2" message={errors.parent_id} />
                        </div>

                        <div>
                            <InputLabel htmlFor="description" value="Description" className="text-slate-600" />
                            <textarea
                                id="description"
                                className="mt-1 block w-full rounded-xl border-slate-200 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 bg-slate-50 focus:bg-white min-h-[100px]"
                                value={data.description}
                                onChange={(e) => setData('description', e.target.value)}
                                placeholder="Describe the type of products in this category..."
                            />
                            <InputError className="mt-2" message={errors.description} />
                        </div>
                    </div>

                    <div className="mt-10 flex justify-end gap-3">
                        <SecondaryButton onClick={() => setIsCreateModalOpen(false)} className="border-slate-200 text-slate-600">Cancel</SecondaryButton>
                        <PrimaryButton disabled={processing} className="bg-indigo-600 h-11 px-6">Save Category</PrimaryButton>
                    </div>
                </form>
            </Modal>

            {/* Edit Modal */}
            <Modal show={isEditModalOpen} onClose={() => setIsEditModalOpen(false)}>
                <form onSubmit={handleEdit} className="p-8">
                    <div className="flex justify-between items-start mb-6">
                        <h2 className="text-xl font-bold text-slate-900">Edit Category</h2>
                        <button 
                            type="button"
                            onClick={() => {
                                Swal.fire({
                                    title: 'Are you sure?',
                                    text: "This category will be permanently deleted!",
                                    icon: 'warning',
                                    showCancelButton: true,
                                    confirmButtonColor: '#4f46e5',
                                    cancelButtonColor: '#ef4444',
                                    confirmButtonText: 'Yes, delete it!'
                                }).then((result) => {
                                    if (result.isConfirmed) {
                                        router.delete(route('categories.destroy', selectedCategory.id), {
                                            onSuccess: () => setIsEditModalOpen(false)
                                        });
                                    }
                                });
                            }}
                            className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        >
                            <Trash2 className="w-5 h-5" />
                        </button>
                    </div>
                    
                    <div className="space-y-5">
                        <div>
                            <InputLabel htmlFor="edit_name" value="Category Name" />
                            <TextInput
                                id="edit_name"
                                className="mt-1 block w-full bg-slate-50 border-slate-200 focus:bg-white"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                required
                            />
                            <InputError className="mt-2" message={errors.name} />
                        </div>

                        <div>
                            <InputLabel htmlFor="edit_parent_id" value="Parent Category" />
                            <select
                                id="edit_parent_id"
                                className="mt-1 block w-full rounded-xl border-slate-200 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 bg-slate-50 focus:bg-white"
                                value={data.parent_id}
                                onChange={(e) => setData('parent_id', e.target.value)}
                            >
                                <option value="">None (Top-Level)</option>
                                {parentCategories
                                    .filter(p => p.id !== selectedCategory?.id)
                                    .map(parent => (
                                        <option key={parent.id} value={parent.id}>{parent.name}</option>
                                    ))
                                }
                            </select>
                            <InputError className="mt-2" message={errors.parent_id} />
                        </div>

                        <div>
                            <InputLabel htmlFor="edit_description" value="Description" />
                            <textarea
                                id="edit_description"
                                className="mt-1 block w-full rounded-xl border-slate-200 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 bg-slate-50 focus:bg-white min-h-[100px]"
                                value={data.description}
                                onChange={(e) => setData('description', e.target.value)}
                            />
                            <InputError className="mt-2" message={errors.description} />
                        </div>
                    </div>

                    <div className="mt-10 flex justify-end gap-3">
                        <SecondaryButton onClick={() => setIsEditModalOpen(false)}>Cancel</SecondaryButton>
                        <PrimaryButton disabled={processing} className="bg-indigo-600 h-11 px-6">Update Category</PrimaryButton>
                    </div>
                </form>
            </Modal>
        </AuthenticatedLayout>
    );
}

