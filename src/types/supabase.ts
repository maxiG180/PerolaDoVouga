export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      categories: {
        Row: {
          id: string
          name: string
          name_en: string | null
          description: string | null
          display_order: number
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          name_en?: string | null
          description?: string | null
          display_order?: number
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          name_en?: string | null
          description?: string | null
          display_order?: number
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      menu_items: {
        Row: {
          id: string
          category_id: string | null
          name: string
          name_en: string | null
          description: string | null
          price: number
          daily_type: 'none' | 'soup' | 'dish' | null
          image_url: string | null
          allergens: string[] | null
          is_available: boolean
          is_featured: boolean
          display_order: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          category_id?: string | null
          name: string
          name_en?: string | null
          description?: string | null
          price: number
          daily_type?: 'none' | 'soup' | 'dish' | null
          image_url?: string | null
          allergens?: string[] | null
          is_available?: boolean
          is_featured?: boolean
          display_order?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          category_id?: string | null
          name?: string
          name_en?: string | null
          description?: string | null
          price?: number
          daily_type?: 'none' | 'soup' | 'dish' | null
          image_url?: string | null
          allergens?: string[] | null
          is_available?: boolean
          is_featured?: boolean
          display_order?: number
          created_at?: string
          updated_at?: string
        }
      }
      orders: {
        Row: {
          id: string
          order_number: string
          customer_name: string
          customer_phone: string
          customer_email: string
          pickup_time: string
          special_instructions: string | null
          total_amount: number
          status: 'pending' | 'accepted' | 'preparing' | 'ready' | 'completed' | 'cancelled'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          order_number: string
          customer_name: string
          customer_phone: string
          customer_email: string
          pickup_time: string
          special_instructions?: string | null
          total_amount: number
          status?: 'pending' | 'accepted' | 'preparing' | 'ready' | 'completed' | 'cancelled'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          order_number?: string
          customer_name?: string
          customer_phone?: string
          customer_email?: string
          pickup_time?: string
          special_instructions?: string | null
          total_amount?: number
          status?: 'pending' | 'accepted' | 'preparing' | 'ready' | 'completed' | 'cancelled'
          created_at?: string
          updated_at?: string
        }
      }
      order_items: {
        Row: {
          id: string
          order_id: string
          menu_item_id: string | null
          item_name: string
          item_price: number
          quantity: number
          customizations: string | null
          subtotal: number
        }
        Insert: {
          id?: string
          order_id: string
          menu_item_id?: string | null
          item_name: string
          item_price: number
          quantity?: number
          customizations?: string | null
          subtotal: number
        }
        Update: {
          id?: string
          order_id?: string
          menu_item_id?: string | null
          item_name?: string
          item_price?: number
          quantity?: number
          customizations?: string | null
          subtotal?: number
        }
      }
    }
  }
}
