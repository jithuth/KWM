import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { generateNewsContent, summarizeText, generateImage, enhanceArticleContent, translateText } from '../../services/geminiService';
import { uploadFile } from '../../services/supabaseClient';
import { Trash2, Edit2, Sparkles, Plus, X, Newspaper, Briefcase, Users, Heart, Image as ImageIcon, Video, Youtube, Upload, Bold, Italic, List, Heading1, Wand2, Loader2, Globe, Type } from 'lucide-react';
import { NewsItem, BusinessListing, Association, Obituary } from '../../types';

type TabType = 'news' | 'business' | 'association' | 'obituary';

const ContentManager: React.FC = () => {
    const { data, addNews, updateNews, deleteNews, addBusiness, updateBusiness, deleteBusiness, addAssociation, updateAssociation, deleteAssociation, addObituary, updateObituary, deleteObituary } = useApp();
    const [activeTab, setActiveTab] = useState<TabType>('news');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isGenerating, setIsGenerating] = useState(false);
    const [isEnhancing, setIsEnhancing] = useState(false);
    const [isTranslating, setIsTranslating] = useState(false);
    const [isGeneratingImage, setIsGeneratingImage] = useState(false);
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

    const handleGenerateImage = async () => {
        if (!formData.title && !formData.summary) {
            alert("Please enter a Title or Summary to generate an image.");
            return;
        }
        
        setIsGeneratingImage(true);
        try {
            const prompt = formData.summary || formData.title;
            const base64Image = await generateImage(prompt);
            if (base64Image) {
                setFormData((prev: any) => ({ ...prev, imageUrl: base64Image }));
            } else {
                alert("Could not generate image. Please try again.");
            }
        } catch (error) {
            console.error(error);
            alert("Failed to generate image.");
        } finally {
            setIsGeneratingImage(false);
        }
    };

    const handleEnhanceContent = async () => {
        if (!formData.content) return;
        
        setIsEnhancing(true);
        try {
            const enhanced = await enhanceArticleContent(formData.content);
            setFormData((prev: any) => ({ ...prev, content: enhanced }));
        } catch (error) {
            console.error(error);
            alert("Failed to enhance content");
        } finally {
            setIsEnhancing(false);
        }
    };

    const handleTranslate = async (lang: 'en' | 'ml') => {
         if (!formData.content) return;
         setIsTranslating(true);
         try {
             const translated = await translateText(formData.content, lang);
             setFormData((prev: any) => ({ ...prev, content: translated }));
         } catch(e) {
             console.error(e);
             alert("Translation failed");
         } finally {
             setIsTranslating(false);
         }
    };

    const insertHtmlTag = (tag: string, style: string = '') => {
        const textarea = document.getElementById('content-editor') as HTMLTextAreaElement;
        if (!textarea) return;

        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const text = formData.content || '';
        const before = text.substring(0, start);
        const selection = text.substring(start, end);
        const after = text.substring(end);

        let prefix = `<${tag}>`;
        let suffix = `</${tag}>`;
        
        if (style) {
             prefix = `<${tag} style="${style}">`;
        } else if (tag === 'font-ml') {
            prefix = `<span class="font-malayalam">`;
            suffix = `</span>`;
        }

        const newContent = `${before}${prefix}${selection}${suffix}${after}`;
        setFormData({ ...formData, content: newContent });
        
        setTimeout(() => {
            textarea.focus();
            textarea.setSelectionRange(start + prefix.length, end + prefix.length);
        }, 0);
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

    const FileUpload = ({ label, onChange, accept, extraButton }: { label: string, onChange: (e: any) => void, accept: string, extraButton?: React.ReactNode }) => (
        <div className="mb-3">
            <div className="flex justify-between items-center mb-1">
                <label className="block text-sm font-medium text-gray-700">{label}</label>
                {extraButton}
            </div>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:bg-gray-50 transition-colors relative cursor-pointer">
                <input type="file" onChange={onChange} accept={accept} className="absolute inset-0 opacity-0 cursor-pointer" />
                <Upload className="mx-auto text-gray-400 mb-2" size={24} />
                <span className="text-sm text-gray-500">Click to upload file</span>
            </div>
        </div>
    );

    const RichTextToolbar = () => (
        <div className="flex items-center flex-wrap gap-1 mb-1 p-1.5 bg-gray-50 border border-gray-200 rounded-t-lg">
            <button type="button" onClick={() => insertHtmlTag('b')} className="p-1.5 hover:bg-gray-200 rounded text-gray-700" title="Bold">
                <Bold size={16} />
            </button>
            <button type="button" onClick={() => insertHtmlTag('i')} className="p-1.5 hover:bg-gray-200 rounded text-gray-700" title="Italic">
                <Italic size={16} />
            </button>
             <button type="button" onClick={() => insertHtmlTag('h2')} className="p-1.5 hover:bg-gray-200 rounded text-gray-700" title="Heading">
                <Heading1 size={16} />
            </button>
             <button type="button" onClick={() => insertHtmlTag('ul')} className="p-1.5 hover:bg-gray-200 rounded text-gray-700" title="List">
                <List size={16} />
            </button>
             <button type="button" onClick={() => insertHtmlTag('li')} className="p-1.5 hover:bg-gray-200 rounded text-gray-700 text-xs font-bold" title="List Item">
                • Item
            </button>
            
            <div className="w-px h-4 bg-gray-300 mx-1"></div>
            
            {/* Font Selection */}
            <button 
                type="button" 
                onClick={() => insertHtmlTag('font-ml')} 
                className="flex items-center space-x-1 p-1.5 hover:bg-gray-200 rounded text-gray-700 text-xs" 
                title="Apply Malayalam Font"
            >
                <Type size={16} />
                <span>Mal</span>
            </button>

            <div className="flex-grow"></div>

            {/* Translation Tools */}
            <div className="flex items-center space-x-1">
                <button 
                    type="button" 
                    onClick={() => handleTranslate('ml')} 
                    disabled={isTranslating}
                    className="flex items-center space-x-1 px-2 py-1 rounded text-xs font-medium bg-blue-50 text-blue-700 hover:bg-blue-100"
                >
                    {isTranslating ? <Loader2 size={14} className="animate-spin" /> : <Globe size={14} />}
                    <span>To Malayalam</span>
                </button>
            </div>

            <button 
                type="button" 
                onClick={handleEnhanceContent} 
                disabled={isEnhancing || !formData.content}
                className={`flex items-center space-x-1 px-2 py-1 rounded text-xs font-medium transition-colors ${isEnhancing ? 'bg-gray-100 text-gray-400' : 'bg-purple-50 text-purple-700 hover:bg-purple-100'}`}
            >
                {isEnhancing ? <Loader2 size={14} className="animate-spin" /> : <Wand2 size={14} />}
                <span>AI Format</span>
            </button>
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
                            <button type="button" onClick={handleGenerateAI} disabled={isGenerating} className="bg-purple-100 text-purple-700 px-3 rounded flex items-center text-sm font-medium hover:bg-purple-200 transition-colors">
                                {isGenerating ? <Loader2 size={16} className="animate-spin mr-1" /> : <Sparkles size={16} className="mr-1" />} 
                                Auto-Write
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
                        <FileUpload 
                            label="Thumbnail Image" 
                            accept="image/*" 
                            onChange={(e: any) => setImageFile(e.target.files[0])}
                            extraButton={
                                <button 
                                    type="button" 
                                    onClick={handleGenerateImage} 
                                    disabled={isGeneratingImage}
                                    className="text-xs text-purple-600 hover:text-purple-800 flex items-center"
                                >
                                    {isGeneratingImage ? <Loader2 size={12} className="animate-spin mr-1"/> : <Sparkles size={12} className="mr-1"/>}
                                    Generate with AI
                                </button>
                            }
                        />
                        
                        {formData.imageUrl && formData.imageUrl.startsWith('data:') && (
                            <div className="mb-3">
                                <p className="text-xs text-green-600 mb-1">AI Image Generated</p>
                                <img src={formData.imageUrl} alt="Generated" className="h-20 w-32 object-cover rounded border" />
                            </div>
                        )}

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
                            className="w-full p-2 border rounded mb-3 text-sm" 
                            rows={3} 
                            placeholder="Summary"
                            value={formData.summary || ''}
                            onChange={e => setFormData({...formData, summary: e.target.value})}
                        />
                        
                        <div className="mb-3">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Article Content</label>
                            <RichTextToolbar />
                            <textarea 
                                id="content-editor"
                                className="w-full p-3 border border-t-0 rounded-b-lg focus:ring-0 text-sm leading-relaxed font-mono" 
                                rows={12} 
                                placeholder="Write your article here... HTML tags are supported for advanced formatting."
                                value={formData.content || ''}
                                onChange={e => setFormData({...formData, content: e.target.value})}
                            />
                            <p className="text-xs text-gray-400 mt-1">Supports HTML tags for rich text.</p>
                        </div>
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
                    <div className="bg-white rounded-xl max-w-4xl w-full p-6">
                         <div className="flex justify-between items-center mb-4 border-b border-gray-100 pb-4">
                            <h3 className="text-xl font-bold capitalize">{editingId ? `Edit ${activeTab}` : `Add New ${activeTab}`}</h3>
                            <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600"><X /></button>
                        </div>
                        <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-6">
                             {/* Main Editor Area */}
                             <div className="flex-1">
                                {renderFormFields()}
                             </div>

                             {/* Sidebar Options for News */}
                             {activeTab === 'news' && (
                                 <div className="w-full md:w-64 space-y-4 border-l pl-0 md:pl-6 border-gray-100">
                                     <div>
                                         <h4 className="font-bold text-xs text-gray-500 uppercase mb-2">Publishing</h4>
                                         <button 
                                            type="submit" 
                                            disabled={uploading}
                                            className="w-full py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 font-medium text-sm flex justify-center items-center"
                                        >
                                            {uploading ? 'Saving...' : 'Publish Now'}
                                        </button>
                                     </div>
                                     
                                     <div>
                                         <h4 className="font-bold text-xs text-gray-500 uppercase mb-2">Date</h4>
                                          <input type="date" className="w-full p-2 border rounded text-sm" value={formData.date || ''} onChange={e => setFormData({...formData, date: e.target.value})} />
                                     </div>
                                     
                                     <div>
                                          <h4 className="font-bold text-xs text-gray-500 uppercase mb-2">Stats</h4>
                                          <input type="number" className="w-full p-2 border rounded text-sm" placeholder="Views" value={formData.views || 0} onChange={e => setFormData({...formData, views: Number(e.target.value)})} />
                                     </div>

                                     <div className="bg-blue-50 p-3 rounded-lg">
                                         <h4 className="font-bold text-xs text-blue-800 mb-1 flex items-center"><Globe size={12} className="mr-1"/> Language Tools</h4>
                                         <p className="text-xs text-blue-600 mb-2">Use the toolbar to translate content to Malayalam.</p>
                                     </div>
                                 </div>
                             )}
                             
                             {activeTab !== 'news' && (
                                  <div className="w-full md:w-auto flex justify-end items-end">
                                        <button 
                                            type="submit" 
                                            disabled={uploading}
                                            className="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 flex items-center"
                                        >
                                            {uploading ? 'Saving...' : 'Save'}
                                        </button>
                                  </div>
                             )}
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ContentManager;