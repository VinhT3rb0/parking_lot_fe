import React, { useState, useEffect } from 'react';
import { Quote, Star, ChevronLeft, ChevronRight } from 'lucide-react';
import { Image } from 'antd';

const Testimonials: React.FC = () => {
    const reviews = [
        {
            id: 1,
            name: "Nguyễn Văn An",
            location: "Hà Nội",
            avatar: "https://i.pravatar.cc/150?img=11",
            text: "Dịch vụ của Parkivia thực sự tuyệt vời. Tôi không còn phải lo lắng về chỗ đậu xe mỗi khi đi làm nữa. Ứng dụng rất dễ sử dụng và nhân viên rất nhiệt tình.",
            rating: 5
        },
        {
            id: 2,
            name: "Trần Thị Mai",
            location: "TP. Hồ Chí Minh",
            avatar: "https://i.pravatar.cc/150?img=5",
            text: "Bãi đậu xe rộng rãi, an ninh tốt. Tôi thích nhất là tính năng đặt chỗ trước, giúp tiết kiệm rất nhiều thời gian. Giá cả cũng rất hợp lý so với chất lượng.",
            rating: 5
        },
        {
            id: 3,
            name: "Lê Minh Tuấn",
            location: "Đà Nẵng",
            avatar: "https://i.pravatar.cc/150?img=3",
            text: "Đội ngũ hỗ trợ khách hàng rất chuyên nghiệp. Tôi gặp một chút sự cố nhỏ lúc ra vào cổng nhưng đã được giải quyết ngay lập tức. Rất hài lòng!",
            rating: 4
        },
        {
            id: 4,
            name: "Phạm Thu Hương",
            location: "Hải Phòng",
            avatar: "https://i.pravatar.cc/150?img=9",
            text: "App đặt chỗ rất tiện lợi, giao diện thân thiện. Tôi thường xuyên sử dụng dịch vụ rửa xe tại đây, xe luôn sạch sẽ và thơm tho. 10 điểm!",
            rating: 5
        },
        {
            id: 5,
            name: "Hoàng Đức Mạnh",
            location: "Cần Thơ",
            avatar: "https://i.pravatar.cc/150?img=13",
            text: "Bãi đỗ xe an toàn, có mái che cẩn thận. Tôi rất yên tâm khi gửi xe qua đêm tại đây. Giá cước minh bạch, không phụ thu vô lý.",
            rating: 5
        }
    ];

    const [currentIndex, setCurrentIndex] = useState(0);
    const [itemsToShow, setItemsToShow] = useState(3);

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 768) {
                setItemsToShow(1);
            } else if (window.innerWidth < 1024) {
                setItemsToShow(2);
            } else {
                setItemsToShow(3);
            }
        };

        handleResize(); // Set initial value
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const maxIndex = Math.max(0, reviews.length - itemsToShow);

    const nextSlide = () => {
        setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
    };

    const prevSlide = () => {
        setCurrentIndex((prev) => (prev <= 0 ? maxIndex : prev - 1));
    };

    const goToSlide = (index: number) => {
        setCurrentIndex(index);
    };

    return (
        <section className="py-24 bg-slate-900 relative overflow-hidden font-sans">
            {/* Background Pattern - Abstract Map/Lines */}
            <div className="absolute inset-0 opacity-10 pointer-events-none">
                <svg className="h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                    <path d="M0 100 C 20 0 50 0 100 100 Z" fill="none" stroke="white" strokeWidth="0.5" />
                    <path d="M0 0 C 50 100 80 100 100 0 Z" fill="none" stroke="white" strokeWidth="0.5" />
                    <circle cx="50" cy="50" r="40" stroke="white" strokeWidth="0.2" fill="none" />
                </svg>
            </div>

            <div className="container mx-auto px-4 md:px-8 relative z-10">
                {/* Section Header */}
                <div className="text-center mb-16">
                    <span className="text-orange-500 font-bold uppercase tracking-widest text-sm">Phản Hồi Khách Hàng</span>
                    <h2 className="text-3xl md:text-5xl font-extrabold text-white mt-3">
                        Khách Hàng Nói Gì <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-orange-600">
                            Về Chúng Tôi?
                        </span>
                    </h2>
                    <div className="w-24 h-1.5 bg-orange-500 mx-auto mt-6 rounded-full"></div>
                </div>

                {/* Slider Container */}
                <div className="relative max-w-7xl mx-auto">
                    {/* Navigation Buttons */}
                    <button
                        onClick={prevSlide}
                        className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 md:-translate-x-12 z-20 bg-white/10 hover:bg-orange-500 text-white p-3 rounded-full backdrop-blur-sm transition-all duration-300 shadow-lg group"
                        aria-label="Previous slide"
                    >
                        <ChevronLeft size={24} className="group-hover:scale-110 transition-transform" />
                    </button>

                    <button
                        onClick={nextSlide}
                        className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 md:translate-x-12 z-20 bg-white/10 hover:bg-orange-500 text-white p-3 rounded-full backdrop-blur-sm transition-all duration-300 shadow-lg group"
                        aria-label="Next slide"
                    >
                        <ChevronRight size={24} className="group-hover:scale-110 transition-transform" />
                    </button>

                    {/* Viewport */}
                    <div className="overflow-hidden px-2 py-4 -mx-2">
                        <div
                            className="flex transition-transform duration-500 ease-out"
                            style={{ transform: `translateX(-${currentIndex * (100 / itemsToShow)}%)` }}
                        >
                            {reviews.map((review) => (
                                <div
                                    key={review.id}
                                    className="flex-shrink-0 px-4"
                                    style={{ width: `${100 / itemsToShow}%` }}
                                >
                                    <div className="bg-white rounded-2xl p-8 pt-12 relative shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 h-full flex flex-col">
                                        {/* Quote Icon - Floating Top Center */}
                                        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-orange-500 text-white p-4 rounded-full shadow-lg">
                                            <Quote size={20} fill="currentColor" />
                                        </div>

                                        {/* Content */}
                                        <div className="text-center mb-6 flex-grow">
                                            <div className="flex justify-center mb-4">
                                                {[...Array(5)].map((_, i) => (
                                                    <Star
                                                        key={i}
                                                        size={16}
                                                        className={`${i < review.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
                                                    />
                                                ))}
                                            </div>
                                            <p className="text-gray-600 italic leading-relaxed text-lg line-clamp-4">
                                                "{review.text}"
                                            </p>
                                        </div>

                                        {/* Author Info */}
                                        <div className="text-center border-t border-gray-100 pt-6 mt-auto flex flex-col items-center">
                                            <div className="w-16 h-16 rounded-full border-4 border-white shadow-md overflow-hidden mb-3 ring-2 ring-gray-100">
                                                <Image
                                                    src={review.avatar}
                                                    alt={review.name}
                                                    className="w-full h-full object-cover"
                                                    preview={false}
                                                />
                                            </div>
                                            <h4 className="font-bold text-slate-900 text-xl">{review.name}</h4>
                                            <span className="text-orange-500 text-sm font-medium uppercase tracking-wide">{review.location}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Dots Indicator */}
                    <div className="flex justify-center mt-10 gap-3">
                        {Array.from({ length: maxIndex + 1 }).map((_, idx) => (
                            <button
                                key={idx}
                                onClick={() => goToSlide(idx)}
                                className={`h-3 rounded-full transition-all duration-300 ${currentIndex === idx
                                    ? 'w-10 bg-orange-500'
                                    : 'w-3 bg-white/30 hover:bg-white/60'
                                    }`}
                                aria-label={`Go to slide ${idx + 1}`}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Testimonials;
