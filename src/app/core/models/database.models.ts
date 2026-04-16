export interface Client {
  id?: string; // uuid
  first_name: string;
  last_name: string;
  identification: string;
  phone: string;
  email?: string;
  birth_date?: string; // date
  gender?: string;
  notes?: string;
  accepts_conditions: boolean;
  created_at?: string; // timestamptz
  is_active: boolean;
}

export interface InventoryItem {
  id?: string; // uuid
  code: string;
  name: string;
  type: string;
  brand?: string;
  model: string;
  description?: string;
  color?: string;
  material?: string;
  stock: number; // int8
  price: number; // numeric
  image_url?: string;
  is_published: boolean;
  is_active: boolean;
  created_at?: string; // timestamptz
  updated_at?: string; // timestamptz
}
