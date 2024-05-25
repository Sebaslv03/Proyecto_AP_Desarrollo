import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://etvvfulbajnrvkzsnkfv.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV0dnZmdWxiYWpucnZrenNua2Z2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTY2MTI5MzUsImV4cCI6MjAzMjE4ODkzNX0.rveiesoyR777Y0dYjqGDGafOMOvonu3LZTPBykUcXIw";

const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;
