-- Super Admin → all permissions
INSERT INTO role_permissions(role_id,permission_id)
SELECT 1,id FROM permissions;

-- Admin → most modules
INSERT INTO role_permissions(role_id,permission_id)
SELECT 2,id FROM permissions;

-- HR Admin
INSERT INTO role_permissions(role_id,permission_id)
SELECT 3,id FROM permissions
WHERE module IN ('employee','leave','attendance','task','payroll','holiday','department');

-- Manager
INSERT INTO role_permissions(role_id,permission_id)
SELECT 4,id FROM permissions
WHERE
  (module='employee' AND action IN ('view','update')) OR
  (module='attendance') OR
  (module='leave') OR
  (module='task') OR
  (module='holiday' AND action='view');

-- Employee
INSERT INTO role_permissions(role_id,permission_id)
SELECT 5,id FROM permissions
WHERE
  (module='employee' AND action IN ('view','update')) OR
  (module='task' AND action IN ('view','update')) OR
  (module='leave' AND action IN ('apply','view')) OR
  (module='attendance' AND action='view') OR
  (module='holiday' AND action='view');