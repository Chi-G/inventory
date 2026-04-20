import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import DeleteUserForm from './Partials/DeleteUserForm';
import UpdatePasswordForm from './Partials/UpdatePasswordForm';
import UpdateProfileInformationForm from './Partials/UpdateProfileInformationForm';
import ThemeSettingsForm from './Partials/ThemeSettingsForm';

export default function Edit({ mustVerifyEmail, status }) {
    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center gap-3">
                    <button 
                        onClick={() => window.history.back()}
                        className="p-2 -ml-2 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                    </button>
                    <h2 className="text-xl font-bold text-slate-800 dark:text-white leading-tight">
                        Profile Settings
                    </h2>
                </div>
            }
        >
            <Head title="Profile" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl space-y-6 sm:px-6 lg:px-8">
                    <div className="bg-white dark:bg-slate-900 p-4 shadow sm:rounded-lg sm:p-8 border border-slate-200 dark:border-slate-800">
                        <ThemeSettingsForm className="max-w-xl" />
                    </div>

                    <div className="bg-white dark:bg-slate-900 p-4 shadow sm:rounded-lg sm:p-8 border border-slate-200 dark:border-slate-800">
                        <UpdateProfileInformationForm
                            mustVerifyEmail={mustVerifyEmail}
                            status={status}
                            className="max-w-xl"
                        />
                    </div>

                    <div className="bg-white dark:bg-slate-900 p-4 shadow sm:rounded-lg sm:p-8 border border-slate-200 dark:border-slate-800">
                        <UpdatePasswordForm className="max-w-xl" />
                    </div>

                    <div className="bg-white dark:bg-slate-900 p-4 shadow sm:rounded-lg sm:p-8 border border-slate-200 dark:border-slate-800">
                        <DeleteUserForm className="max-w-xl" />
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
