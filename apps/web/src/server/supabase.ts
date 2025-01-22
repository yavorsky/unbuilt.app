import { createClient } from '@supabase/supabase-js';
import '../../envConfig';
import { Database } from '../../supabase/database.types';

if (!process.env.SUPABASE_URL || !process.env.SUPABASE_KEY) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient<Database>(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);
