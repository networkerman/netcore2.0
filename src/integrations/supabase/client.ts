// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://etlliytohpvgbvpcfgrd.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV0bGxpeXRvaHB2Z2J2cGNmZ3JkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDIyNzk3NjcsImV4cCI6MjA1Nzg1NTc2N30.rfiKkFV9nIhdJ2NzzrVtwbNI6LvGYlXaX7PBdPzyGNs";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);