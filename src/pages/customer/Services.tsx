import React from 'react';
import PageHeader from '../../components/PageHeader';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Car, Clock, Zap, Shield, ArrowRight, Check } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Image } from 'antd';
import ScrollToTop from '../../components/ScrollToTop';

const Services: React.FC = () => {
    const services = [
        {
            id: 1,
            title: "Đậu Xe Hộ (Valet Parking)",
            desc: "Trải nghiệm dịch vụ đẳng cấp VIP. Chỉ cần lái xe đến sảnh, nhân viên chuyên nghiệp của chúng tôi sẽ lo phần còn lại. An toàn, tiện lợi và tiết kiệm thời gian.",
            icon: <Car size={40} className="text-white" />,
            image: "https://images.unsplash.com/photo-1601362840469-51e4d8d58785?q=80&w=2670&auto=format&fit=crop",
            features: ["Nhân viên chuyên nghiệp", "Giao nhận xe tại sảnh", "Bảo hiểm trách nhiệm"]
        },
        {
            id: 2,
            title: "Đậu Xe Dài Hạn",
            desc: "Giải pháp hoàn hảo cho những chuyến công tác hay du lịch dài ngày. Bãi xe được giám sát 24/7, đảm bảo an toàn tuyệt đối cho phương tiện của bạn với mức giá ưu đãi.",
            icon: <Clock size={40} className="text-white" />,
            image: "https://images.unsplash.com/photo-1470224114660-3f6686c562eb?q=80&w=2669&auto=format&fit=crop",
            features: ["Giám sát 24/7", "Mái che bảo vệ", "Ưu đãi dài hạn"]
        },
        {
            id: 3,
            title: "Sạc Xe Điện",
            desc: "Hệ thống trạm sạc hiện đại, tương thích với hầu hết các dòng xe điện trên thị trường. Vừa đậu xe an toàn, vừa nạp đầy năng lượng cho hành trình tiếp theo.",
            icon: <Zap size={40} className="text-white" />,
            image: "https://images.unsplash.com/photo-1593941707882-a5bba14938c7?q=80&w=2672&auto=format&fit=crop",
            features: ["Sạc nhanh DC", "Tương thích đa dòng xe", "Thanh toán tiện lợi"]
        },
        {
            id: 4,
            title: "An Ninh Cao Cấp",
            desc: "Hệ thống camera AI nhận diện biển số và khuôn mặt, cùng đội ngũ bảo vệ tuần tra liên tục. Sự an toàn của tài sản khách hàng là ưu tiên hàng đầu của chúng tôi.",
            icon: <Shield size={40} className="text-white" />,
            image: "https://images.unsplash.com/photo-1557597774-9d273605dfa9?q=80&w=2670&auto=format&fit=crop",
            features: ["Camera AI", "Bảo vệ 24/24", "Kiểm soát ra vào"]
        }
    ];

    return (
        <div className="font-sans">
            <ScrollToTop />
            <PageHeader
                title="Dịch Vụ Của Chúng Tôi"
                breadcrumbs={[{ name: "Dịch Vụ", path: "/services" }]}
                backgroundImage="https://images.unsplash.com/photo-1590674899484-d5640e854abe?q=80&w=2667&auto=format&fit=crop"
            />

            {/* Main Services Grid */}
            <section className="py-20 px-4 md:px-8 bg-gray-50">
                <div className="container mx-auto">
                    <div className="text-center mb-16">
                        <span className="text-orange-500 font-bold uppercase tracking-widest text-sm">Những Gì Chúng Tôi Cung Cấp</span>
                        <h2 className="text-3xl md:text-5xl font-extrabold text-slate-900 mt-3">
                            Giải Pháp Đậu Xe <br /> <span className="text-blue-600">Toàn Diện</span>
                        </h2>
                        <div className="w-24 h-1.5 bg-orange-500 mx-auto mt-6 rounded-full"></div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {services.map((service) => (
                            <div key={service.id} className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 group flex flex-col h-full hover:-translate-y-2">
                                <div className="h-64 overflow-hidden relative">
                                    <Image
                                        src={service.image}
                                        alt={service.title}
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                        preview={false}
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent opacity-80"></div>
                                    <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between">
                                        <div className="bg-orange-500 p-3 rounded-lg text-white shadow-lg">
                                            {service.icon}
                                        </div>
                                    </div>
                                </div>
                                <div className="p-8 flex flex-col flex-grow">
                                    <h3 className="text-2xl font-bold text-slate-900 mb-4 group-hover:text-orange-500 transition-colors">{service.title}</h3>
                                    <p className="text-gray-500 mb-6 leading-relaxed flex-grow">{service.desc}</p>

                                    <div className="space-y-3 mb-8">
                                        {service.features.map((feature, idx) => (
                                            <div key={idx} className="flex items-center text-sm font-medium text-slate-600">
                                                <div className="w-2 h-2 rounded-full bg-blue-500 mr-2"></div>
                                                {feature}
                                            </div>
                                        ))}
                                    </div>

                                    <Link to="/contact" className="inline-flex items-center font-bold text-orange-500 hover:text-blue-600 transition-colors uppercase tracking-wide text-sm mt-auto">
                                        Đặt Dịch Vụ Này <ArrowRight size={16} className="ml-2" />
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Process/How It Works */}
            <section className="py-20 bg-slate-900 text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 p-12 opacity-5">
                    <Car size={300} />
                </div>
                <div className="container mx-auto px-4 md:px-8 relative z-10">
                    <div className="text-center mb-16">
                        <span className="text-orange-500 font-bold uppercase tracking-widest text-sm">Quy Trình</span>
                        <h2 className="text-3xl md:text-5xl font-extrabold mt-3">Cách Thức Hoạt Động</h2>
                    </div>

                    <div className="flex flex-col md:flex-row justify-between items-center gap-8 relative">
                        {/* Connecting Line (Hidden on mobile) */}
                        <div className="hidden md:block absolute top-1/2 left-0 w-full h-1 bg-white/10 -translate-y-1/2 z-0"></div>

                        {[
                            { num: "01", title: "Đặt Chỗ", desc: "Chọn bãi xe và thời gian qua App Parkivia." },
                            { num: "02", title: "Đến Bãi Xe", desc: "Lái xe đến điểm đã đặt. Hệ thống tự động nhận diện." },
                            { num: "03", title: "Tận Hưởng", desc: "Sử dụng các dịch vụ tiện ích trong khi chúng tôi trông xe." },
                            { num: "04", title: "Thanh Toán", desc: "Thanh toán không tiền mặt và rời đi nhanh chóng." }
                        ].map((step, idx) => (
                            <div key={idx} className="relative z-10 bg-slate-800 p-8 rounded-2xl border border-slate-700 w-full md:w-1/4 text-center hover:bg-slate-700 transition-colors duration-300">
                                <div className="text-5xl font-black text-slate-700 mb-4 opacity-50 absolute top-4 right-4">{step.num}</div>
                                <div className="w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6 shadow-lg shadow-orange-500/30">
                                    {step.num}
                                </div>
                                <h4 className="text-xl font-bold mb-3">{step.title}</h4>
                                <p className="text-gray-400 text-sm">{step.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-24 bg-gradient-to-r from-orange-500 to-red-500 text-white text-center">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl md:text-5xl font-extrabold mb-6">Sẵn Sàng Trải Nghiệm Dịch Vụ 5 Sao?</h2>
                    <p className="text-xl mb-10 max-w-2xl mx-auto opacity-90">Đừng để việc tìm chỗ đậu xe làm phiền bạn. Hãy để Parkivia chăm sóc chiếc xe của bạn ngay hôm nay.</p>
                    <div className="flex flex-col sm:flex-row justify-center gap-4">
                        <Link to="/contact" className="bg-slate-900 text-white px-8 py-4 rounded-lg font-bold hover:bg-slate-800 transition-all shadow-xl hover:scale-105">
                            Liên Hệ Ngay
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Services;
