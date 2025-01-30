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
      styling_libraries: {
        Row: {
          analysis_id: string | null
          confidence: number | null
          created_at: string | null
          id: string
          library: Database["public"]["Enums"]["styling_library_type"]
          matched: Json | null
        }
        Insert: {
          analysis_id?: string | null
          confidence?: number | null
          created_at?: string | null
          id?: string
          library: Database["public"]["Enums"]["styling_library_type"]
          matched?: Json | null
        }
        Update: {
          analysis_id?: string | null
          confidence?: number | null
          created_at?: string | null
          id?: string
          library?: Database["public"]["Enums"]["styling_library_type"]
          matched?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "styling_libraries_analysis_id_fkey"
            columns: ["analysis_id"]
            isOneToOne: false
            referencedRelation: "tech_stack_analysis"
            referencedColumns: ["id"]
          },
        ]
      }
      tech_stack_analysis: {
        Row: {
          additional_data: Json | null
          analyzed_at: string
          bundler: Database["public"]["Enums"]["bundler_type"] | null
          bundler_confidence: number | null
          created_at: string | null
          dates: Database["public"]["Enums"]["dates_type"] | null
          dates_confidence: number | null
          duration: number
          framework: Database["public"]["Enums"]["framework_type"] | null
          framework_confidence: number | null
          http_client: Database["public"]["Enums"]["http_client_type"] | null
          http_client_confidence: number | null
          id: string
          image_metrics:
            | Database["public"]["CompositeTypes"]["image_metrics"]
            | null
          minifier: Database["public"]["Enums"]["minifier_type"] | null
          minifier_confidence: number | null
          modules: Database["public"]["Enums"]["modules_type"] | null
          modules_confidence: number | null
          platform: Database["public"]["Enums"]["platform_type"] | null
          platform_confidence: number | null
          resource_count: number | null
          router: Database["public"]["Enums"]["router_type"] | null
          router_confidence: number | null
          script_metrics:
            | Database["public"]["CompositeTypes"]["script_metrics"]
            | null
          state_management:
            | Database["public"]["Enums"]["state_management_type"]
            | null
          state_management_confidence: number | null
          styling_processor:
            | Database["public"]["Enums"]["styling_processor_type"]
            | null
          styling_processor_confidence: number | null
          total_size: number | null
          translations: Database["public"]["Enums"]["translations_type"] | null
          translations_confidence: number | null
          transpiler: Database["public"]["Enums"]["transpiler_type"] | null
          transpiler_confidence: number | null
          ui_library: Database["public"]["Enums"]["ui_library_type"] | null
          ui_library_confidence: number | null
          url: string
        }
        Insert: {
          additional_data?: Json | null
          analyzed_at: string
          bundler?: Database["public"]["Enums"]["bundler_type"] | null
          bundler_confidence?: number | null
          created_at?: string | null
          dates?: Database["public"]["Enums"]["dates_type"] | null
          dates_confidence?: number | null
          duration: number
          framework?: Database["public"]["Enums"]["framework_type"] | null
          framework_confidence?: number | null
          http_client?: Database["public"]["Enums"]["http_client_type"] | null
          http_client_confidence?: number | null
          id: string
          image_metrics?:
            | Database["public"]["CompositeTypes"]["image_metrics"]
            | null
          minifier?: Database["public"]["Enums"]["minifier_type"] | null
          minifier_confidence?: number | null
          modules?: Database["public"]["Enums"]["modules_type"] | null
          modules_confidence?: number | null
          platform?: Database["public"]["Enums"]["platform_type"] | null
          platform_confidence?: number | null
          resource_count?: number | null
          router?: Database["public"]["Enums"]["router_type"] | null
          router_confidence?: number | null
          script_metrics?:
            | Database["public"]["CompositeTypes"]["script_metrics"]
            | null
          state_management?:
            | Database["public"]["Enums"]["state_management_type"]
            | null
          state_management_confidence?: number | null
          styling_processor?:
            | Database["public"]["Enums"]["styling_processor_type"]
            | null
          styling_processor_confidence?: number | null
          total_size?: number | null
          translations?: Database["public"]["Enums"]["translations_type"] | null
          translations_confidence?: number | null
          transpiler?: Database["public"]["Enums"]["transpiler_type"] | null
          transpiler_confidence?: number | null
          ui_library?: Database["public"]["Enums"]["ui_library_type"] | null
          ui_library_confidence?: number | null
          url: string
        }
        Update: {
          additional_data?: Json | null
          analyzed_at?: string
          bundler?: Database["public"]["Enums"]["bundler_type"] | null
          bundler_confidence?: number | null
          created_at?: string | null
          dates?: Database["public"]["Enums"]["dates_type"] | null
          dates_confidence?: number | null
          duration?: number
          framework?: Database["public"]["Enums"]["framework_type"] | null
          framework_confidence?: number | null
          http_client?: Database["public"]["Enums"]["http_client_type"] | null
          http_client_confidence?: number | null
          id?: string
          image_metrics?:
            | Database["public"]["CompositeTypes"]["image_metrics"]
            | null
          minifier?: Database["public"]["Enums"]["minifier_type"] | null
          minifier_confidence?: number | null
          modules?: Database["public"]["Enums"]["modules_type"] | null
          modules_confidence?: number | null
          platform?: Database["public"]["Enums"]["platform_type"] | null
          platform_confidence?: number | null
          resource_count?: number | null
          router?: Database["public"]["Enums"]["router_type"] | null
          router_confidence?: number | null
          script_metrics?:
            | Database["public"]["CompositeTypes"]["script_metrics"]
            | null
          state_management?:
            | Database["public"]["Enums"]["state_management_type"]
            | null
          state_management_confidence?: number | null
          styling_processor?:
            | Database["public"]["Enums"]["styling_processor_type"]
            | null
          styling_processor_confidence?: number | null
          total_size?: number | null
          translations?: Database["public"]["Enums"]["translations_type"] | null
          translations_confidence?: number | null
          transpiler?: Database["public"]["Enums"]["transpiler_type"] | null
          transpiler_confidence?: number | null
          ui_library?: Database["public"]["Enums"]["ui_library_type"] | null
          ui_library_confidence?: number | null
          url?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      binary_quantize:
        | {
            Args: {
              "": string
            }
            Returns: unknown
          }
        | {
            Args: {
              "": unknown
            }
            Returns: unknown
          }
      get_full_analysis_by_id: {
        Args: {
          analysis_id: string
        }
        Returns: {
          analysis: Json
          styling_libs: Json
        }[]
      }
      get_unique_technologies_count: {
        Args: {
          confidence_threshold: number
          technology_column: string
          search_term?: string
        }
        Returns: {
          technology_value: string
          count: number
        }[]
      }
      get_unique_technology_websites: {
        Args: {
          technology_column: string
          technology_value: string
          confidence_threshold: number
          search_term: string
          page_number: number
          items_per_page: number
        }
        Returns: {
          id: string
          url: string
          analyzed_at: string
          confidence: number
          total_count: number
        }[]
      }
      get_urls_by_technology: {
        Args: {
          tech_type: string
          tech_name: string
          min_confidence?: number
        }
        Returns: {
          url: string
          confidence: number
          analysis_id: string
          analyzed_at: string
        }[]
      }
      halfvec_avg: {
        Args: {
          "": number[]
        }
        Returns: unknown
      }
      halfvec_out: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      halfvec_send: {
        Args: {
          "": unknown
        }
        Returns: string
      }
      halfvec_typmod_in: {
        Args: {
          "": unknown[]
        }
        Returns: number
      }
      hnsw_bit_support: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      hnsw_halfvec_support: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      hnsw_sparsevec_support: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      hnswhandler: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      ivfflat_bit_support: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      ivfflat_halfvec_support: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      ivfflathandler: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      l2_norm:
        | {
            Args: {
              "": unknown
            }
            Returns: number
          }
        | {
            Args: {
              "": unknown
            }
            Returns: number
          }
      l2_normalize:
        | {
            Args: {
              "": string
            }
            Returns: string
          }
        | {
            Args: {
              "": unknown
            }
            Returns: unknown
          }
        | {
            Args: {
              "": unknown
            }
            Returns: unknown
          }
      search_by_tech_stack: {
        Args: {
          techs: Json
          min_confidence?: number
        }
        Returns: {
          url: string
          analysis_id: string
          analyzed_at: string
          confidence_scores: Json
        }[]
      }
      sparsevec_out: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      sparsevec_send: {
        Args: {
          "": unknown
        }
        Returns: string
      }
      sparsevec_typmod_in: {
        Args: {
          "": unknown[]
        }
        Returns: number
      }
      vector_avg: {
        Args: {
          "": number[]
        }
        Returns: string
      }
      vector_dims:
        | {
            Args: {
              "": string
            }
            Returns: number
          }
        | {
            Args: {
              "": unknown
            }
            Returns: number
          }
      vector_norm: {
        Args: {
          "": string
        }
        Returns: number
      }
      vector_out: {
        Args: {
          "": string
        }
        Returns: unknown
      }
      vector_send: {
        Args: {
          "": string
        }
        Returns: string
      }
      vector_typmod_in: {
        Args: {
          "": unknown[]
        }
        Returns: number
      }
    }
    Enums: {
      bundler_type:
        | "unknown"
        | "brunch"
        | "esbuild"
        | "rollup"
        | "turbopack"
        | "vite"
        | "webpack"
        | "bun"
        | "deno"
      dates_type:
        | "unknown"
        | "dateFns"
        | "dayJs"
        | "jsJoda"
        | "luxon"
        | "moment"
      framework_type:
        | "unknown"
        | "astro"
        | "docusaurus"
        | "storybook"
        | "sveltekit"
        | "vitepress"
        | "vuepress"
        | "nuxt"
        | "next"
        | "remix"
        | "gatsby"
      http_client_type:
        | "unknown"
        | "apollo"
        | "axios"
        | "swr"
        | "got"
        | "ky"
        | "relay"
        | "superagent"
        | "urql"
        | "nextServerActions"
        | "fetch"
      minifier_type:
        | "unknown"
        | "babelMinify"
        | "closure"
        | "esbuild"
        | "prepack"
        | "terser"
        | "uglify"
        | "swc"
      modules_type: "unknown" | "amd" | "commonjs" | "esm" | "umd"
      platform_type:
        | "unknown"
        | "shopify"
        | "squarespace"
        | "webflow"
        | "wix"
        | "wordpress"
        | "weebly"
      router_type:
        | "unknown"
        | "tanstackRouter"
        | "angularRouter"
        | "nextRouter"
        | "gatsbyRouter"
        | "qwikRouter"
        | "reactRouter"
        | "remixRouter"
        | "solidRouter"
        | "svelteRouter"
        | "vueRouter"
        | "vitepressRouter"
        | "vuepressRouter"
      state_management_type:
        | "unknown"
        | "effector"
        | "jotai"
        | "mobx"
        | "ngrx"
        | "pinia"
        | "recoil"
        | "redux"
        | "valtio"
        | "zustand"
        | "xState"
      styling_library_type:
        | "unknown"
        | "antDesign"
        | "bootstrap"
        | "chakra"
        | "foundation"
        | "lucide"
        | "mui"
        | "shadcn"
        | "tailwindCSS"
      styling_processor_type:
        | "unknown"
        | "postCSS"
        | "less"
        | "sass"
        | "stylus"
        | "emotion"
        | "jss"
        | "stitches"
        | "styledComponents"
      translations_type:
        | "unknown"
        | "i18next"
        | "reactIntl"
        | "vueI18n"
        | "reactI18next"
      transpiler_type:
        | "unknown"
        | "babel"
        | "esbuild"
        | "sucrase"
        | "swc"
        | "typescript"
        | "bun"
        | "deno"
      ui_library_type:
        | "unknown"
        | "react"
        | "preact"
        | "qwik"
        | "solid"
        | "svelte"
        | "angular"
        | "ember"
        | "inferno"
        | "vue"
        | "jQuery"
    }
    CompositeTypes: {
      image_metrics: {
        lazy_loaded: number | null
        total: number | null
      }
      script_metrics: {
        async: number | null
        defer: number | null
        modules: number | null
      }
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
