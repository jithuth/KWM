import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Calendar, ArrowLeft, Share2 } from 'lucide-react';

const NewsDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const { data } = useApp();
    const newsItem = data.news.find(n => n.id === id);

    if (!newsItem) {
        return <div className="text-center py-20 text-gray-500">Article not found</div>;
    }

    const renderMedia = () => {
        if (newsItem.mediaType === 'youtube' && newsItem.videoUrl) {
            // Simple extraction of ID for standard youtube URLs
            let videoId = newsItem.videoUrl.split('v=')[1];
            const ampersandPosition = videoId?.indexOf('&');
            if (ampersandPosition !== -1) {
                videoId = videoId?.substring(0, ampersandPosition);
            }
            if (!videoId && newsItem.videoUrl.includes('youtu.be')) {
                videoId = newsItem.videoUrl.split('/').pop();
            }

            return (
                <div className="w-full h-56 md:h-80 bg-black">
                    <iframe 
                        width="100%" 
                        height="100%" 
                        src={`https://www.youtube.com/embed/${videoId}`} 
                        title="YouTube video player" 
                        frameBorder="0" 
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                        allowFullScreen
                    ></iframe>
                </div>
            );
        }
        
        if (newsItem.mediaType === 'video' && newsItem.videoUrl) {
            return (
                <video controls className="w-full h-auto max-h-80 bg-black" poster={newsItem.imageUrl}>
                    <source src={newsItem.videoUrl} type="video/mp4" />
                    Your browser does not support the video tag.
                </video>
            );
        }

        return (
            <img 
                src={newsItem.imageUrl} 
                alt={newsItem.title} 
                className="w-full h-56 md:h-80 object-cover"
            />
        );
    };

    // Simple custom markdown parser
    const parseContent = (text: string) => {
        if (!text) return null;
        
        return text.split('\n').map((line, index) => {
            // Headings
            if (line.startsWith('## ')) {
                return <h2 key={index} className="text-xl font-bold text-gray-800 mt-6 mb-3">{line.replace('## ', '')}</h2>;
            }
            // List Items
            if (line.startsWith('* ') || line.startsWith('- ')) {
                return (
                    <li key={index} className="ml-4 list-disc text-gray-700 mb-1">
                        {line.replace(/^[*|-] /, '')}
                    </li>
                );
            }
            
            // Regular Paragraphs with Bold support
            const parts = line.split(/(\*\*.*?\*\*)/g);
            return (
                <p key={index} className="mb-4 text-gray-700 leading-relaxed">
                    {parts.map((part, i) => {
                        if (part.startsWith('**') && part.endsWith('**')) {
                            return <strong key={i} className="font-semibold text-gray-900">{part.slice(2, -2)}</strong>;
                        }
                        return part;
                    })}
                </p>
            );
        });
    };

    return (
        <div className="max-w-3xl mx-auto">
            <Link to="/news" className="inline-flex items-center text-emerald-600 mb-4 text-xs font-medium hover:underline">
                <ArrowLeft size={14} className="mr-1" /> Back to News
            </Link>
            
            <article className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                {renderMedia()}
                
                <div className="p-6 md:p-8">
                    <div className="flex flex-wrap gap-3 items-center text-xs text-gray-500 mb-4">
                        <span className="bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-full font-medium">
                            {newsItem.category}
                        </span>
                        <span className="flex items-center">
                            <Calendar size={14} className="mr-1.5" />
                            {newsItem.date}
                        </span>
                    </div>

                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4 leading-tight">
                        {newsItem.title}
                    </h1>

                    <div className="prose prose-sm prose-emerald max-w-none">
                        {parseContent(newsItem.content)}
                    </div>
                    
                    <div className="mt-8 pt-4 border-t border-gray-100 flex justify-between items-center">
                        <span className="text-xs text-gray-400">Written by Editorial Team</span>
                        <button className="flex items-center space-x-1.5 text-gray-500 hover:text-emerald-600 text-xs font-medium">
                            <Share2 size={16} />
                            <span>Share</span>
                        </button>
                    </div>
                </div>
            </article>
        </div>
    );
};

export default NewsDetail;