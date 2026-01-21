import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

interface PageHeaderProps {
    title: string;
    breadcrumbs: { name: string; path: string }[];
    backgroundImage?: string;
}

const PageHeader: React.FC<PageHeaderProps> = ({
    title,
    breadcrumbs,
    backgroundImage = "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop"
}) => {
    return (
        <div className="relative w-full h-[300px] md:h-[400px] bg-slate-900 flex items-center justify-center overflow-hidden font-sans">
            {/* Background Image */}
            <div
                className="absolute inset-0 bg-cover bg-center z-0"
                style={{ backgroundImage: `url(${backgroundImage})` }}
            ></div>

            {/* Dark Overlay Layer */}
            <div className="absolute inset-0 bg-slate-900/60 z-10"></div>

            {/* Content */}
            <div className="relative z-20 text-center px-4">
                <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4 tracking-tight uppercase">
                    {title}
                </h1>

                {/* Breadcrumbs */}
                <div className="flex items-center justify-center gap-2 text-sm md:text-base text-gray-300 font-medium">
                    <Link to="/" className="flex items-center hover:text-orange-500 transition-colors">
                        <Home size={16} className="mr-1" />
                        Trang Chủ
                    </Link>

                    {breadcrumbs.map((crumb, idx) => (
                        <React.Fragment key={idx}>
                            <ChevronRight size={14} className="text-gray-500" />
                            {idx === breadcrumbs.length - 1 ? (
                                <span className="text-orange-500">{crumb.name}</span>
                            ) : (
                                <Link to={crumb.path} className="hover:text-orange-500 transition-colors">
                                    {crumb.name}
                                </Link>
                            )}
                        </React.Fragment>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default PageHeader;
