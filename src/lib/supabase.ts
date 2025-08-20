import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://paqzvypepyubriuuaopp.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBhcXp2eXBlcHl1YnJpdXVhb3BwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzU2NDUyNzIsImV4cCI6MjA1MTIyMTI3Mn0.kL3PxVHqwbZNW2YoVkRsZhFV7xJXxH8fOPxVHqwbZN';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Database = {
  public: {
    Tables: {
      mental_health_profiles: {
        Row: {
          id: string;
          user_id: string;
          conditions: string[];
          under_treatment: boolean | null;
          on_medication: boolean | null;
          crisis_support: boolean;
          response_style: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          conditions: string[];
          under_treatment?: boolean | null;
          on_medication?: boolean | null;
          crisis_support: boolean;
          response_style: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          conditions?: string[];
          under_treatment?: boolean | null;
          on_medication?: boolean | null;
          crisis_support?: boolean;
          response_style?: string;
          created_at?: string;
        };
      };
      mood_entries: {
        Row: {
          id: string;
          user_id: string;
          mood: string;
          emotional_score: number;
          journal_entry: string | null;
          dream_entry: string | null;
          stress_level: number;
          energy_level: number;
          anxiety_level: number;
          tags: string[];
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          mood: string;
          emotional_score: number;
          journal_entry?: string | null;
          dream_entry?: string | null;
          stress_level: number;
          energy_level: number;
          anxiety_level: number;
          tags: string[];
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          mood?: string;
          emotional_score?: number;
          journal_entry?: string | null;
          dream_entry?: string | null;
          stress_level?: number;
          energy_level?: number;
          anxiety_level?: number;
          tags?: string[];
          created_at?: string;
        };
      };
      game_profiles: {
        Row: {
          id: string;
          user_id: string;
          level: number;
          xp: number;
          total_xp: number;
          abilities: string[];
          streaks: Record<string, number>;
          last_activity: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          level: number;
          xp: number;
          total_xp: number;
          abilities: string[];
          streaks: Record<string, number>;
          last_activity?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          level?: number;
          xp?: number;
          total_xp?: number;
          abilities?: string[];
          streaks?: Record<string, number>;
          last_activity?: string | null;
          created_at?: string;
        };
      };
    };
  };
};