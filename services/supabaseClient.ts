import { createClient } from '@supabase/supabase-js';

// Helper to get env vars safely checking both process.env and import.meta.env
const getEnv = (key: string, viteKey: string) => {
    // @ts-ignore
    if (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env[viteKey]) {
        // @ts-ignore
        return import.meta.env[viteKey];
    }
    // @ts-ignore
    if (typeof process !== 'undefined' && process.env && process.env[key]) {
        return process.env[key];
    }
    return '';
};

const supabaseUrl = getEnv('SUPABASE_URL', 'VITE_SUPABASE_URL') || 'https://duutbojyafdwkoomdonx.supabase.co';
const supabaseAnonKey = getEnv('SUPABASE_KEY', 'VITE_SUPABASE_KEY') || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR1dXRib2p5YWZkd2tvb21kb254Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMzOTczNTAsImV4cCI6MjA3ODk3MzM1MH0.LXlPxjr692E2MkHuA8diMhDGIMDE-FPBSPDLW0flxEA';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Helper to upload files (images or videos) to a 'media' bucket
export const uploadFile = async (file: File, path: string): Promise<string | null> => {
    try {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `${path}/${fileName}`;

        const { error: uploadError } = await supabase.storage
            .from('media')
            .upload(filePath, file);

        if (uploadError) {
            throw uploadError;
        }

        const { data } = supabase.storage.from('media').getPublicUrl(filePath);
        return data.publicUrl;
    } catch (error) {
        console.error('Error uploading file:', error);
        return null;
    }
};