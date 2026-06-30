export type ContentStatus = "DRAFT" | "PUBLISHED" | "ARCHIVED";

export interface MediaAsset {
  id: string;
  provider: "CLOUDINARY";
  public_id: string;
  asset_id?: string | null;
  asset_type: "IMAGE" | "VIDEO" | "DOCUMENT";
  resource_type: string;
  delivery_type: string;
  secure_url: string;
  version?: number | null;
  format?: string | null;
  folder?: string | null;
  original_filename?: string | null;
  width?: number | null;
  height?: number | null;
  bytes?: number | null;
  duration?: number | null;
  alt_text?: string | null;
  caption?: string | null;
  is_public: boolean;
  metadata: Record<string, unknown>;
  created_by?: string | null;
  created_at: string;
  updated_at: string;
  deleted_at?: string | null;
}

export interface SiteSettings {
  id: number;
  site_name?: string | null;
  site_short_name?: string | null;
  tagline?: string | null;
  site_description?: string | null;
  
  logo_media_id?: string | null;
  favicon_media_id?: string | null;
  default_og_media_id?: string | null;
  
  primary_phone?: string | null;
  secondary_phone?: string | null;
  whatsapp_number?: string | null;
  email?: string | null;
  
  address_line?: string | null;
  city?: string | null;
  country?: string | null;
  google_map_url?: string | null;
  
  footer_description?: string | null;
  copyright_text?: string | null;
  developer_credit_text?: string | null;
  
  default_seo_title?: string | null;
  default_seo_description?: string | null;
  
  maintenance_mode: boolean;
  registration_enabled: boolean;
  
  updated_by?: string | null;
  updated_at: string;
}

export interface SiteSocialLink {
  id: string;
  platform: string;
  label: string;
  url: string;
  icon_key: string;
  sort_order: number;
  is_enabled: boolean;
  created_by?: string | null;
  updated_by?: string | null;
  created_at: string;
  updated_at: string;
}

export interface SiteNavigationItem {
  id: string;
  parent_id?: string | null;
  location: "HEADER" | "FOOTER" | "BOTH";
  label: string;
  href: string;
  icon_key?: string | null;
  sort_order: number;
  is_enabled: boolean;
  open_in_new_tab: boolean;
  created_by?: string | null;
  updated_by?: string | null;
  created_at: string;
  updated_at: string;
}

export interface SitePage {
  id: string;
  page_key: string;
  name: string;
  slug: string;
  status: ContentStatus;
  
  seo_title?: string | null;
  seo_description?: string | null;
  canonical_url?: string | null;
  og_media_id?: string | null;
  
  created_by?: string | null;
  updated_by?: string | null;
  created_at: string;
  updated_at: string;
  published_at?: string | null;
}

export interface SitePageSection {
  id: string;
  page_id: string;
  section_key: string;
  component_key: string;
  
  eyebrow?: string | null;
  title?: string | null;
  subtitle?: string | null;
  description?: string | null;
  
  content: Record<string, unknown>;
  settings: Record<string, unknown>;
  
  sort_order: number;
  status: ContentStatus;
  is_enabled: boolean;
  
  created_by?: string | null;
  updated_by?: string | null;
  created_at: string;
  updated_at: string;
  published_at?: string | null;
}

export interface SiteSectionItem {
  id: string;
  section_id: string;
  
  title?: string | null;
  subtitle?: string | null;
  body?: string | null;
  
  icon_key?: string | null;
  media_id?: string | null;
  
  value?: string | null;
  link_label?: string | null;
  link_url?: string | null;
  
  metadata: Record<string, unknown>;
  
  sort_order: number;
  status: ContentStatus;
  
  created_by?: string | null;
  updated_by?: string | null;
  created_at: string;
  updated_at: string;
}
