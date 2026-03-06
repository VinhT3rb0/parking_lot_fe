import React from 'react';
import PageHeader from '../../components/PageHeader';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { MapPin, Phone, Mail, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';
import { Button, Input, Form } from 'antd';
import ScrollToTop from '../../components/ScrollToTop';

const { TextArea } = Input;

const Contact: React.FC = () => {
    return (
        <div className="font-sans">
            <ScrollToTop />
            <PageHeader
                title="Liên Hệ"
                breadcrumbs={[{ name: "Liên Hệ", path: "/contact" }]}
                backgroundImage="https://images.unsplash.com/photo-1601362840469-51e4d8d58785?q=80&w=2670&auto=format&fit=crop"
            />

            <section className="py-20 px-4 md:px-8 bg-white">
                <div className="container mx-auto">
                    <div className="flex flex-col lg:flex-row gap-16">
                        {/* Contact Info */}
                        <div className="w-full lg:w-1/3">
                            <span className="text-orange-500 font-bold uppercase tracking-widest text-sm mb-2 block">Thông Tin Liên Hệ</span>
                            <h2 className="text-3xl font-extrabold text-slate-900 mb-6">Liên Lạc Với Chúng Tôi</h2>
                            <p className="text-gray-500 mb-10 leading-relaxed">
                                Chúng tôi luôn sẵn sàng lắng nghe và hỗ trợ bạn. Vui lòng liên hệ với chúng tôi qua các kênh dưới đây hoặc điền vào biểu mẫu.
                            </p>

                            <div className="space-y-8">
                                <div className="flex items-start">
                                    <div className="bg-orange-100 p-4 rounded-full text-orange-500 mr-4">
                                        <MapPin size={24} />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-slate-900 text-lg">Địa Chỉ</h4>
                                        <p className="text-gray-600">123 Đường Trường Chinh, Hà Nội, Việt Nam</p>
                                    </div>
                                </div>

                                <div className="flex items-start">
                                    <div className="bg-orange-100 p-4 rounded-full text-orange-500 mr-4">
                                        <Phone size={24} />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-slate-900 text-lg">Điện Thoại</h4>
                                        <p className="text-gray-600">0912 345 678</p>
                                        <p className="text-gray-500 text-sm">Thứ 2 - Thứ 7: 8.00 - 18.00</p>
                                    </div>
                                </div>

                                <div className="flex items-start">
                                    <div className="bg-orange-100 p-4 rounded-full text-orange-500 mr-4">
                                        <Mail size={24} />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-slate-900 text-lg">Email</h4>
                                        <p className="text-gray-600">hotro@parkivia.com</p>
                                        <p className="text-gray-600">info@parkivia.com</p>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-12">
                                <h4 className="font-bold text-slate-900 text-lg mb-4">Mạng Xã Hội</h4>
                                <div className="flex space-x-4">
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
                                            className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-600 hover:bg-orange-500 hover:text-white transition-all duration-300"
                                        >
                                            <Icon size={18} />
                                        </a>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Contact Form */}
                        <div className="w-full lg:w-2/3">
                            <div className="bg-gray-50 p-8 md:p-12 rounded-2xl shadow-lg border border-gray-100">
                                <h3 className="text-2xl font-bold text-slate-900 mb-6">Gửi Tin Nhắn</h3>
                                <Form layout="vertical" size="large">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <Form.Item name="name" label="Họ và Tên" rules={[{ required: true }]}>
                                            <Input placeholder="Nhập họ tên của bạn" />
                                        </Form.Item>
                                        <Form.Item name="email" label="Email" rules={[{ required: true, type: 'email' }]}>
                                            <Input placeholder="Nhập địa chỉ email" />
                                        </Form.Item>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <Form.Item name="phone" label="Số Điện Thoại">
                                            <Input placeholder="Nhập số điện thoại" />
                                        </Form.Item>
                                        <Form.Item name="subject" label="Chủ Đề">
                                            <Input placeholder="Bạn cần hỗ trợ về việc gì?" />
                                        </Form.Item>
                                    </div>

                                    <Form.Item name="message" label="Nội Dung" rules={[{ required: true }]}>
                                        <TextArea rows={5} placeholder="Nhập nội dung tin nhắn..." />
                                    </Form.Item>

                                    <Button type="primary" htmlType="submit" size="large" className="bg-orange-500 hover:bg-orange-600 border-none h-12 px-8 font-bold uppercase tracking-wide w-full md:w-auto">
                                        Gửi Tin Nhắn
                                    </Button>
                                </Form>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Google Map Section */}
            <section className="py-20 px-4 md:px-10 bg-white">
                <div className="container mx-auto h-[500px] rounded-2xl overflow-hidden shadow-2xl">
                    <iframe
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3724.812441339885!2d105.82868887471369!3d21.000154188761595!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3135ac7add2e1df5%3A0xd133dca6da4abc5e!2zxJAuIFRyxrDhu51uZyBDaGluaCwgSMOgIE7hu5lpLCBWaeG7h3QgTmFt!5e0!3m2!1svi!2s!4v1768977388873!5m2!1svi!2s"
                        width="100%"
                        height="100%"
                        style={{ border: 0 }}
                        allowFullScreen={true}
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                        title="Parkivia Location"
                        className="grayscale hover:grayscale-0 transition-all duration-500"
                    ></iframe>
                </div>
            </section>
        </div>
    );
};

export default Contact;
