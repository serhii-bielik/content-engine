-- DropIndex
CREATE EXTENSION IF NOT EXISTS pg_trgm;
CREATE INDEX material_title_trgm_idx ON "Material" 
USING GIN(title gin_trgm_ops);
