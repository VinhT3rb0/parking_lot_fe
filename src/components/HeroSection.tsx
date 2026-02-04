import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, ArrowRight, Phone, MapPin } from 'lucide-react';
import { useGetAllParkingLotsQuery } from '../api/app_parkinglot/apiParkinglot';
import { useNavigate } from 'react-router-dom';
import { message } from 'antd';

const HERO_IMAGE_URL = "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2670&auto=format&fit=crop";

const HeroSection: React.FC = () => {
    // const [formState, setFormState] = useState({
    //     name: '',
    //     email: '',
    //     phone: '',
    //     service: 'Valet Parking'
    // });

    const { data: parkingLotsData } = useGetAllParkingLotsQuery({});
    const navigate = useNavigate();
    const [selectedLotId, setSelectedLotId] = useState<string>("");

    const handleAction = () => {
        if (selectedLotId) {
            navigate(`/parking-lots/${selectedLotId}`);
        } else {
            message.info("Vui lòng chọn bãi đỗ xe để xem chi tiết!");
        }
    };

    // Safely access data if wrapped
    const parkingLots = Array.isArray(parkingLotsData) ? parkingLotsData : (parkingLotsData as any)?.data || [];

    return (
        <div className="relative w-full">
            <div className="relative h-[600px] md:h-[700px] w-full bg-slate-900 overflow-hidden">
                <div
                    className="absolute inset-0 bg-cover bg-center z-0"
                    style={{ backgroundImage: `url('${HERO_IMAGE_URL}')` }}
                >
                    <div className="absolute inset-0 bg-slate-900/60 mix-blend-multiply"></div>
                </div>

                {/* Content Container */}
                <div className="relative z-10 container mx-auto px-4 md:px-8 h-full flex flex-col justify-center items-start pt-20">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="max-w-3xl"
                    >
                        <span className="inline-block py-1 px-3 border border-orange-500 text-orange-400 text-sm font-bold uppercase tracking-widest mb-4 bg-slate-900/50 backdrop-blur-sm">
                            Giải Pháp Đậu Xe Cao Cấp
                        </span>
                        <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold text-white leading-tight mb-6">
                            An Toàn & Tiện Lợi <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-orange-600">
                                Cho Xe Của Bạn
                            </span>
                        </h1>
                        <p className="text-lg md:text-xl text-gray-300 mb-8 max-w-2xl leading-relaxed">
                            Trải nghiệm dịch vụ đậu xe không rắc rối với cơ sở vật chất hiện đại của chúng tôi.
                            Giám sát 24/7, dịch vụ chuyên nghiệp và mức giá cạnh tranh.
                        </p>

                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8, delay: 0.6 }}
                            className="flex gap-4"
                        >
                            <button className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-4 px-8 rounded-sm uppercase tracking-wider transition-all shadow-lg hover:shadow-orange-500/20 flex items-center gap-2 group">
                                Dịch Vụ
                                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                            </button>
                            <button className="bg-transparent border-2 border-white hover:bg-white hover:text-slate-900 text-white font-bold py-4 px-8 rounded-sm uppercase tracking-wider transition-all">
                                Tìm Hiểu Thêm
                            </button>
                        </motion.div>
                    </motion.div>
                </div>
            </div>

            {/* "Request a Call" Bar - Static below hero */}
            <div className="relative w-full z-20 px-4 -mt-20 mb-10">
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 1 }}
                    className="container mx-auto"
                >
                    <div className="bg-white shadow-2xl rounded-lg overflow-hidden flex flex-col lg:flex-row">
                        <div className="bg-orange-500 p-8 lg:w-1/4 flex flex-col justify-center items-start text-white relative overflow-hidden group">
                            <div className="absolute -right-6 -top-6 bg-orange-400 w-24 h-24 rounded-full opacity-50 group-hover:scale-150 transition-transform duration-500"></div>
                            <h3 className="text-2xl font-bold relative z-10">Tìm Kiếm</h3>
                            <h3 className="text-2xl font-light relative z-10">Bãi Đỗ</h3>
                            <p className="text-orange-100 text-sm mt-2 relative z-10">Tìm ngay bãi đỗ xe gần bạn nhất.</p>
                        </div>

                        <div className="p-8 lg:w-3/4 bg-white flex flex-col md:flex-row gap-6 items-center">
                            <div className="flex-1 w-full relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <User className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    type="text"
                                    placeholder="Họ và Tên (Tùy chọn)"
                                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                                />
                            </div>

                            <div className="flex-1 w-full relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Phone className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    type="number"
                                    placeholder="Số Điện Thoại (Tùy chọn)"
                                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                                />
                            </div>

                            <div className="flex-1 w-full relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <MapPin className="h-5 w-5 text-gray-400" />
                                </div>
                                <select
                                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all text-gray-700 appearance-none cursor-pointer"
                                    value={selectedLotId}
                                    onChange={(e) => setSelectedLotId(e.target.value)}
                                >
                                    <option value="" disabled>Chọn Bãi Đỗ Xe</option>
                                    {parkingLots.map((lot: any) => (
                                        <option key={lot.id} value={lot.id}>{lot.name}</option>
                                    ))}
                                </select>
                            </div>

                            <button
                                onClick={handleAction}
                                className="w-full md:w-auto bg-slate-900 hover:bg-slate-800 text-white font-bold py-3 px-8 rounded-sm uppercase tracking-wider transition-colors shadow-lg whitespace-nowrap"
                            >
                                Xem Chi Tiết
                            </button>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default HeroSection;
