import React, { useState } from 'react';
import { Calculator, DollarSign, Plane } from 'lucide-react';

const Tools: React.FC = () => {
    const [salary, setSalary] = useState({ basic: 0, allowance: 0, deduction: 0 });
    const [netSalary, setNetSalary] = useState<number | null>(null);

    const calculateSalary = () => {
        setNetSalary(Number(salary.basic) + Number(salary.allowance) - Number(salary.deduction));
    };

    return (
        <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Expat Tools</h1>

            <div className="grid md:grid-cols-2 gap-8">
                {/* Salary Calculator */}
                <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                    <div className="flex items-center space-x-3 mb-6">
                        <div className="bg-emerald-100 p-3 rounded-full text-emerald-600">
                            <Calculator size={24} />
                        </div>
                        <h2 className="text-xl font-bold text-gray-800">Salary Calculator</h2>
                    </div>
                    
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Basic Salary (KWD)</label>
                            <input 
                                type="number" 
                                value={salary.basic || ''} 
                                onChange={e => setSalary({...salary, basic: Number(e.target.value)})}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                                placeholder="e.g. 450"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Allowances (KWD)</label>
                            <input 
                                type="number" 
                                value={salary.allowance || ''} 
                                onChange={e => setSalary({...salary, allowance: Number(e.target.value)})}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                                placeholder="e.g. 50"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Deductions (KWD)</label>
                            <input 
                                type="number" 
                                value={salary.deduction || ''} 
                                onChange={e => setSalary({...salary, deduction: Number(e.target.value)})}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                                placeholder="e.g. 10"
                            />
                        </div>
                        <button 
                            onClick={calculateSalary}
                            className="w-full bg-emerald-600 text-white py-3 rounded-lg font-semibold hover:bg-emerald-700 transition-colors"
                        >
                            Calculate Net Salary
                        </button>

                        {netSalary !== null && (
                            <div className="mt-6 p-4 bg-emerald-50 rounded-lg text-center">
                                <span className="block text-sm text-emerald-600 font-medium uppercase tracking-wide">Estimated Net Salary</span>
                                <span className="block text-3xl font-bold text-emerald-800">{netSalary} KWD</span>
                                <span className="block text-xs text-gray-500 mt-1">Approx {netSalary * 270} INR</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Indemnity Info (Static for now) */}
                <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                    <div className="flex items-center space-x-3 mb-6">
                        <div className="bg-blue-100 p-3 rounded-full text-blue-600">
                            <DollarSign size={24} />
                        </div>
                        <h2 className="text-xl font-bold text-gray-800">Indemnity Rules</h2>
                    </div>
                    <div className="prose text-sm text-gray-600">
                        <p className="mb-3">According to Kuwait Labor Law, end of service indemnity is calculated as follows:</p>
                        <ul className="list-disc pl-5 space-y-2">
                            <li><strong>First 5 years:</strong> 15 days salary for each year of service.</li>
                            <li><strong>After 5 years:</strong> One full month salary for each year of service.</li>
                            <li>Total indemnity cannot exceed one and a half years' salary.</li>
                        </ul>
                        <p className="mt-4 text-xs text-gray-400 italic">Note: This is a simplified guide. Please consult legal experts for exact calculations.</p>
                    </div>
                </div>

                 {/* Flight Tracker Placeholder */}
                 <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 md:col-span-2">
                    <div className="flex items-center space-x-3 mb-6">
                        <div className="bg-purple-100 p-3 rounded-full text-purple-600">
                            <Plane size={24} />
                        </div>
                        <h2 className="text-xl font-bold text-gray-800">Flight Status (KWI)</h2>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg text-center border border-dashed border-gray-300">
                        <p className="text-gray-500">Live flight tracking widget coming soon.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Tools;
