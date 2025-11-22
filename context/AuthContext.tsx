import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../services/supabaseClient';
import { Session, User } from '@supabase/supabase-js';

interface AuthContextType {
    session: Session | null;
    user: User | null;
    isAdmin: boolean;
    login: (email: string, password: string) => Promise<{ error?: string }>;
    signOut: () => Promise<void>;
    loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [session, setSession] = useState<Session | null>(null);
    const [user, setUser] = useState<User | null>(null);
    const [isAdmin, setIsAdmin] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check active session
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
            setUser(session?.user ?? null);
            checkAdminStatus(session?.user);
            setLoading(false);
        });

        // Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
            setUser(session?.user ?? null);
            checkAdminStatus(session?.user);
            setLoading(false);
        });

        return () => subscription.unsubscribe();
    }, []);

    const checkAdminStatus = async (currentUser: User | undefined | null) => {
        if (!currentUser) {
            setIsAdmin(false);
            return;
        }

        // If we are in a fallback/demo session that is manually set, isAdmin is handled in login.
        if (currentUser.id === 'demo-admin') {
            setIsAdmin(true);
            return;
        }

        const { data, error } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', currentUser.id)
            .single();

        if (data && data.role === 'Admin') {
            setIsAdmin(true);
        } else {
            setIsAdmin(false);
        }
    };

    const login = async (email: string, password: string) => {
        // Try Supabase Auth first
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (!error) return {};

        // Fallback: If login fails AND we don't have explicit env vars, allow demo login
        if (!process.env.SUPABASE_URL) {
            if (email === 'admin@kmp.com' && password === 'admin') {
                const demoUser = { id: 'demo-admin', email, role: 'authenticated' } as User;
                const demoSession = { user: demoUser, access_token: 'demo', token_type: 'bearer' } as Session;
                setSession(demoSession);
                setUser(demoUser);
                setIsAdmin(true);
                return {};
            }
        }

        return { error: error.message };
    };

    const signOut = async () => {
        // If we are in a demo session, just clear local state
        if (session?.user.id === 'demo-admin') {
            setSession(null);
            setUser(null);
            setIsAdmin(false);
            return;
        }

        await supabase.auth.signOut();
        setSession(null);
        setUser(null);
        setIsAdmin(false);
    };

    return (
        <AuthContext.Provider value={{ session, user, isAdmin, login, signOut, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};