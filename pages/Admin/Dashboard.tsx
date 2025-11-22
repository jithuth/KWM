import React from 'react';
import { useApp } from '../../context/AppContext';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { Users, Eye, FileText, DollarSign } from 'lucide-react';

const Dashboard: React.FC = () => {
    const { data } = useApp();

    const stats = [
        { title: 'Total Users', value: '12,450', change: '+12%', icon: <Users className="text-blue-500" /> },
        { title: 'Total Views', value: '85,200', change: '+25%', icon: <Eye className="text-purple-500" /> },
        { title: 'Active Articles', value: data.news.length.toString(), change: '+4', icon: <FileText className="text-emerald-500" /> },
        { title: 'Ad Revenue', value: '450 KWD', change: '+8%', icon: <DollarSign className="text-orange-500" /> },
    ];

    const viewData = [
        { name: 'Mon', views: 4000 },
        { name: 'Tue', views: 3000 },
        { name: 'Wed', views: 2000 },
        { name: 'Thu', views: 2780 },
        { name: 'Fri', views: 1890 },
        { name: 'Sat', views: 2390 },
        { name: 'Sun', views: 3490 },
    ];

    return (
        <div className="space-y-8">
            <h2 className="text-2xl font-bold text-gray-800">Overview</h2>
            
            {/* Stat Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {stats.map((stat, index) => (
                    <div key={index} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-2 bg-gray-50 rounded-lg">{stat.icon}</div>
                            <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full">{stat.change}</span>
                        </div>
                        <h3 className="text-3xl font-bold text-gray-900">{stat.value}</h3>
                        <p className="text-sm text-gray-500">{stat.title}</p>
                    </div>
                ))}
            </div>

            {/* Charts */}
            <div className="grid md:grid-cols-2 gap-8">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                    <h3 className="text-lg font-bold text-gray-800 mb-6">Weekly Traffic</h3>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={viewData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                                <YAxis axisLine={false} tickLine={false} />
                                <Tooltip />
                                <Line type="monotone" dataKey="views" stroke="#059669" strokeWidth={3} dot={{r: 4}} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                 <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                    <h3 className="text-lg font-bold text-gray-800 mb-6">User Demographics (By Area)</h3>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={[
                                {name: 'Abbasiya', users: 5000},
                                {name: 'Salmiya', users: 3500},
                                {name: 'Fahaheel', users: 2000},
                                {name: 'Farwaniya', users: 1500}
                            ]}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                                <YAxis axisLine={false} tickLine={false} />
                                <Tooltip />
                                <Bar dataKey="users" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
