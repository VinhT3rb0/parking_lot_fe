import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Linkedin, MapPin, Phone, Mail, ArrowRight, Car } from 'lucide-react';

const Footer: React.FC = () => {
    return (
        <footer className="bg-slate-900 text-gray-400 font-sans border-t border-slate-800">
            {/* Main Footer Content */}
            <div className="container mx-auto px-4 md:px-8 py-16">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
                    {/* Column 1: About */}
                    <div className="space-y-6">
                        <Link to="/" className="flex items-center gap-2 group mb-4">
                            <div className="bg-blue-600 rounded-lg p-2 text-white">
                                <Car size={24} />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-xl font-extrabold text-white tracking-tight leading-none">
                                    PARK<span className="text-orange-500">IVIA</span>
                                </span>
                                <span className="text-[9px] font-bold tracking-widest text-slate-500 uppercase">Hệ Thống Đậu Xe</span>
                            </div>
                        </Link>
                        <p className="leading-relaxed text-sm">
                            Chúng tôi cung cấp các giải pháp đậu xe tốt nhất cho phương tiện của bạn. Bãi đậu xe an toàn, giá cả phải chăng và thuận tiện trong thành phố với hệ thống giám sát 24/7.
                        </p>
                        <div className="flex items-center gap-4">
                            {[
                                { Icon: Facebook, url: 'https://facebook.com' },
                                { Icon: Twitter, url: 'https://twitter.com' },
                                { Icon: Instagram, url: 'https://instagram.com' },
                                { Icon: Linkedin, url: 'https://linkedin.com' }
                            ].map(({ Icon, url }, idx) => (
                                <a
                                    key={idx}
                                    href={url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-orange-500 hover:text-white transition-all duration-300"
                                >
                                    <Icon size={18} />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Column 2: Quick Links */}
                    <div>
                        <h3 className="text-white text-lg font-bold mb-6 relative inline-block">
                            Liên Kết Nhanh
                            <span className="absolute bottom-0 left-0 w-1/2 h-0.5 bg-orange-500"></span>
                        </h3>
                        <ul className="space-y-4">
                            {['Về Chúng Tôi', 'Dịch Vụ', 'Bảng Giá', 'Liên Hệ', 'Chính Sách Bảo Mật'].map((item) => (
                                <li key={item}>
                                    <Link to="/" className="flex items-center gap-2 hover:text-orange-500 transition-colors text-sm">
                                        <ArrowRight size={14} className="text-orange-500" />
                                        {item}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Column 3: Our Services */}
                    <div>
                        <h3 className="text-white text-lg font-bold mb-6 relative inline-block">
                            Dịch Vụ Của Chúng Tôi
                            <span className="absolute bottom-0 left-0 w-1/2 h-0.5 bg-orange-500"></span>
                        </h3>
                        <ul className="space-y-4">
                            {['Đậu Xe Dài Hạn', 'Đậu Xe Theo Giờ', 'Sạc Xe Điện'].map((item) => (
                                <li key={item}>
                                    <Link to="/" className="flex items-center gap-2 hover:text-orange-500 transition-colors text-sm">
                                        <ArrowRight size={14} className="text-orange-500" />
                                        {item}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Column 4: Contact Info */}
                    <div>
                        <h3 className="text-white text-lg font-bold mb-6 relative inline-block">
                            Thông Tin Liên Hệ
                            <span className="absolute bottom-0 left-0 w-1/2 h-0.5 bg-orange-500"></span>
                        </h3>
                        <div className="space-y-6 text-sm">
                            <div className="flex items-start gap-3">
                                <div className="mt-1 text-orange-500"><MapPin size={18} /></div>
                                <p>123 Đường Trường Trinh, Hà Nội, Việt Nam</p>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="text-orange-500"><Phone size={18} /></div>
                                <p>0912 345 678</p>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="text-orange-500"><Mail size={18} /></div>
                                <p>support@parkivia.com</p>
                            </div>
                            <div className="pt-4">
                                <div className="text-white font-bold mb-2">Giờ Mở Cửa:</div>
                                <p>Thứ 2 - Thứ 7: 8:00 Sáng - 6:00 Chiều</p>
                                <p>Chủ Nhật: Đóng Cửa</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Bar */}
            <div className="bg-slate-950 py-6 border-t border-slate-800">
                <div className="container mx-auto px-4 md:px-8 flex flex-col md:flex-row justify-between items-center text-sm">
                    <p>&copy; {new Date().getFullYear()} Parkivia. Bảo Lưu Mọi Quyền.</p>
                    <div className="flex gap-6 mt-4 md:mt-0">
                        <Link to="/" className="hover:text-white transition-colors">Điều Khoản Sử Dụng</Link>
                        <Link to="/" className="hover:text-white transition-colors">Chính Sách Bảo Mật</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
