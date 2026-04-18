export interface Idiom {
  id: string;
  title: string;
  slug: string;
  thumbnail?: string;
  meaning_de: string;
  meaning_en: string;
  meaning_vi: string;
  content_html: string;
  literal: string;
  origin?: string;
  example?: string;
  tags: string[];
  created_at: string;
  updated_at: string;
}
