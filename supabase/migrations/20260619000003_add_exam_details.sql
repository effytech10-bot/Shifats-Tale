-- Migration: Add extra metadata fields to exams table
-- File: supabase/migrations/20260619000003_add_exam_details.sql

ALTER TABLE public.exams
  ADD COLUMN IF NOT EXISTS start_time TIME,
  ADD COLUMN IF NOT EXISTS duration INTEGER,
  ADD COLUMN IF NOT EXISTS result_publication_note TEXT;
