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
          icon_name: string | null
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
          icon_name?: string | null
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
          icon_name?: string | null
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
          is_always_available: boolean
          availability_type: 'immediate' | 'advance_order'
          advance_notice_days: number | null
          minimum_quantity: number | null
          minimum_quantity_text: string | null
          cuisine_type: 'portuguesa' | 'africana' | 'ucraniana' | 'other' | null
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
          is_always_available?: boolean
          availability_type?: 'immediate' | 'advance_order'
          advance_notice_days?: number | null
          minimum_quantity?: number | null
          minimum_quantity_text?: string | null
          cuisine_type?: 'portuguesa' | 'africana' | 'ucraniana' | 'other' | null
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
          is_always_available?: boolean
          availability_type?: 'immediate' | 'advance_order'
          advance_notice_days?: number | null
          minimum_quantity?: number | null
          minimum_quantity_text?: string | null
          cuisine_type?: 'portuguesa' | 'africana' | 'ucraniana' | 'other' | null
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
          payment_method: 'online' | 'pickup'
          payment_status: 'pending' | 'paid' | 'failed'
          stripe_payment_intent_id: string | null
          stripe_fee: number
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
          payment_method?: 'online' | 'pickup'
          payment_status?: 'pending' | 'paid' | 'failed'
          stripe_payment_intent_id?: string | null
          stripe_fee?: number
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
          payment_method?: 'online' | 'pickup'
          payment_status?: 'pending' | 'paid' | 'failed'
          stripe_payment_intent_id?: string | null
          stripe_fee?: number
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
      daily_menu_planning: {
        Row: {
          id: string
          date: string
          soup_id: string | null
          notes: string | null
          created_by: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          date: string
          soup_id?: string | null
          notes?: string | null
          created_by?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          date?: string
          soup_id?: string | null
          notes?: string | null
          created_by?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      daily_menu_items: {
        Row: {
          id: string
          planning_id: string
          menu_item_id: string
          quantity_available: number | null
          quantity_sold: number
          is_sold_out: boolean
          created_at: string
        }
        Insert: {
          id?: string
          planning_id: string
          menu_item_id: string
          quantity_available?: number | null
          quantity_sold?: number
          is_sold_out?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          planning_id?: string
          menu_item_id?: string
          quantity_available?: number | null
          quantity_sold?: number
          is_sold_out?: boolean
          created_at?: string
        }
      }
      expense_categories: {
        Row: {
          id: string
          name: string
          icon: string | null
          color: string | null
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          icon?: string | null
          color?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          icon?: string | null
          color?: string | null
          created_at?: string
        }
      }
      expenses: {
        Row: {
          id: string
          category_id: string
          amount: number
          expense_date: string
          description: string | null
          is_recurring: boolean
          created_at: string
          updated_at: string
          created_by: string | null
        }
        Insert: {
          id?: string
          category_id: string
          amount: number
          expense_date: string
          description?: string | null
          is_recurring?: boolean
          created_at?: string
          updated_at?: string
          created_by?: string | null
        }
        Update: {
          id?: string
          category_id?: string
          amount?: number
          expense_date?: string
          description?: string | null
          is_recurring?: boolean
          created_at?: string
          updated_at?: string
          created_by?: string | null
        }
      }
      sales_log: {
        Row: {
          id: string
          menu_item_id: string
          item_name: string
          quantity: number
          unit_price: number
          total_price: number
          sale_date: string
          notes: string | null
          created_at: string
          created_by: string | null
        }
        Insert: {
          id?: string
          menu_item_id: string
          item_name: string
          quantity: number
          unit_price: number
          sale_date: string
          notes?: string | null
          created_at?: string
          created_by?: string | null
        }
        Update: {
          id?: string
          menu_item_id?: string
          item_name?: string
          quantity?: number
          unit_price?: number
          sale_date?: string
          notes?: string | null
          created_at?: string
          created_by?: string | null
        }
      }
      recipe_costs: {
        Row: {
          id: string
          menu_item_id: string
          ingredient_cost: number
          selling_price: number
          margin_percentage: number
          last_updated: string
          updated_by: string | null
        }
        Insert: {
          id?: string
          menu_item_id: string
          ingredient_cost?: number
          selling_price: number
          last_updated?: string
          updated_by?: string | null
        }
        Update: {
          id?: string
          menu_item_id?: string
          ingredient_cost?: number
          selling_price?: number
          last_updated?: string
          updated_by?: string | null
        }
      }
    }
  }
}
