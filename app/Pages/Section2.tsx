"use client";

import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import Footer from '../components/Footer';

interface SectionProps {
    inView: boolean;
}

const Section2: React.FC<SectionProps> = ({ inView }) => {
    // Use useRef to keep track of whether the animation has already run
    const hasAnimated = useRef(false);

    useEffect(() => {
        if (inView && !hasAnimated.current) {
            // Trigger animations when the section comes into view
            hasAnimated.current = true;

            gsap.fromTo('.s2a', {
                opacity: 0,
                y: -250
            }, {
                opacity: 1,
                y: 0,
                duration: 3
            });

            gsap.fromTo('.s2b', {
                opacity: 0,
                y: 250,
                delay: 2
            }, {
                opacity: 1,
                delay: 2,
                y: 0,
                duration: 3
            });
        }
    }, [inView]); // Only run this effect when inView changes

    return (
        <div className="flex flex-col h-screen">
            {/* Content Area */}
            <div className="flex-grow flex items-center">
                <div className="w-full flex justify-between items-center px-8">
                    {/* Align h1 to the left */}
                    <h1 className="s2a text-gray-100 text-6xl">Welcome to Chatter G</h1>

                    {/* Align p to the right */}
                    <p className="s2b text-gray-300 text-lg mt-4 text-center">
                        This is a new age connectivity and networking tool. <br></br>
                        Specially designed for you to feel connected and at the same time dont get hooked. <br></br>
                        Start connecting. Start Chatter G.
                    </p>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default Section2;
