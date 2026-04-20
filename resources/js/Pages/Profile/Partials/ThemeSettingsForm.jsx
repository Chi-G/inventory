import ThemeToggle from '@/Components/ThemeToggle';

export default function ThemeSettingsForm({ className = '' }) {
    return (
        <section className={className}>
            <header>
                <h2 className="text-lg font-medium text-slate-900 dark:text-slate-100">
                    Appearance Settings
                </h2>

                <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                    Customize how Elevate Interiors looks on your device. Choose between light, dark, or follow your system preferences.
                </p>
            </header>

            <div className="mt-6 flex justify-start">
                <div className="w-full max-w-xs">
                    <ThemeToggle />
                </div>
            </div>
        </section>
    );
}
