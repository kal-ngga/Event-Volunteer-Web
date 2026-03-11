import React from 'react';

export default function Card({ 
    image = "https://placehold.co/356x307", 
    category = "Mobile App Development", 
    type = "Individu", 
    title = "TravelMate — Aplikasi Perencanaan Perjalanan", 
    subtitle = "10billion.org",
    startDate = "14 Maret 2026",
    endDate = "30 Nov 2026",
    location = "Kota Administrasi Jakarta Barat"
}) {
    return (
        <div className="w-full bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-300 flex flex-col overflow-hidden group">
            {/* Image Container */}
            <div className="h-56 w-full relative overflow-hidden bg-gray-100 flex items-center justify-center">
                 {/* Blurred background image for visual effect */}
                <div 
                    className="absolute inset-0 bg-cover bg-center blur-xl opacity-60 scale-110" 
                    style={{ backgroundImage: `url(${image})` }} 
                />
                <img 
                    className="w-full h-full object-cover relative z-10 group-hover:scale-105 transition-transform duration-500" 
                    src={image} 
                    alt={title} 
                />
            </div>

            {/* Content Container */}
            <div className="p-5 flex flex-col gap-4">
                {/* Badges */}
                <div className="flex flex-wrap gap-2">
                    <span className="px-3.5 py-1.5 bg-indigo-50 text-indigo-600 text-sm font-medium rounded-full font-['TT_Commons']">
                        {category}
                    </span>
                    <span className="px-3.5 py-1.5 bg-blue-50 text-blue-900 text-sm font-medium rounded-full font-['TT_Commons']">
                        {type}
                    </span>
                </div>

                {/* Title & Subtitle */}
                <div className="flex flex-col gap-1.5 min-h-[4rem]">
                    <h3 className="text-gray-900 text-xl font-medium font-['TT_Commons'] leading-tight line-clamp-2">
                        {title}
                    </h3>
                    <p className="text-red-700 text-lg font-medium font-['TT_Commons']">
                        {subtitle}
                    </p>
                </div>

                {/* Meta Information */}
                <div className="flex flex-col gap-2 mt-2">
                    <div className="flex items-center gap-3 text-gray-500">
                        <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span className="text-sm font-normal font-['TT_Commons']">
                            {startDate} {endDate ? `- ${endDate}` : ''}
                        </span>
                    </div>
                    <div className="flex items-center gap-3 text-gray-500">
                        <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <span className="text-sm font-normal font-['TT_Commons'] line-clamp-1">
                            {location}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}