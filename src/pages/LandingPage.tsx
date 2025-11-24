// src/pages/LandingPage.tsx
import React from "react";

import { Navbar } from "../components/layout/Navbar";
import { HeroSection } from "../components/sections/HeroSection";
import { WhyEzytixSection } from "../components/sections/WhyEzytixSections";
import { AboutSection } from "../components/sections/AboutSections";
import { StatsRedSection } from "../components/sections/StatsRedSection";
import { CtaRedSection } from "../components/sections/CtaRedSection";
import { ContactInfoSection } from "../components/sections/ContactInfoSection";
import { Footer } from "../components/layout/Footer";

export const LandingPage: React.FC = () => {
    return (
        <div className="w-full min-h-screen bg-white overflow-hidden">

            {/* NAVBAR */}
            <Navbar />

            {/* HERO */}
            <HeroSection />

            {/* SPACER BAWAH HERO (agar searchbox tidak numpuk section berikutnya) */}
            <div className="h-[100px] md:h-[120px]"></div>

            {/* WHY SECTION */}
            <WhyEzytixSection />

            {/* ABOUT */}
            <AboutSection />

            {/* STATS MERAH */}
            <StatsRedSection />

            {/* CTA MERAH */}
            <CtaRedSection />

            {/* CONTACT + MAP */}
            <ContactInfoSection />

            {/* FOOTER */}
            <Footer />
        </div>
    );
};
