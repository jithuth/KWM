import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Search, MapPin, Phone, Star } from 'lucide-react';

const Directory: React.FC = () => {
    const { data } = useApp();
    const [searchTerm, setSearchTerm] = useState('');

    const filteredBusinesses = data.businesses.filter(b => 
        b.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        b.category.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <h1 className="text-2xl font-bold text-gray-900">Business Directory</h1>
                <div className="relative w-full md:w-80">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                    <input 
                        type="text" 
                        placeholder="Search restaurants, jewelers, etc..." 
                        className="w-full pl-9 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
                {filteredBusinesses.map((business) => (
                    <div key={business.id} className="bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow p-5">
                        <div className="flex justify-between items-start mb-3">
                            <div>
                                <span className="text-[10px] font-semibold text-emerald-600 uppercase bg-emerald-50 px-2 py-0.5 rounded">{business.category}</span>
                                <h3 className="text-base font-bold text-gray-900 mt-1.5">{business.name}</h3>
                            </div>
                            <div className="flex items-center bg-yellow-50 px-1.5 py-0.5 rounded">
                                <Star size={12} className="text-yellow-500 fill-current mr-1" />
                                <span className="text-xs font-bold text-yellow-700">{business.rating}</span>
                            </div>
                        </div>
                        
                        <p className="text-gray-600 text-xs mb-3 line-clamp-2 leading-relaxed">{business.description}</p>
                        
                        <div className="space-y-1.5 text-xs text-gray-500">
                            <div className="flex items-center">
                                <MapPin size={14} className="mr-2 text-gray-400" />
                                <span>{business.location}</span>
                            </div>
                            <div className="flex items-center">
                                <Phone size={14} className="mr-2 text-gray-400" />
                                <span>{business.phone}</span>
                            </div>
                        </div>
                        
                        <button className="mt-4 w-full bg-gray-50 text-gray-700 font-medium py-1.5 rounded-lg text-xs hover:bg-gray-100 transition-colors border border-gray-200">
                            View Details
                        </button>
                    </div>
                ))}
            </div>
            
            {filteredBusinesses.length === 0 && (
                <div className="text-center py-12">
                    <p className="text-gray-500 text-sm">No businesses found matching your search.</p>
                </div>
            )}
        </div>
    );
};

export default Directory;