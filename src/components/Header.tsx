import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Phone, Mail, Clock, Facebook, Twitter, Instagram, MapPin, Menu, X, Car } from 'lucide-react';

const Header: React.FC = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const navigate = useNavigate();

    // Handle scroll effect for sticky header if we want it to change appearance
    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 40) {
                setIsScrolled(true);
            } else {
                setIsScrolled(false);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navLinks = [
        { name: 'Trang Chủ', path: '/' },
        { name: 'Về Chúng Tôi', path: '/about' },
        { name: 'Dịch Vụ', path: '/services' },
        { name: 'Bãi Đậu Xe', path: '/parking' },
        { name: 'Liên Hệ', path: '/contact' },
    ];

    return (
        <header className="w-full relative z-50 font-sans">
            {/* Top Bar - Dark Navy Background */}
            <div className="bg-slate-900 text-gray-300 py-2 text-xs md:text-sm border-b border-slate-800">
                <div className="container mx-auto px-4 md:px-8 flex flex-col md:flex-row justify-between items-center">
                    {/* Left Side: Contact Info */}
                    <div className="flex flex-wrap gap-4 md:gap-6 justify-center md:justify-start items-center">
                        <div className="flex items-center gap-2 hover:text-orange-500 transition-colors cursor-pointer">
                            <Mail size={14} className="text-orange-500" />
                            <span>support@parkivia.com</span>
                        </div>
                        <div className="flex items-center gap-2 hover:text-orange-500 transition-colors cursor-pointer">
                            <Clock size={14} className="text-orange-500" />
                            <span>T2 - T7: 8.00 - 18.00</span>
                        </div>
                        <div className="hidden lg:flex items-center gap-2 hover:text-orange-500 transition-colors cursor-pointer">
                            <MapPin size={14} className="text-orange-500" />
                            <span>123 Đường Trường Trinh, Hà Nội</span>
                        </div>
                    </div>

                    {/* Right Side: Phone & Socials */}
                    <div className="flex items-center gap-4 mt-2 md:mt-0">
                        <div className="flex items-center gap-2 mr-4 group cursor-pointer">
                            <div className="bg-orange-500 p-1 rounded-full text-white group-hover:bg-white group-hover:text-orange-500 transition-all">
                                <Phone size={12} />
                            </div>
                            <span className="font-bold text-white group-hover:text-orange-500 transition-colors">0912 345 678</span>
                        </div>
                        <div className="flex items-center gap-3 border-l border-slate-700 pl-4">
                            <a href="#" className="hover:text-orange-500 transition-colors"><Facebook size={16} /></a>
                            <a href="#" className="hover:text-orange-500 transition-colors"><Twitter size={16} /></a>
                            <a href="#" className="hover:text-orange-500 transition-colors"><Instagram size={16} /></a>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Header - White Background */}
            <div className={`w-full transition-all duration-300 z-50 ${isScrolled ? 'fixed top-0 left-0 bg-white/95 backdrop-blur-md shadow-lg animate-in slide-in-from-top-2' : 'relative bg-white'}`}>
                <div className="container mx-auto px-4 md:px-8 flex justify-between items-center py-4">
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-2 group">
                        <div className="relative">
                            <div className="bg-blue-600 rounded-lg p-2 text-white transform -skew-x-12 group-hover:bg-orange-500 transition-colors duration-300">
                                <Car size={28} className="transform skew-x-12" />
                            </div>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-2xl font-extrabold text-slate-900 tracking-tight leading-none">
                                PARK<span className="text-blue-600 group-hover:text-orange-500 transition-colors">IVIA</span>
                            </span>
                            <span className="text-[10px] font-bold tracking-widest text-slate-500 uppercase">Hệ Thống Đậu Xe</span>
                        </div>
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="hidden lg:flex items-center gap-8">
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                to={link.path}
                                className="text-slate-700 font-bold hover:text-orange-500 text-sm uppercase tracking-wide transition-colors relative group py-2"
                            >
                                {link.name}
                                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-orange-500 transition-all duration-300 group-hover:w-full"></span>
                            </Link>
                        ))}
                    </nav>

                    {/* Action Button & Toggle */}
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => navigate('/login')}
                            className="hidden md:flex items-center gap-2 bg-orange-500 hover:bg-slate-900 text-white font-bold py-3 px-6 rounded-sm uppercase text-xs tracking-wider transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                        >
                            <span>Nhận Báo Giá</span>
                            <span className="ml-1">→</span>
                        </button>

                        {/* Mobile Menu Toggle */}
                        <button
                            className="lg:hidden text-slate-900 hover:text-orange-500 transition-colors"
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        >
                            {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {isMobileMenuOpen && (
                <div className="lg:hidden bg-slate-900 text-white absolute top-full left-0 w-full shadow-2xl py-6 px-4 flex flex-col gap-4 animate-in slide-in-from-top-4 duration-200">
                    {navLinks.map((link) => (
                        <Link
                            key={link.name}
                            to={link.path}
                            className="text-lg font-medium border-b border-slate-700 pb-2 hover:text-orange-500 transition-colors"
                            onClick={() => setIsMobileMenuOpen(false)}
                        >
                            {link.name}
                        </Link>
                    ))}
                    <button
                        onClick={() => {
                            navigate('/login');
                            setIsMobileMenuOpen(false);
                        }}
                        className="mt-4 w-full bg-orange-500 text-white py-3 font-bold uppercase tracking-wider rounded-sm"
                    >
                        Nhận Báo Giá
                    </button>
                </div>
            )}
        </header>
    );
};

export default Header;
