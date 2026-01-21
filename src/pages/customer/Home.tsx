import React from 'react';
import HeroSection from '../../components/HeroSection';
import WhyChooseUs from '../../components/WhyChooseUs';
import Testimonials from '../../components/Testimonials';
import ParkingRates from '../../components/ParkingRates';
import ScrollToTop from '../../components/ScrollToTop';

const Home: React.FC = () => {

    return (
        <div className="flex flex-col w-full pb-20">
            <ScrollToTop />

            <HeroSection />

            <WhyChooseUs />

            <ParkingRates />

            <Testimonials />
        </div>
    );
};

export default Home;
