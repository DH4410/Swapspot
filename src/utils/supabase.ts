// src/utils/supabase.ts
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || '';
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_KEY || '';

export const isSupabaseConfigured = () => {
  return SUPABASE_URL && SUPABASE_KEY && SUPABASE_URL.startsWith('http');
};

// Fallbacks to prevent crashing if config is missing
const clientUrl = isSupabaseConfigured() ? SUPABASE_URL : 'https://placeholder.supabase.co';
const clientKey = isSupabaseConfigured() ? SUPABASE_KEY : 'placeholder';

export const supabase = createClient(clientUrl, clientKey);