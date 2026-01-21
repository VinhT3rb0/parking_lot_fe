import React, { useRef, useState } from 'react';
import { Play, Pause } from 'lucide-react';
import { Smartphone, Shield, DollarSign, Clock } from 'lucide-react';

const WhyChooseUs: React.FC = () => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [isPlaying, setIsPlaying] = useState(false);

    const togglePlay = () => {
        if (videoRef.current) {
            if (videoRef.current.paused) {
                videoRef.current.play().catch(error => {
                    console.error("Error attempting to play video:", error);
                });
            } else {
                videoRef.current.pause();
            }
        }
    };

    const features = [
        {
            icon: <Smartphone size={32} className="text-white" />,
            title: "Đặt Chỗ Dễ Dàng",
            desc: "Ứng dụng thông minh giúp bạn tìm và đặt chỗ nhanh chóng."
        },
        {
            icon: <Shield size={32} className="text-white" />,
            title: "An Toàn Tuyệt Đối",
            desc: "Hệ thống camera giám sát và bảo vệ 24/7."
        },
        {
            icon: <DollarSign size={32} className="text-white" />,
            title: "Chi Phí Hợp Lý",
            desc: "Nhiều gói cước linh hoạt phù hợp với mọi nhu cầu."
        },
        {
            icon: <Clock size={32} className="text-white" />,
            title: "Hỗ Trợ 24/7",
            desc: "Đội ngũ nhân viên luôn sẵn sàng hỗ trợ bạn."
        }
    ];

    return (
        <section className="py-20 bg-white">
            <div className="container mx-auto px-4 md:px-8">
                <div className="flex flex-col lg:flex-row gap-16 items-center">
                    {/* Left Side: Video Content */}
                    <div className="w-full lg:w-1/2 relative group">
                        <div className="relative rounded-2xl overflow-hidden shadow-2xl border-4 border-white">
                            {/* Placeholder for video - using a parking related stock video if available or just a nice cover */}
                            {/* Since I can't be sure of a direct mp4 link that works indefinitely, I'll use a poster image and a mock video structure 
                                or a reliable public source. For now let's use a sample Pexels video link which is usually reliable for demos. */}
                            <video
                                ref={videoRef}
                                className="w-full h-auto object-cover"
                                poster="https://images.unsplash.com/photo-1590674899484-d5640e854abe?q=80&w=2667&auto=format&fit=crop"
                                loop
                                muted
                                playsInline
                                onPlay={() => setIsPlaying(true)}
                                onPause={() => setIsPlaying(false)}
                            >
                                <source src="https://assets.mixkit.co/videos/preview/mixkit-man-driving-a-car-in-a-parking-lot-4173-large.mp4" type="video/mp4" />
                                Trình duyệt của bạn không hỗ trợ thẻ video.
                            </video>

                            {/* Overlay Gradient */}
                            <div className={`absolute inset-0 bg-slate-900/30 transition-opacity duration-300 ${isPlaying ? 'opacity-0' : 'opacity-100'}`}></div>

                            {/* Play Button */}
                            <button
                                onClick={togglePlay}
                                className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-orange-500 text-white w-20 h-20 rounded-full flex items-center justify-center shadow-lg hover:bg-orange-600 hover:scale-110 transition-all duration-300 z-10 ${isPlaying ? 'opacity-0 group-hover:opacity-100' : 'opacity-100'}`}
                            >
                                {isPlaying ? <Pause size={32} fill="currentColor" /> : <Play size={32} fill="currentColor" className="ml-1" />}
                            </button>
                        </div>

                        {/* Decorative Elements behind video */}
                        <div className="absolute -bottom-6 -right-6 w-full h-full border-2 border-orange-500 rounded-2xl -z-10 hidden md:block"></div>
                        <div className="absolute -top-6 -left-6 w-24 h-24 bg-dots-pattern opacity-20 hidden md:block"></div>
                    </div>

                    {/* Right Side: Why Choose Us Content */}
                    <div className="w-full lg:w-1/2">
                        <h2 className="text-4xl font-extrabold text-slate-900 mb-6 leading-tight">
                            Tại Sao Nên Chọn Parkivia?
                        </h2>
                        <p className="text-gray-500 mb-8 leading-relaxed">
                            Chúng tôi không chỉ cung cấp chỗ đậu xe, chúng tôi mang đến sự an tâm.
                            Với công nghệ tiên tiến và dịch vụ chuyên nghiệp, Parkivia cam kết
                            trải nghiệm tốt nhất cho bạn và chiếc xe thân yêu.
                        </p>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            {features.map((feature, idx) => (
                                <div key={idx} className="flex items-start gap-4 p-4 rounded-xl bg-slate-50 hover:bg-white hover:shadow-md transition-all duration-300 border border-slate-100">
                                    <div className="bg-orange-500 p-3 rounded-lg shadow-lg shadow-orange-500/30 shrink-0">
                                        {feature.icon}
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-slate-900 text-lg mb-1">{feature.title}</h4>
                                        <p className="text-sm text-gray-500 leading-snug">{feature.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default WhyChooseUs;
