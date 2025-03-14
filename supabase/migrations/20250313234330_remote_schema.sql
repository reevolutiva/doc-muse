create extension if not exists "vector" with schema "public" version '0.8.0';

create table "public"."document_completion" (
    "id" uuid not null default gen_random_uuid(),
    "project_id" uuid not null,
    "document_template_id" uuid not null,
    "completed" boolean not null default false,
    "completed_at" timestamp with time zone,
    "completed_by" uuid,
    "created_at" timestamp with time zone default now(),
    "updated_at" timestamp with time zone default now()
);


alter table "public"."document_completion" enable row level security;

create table "public"."document_embeddings" (
    "id" uuid not null default gen_random_uuid(),
    "project_id" uuid not null,
    "document_id" text not null,
    "content" text not null,
    "embedding" vector(1536),
    "created_at" timestamp with time zone default now(),
    "updated_at" timestamp with time zone default now()
);


alter table "public"."document_embeddings" enable row level security;

create table "public"."document_templates" (
    "id" uuid not null default gen_random_uuid(),
    "title" text not null,
    "description" text,
    "content" jsonb not null,
    "user_id" uuid not null,
    "created_at" timestamp with time zone default now(),
    "updated_at" timestamp with time zone default now(),
    "config" jsonb
);


alter table "public"."document_templates" enable row level security;

create table "public"."document_versions" (
    "id" uuid not null default gen_random_uuid(),
    "document_id" text not null,
    "project_id" uuid not null,
    "version_number" integer not null,
    "content" text not null,
    "created_at" timestamp with time zone default now(),
    "created_by" uuid not null,
    "origin_template_id" uuid,
    "config" jsonb
);


alter table "public"."document_versions" enable row level security;

create table "public"."profiles" (
    "id" uuid not null,
    "email" text,
    "full_name" text,
    "avatar_url" text,
    "created_at" timestamp with time zone default now(),
    "updated_at" timestamp with time zone default now()
);


alter table "public"."profiles" enable row level security;

create table "public"."project_template_doc_templates" (
    "id" uuid not null default gen_random_uuid(),
    "project_template_id" uuid not null,
    "document_template_id" uuid not null,
    "sequence_order" integer not null default 1,
    "is_required" boolean not null default true,
    "created_at" timestamp with time zone default now(),
    "updated_at" timestamp with time zone default now()
);


alter table "public"."project_template_doc_templates" enable row level security;

create table "public"."project_templates" (
    "id" uuid not null default gen_random_uuid(),
    "name" text not null,
    "description" text,
    "created_at" timestamp with time zone default now(),
    "updated_at" timestamp with time zone default now()
);


alter table "public"."project_templates" enable row level security;

create table "public"."projects" (
    "id" uuid not null default gen_random_uuid(),
    "title" text not null,
    "type" text not null,
    "status" text not null default 'en-progreso'::text,
    "progress" integer not null default 0,
    "documents_count" integer not null default 0,
    "user_id" uuid not null,
    "created_at" timestamp with time zone default now(),
    "updated_at" timestamp with time zone default now(),
    "project_template_id" uuid,
    "description" text,
    "objectives" text
);


alter table "public"."projects" enable row level security;

CREATE UNIQUE INDEX document_completion_pkey ON public.document_completion USING btree (id);

CREATE UNIQUE INDEX document_embeddings_pkey ON public.document_embeddings USING btree (id);

CREATE UNIQUE INDEX document_templates_pkey ON public.document_templates USING btree (id);

CREATE UNIQUE INDEX document_versions_pkey ON public.document_versions USING btree (id);

CREATE INDEX idx_document_completion_project_id ON public.document_completion USING btree (project_id);

CREATE INDEX idx_document_templates_config ON public.document_templates USING gin (config);

CREATE INDEX idx_document_versions_project_id ON public.document_versions USING btree (project_id);

CREATE INDEX idx_project_template_docs_doc_id ON public.project_template_doc_templates USING btree (document_template_id);

CREATE INDEX idx_project_template_docs_template_id ON public.project_template_doc_templates USING btree (project_template_id);

CREATE UNIQUE INDEX profiles_pkey ON public.profiles USING btree (id);

CREATE UNIQUE INDEX project_template_doc_templates_pkey ON public.project_template_doc_templates USING btree (id);

CREATE UNIQUE INDEX project_templates_pkey ON public.project_templates USING btree (id);

CREATE UNIQUE INDEX projects_pkey ON public.projects USING btree (id);

alter table "public"."document_completion" add constraint "document_completion_pkey" PRIMARY KEY using index "document_completion_pkey";

alter table "public"."document_embeddings" add constraint "document_embeddings_pkey" PRIMARY KEY using index "document_embeddings_pkey";

alter table "public"."document_templates" add constraint "document_templates_pkey" PRIMARY KEY using index "document_templates_pkey";

alter table "public"."document_versions" add constraint "document_versions_pkey" PRIMARY KEY using index "document_versions_pkey";

alter table "public"."profiles" add constraint "profiles_pkey" PRIMARY KEY using index "profiles_pkey";

alter table "public"."project_template_doc_templates" add constraint "project_template_doc_templates_pkey" PRIMARY KEY using index "project_template_doc_templates_pkey";

alter table "public"."project_templates" add constraint "project_templates_pkey" PRIMARY KEY using index "project_templates_pkey";

alter table "public"."projects" add constraint "projects_pkey" PRIMARY KEY using index "projects_pkey";

alter table "public"."document_completion" add constraint "document_completion_completed_by_fkey" FOREIGN KEY (completed_by) REFERENCES profiles(id) not valid;

alter table "public"."document_completion" validate constraint "document_completion_completed_by_fkey";

alter table "public"."document_completion" add constraint "document_completion_document_template_id_fkey" FOREIGN KEY (document_template_id) REFERENCES document_templates(id) ON DELETE CASCADE not valid;

alter table "public"."document_completion" validate constraint "document_completion_document_template_id_fkey";

alter table "public"."document_completion" add constraint "document_completion_project_id_fkey" FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE not valid;

alter table "public"."document_completion" validate constraint "document_completion_project_id_fkey";

alter table "public"."document_embeddings" add constraint "document_embeddings_project_id_fkey" FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE not valid;

alter table "public"."document_embeddings" validate constraint "document_embeddings_project_id_fkey";

alter table "public"."document_templates" add constraint "document_templates_user_id_fkey" FOREIGN KEY (user_id) REFERENCES profiles(id) not valid;

alter table "public"."document_templates" validate constraint "document_templates_user_id_fkey";

alter table "public"."document_templates" add constraint "valid_content_format" CHECK (
CASE jsonb_typeof(content)
    WHEN 'object'::text THEN ((content ? 'time'::text) AND (content ? 'blocks'::text) AND (content ? 'version'::text) AND (jsonb_typeof((content -> 'blocks'::text)) = 'array'::text))
    ELSE false
END) not valid;

alter table "public"."document_templates" validate constraint "valid_content_format";

alter table "public"."document_versions" add constraint "document_versions_created_by_fkey" FOREIGN KEY (created_by) REFERENCES profiles(id) not valid;

alter table "public"."document_versions" validate constraint "document_versions_created_by_fkey";

alter table "public"."document_versions" add constraint "document_versions_origin_template_id_fkey" FOREIGN KEY (origin_template_id) REFERENCES document_templates(id) not valid;

alter table "public"."document_versions" validate constraint "document_versions_origin_template_id_fkey";

alter table "public"."document_versions" add constraint "document_versions_project_id_fkey" FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE not valid;

alter table "public"."document_versions" validate constraint "document_versions_project_id_fkey";

alter table "public"."profiles" add constraint "profiles_id_fkey" FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE not valid;

alter table "public"."profiles" validate constraint "profiles_id_fkey";

alter table "public"."project_template_doc_templates" add constraint "project_template_doc_templates_document_template_id_fkey" FOREIGN KEY (document_template_id) REFERENCES document_templates(id) ON DELETE CASCADE not valid;

alter table "public"."project_template_doc_templates" validate constraint "project_template_doc_templates_document_template_id_fkey";

alter table "public"."project_template_doc_templates" add constraint "project_template_doc_templates_project_template_id_fkey" FOREIGN KEY (project_template_id) REFERENCES project_templates(id) ON DELETE CASCADE not valid;

alter table "public"."project_template_doc_templates" validate constraint "project_template_doc_templates_project_template_id_fkey";

alter table "public"."projects" add constraint "projects_project_template_id_fkey" FOREIGN KEY (project_template_id) REFERENCES project_templates(id) not valid;

alter table "public"."projects" validate constraint "projects_project_template_id_fkey";

alter table "public"."projects" add constraint "projects_user_id_fkey" FOREIGN KEY (user_id) REFERENCES profiles(id) not valid;

alter table "public"."projects" validate constraint "projects_user_id_fkey";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.get_table_info()
 RETURNS TABLE(table_catalog text, table_schema text, table_name text, column_name text, data_type text, is_nullable text, column_default text, is_identity text)
 LANGUAGE sql
 SECURITY DEFINER
AS $function$
  select 
    table_catalog,
    table_schema,
    table_name,
    column_name,
    data_type,
    is_nullable,
    column_default,
    is_identity
  from information_schema.columns 
  where table_schema = 'public';
$function$
;

CREATE OR REPLACE FUNCTION public.handle_document_version()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
begin
  insert into document_versions (
    document_id,
    project_id,
    version_number,
    content,
    created_by
  )
  select
    new.document_id,
    new.project_id,
    coalesce(
      (
        select max(version_number) + 1
        from document_versions
        where document_id = new.document_id
      ),
      1
    ),
    new.content,
    auth.uid();
  return new;
end;
$function$
;

CREATE OR REPLACE FUNCTION public.handle_new_user()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
begin
  insert into public.profiles (id, email, full_name)
  values (new.id, new.email, new.raw_user_meta_data->>'full_name');
  return new;
end;
$function$
;

CREATE OR REPLACE FUNCTION public.handle_updated_at()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
begin
  new.updated_at = now();
  return new;
end;
$function$
;

CREATE OR REPLACE FUNCTION public.increment_documents_count(project_id uuid)
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
begin
  update projects
  set documents_count = documents_count + 1
  where id = project_id;
end;
$function$
;

grant delete on table "public"."document_completion" to "anon";

grant insert on table "public"."document_completion" to "anon";

grant references on table "public"."document_completion" to "anon";

grant select on table "public"."document_completion" to "anon";

grant trigger on table "public"."document_completion" to "anon";

grant truncate on table "public"."document_completion" to "anon";

grant update on table "public"."document_completion" to "anon";

grant delete on table "public"."document_completion" to "authenticated";

grant insert on table "public"."document_completion" to "authenticated";

grant references on table "public"."document_completion" to "authenticated";

grant select on table "public"."document_completion" to "authenticated";

grant trigger on table "public"."document_completion" to "authenticated";

grant truncate on table "public"."document_completion" to "authenticated";

grant update on table "public"."document_completion" to "authenticated";

grant delete on table "public"."document_completion" to "service_role";

grant insert on table "public"."document_completion" to "service_role";

grant references on table "public"."document_completion" to "service_role";

grant select on table "public"."document_completion" to "service_role";

grant trigger on table "public"."document_completion" to "service_role";

grant truncate on table "public"."document_completion" to "service_role";

grant update on table "public"."document_completion" to "service_role";

grant delete on table "public"."document_embeddings" to "anon";

grant insert on table "public"."document_embeddings" to "anon";

grant references on table "public"."document_embeddings" to "anon";

grant select on table "public"."document_embeddings" to "anon";

grant trigger on table "public"."document_embeddings" to "anon";

grant truncate on table "public"."document_embeddings" to "anon";

grant update on table "public"."document_embeddings" to "anon";

grant delete on table "public"."document_embeddings" to "authenticated";

grant insert on table "public"."document_embeddings" to "authenticated";

grant references on table "public"."document_embeddings" to "authenticated";

grant select on table "public"."document_embeddings" to "authenticated";

grant trigger on table "public"."document_embeddings" to "authenticated";

grant truncate on table "public"."document_embeddings" to "authenticated";

grant update on table "public"."document_embeddings" to "authenticated";

grant delete on table "public"."document_embeddings" to "service_role";

grant insert on table "public"."document_embeddings" to "service_role";

grant references on table "public"."document_embeddings" to "service_role";

grant select on table "public"."document_embeddings" to "service_role";

grant trigger on table "public"."document_embeddings" to "service_role";

grant truncate on table "public"."document_embeddings" to "service_role";

grant update on table "public"."document_embeddings" to "service_role";

grant delete on table "public"."document_templates" to "anon";

grant insert on table "public"."document_templates" to "anon";

grant references on table "public"."document_templates" to "anon";

grant select on table "public"."document_templates" to "anon";

grant trigger on table "public"."document_templates" to "anon";

grant truncate on table "public"."document_templates" to "anon";

grant update on table "public"."document_templates" to "anon";

grant delete on table "public"."document_templates" to "authenticated";

grant insert on table "public"."document_templates" to "authenticated";

grant references on table "public"."document_templates" to "authenticated";

grant select on table "public"."document_templates" to "authenticated";

grant trigger on table "public"."document_templates" to "authenticated";

grant truncate on table "public"."document_templates" to "authenticated";

grant update on table "public"."document_templates" to "authenticated";

grant delete on table "public"."document_templates" to "service_role";

grant insert on table "public"."document_templates" to "service_role";

grant references on table "public"."document_templates" to "service_role";

grant select on table "public"."document_templates" to "service_role";

grant trigger on table "public"."document_templates" to "service_role";

grant truncate on table "public"."document_templates" to "service_role";

grant update on table "public"."document_templates" to "service_role";

grant delete on table "public"."document_versions" to "anon";

grant insert on table "public"."document_versions" to "anon";

grant references on table "public"."document_versions" to "anon";

grant select on table "public"."document_versions" to "anon";

grant trigger on table "public"."document_versions" to "anon";

grant truncate on table "public"."document_versions" to "anon";

grant update on table "public"."document_versions" to "anon";

grant delete on table "public"."document_versions" to "authenticated";

grant insert on table "public"."document_versions" to "authenticated";

grant references on table "public"."document_versions" to "authenticated";

grant select on table "public"."document_versions" to "authenticated";

grant trigger on table "public"."document_versions" to "authenticated";

grant truncate on table "public"."document_versions" to "authenticated";

grant update on table "public"."document_versions" to "authenticated";

grant delete on table "public"."document_versions" to "service_role";

grant insert on table "public"."document_versions" to "service_role";

grant references on table "public"."document_versions" to "service_role";

grant select on table "public"."document_versions" to "service_role";

grant trigger on table "public"."document_versions" to "service_role";

grant truncate on table "public"."document_versions" to "service_role";

grant update on table "public"."document_versions" to "service_role";

grant delete on table "public"."profiles" to "anon";

grant insert on table "public"."profiles" to "anon";

grant references on table "public"."profiles" to "anon";

grant select on table "public"."profiles" to "anon";

grant trigger on table "public"."profiles" to "anon";

grant truncate on table "public"."profiles" to "anon";

grant update on table "public"."profiles" to "anon";

grant delete on table "public"."profiles" to "authenticated";

grant insert on table "public"."profiles" to "authenticated";

grant references on table "public"."profiles" to "authenticated";

grant select on table "public"."profiles" to "authenticated";

grant trigger on table "public"."profiles" to "authenticated";

grant truncate on table "public"."profiles" to "authenticated";

grant update on table "public"."profiles" to "authenticated";

grant delete on table "public"."profiles" to "service_role";

grant insert on table "public"."profiles" to "service_role";

grant references on table "public"."profiles" to "service_role";

grant select on table "public"."profiles" to "service_role";

grant trigger on table "public"."profiles" to "service_role";

grant truncate on table "public"."profiles" to "service_role";

grant update on table "public"."profiles" to "service_role";

grant delete on table "public"."project_template_doc_templates" to "anon";

grant insert on table "public"."project_template_doc_templates" to "anon";

grant references on table "public"."project_template_doc_templates" to "anon";

grant select on table "public"."project_template_doc_templates" to "anon";

grant trigger on table "public"."project_template_doc_templates" to "anon";

grant truncate on table "public"."project_template_doc_templates" to "anon";

grant update on table "public"."project_template_doc_templates" to "anon";

grant delete on table "public"."project_template_doc_templates" to "authenticated";

grant insert on table "public"."project_template_doc_templates" to "authenticated";

grant references on table "public"."project_template_doc_templates" to "authenticated";

grant select on table "public"."project_template_doc_templates" to "authenticated";

grant trigger on table "public"."project_template_doc_templates" to "authenticated";

grant truncate on table "public"."project_template_doc_templates" to "authenticated";

grant update on table "public"."project_template_doc_templates" to "authenticated";

grant delete on table "public"."project_template_doc_templates" to "service_role";

grant insert on table "public"."project_template_doc_templates" to "service_role";

grant references on table "public"."project_template_doc_templates" to "service_role";

grant select on table "public"."project_template_doc_templates" to "service_role";

grant trigger on table "public"."project_template_doc_templates" to "service_role";

grant truncate on table "public"."project_template_doc_templates" to "service_role";

grant update on table "public"."project_template_doc_templates" to "service_role";

grant delete on table "public"."project_templates" to "anon";

grant insert on table "public"."project_templates" to "anon";

grant references on table "public"."project_templates" to "anon";

grant select on table "public"."project_templates" to "anon";

grant trigger on table "public"."project_templates" to "anon";

grant truncate on table "public"."project_templates" to "anon";

grant update on table "public"."project_templates" to "anon";

grant delete on table "public"."project_templates" to "authenticated";

grant insert on table "public"."project_templates" to "authenticated";

grant references on table "public"."project_templates" to "authenticated";

grant select on table "public"."project_templates" to "authenticated";

grant trigger on table "public"."project_templates" to "authenticated";

grant truncate on table "public"."project_templates" to "authenticated";

grant update on table "public"."project_templates" to "authenticated";

grant delete on table "public"."project_templates" to "service_role";

grant insert on table "public"."project_templates" to "service_role";

grant references on table "public"."project_templates" to "service_role";

grant select on table "public"."project_templates" to "service_role";

grant trigger on table "public"."project_templates" to "service_role";

grant truncate on table "public"."project_templates" to "service_role";

grant update on table "public"."project_templates" to "service_role";

grant delete on table "public"."projects" to "anon";

grant insert on table "public"."projects" to "anon";

grant references on table "public"."projects" to "anon";

grant select on table "public"."projects" to "anon";

grant trigger on table "public"."projects" to "anon";

grant truncate on table "public"."projects" to "anon";

grant update on table "public"."projects" to "anon";

grant delete on table "public"."projects" to "authenticated";

grant insert on table "public"."projects" to "authenticated";

grant references on table "public"."projects" to "authenticated";

grant select on table "public"."projects" to "authenticated";

grant trigger on table "public"."projects" to "authenticated";

grant truncate on table "public"."projects" to "authenticated";

grant update on table "public"."projects" to "authenticated";

grant delete on table "public"."projects" to "service_role";

grant insert on table "public"."projects" to "service_role";

grant references on table "public"."projects" to "service_role";

grant select on table "public"."projects" to "service_role";

grant trigger on table "public"."projects" to "service_role";

grant truncate on table "public"."projects" to "service_role";

grant update on table "public"."projects" to "service_role";

create policy "Users can insert their own document completion status"
on "public"."document_completion"
as permissive
for insert
to authenticated
with check ((auth.uid() IN ( SELECT projects.user_id
   FROM projects
  WHERE (projects.id = document_completion.project_id))));


create policy "Users can update their own document completion status"
on "public"."document_completion"
as permissive
for update
to authenticated
using ((auth.uid() IN ( SELECT projects.user_id
   FROM projects
  WHERE (projects.id = document_completion.project_id))))
with check ((auth.uid() IN ( SELECT projects.user_id
   FROM projects
  WHERE (projects.id = document_completion.project_id))));


create policy "Users can view their own document completion status"
on "public"."document_completion"
as permissive
for select
to authenticated
using ((auth.uid() IN ( SELECT projects.user_id
   FROM projects
  WHERE (projects.id = document_completion.project_id))));


create policy "Users can create their own document embeddings"
on "public"."document_embeddings"
as permissive
for insert
to authenticated
with check ((auth.uid() IN ( SELECT projects.user_id
   FROM projects
  WHERE (projects.id = document_embeddings.project_id))));


create policy "Users can delete their own document embeddings"
on "public"."document_embeddings"
as permissive
for delete
to authenticated
using ((auth.uid() IN ( SELECT projects.user_id
   FROM projects
  WHERE (projects.id = document_embeddings.project_id))));


create policy "Users can update their own document embeddings"
on "public"."document_embeddings"
as permissive
for update
to authenticated
using ((auth.uid() IN ( SELECT projects.user_id
   FROM projects
  WHERE (projects.id = document_embeddings.project_id))));


create policy "Users can view their own document embeddings"
on "public"."document_embeddings"
as permissive
for select
to authenticated
using ((auth.uid() IN ( SELECT projects.user_id
   FROM projects
  WHERE (projects.id = document_embeddings.project_id))));


create policy "Users can create their own templates"
on "public"."document_templates"
as permissive
for insert
to authenticated
with check ((auth.uid() = user_id));


create policy "Users can delete their own templates"
on "public"."document_templates"
as permissive
for delete
to authenticated
using ((auth.uid() = user_id));


create policy "Users can update their own templates"
on "public"."document_templates"
as permissive
for update
to authenticated
using ((auth.uid() = user_id));


create policy "Users can view their own templates"
on "public"."document_templates"
as permissive
for select
to authenticated
using ((auth.uid() = user_id));


create policy "Users can create document versions for their projects"
on "public"."document_versions"
as permissive
for insert
to authenticated
with check ((auth.uid() IN ( SELECT p.user_id
   FROM projects p
  WHERE (p.id = document_versions.project_id))));


create policy "Users can delete document versions of their projects"
on "public"."document_versions"
as permissive
for delete
to authenticated
using ((auth.uid() IN ( SELECT p.user_id
   FROM projects p
  WHERE (p.id = document_versions.project_id))));


create policy "Users can update document versions of their projects"
on "public"."document_versions"
as permissive
for update
to authenticated
using ((auth.uid() IN ( SELECT p.user_id
   FROM projects p
  WHERE (p.id = document_versions.project_id))))
with check ((auth.uid() IN ( SELECT p.user_id
   FROM projects p
  WHERE (p.id = document_versions.project_id))));


create policy "Users can view document versions of their projects"
on "public"."document_versions"
as permissive
for select
to authenticated
using ((auth.uid() IN ( SELECT p.user_id
   FROM projects p
  WHERE (p.id = document_versions.project_id))));


create policy "Users can update own profile"
on "public"."profiles"
as permissive
for update
to public
using ((auth.uid() = id));


create policy "Users can view own profile"
on "public"."profiles"
as permissive
for select
to public
using ((auth.uid() = id));


create policy "Users can view project template doc templates"
on "public"."project_template_doc_templates"
as permissive
for select
to authenticated
using (true);


create policy "Users can view project templates"
on "public"."project_templates"
as permissive
for select
to authenticated
using (true);


create policy "Users can create their own projects"
on "public"."projects"
as permissive
for insert
to authenticated
with check ((auth.uid() = user_id));


create policy "Users can delete their own projects"
on "public"."projects"
as permissive
for delete
to authenticated
using ((auth.uid() = user_id));


create policy "Users can update their own projects"
on "public"."projects"
as permissive
for update
to authenticated
using ((auth.uid() = user_id));


create policy "Users can view their own projects"
on "public"."projects"
as permissive
for select
to authenticated
using ((auth.uid() = user_id));


CREATE TRIGGER handle_document_completion_updated_at BEFORE UPDATE ON public.document_completion FOR EACH ROW EXECUTE FUNCTION handle_updated_at();

CREATE TRIGGER handle_embeddings_updated_at BEFORE UPDATE ON public.document_embeddings FOR EACH ROW EXECUTE FUNCTION handle_updated_at();

CREATE TRIGGER on_document_update AFTER INSERT OR UPDATE ON public.document_embeddings FOR EACH ROW EXECUTE FUNCTION handle_document_version();

CREATE TRIGGER handle_templates_updated_at BEFORE UPDATE ON public.document_templates FOR EACH ROW EXECUTE FUNCTION handle_updated_at();

CREATE TRIGGER handle_project_template_docs_updated_at BEFORE UPDATE ON public.project_template_doc_templates FOR EACH ROW EXECUTE FUNCTION handle_updated_at();

CREATE TRIGGER handle_project_templates_updated_at BEFORE UPDATE ON public.project_templates FOR EACH ROW EXECUTE FUNCTION handle_updated_at();

CREATE TRIGGER handle_projects_updated_at BEFORE UPDATE ON public.projects FOR EACH ROW EXECUTE FUNCTION handle_updated_at();


