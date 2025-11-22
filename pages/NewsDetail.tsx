import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Calendar, ArrowLeft, Share2 } from 'lucide-react';

const NewsDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const { data } = useApp();
    const newsItem = data.news.find(n => n.id === id);

    if (!newsItem) {
        return <div className="text-center py-20">Article not found</div>;
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
                <div className="w-full h-64 md:h-96 bg-black">
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
                <video controls className="w-full h-auto max-h-96 bg-black" poster={newsItem.imageUrl}>
                    <source src={newsItem.videoUrl} type="video/mp4" />
                    Your browser does not support the video tag.
                </video>
            );
        }

        return (
            <img 
                src={newsItem.imageUrl} 
                alt={newsItem.title} 
                className="w-full h-64 md:h-96 object-cover"
            />
        );
    };

    return (
        <div className="max-w-4xl mx-auto">
            <Link to="/news" className="inline-flex items-center text-emerald-600 mb-6 hover:underline">
                <ArrowLeft size={16} className="mr-1" /> Back to News
            </Link>
            
            <article className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                {renderMedia()}
                
                <div className="p-6 md:p-10">
                    <div className="flex flex-wrap gap-4 items-center text-sm text-gray-500 mb-6">
                        <span className="bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full font-medium">
                            {newsItem.category}
                        </span>
                        <span className="flex items-center">
                            <Calendar size={16} className="mr-2" />
                            {newsItem.date}
                        </span>
                    </div>

                    <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 leading-tight">
                        {newsItem.title}
                    </h1>

                    <div className="prose prose-emerald max-w-none text-gray-700 leading-relaxed whitespace-pre-line">
                        {newsItem.content}
                    </div>
                    
                    <div className="mt-10 pt-6 border-t border-gray-100 flex justify-between items-center">
                        <span className="text-sm text-gray-500">Written by Editorial Team</span>
                        <button className="flex items-center space-x-2 text-gray-500 hover:text-emerald-600">
                            <Share2 size={18} />
                            <span>Share</span>
                        </button>
                    </div>
                </div>
            </article>
        </div>
    );
};

export default NewsDetail;