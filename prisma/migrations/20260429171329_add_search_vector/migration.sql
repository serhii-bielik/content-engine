-- Добавляем колонку для хранения поискового вектора
ALTER TABLE "Material" ADD COLUMN "searchVector" tsvector;

-- Создаём индекс для быстрого поиска
CREATE INDEX material_search_idx ON "Material" USING GIN("searchVector");

-- Функция обновления вектора
CREATE OR REPLACE FUNCTION update_material_search_vector()
RETURNS trigger AS $$
BEGIN
  NEW."searchVector" := 
    setweight(to_tsvector('russian', coalesce(NEW.title, '')), 'A') ||
    setweight(to_tsvector('russian', coalesce(NEW.description, '')), 'B');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Триггер — вызывается автоматически при INSERT и UPDATE
CREATE TRIGGER material_search_vector_update
  BEFORE INSERT OR UPDATE ON "Material"
  FOR EACH ROW EXECUTE FUNCTION update_material_search_vector();

-- Заполняем вектор для существующих записей
UPDATE "Material" SET title = title;