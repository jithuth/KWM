import React from 'react';
import { useApp } from '../context/AppContext';
import { Heart, MapPin } from 'lucide-react';

const Obituary: React.FC = () => {
    const { data } = useApp();

    return (
        <div className="space-y-6">
            <div className="text-center max-w-2xl mx-auto">
                <Heart className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                <h1 className="text-2xl font-bold text-gray-900">Obituaries</h1>
                <p className="text-gray-500 mt-1 text-xs">Remembering the lives of our community members who have departed.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                {data.obituaries.map(item => (
                    <div key={item.id} className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200 text-center group">
                        <div className="relative h-40 overflow-hidden bg-gray-100">
                            <img 
                                src={item.imageUrl} 
                                alt={item.name} 
                                className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                            />
                        </div>
                        <div className="p-4">
                            <h3 className="text-base font-bold text-gray-900">{item.name}</h3>
                            <p className="text-gray-500 text-xs mb-2">{item.age} Years</p>
                            
                            <div className="space-y-1 text-xs text-gray-600 mb-3">
                                <div className="flex items-center justify-center">
                                    <span className="font-semibold text-gray-400 uppercase tracking-wide mr-1.5 text-[10px]">Kuwait</span>
                                    {item.placeInKuwait}
                                </div>
                                <div className="flex items-center justify-center">
                                    <span className="font-semibold text-gray-400 uppercase tracking-wide mr-1.5 text-[10px]">Kerala</span>
                                    {item.placeInKerala}
                                </div>
                            </div>
                            
                            <div className="pt-2 border-t border-gray-100">
                                <span className="text-[10px] text-gray-400 uppercase">Deceased on</span>
                                <p className="text-sm font-medium text-gray-800">{item.dateOfDeath}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            
            <div className="bg-gray-50 rounded-lg p-6 text-center">
                <h3 className="font-bold text-gray-800 mb-1 text-sm">Submit an Obituary</h3>
                <p className="text-xs text-gray-500 mb-3">To inform the community about a loss, please contact our support team.</p>
                <button className="text-emerald-600 text-xs font-semibold hover:underline">Contact Support</button>
            </div>
        </div>
    );
};

export default Obituary;