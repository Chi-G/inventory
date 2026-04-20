export default function ApplicationLogo(props) {
    return (
        <img 
            {...props} 
            src="/logo.png" 
            alt="Elevate Logo" 
            className={(props.className || '') + " object-contain"} 
        />
    );
}
