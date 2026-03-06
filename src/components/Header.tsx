import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Phone, Mail, Clock, Facebook, Twitter, Instagram, MapPin, Menu, X, Car, User, LogOut, Bell } from 'lucide-react';
import MemberRequestModal from './MemberRequestModal';
import { Dropdown, MenuProps, Avatar, message } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { useAuth } from '../contexts/AuthContext';

const Header: React.FC = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const navigate = useNavigate();
    const { isAuthenticated, user, logout } = useAuth();

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
        { name: 'Bãi Đậu Xe', path: '/parking-lots' },
        { name: 'Liên Hệ', path: '/contact' },
    ];

    const handleGetQuote = () => {
        if (!isAuthenticated) {
            message.warning("Vui lòng đăng nhập để nhận báo giá!");
            navigate('/login');
            setIsMobileMenuOpen(false);
            return;
        }
        setIsModalOpen(true);
        setIsMobileMenuOpen(false);
    }

    const handleLogout = () => {
        logout();
        navigate('/');
        setIsMobileMenuOpen(false);
    };

    const userMenuItems: MenuProps['items'] = [
        {
            key: 'profile',
            label: (
                <Link to="/profile">Hồ sơ cá nhân</Link>
            ),
            icon: <User size={16} />,
        },
        {
            type: 'divider',
        },
        {
            key: 'logout',
            label: 'Đăng xuất',
            icon: <LogOut size={16} />,
            danger: true,
            onClick: handleLogout,
        },
    ];

    return (
        <header className="w-full relative z-50 font-sans">
            <div className="bg-slate-900 text-gray-300 py-2 text-xs md:text-sm border-b border-slate-800">
                <div className="container mx-auto px-4 md:px-8 flex flex-col md:flex-row justify-between items-center">
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
                            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="hover:text-orange-500 transition-colors"><Facebook size={16} /></a>
                            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="hover:text-orange-500 transition-colors"><Twitter size={16} /></a>
                            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-orange-500 transition-colors"><Instagram size={16} /></a>
                        </div>
                    </div>
                </div>
            </div>

            <div className={`w-full transition-all duration-300 z-50 ${isScrolled ? 'fixed top-0 left-0 bg-white/95 backdrop-blur-md shadow-lg animate-in slide-in-from-top-2' : 'relative bg-white'}`}>
                <div className="container mx-auto px-4 md:px-8 flex justify-between items-center py-4">
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

                    <div className="flex items-center gap-4">
                        {isAuthenticated && (
                            <Dropdown
                                trigger={['click']}
                                placement="bottomRight"
                                dropdownRender={(menu) => (
                                    <div className="bg-white w-80 shadow-xl rounded-lg overflow-hidden border border-slate-100">
                                        <div className="px-4 py-3 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                                            <span className="font-bold text-slate-800">Thông báo</span>
                                            <span className="text-xs text-blue-600 cursor-pointer hover:underline">Đánh dấu đã đọc</span>
                                        </div>
                                        <div className="max-h-96 overflow-y-auto">
                                            <div className="px-4 py-3 hover:bg-slate-50 transition-colors cursor-pointer border-b border-slate-50 relative">
                                                <div className="flex gap-3">
                                                    <div className="flex-shrink-0 mt-1">
                                                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                                    </div>
                                                    <div>
                                                        <p className="text-sm text-slate-800 font-medium mb-1">Duyệt thành công</p>
                                                        <p className="text-xs text-slate-500 leading-relaxed">Yêu cầu đăng ký thành viên của bạn đã được duyệt thành công. Hãy thanh toán sớm nhất để sử dụng thẻ thành viên Parkivia!</p>
                                                        <span className="text-[10px] text-slate-400 mt-2 block">Vừa xong</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="px-4 py-2 bg-slate-50 text-center border-t border-slate-100">
                                            <span className="text-xs font-bold text-slate-600 hover:text-orange-500 cursor-pointer transition-colors">Xem tất cả</span>
                                        </div>
                                    </div>
                                )}
                            >
                                <div className="relative group cursor-pointer mr-2">
                                    <div className="p-2 rounded-full hover:bg-slate-100 transition-colors text-slate-600 group-hover:text-orange-500">
                                        <Bell size={20} />
                                        <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white animate-pulse"></span>
                                    </div>
                                </div>
                            </Dropdown>
                        )}

                        {isAuthenticated ? (
                            <Dropdown menu={{ items: userMenuItems }} trigger={['click']} placement="bottomRight">
                                <div className="hidden md:flex items-center gap-2 cursor-pointer hover:bg-slate-100 p-2 rounded-lg transition-colors">
                                    <Avatar
                                        style={{ backgroundColor: '#f97316' }}
                                        icon={<UserOutlined />}
                                        src={user?.avatar}
                                    />
                                    <span className="text-slate-700 font-bold text-sm max-w-[150px] truncate">
                                        {user?.username || 'Tài Khoản'}
                                    </span>
                                </div>
                            </Dropdown>
                        ) : (
                            <button
                                onClick={() => navigate('/login')}
                                className="hidden md:flex items-center gap-2 text-slate-700 hover:text-orange-500 font-bold uppercase text-xs tracking-wider transition-colors"
                            >
                                <User size={18} />
                                <span>Đăng Nhập</span>
                            </button>
                        )}

                        <button
                            onClick={handleGetQuote}
                            className="hidden md:flex items-center gap-2 bg-orange-500 hover:bg-slate-900 text-white font-bold py-3 px-6 rounded-sm uppercase text-xs tracking-wider transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                        >
                            <span>Đăng Ký Thành Viên</span>
                            <span className="ml-1">→</span>
                        </button>

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

                    {isAuthenticated ? (
                        <>
                            <div className="flex items-center gap-3 border-t border-slate-700 pt-4 mt-2">
                                <Avatar
                                    style={{ backgroundColor: '#f97316' }}
                                    icon={<UserOutlined />}
                                    src={user?.avatar}
                                />
                                <div className="flex flex-col">
                                    <span className="font-bold text-white">{user?.username || 'Tài Khoản'}</span>
                                    <span className="text-xs text-slate-400">{user?.role}</span>
                                </div>
                            </div>
                            <Link
                                to="/profile"
                                className="flex items-center gap-2 text-slate-300 hover:text-orange-500 transition-colors py-2"
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                <User size={18} /> Hồ sơ cá nhân
                            </Link>
                            <button
                                onClick={handleLogout}
                                className="flex items-center gap-2 text-red-400 hover:text-red-500 transition-colors py-2 mb-2"
                            >
                                <LogOut size={18} /> Đăng xuất
                            </button>
                        </>
                    ) : (
                        <button
                            onClick={() => {
                                navigate('/login');
                                setIsMobileMenuOpen(false);
                            }}
                            className="mt-4 w-full bg-slate-800 hover:bg-slate-700 text-white py-3 font-bold uppercase tracking-wider rounded-sm flex items-center justify-center gap-2"
                        >
                            <User size={18} />
                            <span>Đăng Nhập</span>
                        </button>
                    )}

                    <button
                        onClick={handleGetQuote}
                        className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 font-bold uppercase tracking-wider rounded-sm"
                    >
                        Nhận Báo Giá
                    </button>
                </div>
            )}

            <MemberRequestModal
                visible={isModalOpen}
                onCancel={() => setIsModalOpen(false)}
            />
        </header>
    );
};

export default Header;
