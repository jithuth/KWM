import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { generateNewsContent, summarizeText } from '../../services/geminiService';
import { uploadFile } from '../../services/supabaseClient';
import { Trash2, Edit2, Sparkles, Plus, X, Newspaper, Briefcase, Users, Heart, Image as ImageIcon, Video, Youtube, Upload } from 'lucide-react';
import { NewsItem, BusinessListing, Association, Obituary } from '../../types';

type TabType = 'news' | 'business' | 'association' | 'obituary';

const ContentManager: React.FC = () => {
    const { data, addNews, updateNews, deleteNews, addBusiness, updateBusiness, deleteBusiness, addAssociation, updateAssociation, deleteAssociation, addObituary, updateObituary, deleteObituary } = useApp();
    const [activeTab, setActiveTab] = useState<TabType>('news');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isGenerating, setIsGenerating] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    
    // Generic Form State
    const [formData, setFormData] = useState<any>({});
    // File State
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [videoFile, setVideoFile] = useState<File | null>(null);

    const resetForm = () => {
        setEditingId(null);
        setImageFile(null);
        setVideoFile(null);
        if (activeTab === 'news') {
            setFormData({ 
                title: '', summary: '', content: '', category: 'Local', 
                mediaType: 'image', // 'image', 'video', 'youtube'
                videoUrl: '', // For youtube or uploaded video url
                imageUrl: '' // Thumbnail
            });
        } else if (activeTab === 'business') {
            setFormData({ name: '', category: 'Retail', location: '', phone: '', description: '', rating: 5 });
        } else if (activeTab === 'association') {
            setFormData({ name: '', focus: '', president: '', contact: '', logoUrl: '' });
        } else if (activeTab === 'obituary') {
            setFormData({ name: '', age: 0, placeInKerala: '', placeInKuwait: '', dateOfDeath: '', imageUrl: '' });
        }
    };

    const handleOpenModal = () => {
        resetForm();
        setIsModalOpen(true);
    };

    const handleEdit = (item: any) => {
        resetForm();
        setFormData({ ...item });
        setEditingId(item.id);
        setIsModalOpen(true);
    };

    const handleGenerateAI = async () => {
        if (activeTab !== 'news' || !formData.title) return;
        
        setIsGenerating(true);
        try {
            const content = await generateNewsContent(formData.title, "Kuwait Malayali Community Context");
            const summary = await summarizeText(content);
            setFormData((prev: any) => ({ ...prev, content, summary }));
        } catch (error) {
            console.error(error);
            alert("Failed to generate content");
        } finally {
            setIsGenerating(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setUploading(true);

        try {
            const id = editingId || Date.now().toString();
            let finalImageUrl = formData.imageUrl;
            let finalVideoUrl = formData.videoUrl;

            // Upload Image if present
            if (imageFile) {
                const path = activeTab === 'news' ? 'news/thumbnails' : activeTab;
                const url = await uploadFile(imageFile, path);
                if (url) finalImageUrl = url;
            }

            // Upload Video if present (only for news)
            if (activeTab === 'news' && formData.mediaType === 'video' && videoFile) {
                const url = await uploadFile(videoFile, 'news/videos');
                if (url) finalVideoUrl = url;
            }

            // If no image URL provided and no file uploaded, use placeholder
            if (!finalImageUrl && !imageFile && !editingId) {
                finalImageUrl = 'https://via.placeholder.com/400x200?text=No+Image';
            }

            if (activeTab === 'news') {
                const newsData = { 
                    ...formData, 
                    id, 
                    date: formData.date || new Date().toISOString().split('T')[0], 
                    views: formData.views || 0,
                    imageUrl: finalImageUrl,
                    videoUrl: finalVideoUrl
                } as NewsItem;
                
                if (editingId) await updateNews(newsData);
                else await addNews(newsData);

            } else if (activeTab === 'business') {
                const bizData = { ...formData, id } as BusinessListing;
                if (editingId) await updateBusiness(bizData);
                else await addBusiness(bizData);

            } else if (activeTab === 'association') {
                const assocData = { ...formData, id, logoUrl: finalImageUrl } as Association;
                if (editingId) await updateAssociation(assocData);
                else await addAssociation(assocData);

            } else if (activeTab === 'obituary') {
                const obitData = { ...formData, id, imageUrl: finalImageUrl } as Obituary;
                if (editingId) await updateObituary(obitData);
                else await addObituary(obitData);
            }
            
            setIsModalOpen(false);
        } catch (err) {
            console.error("Upload/Save failed", err);
            alert("Failed to save content.");
        } finally {
            setUploading(false);
        }
    };

    const renderTabs = () => (
        <div className="flex space-x-4 border-b border-gray-200 mb-6 overflow-x-auto pb-2">
            {[
                { id: 'news', label: 'News', icon: <Newspaper size={18} /> },
                { id: 'business', label: 'Business', icon: <Briefcase size={18} /> },
                { id: 'association', label: 'Associations', icon: <Users size={18} /> },
                { id: 'obituary', label: 'Obituary', icon: <Heart size={18} /> }
            ].map((tab) => (
                <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as TabType)}
                    className={`flex items-center space-x-2 px-4 py-2 border-b-2 font-medium text-sm whitespace-nowrap ${
                        activeTab === tab.id 
                            ? 'border-emerald-600 text-emerald-600' 
                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                >
                    {tab.icon}
                    <span>{tab.label}</span>
                </button>
            ))}
        </div>
    );

    const renderTable = () => {
        return (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name/Title</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Detail</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {activeTab === 'news' && data.news.map(item => (
                            <tr key={item.id}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.title}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.category}</td>
                                <td className="px-6 py-4 text-right whitespace-nowrap">
                                    <button onClick={() => handleEdit(item)} className="text-indigo-600 mr-3"><Edit2 size={18} /></button>
                                    <button onClick={() => deleteNews(item.id)} className="text-red-600"><Trash2 size={18} /></button>
                                </td>
                            </tr>
                        ))}
                        {activeTab === 'business' && data.businesses.map(item => (
                            <tr key={item.id}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.name}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.category}</td>
                                <td className="px-6 py-4 text-right whitespace-nowrap">
                                    <button onClick={() => handleEdit(item)} className="text-indigo-600 mr-3"><Edit2 size={18} /></button>
                                    <button onClick={() => deleteBusiness(item.id)} className="text-red-600"><Trash2 size={18} /></button>
                                </td>
                            </tr>
                        ))}
                        {activeTab === 'association' && data.associations.map(item => (
                            <tr key={item.id}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.name}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.focus}</td>
                                <td className="px-6 py-4 text-right whitespace-nowrap">
                                    <button onClick={() => handleEdit(item)} className="text-indigo-600 mr-3"><Edit2 size={18} /></button>
                                    <button onClick={() => deleteAssociation(item.id)} className="text-red-600"><Trash2 size={18} /></button>
                                </td>
                            </tr>
                        ))}
                        {activeTab === 'obituary' && data.obituaries.map(item => (
                            <tr key={item.id}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.name}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.dateOfDeath}</td>
                                <td className="px-6 py-4 text-right whitespace-nowrap">
                                    <button onClick={() => handleEdit(item)} className="text-indigo-600 mr-3"><Edit2 size={18} /></button>
                                    <button onClick={() => deleteObituary(item.id)} className="text-red-600"><Trash2 size={18} /></button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        );
    };

    const FileUpload = ({ label, onChange, accept }: { label: string, onChange: (e: any) => void, accept: string }) => (
        <div className="mb-3">
            <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:bg-gray-50 transition-colors relative cursor-pointer">
                <input type="file" onChange={onChange} accept={accept} className="absolute inset-0 opacity-0 cursor-pointer" />
                <Upload className="mx-auto text-gray-400 mb-2" size={24} />
                <span className="text-sm text-gray-500">Click to upload file</span>
            </div>
        </div>
    );

    const renderFormFields = () => {
        switch (activeTab) {
            case 'news':
                return (
                    <>
                        <input 
                            className="w-full p-2 border rounded mb-3" 
                            placeholder="Headline" 
                            value={formData.title || ''} 
                            onChange={e => setFormData({...formData, title: e.target.value})} 
                        />
                        <div className="flex space-x-2 mb-3">
                            <select 
                                className="p-2 border rounded flex-1"
                                value={formData.category || 'Local'}
                                onChange={e => setFormData({...formData, category: e.target.value})}
                            >
                                <option>Local</option>
                                <option>Kerala</option>
                                <option>International</option>
                                <option>Sports</option>
                            </select>
                            <button type="button" onClick={handleGenerateAI} disabled={isGenerating} className="bg-purple-100 text-purple-700 px-3 rounded flex items-center">
                                <Sparkles size={16} className="mr-1" /> AI
                            </button>
                        </div>

                        {/* Media Type Selection */}
                        <div className="flex space-x-4 mb-4 bg-gray-50 p-2 rounded-lg">
                             <button 
                                type="button"
                                onClick={() => setFormData({...formData, mediaType: 'image'})}
                                className={`flex-1 py-2 flex items-center justify-center rounded-md text-sm ${formData.mediaType === 'image' ? 'bg-white shadow text-emerald-600' : 'text-gray-500'}`}
                             >
                                <ImageIcon size={16} className="mr-2" /> Image
                             </button>
                             <button 
                                type="button"
                                onClick={() => setFormData({...formData, mediaType: 'video'})}
                                className={`flex-1 py-2 flex items-center justify-center rounded-md text-sm ${formData.mediaType === 'video' ? 'bg-white shadow text-emerald-600' : 'text-gray-500'}`}
                             >
                                <Video size={16} className="mr-2" /> Upload Video
                             </button>
                             <button 
                                type="button"
                                onClick={() => setFormData({...formData, mediaType: 'youtube'})}
                                className={`flex-1 py-2 flex items-center justify-center rounded-md text-sm ${formData.mediaType === 'youtube' ? 'bg-white shadow text-red-600' : 'text-gray-500'}`}
                             >
                                <Youtube size={16} className="mr-2" /> YouTube
                             </button>
                        </div>

                        {/* Conditional Media Inputs */}
                        <FileUpload label="Thumbnail Image" accept="image/*" onChange={(e: any) => setImageFile(e.target.files[0])} />
                        
                        {formData.mediaType === 'video' && (
                            <FileUpload label="Video File (MP4)" accept="video/mp4" onChange={(e: any) => setVideoFile(e.target.files[0])} />
                        )}
                        
                        {formData.mediaType === 'youtube' && (
                            <input 
                                className="w-full p-2 border rounded mb-3" 
                                placeholder="YouTube URL (e.g. https://youtube.com/watch?v=...)" 
                                value={formData.videoUrl || ''} 
                                onChange={e => setFormData({...formData, videoUrl: e.target.value})} 
                            />
                        )}

                        <textarea 
                            className="w-full p-2 border rounded mb-3" 
                            rows={3} 
                            placeholder="Summary"
                            value={formData.summary || ''}
                            onChange={e => setFormData({...formData, summary: e.target.value})}
                        />
                        <textarea 
                            className="w-full p-2 border rounded mb-3" 
                            rows={6} 
                            placeholder="Content"
                            value={formData.content || ''}
                            onChange={e => setFormData({...formData, content: e.target.value})}
                        />
                    </>
                );
            case 'business':
                return (
                    <>
                        <input className="w-full p-2 border rounded mb-3" placeholder="Business Name" value={formData.name || ''} onChange={e => setFormData({...formData, name: e.target.value})} />
                        <input className="w-full p-2 border rounded mb-3" placeholder="Category" value={formData.category || ''} onChange={e => setFormData({...formData, category: e.target.value})} />
                        <input className="w-full p-2 border rounded mb-3" placeholder="Location" value={formData.location || ''} onChange={e => setFormData({...formData, location: e.target.value})} />
                        <input className="w-full p-2 border rounded mb-3" placeholder="Phone" value={formData.phone || ''} onChange={e => setFormData({...formData, phone: e.target.value})} />
                        <textarea className="w-full p-2 border rounded mb-3" placeholder="Description" value={formData.description || ''} onChange={e => setFormData({...formData, description: e.target.value})} />
                    </>
                );
            case 'association':
                return (
                    <>
                         <input className="w-full p-2 border rounded mb-3" placeholder="Association Name" value={formData.name || ''} onChange={e => setFormData({...formData, name: e.target.value})} />
                         <FileUpload label="Logo" accept="image/*" onChange={(e: any) => setImageFile(e.target.files[0])} />
                         <input className="w-full p-2 border rounded mb-3" placeholder="Focus (e.g. Arts)" value={formData.focus || ''} onChange={e => setFormData({...formData, focus: e.target.value})} />
                         <input className="w-full p-2 border rounded mb-3" placeholder="President Name" value={formData.president || ''} onChange={e => setFormData({...formData, president: e.target.value})} />
                         <input className="w-full p-2 border rounded mb-3" placeholder="Contact Number" value={formData.contact || ''} onChange={e => setFormData({...formData, contact: e.target.value})} />
                    </>
                );
             case 'obituary':
                return (
                    <>
                         <input className="w-full p-2 border rounded mb-3" placeholder="Name" value={formData.name || ''} onChange={e => setFormData({...formData, name: e.target.value})} />
                         <FileUpload label="Photo" accept="image/*" onChange={(e: any) => setImageFile(e.target.files[0])} />
                         <div className="flex space-x-2 mb-3">
                            <input type="number" className="w-1/2 p-2 border rounded" placeholder="Age" value={formData.age || ''} onChange={e => setFormData({...formData, age: Number(e.target.value)})} />
                            <input type="date" className="w-1/2 p-2 border rounded" value={formData.dateOfDeath || ''} onChange={e => setFormData({...formData, dateOfDeath: e.target.value})} />
                         </div>
                         <input className="w-full p-2 border rounded mb-3" placeholder="Place in Kuwait" value={formData.placeInKuwait || ''} onChange={e => setFormData({...formData, placeInKuwait: e.target.value})} />
                         <input className="w-full p-2 border rounded mb-3" placeholder="Place in Kerala" value={formData.placeInKerala || ''} onChange={e => setFormData({...formData, placeInKerala: e.target.value})} />
                    </>
                );
        }
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Data Management</h2>
                <button 
                    onClick={handleOpenModal}
                    className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 flex items-center space-x-2"
                >
                    <Plus size={20} />
                    <span className="capitalize">Add {activeTab}</span>
                </button>
            </div>

            {renderTabs()}
            {renderTable()}

            {isModalOpen && (
                <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-xl max-w-2xl w-full p-6">
                        <div className="flex justify-between items-center mb-4 border-b border-gray-100 pb-4">
                            <h3 className="text-xl font-bold capitalize">{editingId ? `Edit ${activeTab}` : `Add New ${activeTab}`}</h3>
                            <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600"><X /></button>
                        </div>
                        <form onSubmit={handleSubmit}>
                            {renderFormFields()}
                            <div className="pt-4 flex justify-end space-x-3">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg">Cancel</button>
                                <button 
                                    type="submit" 
                                    disabled={uploading}
                                    className="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 flex items-center"
                                >
                                    {uploading ? 'Saving...' : 'Save'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ContentManager;