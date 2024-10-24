"use client";

import React, { useEffect, useState } from 'react';
import gsap from 'gsap';

interface SectionProps {
    inView: boolean;
}

const Section1: React.FC<SectionProps> = ({ inView }) => {
    const [isLowerVisible, setLowerVisible] = useState(true); // State to control visibility of .lower

    useEffect(() => {
        if (inView) {
            // Trigger animations when the section comes into view
            gsap.fromTo(".head", {
                opacity: 0,
            }, {
                opacity: 1,
                duration: 1,
                delay: 1,
            });

            gsap.fromTo(".lower", {
                y: 0,
            }, {
                y: 2000,
                duration: 3,
                delay: 3,
                onComplete: () => {
                    setLowerVisible(false); // Set state to hide the lower div
                }
            });
        }
    }, [inView]); // Only run this effect when inView changes

    return (
        <div className="relative w-full h-full overflow-hidden">
            <video
                className="absolute top-0 left-0 w-full h-full object-cover"
                autoPlay
                loop
                muted
                playsInline
            >
                <source src="/Globe.mp4" type="video/mp4" />
                Your browser does not support the video tag.
            </video>
            <div className="relative z-20 w-full h-full">
                <div className="absolute left-0 w-full h-1/2 bg-transparent">
                    <div className="absolute bottom-3/4 left-0 w-full h-[100vh] bg-white skew-y-6"></div>
                    {isLowerVisible && ( // Render .lower only if visible
                        <div className="absolute lower opacity-100 left-0 w-full h-[100vh] bg-white skew-y-6"></div>
                    )}
                </div>
                <div className="relative z-30 flex flex-col justify-center items-center mt-40 text-center">
                    <h1 className="head text-gray-800 text-6xl">Let&apos;s Connect</h1> {/* Escape single quote */}
                </div>
            </div>
            <div className="absolute top-0 left-0 w-full h-full bg-black/40 z-10"></div>
        </div>
    );
};

export default Section1;
