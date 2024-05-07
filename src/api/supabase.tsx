import { createClient } from '@supabase/supabase-js'
const supabaseUrl = import.meta.env.VITE_SUPA_BASE_URL
const supabaseKey = import.meta.env.VITE_SUPA_BASE_KEY
const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase