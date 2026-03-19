-- Super Admin → all permissions
INSERT INTO role_permissions(role_id,permission_id)
SELECT 1,id FROM permissions;

-- Admin → most modules
INSERT INTO role_permissions(role_id,permission_id)
SELECT 2,id FROM permissions
WHERE module IN ('employee','department','leave','attendance','task','payroll');

-- HR Admin
INSERT INTO role_permissions(role_id,permission_id)
SELECT 3,id FROM permissions
WHERE module IN ('employee','leave','attendance','task','payroll');

-- Manager
INSERT INTO role_permissions(role_id,permission_id)
SELECT 4,id FROM permissions
WHERE module IN ('employee','attendance','task');

-- Employee
INSERT INTO role_permissions(role_id,permission_id)
SELECT 5,id FROM permissions
WHERE module='employee' AND action IN ('view','update');