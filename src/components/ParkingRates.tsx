import React, { useState } from 'react';
import { useGetPopularParkingPlansQuery } from '../api/app_parkingPlan/apiParkingPlan';
import { Spin, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Check } from 'lucide-react';
import MemberRequestModal from './MemberRequestModal';

const ParkingRates: React.FC = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedPlan, setSelectedPlan] = useState<{ name: string, id: number } | { name: '', id: 0 }>({ name: '', id: 0 });
    const { isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const { data: popularPlansData, isLoading } = useGetPopularParkingPlansQuery();

    const plansSource = (popularPlansData as any)?.data || popularPlansData || [];
    const plansToDisplay = Array.isArray(plansSource) ? plansSource.slice(0, 4) : [];
    const firstPopularIndex = plansToDisplay.findIndex((p: any) => p.isPopular);
    const plans = plansToDisplay.map((plan: any, index: number) => {
        const features = [];
        if (plan.isUnlimitedParking) features.push("Đỗ xe không giới hạn");
        if (plan.hasFixedSpot) features.push("Chỗ cố định");
        if (plan.hasValetService) features.push("Dịch vụ Valet");
        if (plan.hasCarWash) features.push("Rửa xe miễn phí");
        if (plan.hasCoveredParking) features.push("Có mái che");
        if (plan.hasSecurity247) features.push("An ninh 24/7");
        const isPopular = plan.isPopular && index === firstPopularIndex;

        return {
            id: plan.id,
            name: plan.name,
            price: new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(plan.price),
            period: plan.priceUnit === 'DAY' ? '/ ngày' : (plan.priceUnit === 'MONTH' ? '/ tháng' : '/ năm'),
            desc: plan.description,
            features: features,
            isPopular: index === 1
        };
    });

    if (isLoading) {
        return <div className="flex justify-center py-20"><Spin size="large" /></div>;
    }

    const handleOpenModal = (planName: string, planId: number) => {
        if (!isAuthenticated) {
            message.warning("Vui lòng đăng nhập để đăng ký thành viên!");
            navigate('/login');
            return;
        }
        setSelectedPlan({ name: planName, id: planId });
        setIsModalOpen(true);
    };

    return (
        <section className="py-20 bg-gray-50 font-sans">
            <div className="container mx-auto px-4 md:px-8">
                {/* Header */}
                <div className="text-center mb-16">
                    <span className="text-orange-500 font-bold uppercase tracking-widest text-sm">Bảng Giá Dịch Vụ</span>
                    <h2 className="text-3xl md:text-5xl font-extrabold text-slate-900 mt-3">
                        Gói Member & <br />
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

                                <button
                                    onClick={() => handleOpenModal(plan.name, plan.id)}
                                    className={`w-full py-3 rounded-lg font-bold uppercase text-sm tracking-wider transition-colors
                                    ${plan.isPopular
                                            ? 'bg-orange-500 text-white hover:bg-orange-600 shadow-md shadow-orange-500/20'
                                            : 'bg-slate-100 text-slate-600 hover:bg-slate-900 hover:text-white'}
                                `}>
                                    Đăng Ký Ngay
                                </button>
                            </div>

                            {!plan.isPopular && (
                                <div className="absolute inset-0 border-2 border-dashed border-gray-200 rounded-xl pointer-events-none"></div>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* Request Modal */}
            <MemberRequestModal
                visible={isModalOpen}
                onCancel={() => setIsModalOpen(false)}
                initialPlan={selectedPlan.name}
                initialPlanId={selectedPlan.id}
            />
        </section>
    );
};

export default ParkingRates;
