import React from 'react';
import { useApp } from '../context/AppContext';
import { Heart, MapPin } from 'lucide-react';

const Obituary: React.FC = () => {
    const { data } = useApp();

    return (
        <div className="space-y-8">
            <div className="text-center max-w-2xl mx-auto">
                <Heart className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <h1 className="text-3xl font-bold text-gray-900">Obituaries</h1>
                <p className="text-gray-500 mt-2">Remembering the lives of our community members who have departed.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {data.obituaries.map(item => (
                    <div key={item.id} className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200 text-center group">
                        <div className="relative h-48 overflow-hidden bg-gray-100">
                            <img 
                                src={item.imageUrl} 
                                alt={item.name} 
                                className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                            />
                        </div>
                        <div className="p-5">
                            <h3 className="text-xl font-bold text-gray-900">{item.name}</h3>
                            <p className="text-gray-500 text-sm mb-3">{item.age} Years</p>
                            
                            <div className="space-y-2 text-sm text-gray-600 mb-4">
                                <div className="flex items-center justify-center text-xs">
                                    <span className="font-semibold text-gray-400 uppercase tracking-wide mr-2">Kuwait</span>
                                    {item.placeInKuwait}
                                </div>
                                <div className="flex items-center justify-center text-xs">
                                    <span className="font-semibold text-gray-400 uppercase tracking-wide mr-2">Kerala</span>
                                    {item.placeInKerala}
                                </div>
                            </div>
                            
                            <div className="pt-3 border-t border-gray-100">
                                <span className="text-xs text-gray-400">Deceased on</span>
                                <p className="text-sm font-medium text-gray-800">{item.dateOfDeath}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            
            <div className="bg-gray-50 rounded-lg p-8 text-center">
                <h3 className="font-bold text-gray-800 mb-2">Submit an Obituary</h3>
                <p className="text-sm text-gray-500 mb-4">To inform the community about a loss, please contact our support team.</p>
                <button className="text-emerald-600 font-semibold hover:underline">Contact Support</button>
            </div>
        </div>
    );
};

export default Obituary;