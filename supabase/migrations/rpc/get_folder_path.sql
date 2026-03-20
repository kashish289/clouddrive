-- Add to 001_create_schema.sql at end
CREATE OR REPLACE FUNCTION get_folder_path(folder_id UUID)
RETURNS TABLE (
  id UUID,
  name TEXT,
  depth INTEGER
) AS $$
BEGIN
  RETURN QUERY
  WITH RECURSIVE folder_path AS (
    SELECT id, name, 0 as depth
    FROM folders 
    WHERE id = folder_id AND NOT is_deleted
    
    UNION ALL
    
    SELECT f.id, f.name, fp.depth + 1
    FROM folders f
    JOIN folder_path fp ON f.id = fp.parent_id
    WHERE NOT f.is_deleted
  )
  SELECT * FROM folder_path ORDER BY depth;
END;
$$ LANGUAGE plpgsql;
