"use client";

import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import Footer from '../components/Footer';

interface SectionProps {
    inView: boolean;
}

const Section3: React.FC<SectionProps> = ({ inView }) => {
    // Use useRef to keep track of whether the animation has already run
    const hasAnimated = useRef(false);

    useEffect(() => {
        if (inView && !hasAnimated.current) {
            // Trigger animations when the section comes into view
            hasAnimated.current = true;

            gsap.fromTo('.s3a', {
                opacity: 0,
                x: -250
            }, {
                opacity: 1,
                x: 0,
                duration: 3
            });

            gsap.fromTo('.s3b', {
                opacity: 0,
                x: 250,
            }, {
                opacity: 1,
                x: 0,
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
                    <h1 className="s3a text-gray-100 text-6xl">Welcome to Section 3</h1>

                    {/* Align p to the right */}
                    <p className="s3b text-gray-300 text-lg mt-4">This is some content overlaying the diagonal section.</p>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default Section3;
