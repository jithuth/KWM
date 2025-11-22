import React from 'react';
import { useApp } from '../context/AppContext';
import { ArrowRight, TrendingUp, Calendar, Phone, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';

const Home: React.FC = () => {
    const { data } = useApp();
    const featuredNews = data.news.slice(0, 1)[0];
    const recentNews = data.news.slice(1, 4);

    return (
        <div className="space-y-10">
            {/* Hero Section - Featured News */}
            <section className="relative rounded-2xl overflow-hidden shadow-2xl bg-gray-900 text-white h-[400px]">
                {featuredNews && (
                    <>
                        <img 
                            src={featuredNews.imageUrl} 
                            alt={featuredNews.title} 
                            className="absolute inset-0 w-full h-full object-cover opacity-50"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
                        <div className="absolute bottom-0 left-0 p-8 md:p-12 w-full md:w-2/3">
                            <span className="bg-emerald-600 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-3 inline-block">
                                {featuredNews.category}
                            </span>
                            <h1 className="text-3xl md:text-5xl font-bold mb-4 leading-tight">
                                {featuredNews.title}
                            </h1>
                            <p className="text-gray-200 line-clamp-2 mb-6">
                                {featuredNews.summary}
                            </p>
                            <Link to={`/news/${featuredNews.id}`} className="inline-flex items-center bg-white text-black px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
                                Read Full Story <ArrowRight className="ml-2" size={18} />
                            </Link>
                        </div>
                    </>
                )}
            </section>

            {/* Quick Stats / Tickers */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center justify-center text-center">
                    <div className="bg-blue-100 p-3 rounded-full text-blue-600 mb-3">
                        <TrendingUp size={24} />
                    </div>
                    <span className="text-2xl font-bold text-gray-800">1 KWD = 270 INR</span>
                    <span className="text-xs text-gray-500 mt-1">Exchange Rate (Approx)</span>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center justify-center text-center">
                    <div className="bg-orange-100 p-3 rounded-full text-orange-600 mb-3">
                        <Calendar size={24} />
                    </div>
                    <span className="text-2xl font-bold text-gray-800">Events</span>
                    <span className="text-xs text-gray-500 mt-1">5 Upcoming this week</span>
                </div>
                 <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center justify-center text-center">
                    <div className="bg-red-100 p-3 rounded-full text-red-600 mb-3">
                        <Phone size={24} />
                    </div>
                    <span className="text-xl font-bold text-gray-800">Embassy</span>
                    <span className="text-xs text-gray-500 mt-1">+965 22530600</span>
                </div>
                 <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center justify-center text-center">
                    <div className="bg-green-100 p-3 rounded-full text-green-600 mb-3">
                        <Clock size={24} />
                    </div>
                    <span className="text-xl font-bold text-gray-800">Prayer</span>
                    <span className="text-xs text-gray-500 mt-1">Maghrib 5:10 PM</span>
                </div>
            </div>

            {/* Recent News Grid */}
            <section>
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-800">Latest Updates</h2>
                    <Link to="/news" className="text-emerald-600 font-medium hover:text-emerald-700">View All</Link>
                </div>
                <div className="grid md:grid-cols-3 gap-6">
                    {recentNews.map(news => (
                        <Link key={news.id} to={`/news/${news.id}`} className="group bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100 hover:shadow-md transition-all">
                            <div className="h-48 overflow-hidden">
                                <img 
                                    src={news.imageUrl} 
                                    alt={news.title} 
                                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300" 
                                />
                            </div>
                            <div className="p-5">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-xs font-semibold text-emerald-600 uppercase">{news.category}</span>
                                    <span className="text-xs text-gray-400">{news.date}</span>
                                </div>
                                <h3 className="font-bold text-lg mb-2 text-gray-900 line-clamp-2 group-hover:text-emerald-600 transition-colors">{news.title}</h3>
                                <p className="text-gray-600 text-sm line-clamp-3">{news.summary}</p>
                            </div>
                        </Link>
                    ))}
                </div>
            </section>

            {/* Business Promotions Banner */}
            <section className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-8 text-white flex flex-col md:flex-row items-center justify-between">
                <div className="mb-6 md:mb-0 md:mr-8">
                    <h3 className="text-2xl font-bold mb-2">Promote Your Business</h3>
                    <p className="text-indigo-100">Reach thousands of Malayalis in Kuwait. Join our business directory today!</p>
                </div>
                <Link to="/directory" className="bg-white text-indigo-600 px-6 py-3 rounded-lg font-bold shadow-lg hover:bg-indigo-50 transition-colors whitespace-nowrap">
                    List Your Business
                </Link>
            </section>
        </div>
    );
};

export default Home;