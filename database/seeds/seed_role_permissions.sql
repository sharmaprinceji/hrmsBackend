-- -- Super Admin → all permissions
-- INSERT INTO role_permissions(role_id,permission_id)
-- SELECT 1,id FROM permissions;

-- -- Admin → most modules
-- INSERT INTO role_permissions(role_id,permission_id)
-- SELECT 2,id FROM permissions;

-- -- HR Admin
-- INSERT INTO role_permissions(role_id,permission_id)
-- SELECT 3,id FROM permissions
-- WHERE module IN ('employee','leave','attendance','task','payroll','holiday','department');

-- -- Manager
-- INSERT INTO role_permissions(role_id,permission_id)
-- SELECT 4,id FROM permissions
-- WHERE
--   (module='employee' AND action IN ('view','update')) OR
--   (module='attendance') OR
--   (module='leave') OR
--   (module='task') OR
--   (module='holiday' AND action='view');

-- -- Employee
-- INSERT INTO role_permissions(role_id,permission_id)
-- SELECT 5,id FROM permissions
-- WHERE
--   (module='employee' AND action IN ('view','update')) OR
--   (module='task' AND action IN ('view','update')) OR
--   (module='leave' AND action IN ('apply','view')) OR
--   (module='attendance' AND action='view') OR
--   (module='holiday' AND action='view');



INSERT IGNORE INTO role_permissions(role_id,permission_id)
SELECT r.id, p.id
FROM roles r, permissions p
WHERE r.name='Super Admin';

-- Admin → all permissions
INSERT IGNORE INTO role_permissions(role_id,permission_id)
SELECT r.id, p.id
FROM roles r, permissions p
WHERE r.name='Admin';

-- HR Admin
INSERT IGNORE INTO role_permissions(role_id,permission_id)
SELECT r.id, p.id
FROM roles r, permissions p
WHERE r.name='HR Admin'
AND p.module IN ('employee','leave','attendance','task','payroll','holiday','department');

-- Manager
INSERT IGNORE INTO role_permissions(role_id,permission_id)
SELECT r.id, p.id
FROM roles r, permissions p
WHERE r.name='Manager'
AND (
  (p.module='employee' AND p.action IN ('view','update')) OR
  (p.module='attendance') OR
  (p.module='leave') OR
  (p.module='task') OR
  (p.module='holiday' AND p.action='view')
);

-- Employee
INSERT IGNORE INTO role_permissions(role_id,permission_id)
SELECT r.id, p.id
FROM roles r, permissions p
WHERE r.name='Employee'
AND (
  (p.module='employee' AND p.action IN ('view','update')) OR
  (p.module='task' AND p.action IN ('view','update')) OR
  (p.module='leave' AND p.action IN ('apply','view')) OR
  (p.module='attendance' AND p.action='view') OR
  (p.module='holiday' AND p.action='view')
);