create table public.events (
  id uuid not null default gen_random_uuid (),
  nama_event text not null,
  location text not null,
  jam_mulai time without time zone not null,
  jam_selesai time without time zone not null,
  no_wa text null,
  email text null,
  harga_tiket text null,
  created_at timestamp without time zone null default now(),
  latitude numeric null,
  longitude numeric null,
  description text null,
  tanggal_mulai date not null,
  tanggal_selesai date not null,
  constraint events_pkey primary key (id)
) TABLESPACE pg_default;