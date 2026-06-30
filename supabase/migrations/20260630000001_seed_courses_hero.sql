-- 20260630000001_seed_courses_hero.sql
-- Seed the "COURSES" page and "COURSES_HERO" section

DO $$ 
DECLARE
  v_page_id uuid;
  v_teacher_id uuid;
BEGIN
  -- Get any active profile to assign as creator (fallback to null if none exists)
  SELECT id INTO v_teacher_id FROM public.profiles LIMIT 1;

  -- 1. Upsert COURSES page
  INSERT INTO public.site_pages (page_key, name, slug, status, seo_title, seo_description, created_by, updated_by, published_at)
  VALUES (
    'COURSES', 
    'Courses & Batches', 
    'courses', 
    'PUBLISHED',
    'Available Courses & Batches | Shifat''s Tales',
    'Explore our curriculum programs designed to guide students towards absolute clarity in board and admission exams.',
    v_teacher_id,
    v_teacher_id,
    now()
  )
  ON CONFLICT (page_key) DO UPDATE SET 
    updated_at = now()
  RETURNING id INTO v_page_id;

  -- 2. Upsert COURSES_HERO section
  INSERT INTO public.site_page_sections (
    page_id, 
    section_key, 
    component_key, 
    eyebrow, 
    title, 
    subtitle, 
    description, 
    status, 
    is_enabled,
    created_by,
    updated_by,
    published_at
  )
  VALUES (
    v_page_id,
    'COURSES_HERO',
    'InnerPageHero',
    'BATCHES & PROGRAMS',
    'Explore Our Batches at',
    'Shifat''s Tales',
    'Explore our curriculum programs designed to guide students towards absolute clarity in board and admission exams.',
    'PUBLISHED',
    true,
    v_teacher_id,
    v_teacher_id,
    now()
  )
  ON CONFLICT (page_id, section_key) DO NOTHING;
END $$;
