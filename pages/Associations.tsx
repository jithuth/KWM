import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Users, Phone, Search } from 'lucide-react';

const Associations: React.FC = () => {
    const { data } = useApp();
    const [searchTerm, setSearchTerm] = useState('');

    const filteredList = data.associations.filter(item => 
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.focus.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Associations Directory</h1>
                    <p className="text-gray-500 mt-0.5 text-xs">Connecting Malayali organizations in Kuwait</p>
                </div>
                <div className="relative w-full md:w-64">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                    <input 
                        type="text" 
                        placeholder="Find associations..." 
                        className="w-full pl-9 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <div className="grid md:grid-cols-2 gap-5">
                {filteredList.map(assoc => (
                    <div key={assoc.id} className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 flex items-start space-x-4 hover:shadow-md transition-shadow">
                        <img src={assoc.logoUrl} alt={assoc.name} className="w-14 h-14 rounded-full object-cover bg-gray-100 flex-shrink-0" />
                        <div className="flex-1">
                            <h3 className="text-base font-bold text-gray-900">{assoc.name}</h3>
                            <span className="inline-block bg-blue-50 text-blue-700 text-[10px] px-2 py-0.5 rounded mt-1 mb-2 uppercase tracking-wide">
                                {assoc.focus}
                            </span>
                            <div className="space-y-1 text-xs text-gray-600">
                                <div className="flex items-center">
                                    <Users size={12} className="mr-2 text-gray-400" />
                                    <span className="font-medium">President:</span> <span className="ml-1">{assoc.president}</span>
                                </div>
                                <div className="flex items-center">
                                    <Phone size={12} className="mr-2 text-gray-400" />
                                    <span className="font-medium">Contact:</span> <span className="ml-1">{assoc.contact}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Associations;