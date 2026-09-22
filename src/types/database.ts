/**
 * FAITHION — Tipos Oficiais do Banco de Dados Supabase
 * Centralização dos tipos de todas as 21 tabelas oficiais.
 * 
 * Tabelas:
 * - profiles, user_settings
 * - goals, routines, routine_items, daily_tasks
 * - bible_versions, bible_books, bible_chapters, bible_verses
 * - reading_plans, reading_plan_items, reading_progress
 * - prayer_requests, prayer_plans, fasting_plans
 * - reflections, activity_history, favorites, notes, word_of_day_history
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          name: string;
          email: string | null;
          avatar_url: string | null;
          spiritual_focus: string | null;
          life_season: string | null;
          daily_prayer_goal_minutes: number | null;
          daily_bible_chapters_goal: number | null;
          weekly_fasting_goal_days: number | null;
          preferred_bible_version: string | null;
          wake_up_time: string | null;
          bed_time: string | null;
          preferred_practice_duration_minutes: number | null;
          bible_experience_level: string | null;
          reading_frequency: string | null;
          prayer_frequency: string | null;
          reading_preference: string | null;
          prayer_preference: string | null;
          routine_preference: string | null;
          created_at: string;
          updated_at: string | null;
        };
        Insert: {
          id: string;
          name: string;
          email?: string | null;
          avatar_url?: string | null;
          spiritual_focus?: string | null;
          life_season?: string | null;
          daily_prayer_goal_minutes?: number | null;
          daily_bible_chapters_goal?: number | null;
          weekly_fasting_goal_days?: number | null;
          preferred_bible_version?: string | null;
          wake_up_time?: string | null;
          bed_time?: string | null;
          preferred_practice_duration_minutes?: number | null;
          bible_experience_level?: string | null;
          reading_frequency?: string | null;
          prayer_frequency?: string | null;
          reading_preference?: string | null;
          prayer_preference?: string | null;
          routine_preference?: string | null;
          created_at?: string;
          updated_at?: string | null;
        };
        Update: {
          id?: string;
          name?: string;
          email?: string | null;
          avatar_url?: string | null;
          spiritual_focus?: string | null;
          life_season?: string | null;
          daily_prayer_goal_minutes?: number | null;
          daily_bible_chapters_goal?: number | null;
          weekly_fasting_goal_days?: number | null;
          preferred_bible_version?: string | null;
          wake_up_time?: string | null;
          bed_time?: string | null;
          preferred_practice_duration_minutes?: number | null;
          bible_experience_level?: string | null;
          reading_frequency?: string | null;
          prayer_frequency?: string | null;
          reading_preference?: string | null;
          prayer_preference?: string | null;
          routine_preference?: string | null;
          created_at?: string;
          updated_at?: string | null;
        };
      };

      user_settings: {
        Row: {
          id: string;
          user_id: string;
          theme: string | null;
          reminders_enabled: boolean;
          auto_sync: boolean;
          available_time_slots: Json | null;
          available_days: Json | null;
          topics_of_interest: Json | null;
          created_at: string;
          updated_at: string | null;
        };
        Insert: {
          id?: string;
          user_id: string;
          theme?: string | null;
          reminders_enabled?: boolean;
          auto_sync?: boolean;
          available_time_slots?: Json | null;
          available_days?: Json | null;
          topics_of_interest?: Json | null;
          created_at?: string;
          updated_at?: string | null;
        };
        Update: {
          id?: string;
          user_id?: string;
          theme?: string | null;
          reminders_enabled?: boolean;
          auto_sync?: boolean;
          available_time_slots?: Json | null;
          available_days?: Json | null;
          topics_of_interest?: Json | null;
          created_at?: string;
          updated_at?: string | null;
        };
      };

      goals: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          category: string;
          priority: string;
          frequency: string | null;
          target_value: number | null;
          current_value: number | null;
          unit: string | null;
          current_progress: number | null;
          target_description: string | null;
          why: string | null;
          deadline: string | null;
          status: string;
          completed: boolean;
          created_at: string;
          updated_at: string | null;
        };
        Insert: {
          id?: string;
          user_id: string;
          title: string;
          category: string;
          priority?: string;
          frequency?: string | null;
          target_value?: number | null;
          current_value?: number | null;
          unit?: string | null;
          current_progress?: number | null;
          target_description?: string | null;
          why?: string | null;
          deadline?: string | null;
          status?: string;
          completed?: boolean;
          created_at?: string;
          updated_at?: string | null;
        };
        Update: {
          id?: string;
          user_id?: string;
          title?: string;
          category?: string;
          priority?: string;
          frequency?: string | null;
          target_value?: number | null;
          current_value?: number | null;
          unit?: string | null;
          current_progress?: number | null;
          target_description?: string | null;
          why?: string | null;
          deadline?: string | null;
          status?: string;
          completed?: boolean;
          created_at?: string;
          updated_at?: string | null;
        };
      };

      routines: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          description: string | null;
          block: string | null;
          suggested_time: string | null;
          is_active: boolean;
          order_index: number;
          created_at: string;
          updated_at: string | null;
        };
        Insert: {
          id?: string;
          user_id: string;
          title: string;
          description?: string | null;
          block?: string | null;
          suggested_time?: string | null;
          is_active?: boolean;
          order_index?: number;
          created_at?: string;
          updated_at?: string | null;
        };
        Update: {
          id?: string;
          user_id?: string;
          title?: string;
          description?: string | null;
          block?: string | null;
          suggested_time?: string | null;
          is_active?: boolean;
          order_index?: number;
          created_at?: string;
          updated_at?: string | null;
        };
      };

      routine_items: {
        Row: {
          id: string;
          routine_id: string | null;
          user_id: string;
          name: string;
          type: string;
          block: string;
          suggested_time: string | null;
          estimated_minutes: number;
          priority: string;
          why: string | null;
          is_active: boolean;
          order_index: number;
          applicable_days: Json | null;
          passage_ref: string | null;
          created_at: string;
          updated_at: string | null;
        };
        Insert: {
          id?: string;
          routine_id?: string | null;
          user_id: string;
          name: string;
          type: string;
          block: string;
          suggested_time?: string | null;
          estimated_minutes?: number;
          priority?: string;
          why?: string | null;
          is_active?: boolean;
          order_index?: number;
          applicable_days?: Json | null;
          passage_ref?: string | null;
          created_at?: string;
          updated_at?: string | null;
        };
        Update: {
          id?: string;
          routine_id?: string | null;
          user_id?: string;
          name?: string;
          type?: string;
          block?: string;
          suggested_time?: string | null;
          estimated_minutes?: number;
          priority?: string;
          why?: string | null;
          is_active?: boolean;
          order_index?: number;
          applicable_days?: Json | null;
          passage_ref?: string | null;
          created_at?: string;
          updated_at?: string | null;
        };
      };

      daily_tasks: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          category: string;
          time_of_day: string;
          scheduled_time: string;
          estimated_minutes: number;
          actual_minutes: number | null;
          why: string | null;
          passage_reference: string | null;
          status: string;
          priority: string | null;
          completed: boolean;
          completed_at: string | null;
          started_at: string | null;
          order_index: number;
          notes: string | null;
          plan_id: string | null;
          created_at: string;
          updated_at: string | null;
        };
        Insert: {
          id?: string;
          user_id: string;
          title: string;
          category: string;
          time_of_day?: string;
          scheduled_time?: string;
          estimated_minutes?: number;
          actual_minutes?: number | null;
          why?: string | null;
          passage_reference?: string | null;
          status?: string;
          priority?: string | null;
          completed?: boolean;
          completed_at?: string | null;
          started_at?: string | null;
          order_index?: number;
          notes?: string | null;
          plan_id?: string | null;
          created_at?: string;
          updated_at?: string | null;
        };
        Update: {
          id?: string;
          user_id?: string;
          title?: string;
          category?: string;
          time_of_day?: string;
          scheduled_time?: string;
          estimated_minutes?: number;
          actual_minutes?: number | null;
          why?: string | null;
          passage_reference?: string | null;
          status?: string;
          priority?: string | null;
          completed?: boolean;
          completed_at?: string | null;
          started_at?: string | null;
          order_index?: number;
          notes?: string | null;
          plan_id?: string | null;
          created_at?: string;
          updated_at?: string | null;
        };
      };

      bible_versions: {
        Row: {
          id: string;
          name: string;
          abbreviation: string;
          language: string;
          origin: string | null;
          license: string | null;
          available: boolean;
          order_index: number;
          description: string | null;
        };
        Insert: {
          id: string;
          name: string;
          abbreviation: string;
          language?: string;
          origin?: string | null;
          license?: string | null;
          available?: boolean;
          order_index?: number;
          description?: string | null;
        };
        Update: {
          id?: string;
          name?: string;
          abbreviation?: string;
          language?: string;
          origin?: string | null;
          license?: string | null;
          available?: boolean;
          order_index?: number;
          description?: string | null;
        };
      };

      bible_books: {
        Row: {
          id: string;
          name: string;
          abbreviation: string;
          testament: string;
          order_index: number;
          chapters_count: number;
        };
        Insert: {
          id: string;
          name: string;
          abbreviation: string;
          testament: string;
          order_index: number;
          chapters_count: number;
        };
        Update: {
          id?: string;
          name?: string;
          abbreviation?: string;
          testament?: string;
          order_index?: number;
          chapters_count?: number;
        };
      };

      bible_chapters: {
        Row: {
          id: string;
          book_id: string;
          chapter_number: number;
          verses_count: number;
        };
        Insert: {
          id: string;
          book_id: string;
          chapter_number: number;
          verses_count: number;
        };
        Update: {
          id?: string;
          book_id?: string;
          chapter_number?: number;
          verses_count?: number;
        };
      };

      bible_verses: {
        Row: {
          id: string;
          version_id: string;
          book_id: string;
          chapter_number: number;
          verse_number: number;
          text: string;
        };
        Insert: {
          id?: string;
          version_id: string;
          book_id: string;
          chapter_number: number;
          verse_number: number;
          text: string;
        };
        Update: {
          id?: string;
          version_id?: string;
          book_id?: string;
          chapter_number?: number;
          verse_number?: number;
          text?: string;
        };
      };

      reading_plans: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          description: string | null;
          objective: string | null;
          category: string;
          duration_days: number;
          current_day: number;
          is_active: boolean;
          status: string;
          started_at: string | null;
          completed_at: string | null;
          paused_at: string | null;
          start_date: string | null;
          frequency: string | null;
          daily_estimated_minutes: number | null;
          preferred_version: string | null;
          method: string | null;
          selected_books: Json | null;
          is_template: boolean;
          created_at: string;
          updated_at: string | null;
        };
        Insert: {
          id?: string;
          user_id: string;
          title: string;
          description?: string | null;
          objective?: string | null;
          category?: string;
          duration_days?: number;
          current_day?: number;
          is_active?: boolean;
          status?: string;
          started_at?: string | null;
          completed_at?: string | null;
          paused_at?: string | null;
          start_date?: string | null;
          frequency?: string | null;
          daily_estimated_minutes?: number | null;
          preferred_version?: string | null;
          method?: string | null;
          selected_books?: Json | null;
          is_template?: boolean;
          created_at?: string;
          updated_at?: string | null;
        };
        Update: {
          id?: string;
          user_id?: string;
          title?: string;
          description?: string | null;
          objective?: string | null;
          category?: string;
          duration_days?: number;
          current_day?: number;
          is_active?: boolean;
          status?: string;
          started_at?: string | null;
          completed_at?: string | null;
          paused_at?: string | null;
          start_date?: string | null;
          frequency?: string | null;
          daily_estimated_minutes?: number | null;
          preferred_version?: string | null;
          method?: string | null;
          selected_books?: Json | null;
          is_template?: boolean;
          created_at?: string;
          updated_at?: string | null;
        };
      };

      reading_plan_items: {
        Row: {
          id: string;
          plan_id: string;
          user_id: string;
          day_number: number;
          title: string;
          passage_ref: string;
          book_id: string | null;
          chapter: number | null;
          verse_range: string | null;
          devotional_prompt: string | null;
          estimated_minutes: number | null;
          date: string | null;
          status: string | null;
          completed: boolean;
          completed_at: string | null;
        };
        Insert: {
          id?: string;
          plan_id: string;
          user_id: string;
          day_number: number;
          title: string;
          passage_ref: string;
          book_id?: string | null;
          chapter?: number | null;
          verse_range?: string | null;
          devotional_prompt?: string | null;
          estimated_minutes?: number | null;
          date?: string | null;
          status?: string | null;
          completed?: boolean;
          completed_at?: string | null;
        };
        Update: {
          id?: string;
          plan_id?: string;
          user_id?: string;
          day_number?: number;
          title?: string;
          passage_ref?: string;
          book_id?: string | null;
          chapter?: number | null;
          verse_range?: string | null;
          devotional_prompt?: string | null;
          estimated_minutes?: number | null;
          date?: string | null;
          status?: string | null;
          completed?: boolean;
          completed_at?: string | null;
        };
      };

      reading_progress: {
        Row: {
          id: string;
          user_id: string;
          plan_id: string | null;
          book_id: string;
          chapter: number;
          verses_read: number | null;
          date: string;
          duration_minutes: number | null;
          completed: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          plan_id?: string | null;
          book_id: string;
          chapter: number;
          verses_read?: number | null;
          date?: string;
          duration_minutes?: number | null;
          completed?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          plan_id?: string | null;
          book_id?: string;
          chapter?: number;
          verses_read?: number | null;
          date?: string;
          duration_minutes?: number | null;
          completed?: boolean;
          created_at?: string;
        };
      };

      prayer_requests: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          description: string;
          person: string | null;
          category: string;
          priority: string;
          date: string;
          status: string;
          answer: string | null;
          notes: string | null;
          scripture_references: Json | null;
          answered: boolean;
          answered_at: string | null;
          answered_testimony: string | null;
          times_prayed: number;
          last_prayed_at: string | null;
          is_urgent: boolean;
          created_at: string;
          updated_at: string | null;
        };
        Insert: {
          id?: string;
          user_id: string;
          title: string;
          description?: string;
          person?: string | null;
          category?: string;
          priority?: string;
          date?: string;
          status?: string;
          answer?: string | null;
          notes?: string | null;
          scripture_references?: Json | null;
          answered?: boolean;
          answered_at?: string | null;
          answered_testimony?: string | null;
          times_prayed?: number;
          last_prayed_at?: string | null;
          is_urgent?: boolean;
          created_at?: string;
          updated_at?: string | null;
        };
        Update: {
          id?: string;
          user_id?: string;
          title?: string;
          description?: string;
          person?: string | null;
          category?: string;
          priority?: string;
          date?: string;
          status?: string;
          answer?: string | null;
          notes?: string | null;
          scripture_references?: Json | null;
          answered?: boolean;
          answered_at?: string | null;
          answered_testimony?: string | null;
          times_prayed?: number;
          last_prayed_at?: string | null;
          is_urgent?: boolean;
          created_at?: string;
          updated_at?: string | null;
        };
      };

      prayer_plans: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          description: string | null;
          type: string;
          scheduled_times: Json | null;
          recurrence_days: Json | null;
          target_minutes: number;
          associated_prayer_ids: Json | null;
          is_active: boolean;
          created_at: string;
          updated_at: string | null;
        };
        Insert: {
          id?: string;
          user_id: string;
          title: string;
          description?: string | null;
          type?: string;
          scheduled_times?: Json | null;
          recurrence_days?: Json | null;
          target_minutes?: number;
          associated_prayer_ids?: Json | null;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string | null;
        };
        Update: {
          id?: string;
          user_id?: string;
          title?: string;
          description?: string | null;
          type?: string;
          scheduled_times?: Json | null;
          recurrence_days?: Json | null;
          target_minutes?: number;
          associated_prayer_ids?: Json | null;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string | null;
        };
      };

      fasting_plans: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          type: string;
          date: string;
          start_time: string;
          end_time: string;
          target_hours: number;
          purpose: string;
          related_prayer_id: string | null;
          related_passage: string | null;
          notes: string | null;
          status: string;
          active: boolean;
          completed: boolean;
          completed_at: string | null;
          interrupted_at: string | null;
          interruption_reason: string | null;
          reflections_during_fast: string | null;
          created_at: string;
          updated_at: string | null;
        };
        Insert: {
          id?: string;
          user_id: string;
          title: string;
          type?: string;
          date?: string;
          start_time?: string;
          end_time?: string;
          target_hours?: number;
          purpose?: string;
          related_prayer_id?: string | null;
          related_passage?: string | null;
          notes?: string | null;
          status?: string;
          active?: boolean;
          completed?: boolean;
          completed_at?: string | null;
          interrupted_at?: string | null;
          interruption_reason?: string | null;
          reflections_during_fast?: string | null;
          created_at?: string;
          updated_at?: string | null;
        };
        Update: {
          id?: string;
          user_id?: string;
          title?: string;
          type?: string;
          date?: string;
          start_time?: string;
          end_time?: string;
          target_hours?: number;
          purpose?: string;
          related_prayer_id?: string | null;
          related_passage?: string | null;
          notes?: string | null;
          status?: string;
          active?: boolean;
          completed?: boolean;
          completed_at?: string | null;
          interrupted_at?: string | null;
          interruption_reason?: string | null;
          reflections_during_fast?: string | null;
          created_at?: string;
          updated_at?: string | null;
        };
      };

      reflections: {
        Row: {
          id: string;
          user_id: string;
          date: string;
          scripture_ref: string | null;
          what_learned: string | null;
          what_caught_attention: string | null;
          how_to_apply: string | null;
          personal_prayer: string | null;
          notes: string | null;
          related_activity_id: string | null;
          related_activity_type: string | null;
          related_title: string | null;
          mood_rating: number | null;
          created_at: string;
          updated_at: string | null;
        };
        Insert: {
          id?: string;
          user_id: string;
          date?: string;
          scripture_ref?: string | null;
          what_learned?: string | null;
          what_caught_attention?: string | null;
          how_to_apply?: string | null;
          personal_prayer?: string | null;
          notes?: string | null;
          related_activity_id?: string | null;
          related_activity_type?: string | null;
          related_title?: string | null;
          mood_rating?: number | null;
          created_at?: string;
          updated_at?: string | null;
        };
        Update: {
          id?: string;
          user_id?: string;
          date?: string;
          scripture_ref?: string | null;
          what_learned?: string | null;
          what_caught_attention?: string | null;
          how_to_apply?: string | null;
          personal_prayer?: string | null;
          notes?: string | null;
          related_activity_id?: string | null;
          related_activity_type?: string | null;
          related_title?: string | null;
          mood_rating?: number | null;
          created_at?: string;
          updated_at?: string | null;
        };
      };

      activity_history: {
        Row: {
          id: string;
          user_id: string;
          date: string;
          activity_id: string | null;
          activity_name: string;
          block: string | null;
          planned_minutes: number;
          actual_minutes: number;
          status: string;
          reason: string | null;
          reason_notes: string | null;
          quick_reflection: string | null;
          logged_at: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          date?: string;
          activity_id?: string | null;
          activity_name: string;
          block?: string | null;
          planned_minutes?: number;
          actual_minutes?: number;
          status?: string;
          reason?: string | null;
          reason_notes?: string | null;
          quick_reflection?: string | null;
          logged_at?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          date?: string;
          activity_id?: string | null;
          activity_name?: string;
          block?: string | null;
          planned_minutes?: number;
          actual_minutes?: number;
          status?: string;
          reason?: string | null;
          reason_notes?: string | null;
          quick_reflection?: string | null;
          logged_at?: string;
          created_at?: string;
        };
      };

      favorites: {
        Row: {
          id: string;
          user_id: string;
          book_id: string;
          book_name: string;
          chapter: number;
          verse_number: number;
          verse_text: string;
          version_id: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          book_id: string;
          book_name: string;
          chapter: number;
          verse_number: number;
          verse_text: string;
          version_id?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          book_id?: string;
          book_name?: string;
          chapter?: number;
          verse_number?: number;
          verse_text?: string;
          version_id?: string;
          created_at?: string;
        };
      };

      notes: {
        Row: {
          id: string;
          user_id: string;
          book_id: string;
          book_name: string;
          chapter: number;
          verse_number: number | null;
          note_text: string;
          version_id: string;
          created_at: string;
          updated_at: string | null;
        };
        Insert: {
          id?: string;
          user_id: string;
          book_id: string;
          book_name: string;
          chapter: number;
          verse_number?: number | null;
          note_text: string;
          version_id?: string;
          created_at?: string;
          updated_at?: string | null;
        };
        Update: {
          id?: string;
          user_id?: string;
          book_id?: string;
          book_name?: string;
          chapter?: number;
          verse_number?: number | null;
          note_text?: string;
          version_id?: string;
          created_at?: string;
          updated_at?: string | null;
        };
      };

      word_of_day_history: {
        Row: {
          id: string;
          user_id: string;
          date: string;
          word_id: string;
          is_favorite: boolean;
          has_read: boolean;
          has_prayed: boolean;
          has_shared: boolean;
          has_fasted: boolean;
          user_reflection: string | null;
          viewed_at: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          date?: string;
          word_id: string;
          is_favorite?: boolean;
          has_read?: boolean;
          has_prayed?: boolean;
          has_shared?: boolean;
          has_fasted?: boolean;
          user_reflection?: string | null;
          viewed_at?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          date?: string;
          word_id?: string;
          is_favorite?: boolean;
          has_read?: boolean;
          has_prayed?: boolean;
          has_shared?: boolean;
          has_fasted?: boolean;
          user_reflection?: string | null;
          viewed_at?: string;
          created_at?: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}

// Helpers de tipos rápidos para conveniência
export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row'];
export type Inserts<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Insert'];
export type Updates<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Update'];

export type ProfileRow = Tables<'profiles'>;
export type UserSettingsRow = Tables<'user_settings'>;
export type GoalRow = Tables<'goals'>;
export type RoutineRow = Tables<'routines'>;
export type RoutineItemRow = Tables<'routine_items'>;
export type DailyTaskRow = Tables<'daily_tasks'>;
export type ReadingPlanRow = Tables<'reading_plans'>;
export type ReadingPlanItemRow = Tables<'reading_plan_items'>;
export type PrayerRequestRow = Tables<'prayer_requests'>;
export type PrayerPlanRow = Tables<'prayer_plans'>;
export type FastingPlanRow = Tables<'fasting_plans'>;
export type ReflectionRow = Tables<'reflections'>;
export type ActivityHistoryRow = Tables<'activity_history'>;
export type FavoriteRow = Tables<'favorites'>;
export type NoteRow = Tables<'notes'>;
