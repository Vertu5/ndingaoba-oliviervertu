export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      alerts: {
        Row: {
          alert_id: number
          created_at: string | null
          measurement_id: number
          threshold_type: string
          threshold_value: number
        }
        Insert: {
          alert_id?: number
          created_at?: string | null
          measurement_id: number
          threshold_type: string
          threshold_value: number
        }
        Update: {
          alert_id?: number
          created_at?: string | null
          measurement_id?: number
          threshold_type?: string
          threshold_value?: number
        }
        Relationships: [
          {
            foreignKeyName: "alerts_measurement_id_fkey"
            columns: ["measurement_id"]
            isOneToOne: false
            referencedRelation: "measurements"
            referencedColumns: ["measurement_id"]
          },
        ]
      }
      cities: {
        Row: {
          city_id: number
          country_code: string
          created_at: string | null
          latitude: number | null
          longitude: number | null
          name: string
          timezone: string
        }
        Insert: {
          city_id?: number
          country_code: string
          created_at?: string | null
          latitude?: number | null
          longitude?: number | null
          name: string
          timezone: string
        }
        Update: {
          city_id?: number
          country_code?: string
          created_at?: string | null
          latitude?: number | null
          longitude?: number | null
          name?: string
          timezone?: string
        }
        Relationships: []
      }
      measurements: {
        Row: {
          created_at: string | null
          measured_at: string
          measured_at_local: string | null
          measurement_id: number
          pollutant_id: number
          source: string | null
          station_id: number
          value: number
        }
        Insert: {
          created_at?: string | null
          measured_at: string
          measured_at_local?: string | null
          measurement_id?: number
          pollutant_id: number
          source?: string | null
          station_id: number
          value: number
        }
        Update: {
          created_at?: string | null
          measured_at?: string
          measured_at_local?: string | null
          measurement_id?: number
          pollutant_id?: number
          source?: string | null
          station_id?: number
          value?: number
        }
        Relationships: [
          {
            foreignKeyName: "measurements_pollutant_id_fkey"
            columns: ["pollutant_id"]
            isOneToOne: false
            referencedRelation: "pollutants"
            referencedColumns: ["pollutant_id"]
          },
          {
            foreignKeyName: "measurements_station_id_fkey"
            columns: ["station_id"]
            isOneToOne: false
            referencedRelation: "stations"
            referencedColumns: ["station_id"]
          },
        ]
      }
      pollutants: {
        Row: {
          code: string
          description: string | null
          display_name: string
          pollutant_id: number
          unit: string
          who_1h_guideline: number | null
          who_24h_guideline: number | null
          who_annual_guideline: number | null
        }
        Insert: {
          code: string
          description?: string | null
          display_name: string
          pollutant_id?: number
          unit: string
          who_1h_guideline?: number | null
          who_24h_guideline?: number | null
          who_annual_guideline?: number | null
        }
        Update: {
          code?: string
          description?: string | null
          display_name?: string
          pollutant_id?: number
          unit?: string
          who_1h_guideline?: number | null
          who_24h_guideline?: number | null
          who_annual_guideline?: number | null
        }
        Relationships: []
      }
      stations: {
        Row: {
          city_id: number
          created_at: string | null
          is_mobile: boolean | null
          is_monitor: boolean | null
          last_seen_at: string | null
          latitude: number
          locality: string | null
          longitude: number
          name: string
          openaq_location_id: number
          provider_name: string | null
          station_id: number
          timezone: string | null
        }
        Insert: {
          city_id: number
          created_at?: string | null
          is_mobile?: boolean | null
          is_monitor?: boolean | null
          last_seen_at?: string | null
          latitude: number
          locality?: string | null
          longitude: number
          name: string
          openaq_location_id: number
          provider_name?: string | null
          station_id?: number
          timezone?: string | null
        }
        Update: {
          city_id?: number
          created_at?: string | null
          is_mobile?: boolean | null
          is_monitor?: boolean | null
          last_seen_at?: string | null
          latitude?: number
          locality?: string | null
          longitude?: number
          name?: string
          openaq_location_id?: number
          provider_name?: string | null
          station_id?: number
          timezone?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "stations_city_id_fkey"
            columns: ["city_id"]
            isOneToOne: false
            referencedRelation: "cities"
            referencedColumns: ["city_id"]
          },
        ]
      }
    }
    Views: {
      vw_active_alerts: {
        Row: {
          alert_triggered_at: string | null
          city_name: string | null
          measured_at: string | null
          pollutant_code: string | null
          station_name: string | null
          threshold: number | null
          value: number | null
        }
        Relationships: []
      }
      vw_latest_city_metrics: {
        Row: {
          city_name: string | null
          measured_at: string | null
          pollutant_code: string | null
          value: number | null
        }
        Relationships: []
      }
      vw_pollutant_distribution: {
        Row: {
          avg_value: number | null
          city_name: string | null
          measurement_count: number | null
          pollutant_code: string | null
        }
        Relationships: []
      }
      vw_time_series_pm25: {
        Row: {
          avg_value: number | null
          city_name: string | null
          time_bucket: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
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
    Enums: {},
  },
} as const

