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
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 border-b border-gray-200 pb-6">
                <h1 className="text-3xl font-bold text-gray-900">Latest News</h1>
                <div className="flex space-x-2 overflow-x-auto pb-2 md:pb-0 w-full md:w-auto no-scrollbar">
                    {categories.map(cat => (
                        <button
                            key={cat}
                            onClick={() => setFilter(cat)}
                            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
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

            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                {filteredNews.map(item => (
                    <Link key={item.id} to={`/news/${item.id}`} className="group block bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all">
                        <div className="relative h-48 overflow-hidden">
                            <img 
                                src={item.imageUrl} 
                                alt={item.title} 
                                className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300"
                            />
                            {item.mediaType !== 'image' && (
                                <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                                    <PlayCircle className="text-white w-12 h-12 opacity-80 group-hover:opacity-100 transition-opacity" />
                                </div>
                            )}
                            <div className="absolute top-2 right-2 bg-black/50 backdrop-blur-sm text-white text-xs px-2 py-1 rounded">
                                {item.category}
                            </div>
                        </div>
                        <div className="p-5">
                            <div className="flex items-center text-gray-400 text-xs mb-3 space-x-4">
                                <div className="flex items-center">
                                    <Calendar size={14} className="mr-1" />
                                    {item.date}
                                </div>
                                <div className="flex items-center">
                                    <Eye size={14} className="mr-1" />
                                    {item.views}
                                </div>
                            </div>
                            <h2 className="font-bold text-lg text-gray-900 mb-2 line-clamp-2 group-hover:text-emerald-600 transition-colors">
                                {item.title}
                            </h2>
                            <p className="text-gray-600 text-sm line-clamp-3">
                                {item.summary}
                            </p>
                            <div className="mt-4 text-emerald-600 text-sm font-medium flex items-center">
                                Read More <span className="ml-1 group-hover:translate-x-1 transition-transform">&rarr;</span>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
            
            {filteredNews.length === 0 && (
                 <div className="text-center py-12 text-gray-500">
                     No news articles found in this category.
                 </div>
            )}
        </div>
    );
};
export default News;