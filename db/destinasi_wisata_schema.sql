create table public.destinasi_wisata (
  id serial not null,
  nama_destinasi character varying(255) null,
  alamat character varying(255) null,
  detail_alamat text null,
  latitude numeric(10, 6) null,
  longitude numeric(10, 6) null,
  jam_buka time without time zone null,
  jam_tutup time without time zone null,
  telepon character varying(50) null,
  email character varying(255) null,
  fasilitas jsonb null,
  harga_tiket integer null,
  gambar jsonb null,
  constraint destinasi_wisata_pkey primary key (id)
) TABLESPACE pg_default;