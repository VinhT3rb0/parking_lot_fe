import React from 'react';
import { Check } from 'lucide-react';

const ParkingRates: React.FC = () => {
    const plans = [
        {
            name: "Cao Cấp",
            price: "300.000đ",
            period: "/ ngày",
            desc: "Gói này bao gồm tất cả các dịch vụ đi kèm với một chỗ đậu xe!",
            features: ["Đậu xe không giới hạn", "Dịch vụ Valet", "Rửa xe miễn phí", "Có mái che"],
            isPopular: false
        },
        {
            name: "Tiêu Chuẩn",
            price: "150.000đ",
            period: "/ ngày",
            desc: "Nhận thời gian không giới hạn và một chỗ đậu xe cố định tại một trong các bãi.",
            features: ["Đậu xe không giới hạn", "Chỗ cố định", "An ninh 24/7", "Có mái che"],
            isPopular: true
        },
        {
            name: "Cơ Bản",
            price: "50.000đ",
            period: "/ ngày",
            desc: "Gói giới hạn hoàn hảo cho kỳ nghỉ ngắn với các chỗ đậu xe ngẫu nhiên.",
            features: ["Đậu xe trong ngày", "Chỗ ngẫu nhiên", "An ninh 24/7"],
            isPopular: false
        },
        {
            name: "Tiết Kiệm",
            price: "10.000đ",
            period: "/ giờ",
            desc: "Nhận một chỗ đậu xe tại thời điểm đến. Không có dịch vụ đi kèm.",
            features: ["Tính theo giờ", "Chỗ ngẫu nhiên", "Ngoài trời"],
            isPopular: false
        }
    ];

    return (
        <section className="py-20 bg-gray-50 font-sans">
            <div className="container mx-auto px-4 md:px-8">
                {/* Header */}
                <div className="text-center mb-16">
                    <span className="text-orange-500 font-bold uppercase tracking-widest text-sm">Bảng Giá Dịch Vụ</span>
                    <h2 className="text-3xl md:text-5xl font-extrabold text-slate-900 mt-3">
                        Gói Cước & <br />
                        <span className="text-blue-600">
                            Tùy Chọn Đậu Xe
                        </span>
                    </h2>
                    <div className="w-24 h-1.5 bg-orange-500 mx-auto mt-6 rounded-full"></div>
                </div>

                {/* Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {plans.map((plan, idx) => (
                        <div
                            key={idx}
                            className={`relative bg-white rounded-xl overflow-hidden border-2 transition-all duration-300 hover:-translate-y-2 hover:shadow-xl flex flex-col
                                ${plan.isPopular ? 'border-orange-500 shadow-lg scale-105 z-10' : 'border-transparent hover:border-blue-200'}
                            `}
                        >
                            {plan.isPopular && (
                                <div className="bg-orange-500 text-white text-xs font-bold uppercase py-1 px-4 absolute top-0 right-0 rounded-bl-xl">
                                    Phổ Biến
                                </div>
                            )}

                            <div className="p-8 text-center border-b border-gray-100">
                                <div className="flex justify-center items-baseline text-slate-900 mb-2">
                                    <span className="text-2xl md:text-3xl font-extrabold text-blue-600">{plan.price}</span>
                                    <span className="text-gray-500 ml-1 text-sm">{plan.period}</span>
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 mb-4">{plan.name}</h3>
                                <p className="text-gray-500 text-sm leading-relaxed mb-0">
                                    {plan.desc}
                                </p>
                            </div>

                            <div className="p-8 bg-white flex-grow flex flex-col justify-between">
                                <ul className="space-y-3 mb-8">
                                    {plan.features.map((feature, fIdx) => (
                                        <li key={fIdx} className="flex items-center text-sm text-gray-600">
                                            <div className="w-5 h-5 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center mr-3 shrink-0">
                                                <Check size={12} strokeWidth={3} />
                                            </div>
                                            {feature}
                                        </li>
                                    ))}
                                </ul>

                                <button className={`w-full py-3 rounded-lg font-bold uppercase text-sm tracking-wider transition-colors
                                    ${plan.isPopular
                                        ? 'bg-orange-500 text-white hover:bg-orange-600 shadow-md shadow-orange-500/20'
                                        : 'bg-slate-100 text-slate-600 hover:bg-slate-900 hover:text-white'}
                                `}>
                                    Tìm Hiểu Thêm
                                </button>
                            </div>

                            {/* Dotted Border Effect for non-popular items to match the image style roughly */}
                            {!plan.isPopular && (
                                <div className="absolute inset-0 border-2 border-dashed border-gray-200 rounded-xl pointer-events-none"></div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default ParkingRates;
