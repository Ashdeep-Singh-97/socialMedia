"use client";

import React, { useEffect, useRef, useState } from 'react';
import Section1 from './Pages/Section1';
import Section2 from './Pages/Section2';
import LandingNavbar from './components/LandingNavbar';

const HomePage: React.FC = () => {
    const sectionRefs = useRef<(HTMLDivElement | null)[]>([]);
    const [sectionInView, setSectionInView] = useState({
        section1: false,
        section2: false,
        section3: false,
    });

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    const sectionId = entry.target.id;
                    if (entry.isIntersecting) {
                        setSectionInView((prev) => ({
                            ...prev,
                            [sectionId]: true,
                        }));
                    } else {
                        setSectionInView((prev) => ({
                            ...prev,
                            [sectionId]: false,
                        }));
                    }
                });
            },
            { threshold: 0.5 } // Adjust threshold as needed
        );

        sectionRefs.current.forEach((section) => {
            if (section) observer.observe(section);
        });

        return () => {
            sectionRefs.current.forEach((section) => {
                if (section) observer.unobserve(section);
            });
        };
    }, []);

    return (
        <div className="h-screen snap-y snap-mandatory overflow-y-scroll">
            <LandingNavbar />
            <div
                id="section1"
                ref={(el) => { sectionRefs.current[0] = el; }}
                className="section snap-start h-screen"
            >
                <Section1 inView={sectionInView.section1} />
            </div>
            <div
                id="section2"
                ref={(el) => { sectionRefs.current[1] = el; }}
                className="section snap-start h-screen"
                style={{ background: 'rgba(0,1,0,255)' }}
            >
                <Section2 inView={sectionInView.section2} />
            </div>
        </div>
    );
};

export default HomePage;
