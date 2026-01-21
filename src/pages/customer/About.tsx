import React from 'react';
import PageHeader from '../../components/PageHeader';
import { CheckCircle, Users, Award, Clock } from 'lucide-react';
import Testimonials from '../../components/Testimonials';
import ScrollToTop from '../../components/ScrollToTop';
import { Image } from 'antd';

const About: React.FC = () => {
    const stats = [
        { icon: <Clock size={32} />, value: "15+", label: "Năm Kinh Nghiệm" },
        { icon: <Users size={32} />, value: "10K+", label: "Khách Hàng Hài Lòng" },
        { icon: <CheckCircle size={32} />, value: "50+", label: "Bãi Đỗ Xe" },
        { icon: <Award size={32} />, value: "24/7", label: "Hỗ Trợ Tiêu Chuẩn" },
    ];

    const team = [
        {
            name: "John Doe",
            role: "Nhà Sáng Lập",
            img: "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=2574&auto=format&fit=crop"
        },
        {
            name: "Jane Smith",
            role: "Giám Đốc Điều Hành",
            img: "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=2661&auto=format&fit=crop"
        },
        {
            name: "Mike Johnson",
            role: "Trưởng Phòng Kỹ Thuật",
            img: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=2574&auto=format&fit=crop"
        },
        {
            name: "Sarah Williams",
            role: "Quản Lý Khách Hàng",
            img: "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=2661&auto=format&fit=crop"
        }
    ];

    return (
        <div className="font-sans">
            <ScrollToTop />
            <PageHeader
                title="Về Chúng Tôi"
                breadcrumbs={[{ name: "Về Chúng Tôi", path: "/about" }]}
            />

            {/* Introduction Section */}
            <section className="py-20 px-4 md:px-8 bg-white">
                <div className="container mx-auto">
                    <div className="flex flex-col lg:flex-row items-center gap-16">
                        <div className="w-full lg:w-1/2">
                            <div className="relative rounded-lg overflow-hidden shadow-2xl">
                                <Image
                                    src="https://images.unsplash.com/photo-1590674899484-d5640e854abe?q=80&w=2667&auto=format&fit=crop"
                                    alt="About Parkivia"
                                    preview={false}
                                    className="w-full h-auto object-cover transform hover:scale-105 transition-transform duration-700"
                                />
                                <div className="absolute bottom-0 right-0 bg-orange-500 text-white p-8 rounded-tl-3xl">
                                    <p className="text-4xl font-extrabold mb-1">15+</p>
                                    <p className="text-sm font-medium uppercase tracking-wider">Năm Kinh Nghiệm</p>
                                </div>
                            </div>
                        </div>
                        <div className="w-full lg:w-1/2">
                            <span className="text-orange-500 font-bold uppercase tracking-widest text-sm mb-2 block">Câu Chuyện Của Chúng Tôi</span>
                            <h2 className="text-4xl font-extrabold text-slate-900 mb-6 leading-tight">
                                Giải Pháp Đậu Xe <br /> <span className="text-blue-600">Thông Minh & Hiện Đại</span>
                            </h2>
                            <p className="text-gray-500 mb-6 leading-relaxed text-lg">
                                Được thành lập vào năm 2010, Parkivia đã trở thành đơn vị tiên phong trong lĩnh vực cung cấp giải pháp bãi đậu xe thông minh tại Việt Nam. Chúng tôi hiểu rằng, mỗi chuyến đi đều bắt đầu và kết thúc tại một chỗ đậu xe tốt.
                            </p>
                            <p className="text-gray-500 mb-8 leading-relaxed">
                                Sứ mệnh của chúng tôi là làm cho việc tìm kiếm chỗ đậu xe trở nên dễ dàng, an toàn và thuận tiện nhất có thể. Với hệ thống công nghệ tiên tiến và đội ngũ nhân viên tận tâm, chúng tôi cam kết mang đến trải nghiệm 5 sao cho mọi khách hàng.
                            </p>

                            <ul className="space-y-4">
                                {["Hệ thống giám sát an ninh 24/7", "Đặt chỗ nhanh chóng qua ứng dụng", "Đội ngũ hỗ trợ chuyên nghiệp", "Giá cả minh bạch, cạnh tranh"].map((item, idx) => (
                                    <li key={idx} className="flex items-center text-slate-700 font-medium">
                                        <CheckCircle className="text-orange-500 mr-3" size={20} />
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="py-16 bg-blue-600 text-white">
                <div className="container mx-auto px-4 md:px-8">
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center divide-x divide-blue-500/50">
                        {stats.map((stat, idx) => (
                            <div key={idx} className="p-4 group">
                                <div className="mb-4 inline-flex p-4 bg-white/10 rounded-full group-hover:bg-white group-hover:text-blue-600 transition-colors duration-300">
                                    {stat.icon}
                                </div>
                                <h3 className="text-4xl font-extrabold mb-2">{stat.value}</h3>
                                <p className="text-blue-100 font-medium uppercase tracking-wider text-sm">{stat.label}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Team Section */}
            <section className="py-20 bg-gray-50">
                <div className="container mx-auto px-4 md:px-8">
                    <div className="text-center mb-16">
                        <span className="text-orange-500 font-bold uppercase tracking-widest text-sm">Đội Ngũ Chuyên Gia</span>
                        <h2 className="text-3xl md:text-5xl font-extrabold text-slate-900 mt-3">Gặp Gỡ Đội Ngũ</h2>
                        <div className="w-24 h-1.5 bg-orange-500 mx-auto mt-6 rounded-full"></div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {team.map((member, idx) => (
                            <div key={idx} className="bg-white rounded-xl overflow-hidden shadow-lg group">
                                <div className="h-80 overflow-hidden relative">
                                    <img
                                        src={member.img}
                                        alt={member.name}
                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                    />
                                    <div className="absolute inset-0 bg-slate-900/0 group-hover:bg-slate-900/60 transition-colors duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                                        <button className="bg-orange-500 text-white px-6 py-2 rounded-full font-bold text-sm transform translate-y-4 group-hover:translate-y-0 transition-all duration-300">XEM HỒ SƠ</button>
                                    </div>
                                </div>
                                <div className="p-6 text-center">
                                    <h4 className="text-xl font-bold text-slate-900 mb-1 group-hover:text-orange-500 transition-colors">{member.name}</h4>
                                    <p className="text-gray-500 text-sm uppercase tracking-wide">{member.role}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Reuse Testimonials */}
            <Testimonials />
        </div>
    );
};

export default About;
