-- Idempotent demo seed: 2 trainers + 3 trainees with linked plans and history.
--
-- Already applied to the project database via the Supabase MCP. Kept here so
-- the same data can be re-applied to any environment (e.g. branch databases)
-- with `supabase db push` or by running the file manually.
--
-- Demo credentials (all share the same password: GymDemo123!):
--   Trainers
--     coach.alex@gymtracker.demo  - Alex Bianchi  (clients: Mario, Giulia)
--     coach.sara@gymtracker.demo  - Sara Conti    (clients: Luca)
--   Trainees
--     mario.rossi@gymtracker.demo  - Mario Rossi
--     giulia.verdi@gymtracker.demo - Giulia Verdi
--     luca.neri@gymtracker.demo    - Luca Neri
--
-- Re-running the migration is safe: existing auth users / profiles / links are
-- preserved, while plan exercises and historical workout logs are rebuilt so
-- the seeded fixture stays deterministic.

DO $$
DECLARE
  trainer_alex   uuid := '00000000-0000-4000-8000-000000000a01';
  trainer_sara   uuid := '00000000-0000-4000-8000-000000000a02';
  trainee_mario  uuid := '00000000-0000-4000-8000-000000000b01';
  trainee_giulia uuid := '00000000-0000-4000-8000-000000000b02';
  trainee_luca   uuid := '00000000-0000-4000-8000-000000000b03';

  password_hash text := crypt('GymDemo123!', gen_salt('bf'));

  plan_mario_full   uuid := '00000000-0000-4000-8000-000000000c01';
  plan_mario_push   uuid := '00000000-0000-4000-8000-000000000c02';
  plan_giulia_low   uuid := '00000000-0000-4000-8000-000000000c03';
  plan_giulia_upper uuid := '00000000-0000-4000-8000-000000000c04';
  plan_luca_full    uuid := '00000000-0000-4000-8000-000000000c05';

  log_id uuid;
BEGIN
  -- 1) Auth users (the handle_new_user trigger creates the matching profiles)
  INSERT INTO auth.users (
    instance_id, id, aud, role, email, encrypted_password,
    email_confirmed_at, raw_app_meta_data, raw_user_meta_data,
    created_at, updated_at, confirmation_token, recovery_token,
    email_change_token_new, email_change
  )
  VALUES
    ('00000000-0000-0000-0000-000000000000', trainer_alex, 'authenticated', 'authenticated',
     'coach.alex@gymtracker.demo', password_hash, now(),
     '{"provider":"email","providers":["email"]}'::jsonb,
     jsonb_build_object('full_name','Alex Bianchi','role','trainer'),
     now(), now(), '', '', '', ''),
    ('00000000-0000-0000-0000-000000000000', trainer_sara, 'authenticated', 'authenticated',
     'coach.sara@gymtracker.demo', password_hash, now(),
     '{"provider":"email","providers":["email"]}'::jsonb,
     jsonb_build_object('full_name','Sara Conti','role','trainer'),
     now(), now(), '', '', '', ''),
    ('00000000-0000-0000-0000-000000000000', trainee_mario, 'authenticated', 'authenticated',
     'mario.rossi@gymtracker.demo', password_hash, now(),
     '{"provider":"email","providers":["email"]}'::jsonb,
     jsonb_build_object('full_name','Mario Rossi','role','user'),
     now(), now(), '', '', '', ''),
    ('00000000-0000-0000-0000-000000000000', trainee_giulia, 'authenticated', 'authenticated',
     'giulia.verdi@gymtracker.demo', password_hash, now(),
     '{"provider":"email","providers":["email"]}'::jsonb,
     jsonb_build_object('full_name','Giulia Verdi','role','user'),
     now(), now(), '', '', '', ''),
    ('00000000-0000-0000-0000-000000000000', trainee_luca, 'authenticated', 'authenticated',
     'luca.neri@gymtracker.demo', password_hash, now(),
     '{"provider":"email","providers":["email"]}'::jsonb,
     jsonb_build_object('full_name','Luca Neri','role','user'),
     now(), now(), '', '', '', '')
  ON CONFLICT (id) DO NOTHING;

  INSERT INTO auth.identities (
    id, user_id, provider, provider_id, identity_data,
    last_sign_in_at, created_at, updated_at
  )
  VALUES
    (gen_random_uuid(), trainer_alex,   'email', trainer_alex::text,
     jsonb_build_object('sub', trainer_alex::text,   'email','coach.alex@gymtracker.demo',  'email_verified', true, 'phone_verified', false, 'role','trainer', 'full_name','Alex Bianchi'),
     now(), now(), now()),
    (gen_random_uuid(), trainer_sara,   'email', trainer_sara::text,
     jsonb_build_object('sub', trainer_sara::text,   'email','coach.sara@gymtracker.demo',  'email_verified', true, 'phone_verified', false, 'role','trainer', 'full_name','Sara Conti'),
     now(), now(), now()),
    (gen_random_uuid(), trainee_mario,  'email', trainee_mario::text,
     jsonb_build_object('sub', trainee_mario::text,  'email','mario.rossi@gymtracker.demo', 'email_verified', true, 'phone_verified', false, 'role','user',    'full_name','Mario Rossi'),
     now(), now(), now()),
    (gen_random_uuid(), trainee_giulia, 'email', trainee_giulia::text,
     jsonb_build_object('sub', trainee_giulia::text, 'email','giulia.verdi@gymtracker.demo','email_verified', true, 'phone_verified', false, 'role','user',    'full_name','Giulia Verdi'),
     now(), now(), now()),
    (gen_random_uuid(), trainee_luca,   'email', trainee_luca::text,
     jsonb_build_object('sub', trainee_luca::text,   'email','luca.neri@gymtracker.demo',   'email_verified', true, 'phone_verified', false, 'role','user',    'full_name','Luca Neri'),
     now(), now(), now())
  ON CONFLICT (provider_id, provider) DO NOTHING;

  -- 2) trainer_clients links
  INSERT INTO public.trainer_clients (trainer_id, client_id) VALUES
    (trainer_alex, trainee_mario),
    (trainer_alex, trainee_giulia),
    (trainer_sara, trainee_luca)
  ON CONFLICT (trainer_id, client_id) DO NOTHING;

  -- 3) Workout plans
  INSERT INTO public.workout_plans (id, name, description, trainer_id, client_id, created_at, updated_at) VALUES
    (plan_mario_full,   'Full Body Principiante',
       'Scheda full-body 3x settimana per costruire una base di forza generale.',
       trainer_alex, trainee_mario, now() - interval '21 days', now() - interval '5 days'),
    (plan_mario_push,   'Push Day Intermedio',
       'Spinta orizzontale e verticale per petto, spalle e tricipiti.',
       trainer_alex, trainee_mario, now() - interval '7 days',  now() - interval '2 days'),
    (plan_giulia_low,   'Lower Body Glutei & Gambe',
       'Focus su glutei, femorali e quadricipiti con accessori di isolamento.',
       trainer_alex, trainee_giulia, now() - interval '30 days', now() - interval '4 days'),
    (plan_giulia_upper, 'Upper Body Tonificazione',
       'Schiena, spalle e core per una postura piu stabile.',
       trainer_alex, trainee_giulia, now() - interval '14 days', now() - interval '3 days'),
    (plan_luca_full,    'Forza Total Body',
       'Allenamento di forza con multiarticolari pesanti e accessori mirati.',
       trainer_sara, trainee_luca,  now() - interval '20 days', now() - interval '1 day')
  ON CONFLICT (id) DO NOTHING;

  -- 4) Plan exercises (delete-then-insert so re-runs reflect this seed)
  DELETE FROM public.plan_exercises
   WHERE plan_id IN (plan_mario_full, plan_mario_push, plan_giulia_low, plan_giulia_upper, plan_luca_full);

  INSERT INTO public.plan_exercises (plan_id, exercise_id, target_sets, target_reps, rest_seconds, notes, position) VALUES
    (plan_mario_full, 'squat',                4, '8',  120, 'Scendi sotto al parallelo, controlla la discesa.', 0),
    (plan_mario_full, 'bench-press',          4, '8',  120, 'Scapole addotte, gomiti a 45 gradi.',              1),
    (plan_mario_full, 'rematore-bilanciere',  4, '10',  90, 'Tira verso lombare, busto fermo.',                 2),
    (plan_mario_full, 'military-press',       3, '10',  90, 'Core attivo, no inarcamento eccessivo.',           3),
    (plan_mario_full, 'plank',                3, '45',  60, '45 secondi per serie.',                            4),

    (plan_mario_push, 'panca-inclinata', 4, '10',  90, 'Inclinazione 30 gradi.', 0),
    (plan_mario_push, 'military-press',  4, '8',  120, NULL,                     1),
    (plan_mario_push, 'alzate-laterali', 3, '12',  60, 'Peso leggero, controllo massimo.', 2),
    (plan_mario_push, 'pushdown-cavi',   3, '12',  60, NULL, 3),
    (plan_mario_push, 'french-press',    3, '10',  60, NULL, 4),

    (plan_giulia_low, 'hip-thrust',     4, '10', 120, 'Pausa di 1s in cima.', 0),
    (plan_giulia_low, 'leg-press',      4, '12', 120, 'Piedi alti per piu glutei.', 1),
    (plan_giulia_low, 'affondi',        3, '10',  90, 'Alterna le gambe.', 2),
    (plan_giulia_low, 'leg-curl',       3, '12',  60, NULL, 3),
    (plan_giulia_low, 'slancio-glutei', 3, '15',  45, 'Per gamba.', 4),
    (plan_giulia_low, 'calf-raise',     4, '15',  45, NULL, 5),

    (plan_giulia_upper, 'lat-machine',     4, '10',  90, NULL, 0),
    (plan_giulia_upper, 'pulley-basso',    3, '12',  90, 'Stringi le scapole.', 1),
    (plan_giulia_upper, 'alzate-laterali', 3, '12',  60, NULL, 2),
    (plan_giulia_upper, 'face-pull',       3, '15',  60, 'Salute spalle.', 3),
    (plan_giulia_upper, 'curl-manubri',    3, '12',  60, NULL, 4),
    (plan_giulia_upper, 'crunch',          3, '15',  45, NULL, 5),

    (plan_luca_full, 'stacco',          5, '5',  180, 'Tecnica prima del carico.', 0),
    (plan_luca_full, 'squat',           5, '5',  180, NULL, 1),
    (plan_luca_full, 'bench-press',     5, '5',  180, NULL, 2),
    (plan_luca_full, 'trazioni',        4, '6',  120, 'Usa elastico se necessario.', 3),
    (plan_luca_full, 'curl-bilanciere', 3, '8',   75, NULL, 4),
    (plan_luca_full, 'pushdown-cavi',   3, '10',  60, NULL, 5);

  -- 5) Workout logs + sets (all in the past so the demo trainees can still
  --    start a fresh workout today)
  DELETE FROM public.workout_logs WHERE user_id IN (trainee_mario, trainee_giulia, trainee_luca);

  INSERT INTO public.workout_logs (user_id, plan_id, plan_name, date)
  VALUES (trainee_mario, plan_mario_full, 'Full Body Principiante', now() - interval '5 days')
  RETURNING id INTO log_id;
  INSERT INTO public.workout_log_sets (log_id, exercise_id, set_number, weight, reps, completed) VALUES
    (log_id, 'squat',              1, 60, 8,  true),
    (log_id, 'squat',              2, 65, 8,  true),
    (log_id, 'squat',              3, 70, 6,  true),
    (log_id, 'squat',              4, 70, 6,  true),
    (log_id, 'bench-press',        1, 50, 8,  true),
    (log_id, 'bench-press',        2, 55, 8,  true),
    (log_id, 'bench-press',        3, 60, 6,  true),
    (log_id, 'bench-press',        4, 60, 6,  true),
    (log_id, 'rematore-bilanciere',1, 40, 10, true),
    (log_id, 'rematore-bilanciere',2, 45, 10, true),
    (log_id, 'rematore-bilanciere',3, 50, 8,  true),
    (log_id, 'military-press',     1, 30, 10, true),
    (log_id, 'military-press',     2, 32, 8,  true),
    (log_id, 'plank',              1,  0, 45, true),
    (log_id, 'plank',              2,  0, 45, true);

  INSERT INTO public.workout_logs (user_id, plan_id, plan_name, date)
  VALUES (trainee_mario, plan_mario_push, 'Push Day Intermedio', now() - interval '2 days')
  RETURNING id INTO log_id;
  INSERT INTO public.workout_log_sets (log_id, exercise_id, set_number, weight, reps, completed) VALUES
    (log_id, 'panca-inclinata', 1, 18, 10, true),
    (log_id, 'panca-inclinata', 2, 20, 10, true),
    (log_id, 'panca-inclinata', 3, 22, 8,  true),
    (log_id, 'military-press',  1, 32, 8,  true),
    (log_id, 'military-press',  2, 35, 6,  true),
    (log_id, 'alzate-laterali', 1,  8, 12, true),
    (log_id, 'alzate-laterali', 2,  8, 12, true),
    (log_id, 'pushdown-cavi',   1, 25, 12, true),
    (log_id, 'pushdown-cavi',   2, 27, 10, true),
    (log_id, 'french-press',    1, 20, 10, true),
    (log_id, 'french-press',    2, 22, 8,  true);

  INSERT INTO public.workout_logs (user_id, plan_id, plan_name, date)
  VALUES (trainee_giulia, plan_giulia_low, 'Lower Body Glutei & Gambe', now() - interval '8 days')
  RETURNING id INTO log_id;
  INSERT INTO public.workout_log_sets (log_id, exercise_id, set_number, weight, reps, completed) VALUES
    (log_id, 'hip-thrust',     1, 60, 10, true),
    (log_id, 'hip-thrust',     2, 70, 10, true),
    (log_id, 'hip-thrust',     3, 80, 8,  true),
    (log_id, 'leg-press',      1, 100, 12, true),
    (log_id, 'leg-press',      2, 110, 12, true),
    (log_id, 'leg-press',      3, 120, 10, true),
    (log_id, 'affondi',        1, 12, 10, true),
    (log_id, 'affondi',        2, 12, 10, true),
    (log_id, 'leg-curl',       1, 25, 12, true),
    (log_id, 'leg-curl',       2, 28, 10, true),
    (log_id, 'slancio-glutei', 1, 10, 15, true),
    (log_id, 'calf-raise',     1, 60, 15, true),
    (log_id, 'calf-raise',     2, 70, 15, true);

  INSERT INTO public.workout_logs (user_id, plan_id, plan_name, date)
  VALUES (trainee_giulia, plan_giulia_low, 'Lower Body Glutei & Gambe', now() - interval '4 days')
  RETURNING id INTO log_id;
  INSERT INTO public.workout_log_sets (log_id, exercise_id, set_number, weight, reps, completed) VALUES
    (log_id, 'hip-thrust', 1, 70, 10, true),
    (log_id, 'hip-thrust', 2, 75, 10, true),
    (log_id, 'hip-thrust', 3, 85, 8,  true),
    (log_id, 'leg-press',  1, 110, 12, true),
    (log_id, 'leg-press',  2, 120, 12, true),
    (log_id, 'affondi',    1, 14, 10, true),
    (log_id, 'leg-curl',   1, 28, 12, true),
    (log_id, 'calf-raise', 1, 70, 15, true);

  INSERT INTO public.workout_logs (user_id, plan_id, plan_name, date)
  VALUES (trainee_giulia, plan_giulia_upper, 'Upper Body Tonificazione', now() - interval '3 days')
  RETURNING id INTO log_id;
  INSERT INTO public.workout_log_sets (log_id, exercise_id, set_number, weight, reps, completed) VALUES
    (log_id, 'lat-machine',     1, 30, 10, true),
    (log_id, 'lat-machine',     2, 32, 10, true),
    (log_id, 'lat-machine',     3, 35, 8,  true),
    (log_id, 'pulley-basso',    1, 30, 12, true),
    (log_id, 'pulley-basso',    2, 35, 10, true),
    (log_id, 'alzate-laterali', 1,  6, 12, true),
    (log_id, 'alzate-laterali', 2,  6, 12, true),
    (log_id, 'face-pull',       1, 15, 15, true),
    (log_id, 'curl-manubri',    1,  8, 12, true),
    (log_id, 'crunch',          1,  0, 15, true);

  INSERT INTO public.workout_logs (user_id, plan_id, plan_name, date)
  VALUES (trainee_luca, plan_luca_full, 'Forza Total Body', now() - interval '10 days')
  RETURNING id INTO log_id;
  INSERT INTO public.workout_log_sets (log_id, exercise_id, set_number, weight, reps, completed) VALUES
    (log_id, 'stacco',          1, 80,  5, true),
    (log_id, 'stacco',          2, 100, 5, true),
    (log_id, 'stacco',          3, 110, 5, true),
    (log_id, 'stacco',          4, 110, 5, true),
    (log_id, 'squat',           1, 80,  5, true),
    (log_id, 'squat',           2, 90,  5, true),
    (log_id, 'squat',           3, 95,  5, true),
    (log_id, 'bench-press',     1, 60,  5, true),
    (log_id, 'bench-press',     2, 65,  5, true),
    (log_id, 'bench-press',     3, 70,  5, true),
    (log_id, 'trazioni',        1,  0,  6, true),
    (log_id, 'trazioni',        2,  0,  5, true),
    (log_id, 'curl-bilanciere', 1, 25,  8, true),
    (log_id, 'pushdown-cavi',   1, 30, 10, true);

  INSERT INTO public.workout_logs (user_id, plan_id, plan_name, date)
  VALUES (trainee_luca, plan_luca_full, 'Forza Total Body', now() - interval '4 days')
  RETURNING id INTO log_id;
  INSERT INTO public.workout_log_sets (log_id, exercise_id, set_number, weight, reps, completed) VALUES
    (log_id, 'stacco',          1, 90,  5, true),
    (log_id, 'stacco',          2, 110, 5, true),
    (log_id, 'stacco',          3, 120, 5, true),
    (log_id, 'stacco',          4, 120, 4, true),
    (log_id, 'squat',           1, 85,  5, true),
    (log_id, 'squat',           2, 95,  5, true),
    (log_id, 'squat',           3, 100, 4, true),
    (log_id, 'bench-press',     1, 65,  5, true),
    (log_id, 'bench-press',     2, 70,  5, true),
    (log_id, 'bench-press',     3, 72,  4, true),
    (log_id, 'trazioni',        1,  0,  7, true),
    (log_id, 'trazioni',        2,  0,  6, true),
    (log_id, 'curl-bilanciere', 1, 27,  8, true),
    (log_id, 'pushdown-cavi',   1, 32, 10, true);

  INSERT INTO public.workout_logs (user_id, plan_id, plan_name, date)
  VALUES (trainee_luca, plan_luca_full, 'Forza Total Body', now() - interval '1 day')
  RETURNING id INTO log_id;
  INSERT INTO public.workout_log_sets (log_id, exercise_id, set_number, weight, reps, completed) VALUES
    (log_id, 'stacco',          1, 100, 5, true),
    (log_id, 'stacco',          2, 115, 5, true),
    (log_id, 'stacco',          3, 125, 5, true),
    (log_id, 'squat',           1, 90,  5, true),
    (log_id, 'squat',           2, 100, 5, true),
    (log_id, 'squat',           3, 105, 4, true),
    (log_id, 'bench-press',     1, 67,  5, true),
    (log_id, 'bench-press',     2, 72,  5, true),
    (log_id, 'bench-press',     3, 75,  4, true),
    (log_id, 'trazioni',        1,  0,  8, true),
    (log_id, 'trazioni',        2,  0,  7, true),
    (log_id, 'curl-bilanciere', 1, 30,  8, true),
    (log_id, 'pushdown-cavi',   1, 35, 10, true);
END $$;
