import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { User } from '../../types';
import { Search, Trash2, Edit2, X, User as UserIcon, Mail, Shield, Calendar, CheckCircle, Plus } from 'lucide-react';

// Helper to generate UUID for new users
const generateUUID = () => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
};

const UserManagement: React.FC = () => {
    const { data, deleteUser, updateUser, addUser } = useApp();
    const [searchTerm, setSearchTerm] = useState('');
    const [editingUser, setEditingUser] = useState<Partial<User> | null>(null);
    const [isAdding, setIsAdding] = useState(false);

    const filteredUsers = data.users.filter(user => 
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleDelete = (id: string) => {
        if (window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
            deleteUser(id);
        }
    };

    const handleEdit = (user: User) => {
        setIsAdding(false);
        setEditingUser({ ...user });
    };

    const handleAdd = () => {
        setIsAdding(true);
        setEditingUser({
            name: '',
            email: '',
            role: 'User',
            status: 'Active',
            joinDate: new Date().toISOString().split('T')[0]
        });
    };

    const handleSaveUser = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingUser) {
            if (isAdding) {
                // Create new user logic
                const newUser: User = {
                    id: generateUUID(), // Use proper UUID format
                    name: editingUser.name || '',
                    email: editingUser.email || '',
                    role: editingUser.role || 'User',
                    status: editingUser.status || 'Active',
                    joinDate: editingUser.joinDate || new Date().toISOString().split('T')[0]
                };
                addUser(newUser);
            } else {
                // Update existing user
                updateUser(editingUser as User);
            }
            setEditingUser(null);
            setIsAdding(false);
        }
    };

    const getRoleBadgeColor = (role: string) => {
        switch (role) {
            case 'Admin': return 'bg-purple-100 text-purple-700';
            case 'Editor': return 'bg-blue-100 text-blue-700';
            case 'Contributor': return 'bg-teal-100 text-teal-700';
            case 'Viewer': return 'bg-slate-100 text-slate-700';
            default: return 'bg-gray-100 text-gray-700';
        }
    };

    const getStatusBadgeColor = (status: string) => {
        switch (status) {
            case 'Active': return 'bg-green-100 text-green-700';
            case 'Suspended': return 'bg-red-100 text-red-700';
            case 'Pending': return 'bg-yellow-100 text-yellow-700';
            default: return 'bg-gray-100 text-gray-700';
        }
    };

    return (
        <div>
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
                <h2 className="text-2xl font-bold text-gray-800">User Management</h2>
                <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
                     <div className="relative w-full md:w-64">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                        <input 
                            type="text" 
                            placeholder="Search users..." 
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <button 
                        onClick={handleAdd}
                        className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 flex items-center justify-center space-x-2 whitespace-nowrap"
                    >
                        <Plus size={20} />
                        <span>Add User</span>
                    </button>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Joined</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {filteredUsers.map((user) => (
                                <tr key={user.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div className="flex-shrink-0 h-10 w-10 bg-gray-200 rounded-full flex items-center justify-center text-gray-500 font-bold">
                                                {user.name.charAt(0)}
                                            </div>
                                            <div className="ml-4">
                                                <div className="text-sm font-medium text-gray-900">{user.name}</div>
                                                <div className="text-sm text-gray-500">{user.email}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getRoleBadgeColor(user.role)}`}>
                                            {user.role}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeColor(user.status)}`}>
                                            {user.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {user.joinDate}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <button onClick={() => handleEdit(user)} className="text-indigo-600 hover:text-indigo-900 mr-3">
                                            <Edit2 size={18} />
                                        </button>
                                        <button onClick={() => handleDelete(user.id)} className="text-red-600 hover:text-red-900">
                                            <Trash2 size={18} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {filteredUsers.length === 0 && (
                    <div className="text-center py-10 text-gray-500">No users found matching your search.</div>
                )}
            </div>

            {/* Edit/Add User Modal */}
            {editingUser && (
                <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-xl">
                        <div className="flex justify-between items-center mb-6 border-b border-gray-100 pb-4">
                            <h3 className="text-xl font-bold text-gray-800">{isAdding ? 'Add New User' : 'Edit User'}</h3>
                            <button onClick={() => {setEditingUser(null); setIsAdding(false);}} className="text-gray-400 hover:text-gray-600"><X size={24}/></button>
                        </div>
                        
                        <form onSubmit={handleSaveUser}>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                                    <div className="relative">
                                        <UserIcon size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                        <input 
                                            type="text" 
                                            value={editingUser.name} 
                                            onChange={e => setEditingUser({...editingUser, name: e.target.value})}
                                            className="w-full pl-10 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                                            required
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                                    <div className="relative">
                                        <Mail size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                        <input 
                                            type="email" 
                                            value={editingUser.email} 
                                            onChange={e => setEditingUser({...editingUser, email: e.target.value})}
                                            className="w-full pl-10 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                                        <div className="relative">
                                            <Shield size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                            <select 
                                                value={editingUser.role} 
                                                onChange={e => setEditingUser({...editingUser, role: e.target.value as any})}
                                                className="w-full pl-10 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                                            >
                                                <option value="User">User</option>
                                                <option value="Viewer">Viewer</option>
                                                <option value="Contributor">Contributor</option>
                                                <option value="Editor">Editor</option>
                                                <option value="Admin">Admin</option>
                                            </select>
                                        </div>
                                    </div>
                                    
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                                        <div className="relative">
                                            <CheckCircle size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                            <select 
                                                value={editingUser.status} 
                                                onChange={e => setEditingUser({...editingUser, status: e.target.value as any})}
                                                className="w-full pl-10 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                                            >
                                                <option value="Active">Active</option>
                                                <option value="Suspended">Suspended</option>
                                                <option value="Pending">Pending</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>

                                {!isAdding && (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Date Joined</label>
                                        <div className="relative">
                                            <Calendar size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                            <input 
                                                type="text" 
                                                value={editingUser.joinDate} 
                                                readOnly
                                                className="w-full pl-10 p-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500"
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="pt-6 flex justify-end space-x-3">
                                <button type="button" onClick={() => {setEditingUser(null); setIsAdding(false);}} className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg">Cancel</button>
                                <button type="submit" className="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 font-medium">{isAdding ? 'Add User' : 'Save Changes'}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserManagement;