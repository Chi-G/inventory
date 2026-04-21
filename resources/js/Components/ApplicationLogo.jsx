import { usePage } from '@inertiajs/react';

export default function ApplicationLogo(props) {
    const { app } = usePage().props;
    const logoSrc = app.is_production ? `${app.url}/logo.png` : '/logo.png';

    return (
        <img 
            {...props} 
            src={logoSrc} 
            alt="Elevate Logo" 
            className={(props.className || '') + " object-contain"} 
        />
    );
}
