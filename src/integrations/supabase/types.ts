export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      evidences: {
        Row: {
          created_at: string
          id: string
          task_id: string
          uploaded_by: string
          url: string
        }
        Insert: {
          created_at?: string
          id?: string
          task_id: string
          uploaded_by: string
          url: string
        }
        Update: {
          created_at?: string
          id?: string
          task_id?: string
          uploaded_by?: string
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: "evidences_task_id_fkey"
            columns: ["task_id"]
            isOneToOne: false
            referencedRelation: "tasks"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "evidences_uploaded_by_fkey"
            columns: ["uploaded_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string
          email: string
          id: string
          name: string | null
          phone: string | null
          updated_at: string
          zone: string | null
        }
        Insert: {
          created_at?: string
          email: string
          id: string
          name?: string | null
          phone?: string | null
          updated_at?: string
          zone?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          name?: string | null
          phone?: string | null
          updated_at?: string
          zone?: string | null
        }
        Relationships: []
      }
      reports: {
        Row: {
          assigned_at: string | null
          assigned_by: string | null
          assigned_to: string | null
          citizen_id: string
          completed_at: string | null
          created_at: string
          description: string | null
          id: string
          location_address: string | null
          location_lat: number
          location_lng: number
          photos: string[]
          priority: Database["public"]["Enums"]["priority"]
          status: Database["public"]["Enums"]["report_status"]
          type: Database["public"]["Enums"]["report_type"]
          updated_at: string
          zone_id: string | null
        }
        Insert: {
          assigned_at?: string | null
          assigned_by?: string | null
          assigned_to?: string | null
          citizen_id: string
          completed_at?: string | null
          created_at?: string
          description?: string | null
          id?: string
          location_address?: string | null
          location_lat: number
          location_lng: number
          photos?: string[]
          priority?: Database["public"]["Enums"]["priority"]
          status?: Database["public"]["Enums"]["report_status"]
          type: Database["public"]["Enums"]["report_type"]
          updated_at?: string
          zone_id?: string | null
        }
        Update: {
          assigned_at?: string | null
          assigned_by?: string | null
          assigned_to?: string | null
          citizen_id?: string
          completed_at?: string | null
          created_at?: string
          description?: string | null
          id?: string
          location_address?: string | null
          location_lat?: number
          location_lng?: number
          photos?: string[]
          priority?: Database["public"]["Enums"]["priority"]
          status?: Database["public"]["Enums"]["report_status"]
          type?: Database["public"]["Enums"]["report_type"]
          updated_at?: string
          zone_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "reports_assigned_by_fkey"
            columns: ["assigned_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reports_assigned_to_fkey"
            columns: ["assigned_to"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reports_citizen_id_fkey"
            columns: ["citizen_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reports_zone_id_fkey"
            columns: ["zone_id"]
            isOneToOne: false
            referencedRelation: "zones"
            referencedColumns: ["id"]
          },
        ]
      }
      tasks: {
        Row: {
          assigned_at: string
          completed_at: string | null
          created_at: string
          description: string | null
          id: string
          location_address: string | null
          location_lat: number
          location_lng: number
          priority: Database["public"]["Enums"]["priority"]
          report_id: string
          started_at: string | null
          status: Database["public"]["Enums"]["task_status"]
          supervisor_id: string
          title: string
          type: Database["public"]["Enums"]["report_type"]
          updated_at: string
          worker_id: string
        }
        Insert: {
          assigned_at?: string
          completed_at?: string | null
          created_at?: string
          description?: string | null
          id?: string
          location_address?: string | null
          location_lat: number
          location_lng: number
          priority?: Database["public"]["Enums"]["priority"]
          report_id: string
          started_at?: string | null
          status?: Database["public"]["Enums"]["task_status"]
          supervisor_id: string
          title: string
          type: Database["public"]["Enums"]["report_type"]
          updated_at?: string
          worker_id: string
        }
        Update: {
          assigned_at?: string
          completed_at?: string | null
          created_at?: string
          description?: string | null
          id?: string
          location_address?: string | null
          location_lat?: number
          location_lng?: number
          priority?: Database["public"]["Enums"]["priority"]
          report_id?: string
          started_at?: string | null
          status?: Database["public"]["Enums"]["task_status"]
          supervisor_id?: string
          title?: string
          type?: Database["public"]["Enums"]["report_type"]
          updated_at?: string
          worker_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "tasks_report_id_fkey"
            columns: ["report_id"]
            isOneToOne: false
            referencedRelation: "reports"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tasks_supervisor_id_fkey"
            columns: ["supervisor_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tasks_worker_id_fkey"
            columns: ["worker_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      zones: {
        Row: {
          boundaries: Json
          created_at: string
          id: string
          name: string
          supervisor_id: string | null
          updated_at: string
        }
        Insert: {
          boundaries?: Json
          created_at?: string
          id?: string
          name: string
          supervisor_id?: string | null
          updated_at?: string
        }
        Update: {
          boundaries?: Json
          created_at?: string
          id?: string
          name?: string
          supervisor_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "zones_supervisor_id_fkey"
            columns: ["supervisor_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_zone_supervisor: {
        Args: { _user_id: string; _zone_id: string }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "ciudadano" | "supervisor" | "trabajador"
      priority: "baja" | "media" | "alta"
      report_status: "pendiente" | "en_proceso" | "resuelto"
      report_type: "barrido" | "residuos_solidos" | "maleza"
      task_status: "pendiente" | "en_proceso" | "completada"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["ciudadano", "supervisor", "trabajador"],
      priority: ["baja", "media", "alta"],
      report_status: ["pendiente", "en_proceso", "resuelto"],
      report_type: ["barrido", "residuos_solidos", "maleza"],
      task_status: ["pendiente", "en_proceso", "completada"],
    },
  },
} as const
