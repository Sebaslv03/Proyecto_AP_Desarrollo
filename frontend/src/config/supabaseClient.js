import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_REACT_APP_SUPABASE_URL ?? "https://etvvfulbajnrvkzsnkfv.supabase.co";
const supabaseKey = import.meta.env.VITE_REACT_APP_ANON_KEY ??
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV0dnZmdWxiYWpucnZrenNua2Z2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTY2MTI5MzUsImV4cCI6MjAzMjE4ODkzNX0.rveiesoyR777Y0dYjqGDGafOMOvonu3LZTPBykUcXIw";

const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;
