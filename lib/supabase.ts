import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://txhitsubmjjbmrtqdiku.supabase.co';
const SUPABASE_ANON_KEY = 'YOUR_ANON_KEY'; // Replace with your actual anon key from Supabase dashboard

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

export type { User, Session } from '@supabase/supabase-js';

