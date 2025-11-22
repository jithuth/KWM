import React, { createContext, useContext, useState, useEffect } from 'react';
import { AppData, NewsItem, BusinessListing, Association, Obituary, User } from '../types';
import { supabase } from '../services/supabaseClient';

interface AppContextType {
    data: AppData;
    loading: boolean;
    error: string | null;
    isDemoMode: boolean;
    addNews: (item: NewsItem) => Promise<void>;
    updateNews: (item: NewsItem) => Promise<void>;
    deleteNews: (id: string) => Promise<void>;
    addBusiness: (item: BusinessListing) => Promise<void>;
    updateBusiness: (item: BusinessListing) => Promise<void>;
    deleteBusiness: (id: string) => Promise<void>;
    addAssociation: (item: Association) => Promise<void>;
    updateAssociation: (item: Association) => Promise<void>;
    deleteAssociation: (id: string) => Promise<void>;
    addObituary: (item: Obituary) => Promise<void>;
    updateObituary: (item: Obituary) => Promise<void>;
    deleteObituary: (id: string) => Promise<void>;
    addUser: (user: User) => Promise<void>;
    deleteUser: (id: string) => Promise<void>;
    updateUser: (user: User) => Promise<void>;
    refreshData: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// --- DEMO DATA FOR FALLBACK ---
const DEMO_DATA: AppData = {
    news: [
        { 
            id: '1', 
            title: 'Kuwait National Day Celebrations Announced', 
            summary: 'The government has announced a week-long celebration for the upcoming National Day with fireworks and cultural events.', 
            content: 'The festivities will begin on February 25th with a grand parade on Gulf Road. Authorities have ensured all safety measures are in place. Several international dignitaries are expected to attend the event, which marks a significant milestone in the country\'s history.', 
            date: '2023-02-20', 
            imageUrl: 'https://images.unsplash.com/photo-1578894381163-e72c17f2d45f?auto=format&fit=crop&w=800&q=80', 
            category: 'Local', 
            views: 1540, 
            mediaType: 'image' 
        },
        { 
            id: '2', 
            title: 'New Direct Flights to Kochi Started', 
            summary: 'Jazeera Airways has launched daily direct flights to Kochi, reducing travel time significantly for expats.', 
            content: 'The new service starts from March 1st. Tickets are available at introductory prices. This move is expected to boost tourism and help the large Malayali community in Kuwait visit home more frequently.', 
            date: '2023-02-18', 
            imageUrl: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=800&q=80', 
            category: 'International', 
            views: 2300, 
            mediaType: 'image' 
        },
        { 
            id: '3', 
            title: 'Kerala Blasters Fan Club Meetup', 
            summary: 'The official fan club in Kuwait is hosting a screening of the upcoming match against Bengaluru FC.', 
            content: 'Fans are invited to the Abbasiya Community Hall this Friday. Entry is free for registered members.', 
            date: '2023-02-15', 
            imageUrl: 'https://images.unsplash.com/photo-1518091043644-c1d4457512c6?auto=format&fit=crop&w=800&q=80', 
            category: 'Sports', 
            views: 800, 
            mediaType: 'image' 
        }
    ],
    businesses: [
        { id: '1', name: 'Malabar Gold & Diamonds', category: 'Jewelry', location: 'Fahaheel', phone: '2392 0000', description: 'Exquisite collection of gold, diamond, and platinum jewelry.', rating: 4.8 },
        { id: '2', name: 'Saravana Bhavan', category: 'Restaurant', location: 'Salmiya', phone: '2571 0000', description: 'Authentic South Indian vegetarian cuisine.', rating: 4.5 },
        { id: '3', name: 'LuLu Hypermarket', category: 'Retail', location: 'Al Rai', phone: '2475 0000', description: 'One stop shop for all your grocery and lifestyle needs.', rating: 4.7 }
    ],
    associations: [
        { id: '1', name: 'Kuwait Malayali Samajam', focus: 'Arts & Culture', president: 'John Doe', contact: '9999 8888', logoUrl: 'https://via.placeholder.com/150' },
        { id: '2', name: 'Kozhikode District Association', focus: 'District Welfare', president: 'Jane Smith', contact: '6666 5555', logoUrl: 'https://via.placeholder.com/150' }
    ],
    obituaries: [
        { id: '1', name: 'Thomas Varghese', age: 65, placeInKerala: 'Kottayam', placeInKuwait: 'Abbasiya', dateOfDeath: '2023-02-10', imageUrl: 'https://via.placeholder.com/150' }
    ],
    users: [
        { id: '1', name: 'Admin User', email: 'admin@kmp.com', role: 'Admin', status: 'Active', joinDate: '2023-01-01' },
        { id: '2', name: 'Editor User', email: 'editor@kmp.com', role: 'Editor', status: 'Active', joinDate: '2023-01-15' }
    ]
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [data, setData] = useState<AppData>(DEMO_DATA); // Init with Demo Data to prevent flash
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isDemoMode, setIsDemoMode] = useState(false);

    // Fetch all data from Supabase
    const fetchData = async () => {
        setLoading(true);
        
        try {
            const [newsRes, bizRes, assocRes, obitRes, userRes] = await Promise.all([
                supabase.from('news').select('*').order('date', { ascending: false }),
                supabase.from('businesses').select('*'),
                supabase.from('associations').select('*'),
                supabase.from('obituaries').select('*'),
                supabase.from('profiles').select('*') 
            ]);

            if (newsRes.error) throw newsRes.error;

            const mappedNews = (newsRes.data || []).map((n: any) => ({
                ...n,
                imageUrl: n.image_url,
                mediaType: n.media_type || 'image',
                videoUrl: n.video_url
            }));

            const mappedBiz = (bizRes.data || []).map((b: any) => ({ ...b }));
            const mappedAssoc = (assocRes.data || []).map((a: any) => ({ ...a, logoUrl: a.logo_url }));
            const mappedObit = (obitRes.data || []).map((o: any) => ({ 
                ...o, 
                placeInKerala: o.place_kerala,
                placeInKuwait: o.place_kuwait,
                dateOfDeath: o.date_of_death,
                imageUrl: o.image_url 
            }));

            setData({
                news: mappedNews,
                businesses: mappedBiz,
                associations: mappedAssoc,
                obituaries: mappedObit,
                users: userRes.data?.map((u: any) => ({
                    id: u.id,
                    name: u.full_name || u.email,
                    email: u.email,
                    role: u.role,
                    status: u.status || 'Active',
                    joinDate: u.created_at ? new Date(u.created_at).toISOString().split('T')[0] : ''
                })) || []
            });
            setError(null);
            setIsDemoMode(false);
        } catch (err: any) {
            console.error("Error fetching data:", err);
            // Fallback to demo data on fetch error
            setData(DEMO_DATA);
            setIsDemoMode(true);
            setError("Failed to load data from database. Running in Demo Mode.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    // --- News Operations ---
    const addNews = async (item: NewsItem) => {
        setData(prev => ({ ...prev, news: [item, ...prev.news] }));
        if (!isDemoMode) {
            const { error } = await supabase.from('news').insert([{
                title: item.title,
                summary: item.summary,
                content: item.content,
                category: item.category,
                image_url: item.imageUrl,
                date: item.date,
                views: 0,
                media_type: item.mediaType,
                video_url: item.videoUrl
            }]);
            if (error) console.error("Error adding news:", error);
            else fetchData(); 
        }
    };

    const updateNews = async (item: NewsItem) => {
        setData(prev => ({ ...prev, news: prev.news.map(n => n.id === item.id ? item : n) }));
        if (!isDemoMode) {
            const { error } = await supabase.from('news').update({
                title: item.title,
                summary: item.summary,
                content: item.content,
                category: item.category,
                image_url: item.imageUrl,
                date: item.date,
                media_type: item.mediaType,
                video_url: item.videoUrl
            }).eq('id', item.id);
            if (error) console.error("Error updating news:", error);
        }
    };

    const deleteNews = async (id: string) => {
        setData(prev => ({ ...prev, news: prev.news.filter(n => n.id !== id) }));
        if (!isDemoMode) {
            await supabase.from('news').delete().eq('id', id);
        }
    };

    // --- Business Operations ---
    const addBusiness = async (item: BusinessListing) => {
        setData(prev => ({ ...prev, businesses: [item, ...prev.businesses] }));
        if (!isDemoMode) {
             const { error } = await supabase.from('businesses').insert([{
                name: item.name,
                category: item.category,
                location: item.location,
                phone: item.phone,
                description: item.description,
                rating: item.rating
            }]);
            if (error) console.error("Error adding business:", error);
            else fetchData();
        }
    };

    const updateBusiness = async (item: BusinessListing) => {
        setData(prev => ({ ...prev, businesses: prev.businesses.map(b => b.id === item.id ? item : b) }));
        if (!isDemoMode) {
             const { error } = await supabase.from('businesses').update({
                name: item.name,
                category: item.category,
                location: item.location,
                phone: item.phone,
                description: item.description,
                rating: item.rating
            }).eq('id', item.id);
            if (error) console.error("Error updating business:", error);
        }
    };

    const deleteBusiness = async (id: string) => {
        setData(prev => ({ ...prev, businesses: prev.businesses.filter(b => b.id !== id) }));
        if (!isDemoMode) {
            await supabase.from('businesses').delete().eq('id', id);
        }
    };

    // --- Association Operations ---
    const addAssociation = async (item: Association) => {
        setData(prev => ({ ...prev, associations: [item, ...prev.associations] }));
        if (!isDemoMode) {
            const { error } = await supabase.from('associations').insert([{
                name: item.name,
                focus: item.focus,
                president: item.president,
                contact: item.contact,
                logo_url: item.logoUrl
            }]);
             if (error) console.error("Error adding association:", error);
             else fetchData();
        }
    };

    const updateAssociation = async (item: Association) => {
        setData(prev => ({ ...prev, associations: prev.associations.map(a => a.id === item.id ? item : a) }));
        if (!isDemoMode) {
            const { error } = await supabase.from('associations').update({
                name: item.name,
                focus: item.focus,
                president: item.president,
                contact: item.contact,
                logo_url: item.logoUrl
            }).eq('id', item.id);
             if (error) console.error("Error updating association:", error);
        }
    };

    const deleteAssociation = async (id: string) => {
        setData(prev => ({ ...prev, associations: prev.associations.filter(a => a.id !== id) }));
        if (!isDemoMode) {
            await supabase.from('associations').delete().eq('id', id);
        }
    };

    // --- Obituary Operations ---
    const addObituary = async (item: Obituary) => {
        setData(prev => ({ ...prev, obituaries: [item, ...prev.obituaries] }));
        if (!isDemoMode) {
            const { error } = await supabase.from('obituaries').insert([{
                name: item.name,
                age: item.age,
                place_kerala: item.placeInKerala,
                place_kuwait: item.placeInKuwait,
                date_of_death: item.dateOfDeath,
                image_url: item.imageUrl
            }]);
             if (error) console.error("Error adding obituary:", error);
             else fetchData();
        }
    };

    const updateObituary = async (item: Obituary) => {
        setData(prev => ({ ...prev, obituaries: prev.obituaries.map(o => o.id === item.id ? item : o) }));
        if (!isDemoMode) {
            const { error } = await supabase.from('obituaries').update({
                name: item.name,
                age: item.age,
                place_kerala: item.placeInKerala,
                place_kuwait: item.placeInKuwait,
                date_of_death: item.dateOfDeath,
                image_url: item.imageUrl
            }).eq('id', item.id);
             if (error) console.error("Error updating obituary:", error);
        }
    };

    const deleteObituary = async (id: string) => {
        setData(prev => ({ ...prev, obituaries: prev.obituaries.filter(o => o.id !== id) }));
        if (!isDemoMode) {
            await supabase.from('obituaries').delete().eq('id', id);
        }
    };

    // --- User Operations ---
    const addUser = async (item: User) => {
        setData(prev => ({ ...prev, users: [item, ...prev.users] }));
        if (!isDemoMode) {
            const { error } = await supabase.from('profiles').insert([{
                id: item.id, // Note: Normally ID comes from Auth, but if adding manually to profile table
                email: item.email,
                full_name: item.name,
                role: item.role,
                status: item.status
            }]);
             if (error) console.error("Error adding user:", error);
             else fetchData();
        }
    };

    const deleteUser = async (id: string) => {
        setData(prev => ({ ...prev, users: prev.users.filter(u => u.id !== id) }));
        if (!isDemoMode) {
            await supabase.from('profiles').delete().eq('id', id);
        }
    };

    const updateUser = async (updatedUser: User) => {
        setData(prev => ({
            ...prev,
            users: prev.users.map(u => u.id === updatedUser.id ? updatedUser : u)
        }));
        
        if (!isDemoMode) {
            await supabase.from('profiles').update({
                full_name: updatedUser.name,
                email: updatedUser.email,
                role: updatedUser.role,
                status: updatedUser.status
            }).eq('id', updatedUser.id);
        }
    };

    return (
        <AppContext.Provider value={{ 
            data, loading, error, isDemoMode,
            addNews, updateNews, deleteNews, 
            addBusiness, updateBusiness, deleteBusiness,
            addAssociation, updateAssociation, deleteAssociation,
            addObituary, updateObituary, deleteObituary,
            addUser, deleteUser, updateUser,
            refreshData: fetchData
        }}>
            {children}
        </AppContext.Provider>
    );
};

export const useApp = () => {
    const context = useContext(AppContext);
    if (!context) {
        throw new Error('useApp must be used within an AppProvider');
    }
    return context;
};