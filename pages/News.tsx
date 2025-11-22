import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Link } from 'react-router-dom';
import { Calendar, Eye, PlayCircle } from 'lucide-react';

const News: React.FC = () => {
    const { data } = useApp();
    const [filter, setFilter] = useState('All');
    const categories = ['All', 'Local', 'Kerala', 'International', 'Sports'];

    const filteredNews = filter === 'All' 
        ? data.news 
        : data.news.filter(n => n.category === filter);

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 border-b border-gray-200 pb-4">
                <h1 className="text-2xl font-bold text-gray-900">Latest News</h1>
                <div className="flex space-x-2 overflow-x-auto pb-2 md:pb-0 w-full md:w-auto no-scrollbar">
                    {categories.map(cat => (
                        <button
                            key={cat}
                            onClick={() => setFilter(cat)}
                            className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
                                filter === cat 
                                    ? 'bg-emerald-600 text-white' 
                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {filteredNews.map(item => (
                    <Link key={item.id} to={`/news/${item.id}`} className="group block bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all">
                        <div className="relative h-40 overflow-hidden">
                            <img 
                                src={item.imageUrl} 
                                alt={item.title} 
                                className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300"
                            />
                            {item.mediaType !== 'image' && (
                                <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                                    <PlayCircle className="text-white w-10 h-10 opacity-80 group-hover:opacity-100 transition-opacity" />
                                </div>
                            )}
                            <div className="absolute top-2 right-2 bg-black/50 backdrop-blur-sm text-white text-[10px] px-2 py-0.5 rounded uppercase tracking-wide">
                                {item.category}
                            </div>
                        </div>
                        <div className="p-4">
                            <div className="flex items-center text-gray-400 text-[10px] mb-2 space-x-3">
                                <div className="flex items-center">
                                    <Calendar size={12} className="mr-1" />
                                    {item.date}
                                </div>
                                <div className="flex items-center">
                                    <Eye size={12} className="mr-1" />
                                    {item.views}
                                </div>
                            </div>
                            <h2 className="font-bold text-base text-gray-900 mb-2 line-clamp-2 group-hover:text-emerald-600 transition-colors">
                                {item.title}
                            </h2>
                            <p className="text-gray-600 text-xs line-clamp-3 leading-relaxed">
                                {item.summary}
                            </p>
                            <div className="mt-3 text-emerald-600 text-xs font-medium flex items-center">
                                Read More <span className="ml-1 group-hover:translate-x-1 transition-transform">&rarr;</span>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
            
            {filteredNews.length === 0 && (
                 <div className="text-center py-10 text-gray-500 text-sm">
                     No news articles found in this category.
                 </div>
            )}
        </div>
    );
};
export default News;