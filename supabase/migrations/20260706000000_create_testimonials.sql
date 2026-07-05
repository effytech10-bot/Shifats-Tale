-- Create public.testimonials table
create table public.testimonials (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  role text not null check (role in ('Student', 'Parent')),
  message text not null,
  rating integer not null check (rating >= 1 and rating <= 5),
  image text not null default '/images/shifat_sir.png',
  batch text not null,
  achievement text,
  is_approved boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Enable Row Level Security (RLS)
alter table public.testimonials enable row level security;

-- Policy 1: Anyone can view approved testimonials
create policy "Anyone can select approved testimonials"
on public.testimonials
for select
using (is_approved = true);

-- Policy 2: Anyone can insert unapproved testimonials as DRAFT (requires is_approved = false)
create policy "Anyone can insert testimonials"
on public.testimonials
for insert
with check (is_approved = false);

-- Policy 3: Active teachers have full access to manage testimonials
create policy "Teachers can manage testimonials"
on public.testimonials
for all
to authenticated
using (public.is_active_teacher())
with check (public.is_active_teacher());

-- Trigger for updating the updated_at timestamp automatically
create trigger update_testimonials_modtime
before update on public.testimonials
for each row execute function public.set_updated_at();

-- Grant permissions to anonymous and authenticated users, and PostgreSQL roles
grant select, insert on public.testimonials to anon, authenticated;
grant all on public.testimonials to postgres, service_role;

-- Seed the initial 9 testimonials from static data
insert into public.testimonials (id, name, role, message, rating, image, batch, achievement, is_approved) values
('c1a2d3e4-f5a6-7b8c-9d0e-1f2a3b4c5d6e', 'Adib Hasan', 'Student', 'Shifat Sir has an extraordinary way of explaining complex physics concepts. Before joining his batch, I used to memorize formulas, but he taught me how to derive and visualize them. His hand notes are gold for admission tests!', 5, '/images/shifat_sir.png', 'HSC Batch 2024', 'Currently studying at BUET (CSE)', true),
('c1a2d3e4-f5a6-7b8c-9d0e-1f2a3b4c5d7f', 'Dr. Farhana Yasmin', 'Parent', 'As a doctor, I wanted my son to have a strong conceptual foundation rather than just cramming for exams. Shifat Sir''s personal monitoring, regular test updates, and constant encouragement completely changed Abrar''s attitude towards Mathematics.', 5, '/images/shifat_sir.png', 'Mother of Abrar (SSC Batch 2025)', 'Abrar got GPA 5.00', true),
('c1a2d3e4-f5a6-7b8c-9d0e-1f2a3b4c5d8a', 'Tahmina Chowdhury', 'Student', 'Even though I was preparing for medical school, Sir''s Physics batches helped me immensely. His techniques for solving math quickly saved me critical time in the DMC admission test. He is a mentor who checks up on every single student.', 5, '/images/shifat_sir.png', 'HSC Batch 2024', 'Dhaka Medical College (DMC)', true),
('c1a2d3e4-f5a6-7b8c-9d0e-1f2a3b4c5d9b', 'Saadman Rahman', 'Student', 'Sir''s weekly assessment tests are challenging, but they prepare you perfectly for any exam standard. He never hesitates to explain the same topic 5 times if you don''t understand it. Best teacher I have ever met.', 5, '/images/shifat_sir.png', 'HSC Batch 2025', 'Physics Board Mark: 98/100', true),
('c1a2d3e4-f5a6-7b8c-9d0e-1f2a3b4c5e0c', 'Nabila Sajjad', 'Student', 'Sir''s mathematical physics shortcut derivations and coordinate geometry summaries saved my admission exam time. I managed to solve all problems and got into RUET EEE!', 5, '/images/shifat_sir.png', 'HSC Batch 2023', 'Got into RUET (EEE)', true),
('c1a2d3e4-f5a6-7b8c-9d0e-1f2a3b4c5e1d', 'Kamrul Islam', 'Parent', 'Fahim was struggling with mechanics in physics class. After joining Shifat Sir''s core care batch, his analytical skills improved significantly. He succeeded in board exams and got admitted into CUET.', 5, '/images/shifat_sir.png', 'Father of Fahim (HSC Batch 2024)', 'Fahim got into CUET', true),
('c1a2d3e4-f5a6-7b8c-9d0e-1f2a3b4c5e2e', 'Farhan Labib', 'Student', 'Higher Mathematics calculus was a nightmare for me until I did the differentiation and integration visual breakdown sessions with Sifat Sir. His graphical representation was superb.', 5, '/images/shifat_sir.png', 'HSC Batch 2025', 'Board Exam Math A+', true),
('c1a2d3e4-f5a6-7b8c-9d0e-1f2a3b4c5e3f', 'Jannatul Fiza', 'Student', 'The strict diagnostic test rankings and parent notification system kept me serious and focused throughout my HSC prep. I am extremely proud to say I got admitted into DU A-Unit!', 5, '/images/shifat_sir.png', 'HSC Batch 2024', 'Got into Dhaka University (DU)', true),
('c1a2d3e4-f5a6-7b8c-9d0e-1f2a3b4c5e4a', 'Maisha Anjum', 'Student', 'I got board A+ in all science core subjects. Sir''s creative questions (CQ) and MCQ speed-drills prepared me to manage exam stress without panicking.', 5, '/images/shifat_sir.png', 'SSC Batch 2024', 'SSC Board GPA 5.00', true);
