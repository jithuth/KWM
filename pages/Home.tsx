import React from 'react';
import { useApp } from '../context/AppContext';
import { useLanguage } from '../context/LanguageContext';
import { ArrowRight, TrendingUp, Calendar, Phone, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';

const Home: React.FC = () => {
    const { data } = useApp();
    const { t } = useLanguage();
    const featuredNews = data.news.slice(0, 1)[0];
    const recentNews = data.news.slice(1, 4);

    return (
        <div className="space-y-8">
            {/* Hero Section - Featured News */}
            <section className="relative rounded-2xl overflow-hidden shadow-xl bg-gray-900 text-white h-[340px]">
                {featuredNews && (
                    <>
                        <img 
                            src={featuredNews.imageUrl} 
                            alt={featuredNews.title} 
                            className="absolute inset-0 w-full h-full object-cover opacity-50"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
                        <div className="absolute bottom-0 left-0 p-6 md:p-10 w-full md:w-3/4">
                            <span className="bg-emerald-600 text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider mb-2 inline-block">
                                {featuredNews.category}
                            </span>
                            <h1 className="text-2xl md:text-4xl font-bold mb-2 leading-tight">
                                {featuredNews.title}
                            </h1>
                            <p className="text-gray-200 text-sm line-clamp-2 mb-4">
                                {featuredNews.summary}
                            </p>
                            <Link to={`/news/${featuredNews.id}`} className="inline-flex items-center bg-white text-black px-4 py-2 rounded-lg text-sm font-semibold hover:bg-gray-100 transition-colors">
                                {t('hero.readMore')} <ArrowRight className="ml-2" size={16} />
                            </Link>
                        </div>
                    </>
                )}
            </section>

            {/* Quick Stats / Tickers */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center justify-center text-center">
                    <div className="bg-blue-100 p-2 rounded-full text-blue-600 mb-2">
                        <TrendingUp size={20} />
                    </div>
                    <span className="text-xl font-bold text-gray-800">1 KWD = 270 INR</span>
                    <span className="text-[10px] text-gray-500 mt-0.5 uppercase tracking-wide">{t('stats.exchange')}</span>
                </div>
                <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center justify-center text-center">
                    <div className="bg-orange-100 p-2 rounded-full text-orange-600 mb-2">
                        <Calendar size={20} />
                    </div>
                    <span className="text-xl font-bold text-gray-800">{t('stats.events')}</span>
                    <span className="text-[10px] text-gray-500 mt-0.5 uppercase tracking-wide">5 Upcoming</span>
                </div>
                 <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center justify-center text-center">
                    <div className="bg-red-100 p-2 rounded-full text-red-600 mb-2">
                        <Phone size={20} />
                    </div>
                    <span className="text-lg font-bold text-gray-800">{t('stats.embassy')}</span>
                    <span className="text-[10px] text-gray-500 mt-0.5 uppercase tracking-wide">+965 22530600</span>
                </div>
                 <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center justify-center text-center">
                    <div className="bg-green-100 p-2 rounded-full text-green-600 mb-2">
                        <Clock size={20} />
                    </div>
                    <span className="text-lg font-bold text-gray-800">{t('stats.prayer')}</span>
                    <span className="text-[10px] text-gray-500 mt-0.5 uppercase tracking-wide">Maghrib 5:10 PM</span>
                </div>
            </div>

            {/* Recent News Grid */}
            <section>
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold text-gray-800">{t('section.latest')}</h2>
                    <Link to="/news" className="text-emerald-600 text-sm font-medium hover:text-emerald-700">{t('section.viewAll')}</Link>
                </div>
                <div className="grid md:grid-cols-3 gap-6">
                    {recentNews.map(news => (
                        <Link key={news.id} to={`/news/${news.id}`} className="group bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100 hover:shadow-md transition-all">
                            <div className="h-40 overflow-hidden">
                                <img 
                                    src={news.imageUrl} 
                                    alt={news.title} 
                                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300" 
                                />
                            </div>
                            <div className="p-4">
                                <div className="flex justify-between items-center mb-1.5">
                                    <span className="text-[10px] font-semibold text-emerald-600 uppercase tracking-wide">{news.category}</span>
                                    <span className="text-[10px] text-gray-400">{news.date}</span>
                                </div>
                                <h3 className="font-bold text-base mb-1.5 text-gray-900 line-clamp-2 group-hover:text-emerald-600 transition-colors">{news.title}</h3>
                                <p className="text-gray-600 text-xs line-clamp-3 leading-relaxed">{news.summary}</p>
                            </div>
                        </Link>
                    ))}
                </div>
            </section>

            {/* Business Promotions Banner */}
            <section className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl p-6 text-white flex flex-col md:flex-row items-center justify-between">
                <div className="mb-4 md:mb-0 md:mr-8">
                    <h3 className="text-xl font-bold mb-1">{t('promo.title')}</h3>
                    <p className="text-indigo-100 text-sm">{t('promo.subtitle')}</p>
                </div>
                <Link to="/directory" className="bg-white text-indigo-600 px-5 py-2 rounded-lg text-sm font-bold shadow-lg hover:bg-indigo-50 transition-colors whitespace-nowrap">
                    {t('promo.btn')}
                </Link>
            </section>
        </div>
    );
};

export default Home;