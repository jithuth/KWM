export enum Category {
    NEWS = 'News',
    BUSINESS = 'Business',
    ASSOCIATION = 'Association',
    OBITUARY = 'Obituary',
    EVENT = 'Event'
}

export interface NewsItem {
    id: string;
    title: string;
    summary: string;
    content: string;
    date: string;
    imageUrl: string;
    category: 'Local' | 'Kerala' | 'International' | 'Sports';
    views: number;
    mediaType?: 'image' | 'video' | 'youtube';
    videoUrl?: string;
}

export interface BusinessListing {
    id: string;
    name: string;
    category: string;
    location: string;
    phone: string;
    description: string;
    rating: number;
}

export interface Association {
    id: string;
    name: string;
    focus: string; // e.g., Arts, Charity, District-based
    president: string;
    contact: string;
    logoUrl: string;
}

export interface Obituary {
    id: string;
    name: string;
    age: number;
    placeInKerala: string;
    placeInKuwait: string;
    dateOfDeath: string;
    imageUrl: string;
}

export interface User {
    id: string;
    name: string;
    email: string;
    role: 'Admin' | 'Editor' | 'User';
    status: 'Active' | 'Suspended' | 'Pending';
    joinDate: string;
}

export interface AppData {
    news: NewsItem[];
    businesses: BusinessListing[];
    associations: Association[];
    obituaries: Obituary[];
    users: User[];
}

export interface AdminStats {
    totalUsers: number;
    dailyViews: number;
    activeListings: number;
    revenue: number;
}