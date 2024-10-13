import React from 'react';

const Footer: React.FC = () => {
    return (
        <footer className="relative flex justify-center items-center h-16" style={{ background: 'rgba(0,1,0,255)' }}>
            {/* Decorative Border with Gradient Effect */}
            <div className="absolute top-0 left-0 w-full h-[2px]">
                <div className="h-full w-full bg-gradient-to-r from-transparent via-white to-transparent"></div>
            </div>
            {/* Footer Content */}
            <p className="text-white font-serif text-lg z-10">All rights inclusive</p>
        </footer>
    );
};

export default Footer;