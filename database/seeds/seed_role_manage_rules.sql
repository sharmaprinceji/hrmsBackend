-- -- Super Admin manages everyone
-- INSERT INTO role_manage_rules(manager_role_id,target_role_id)
-- VALUES
-- (1,2),
-- (1,3),
-- (1,4),
-- (1,5);

-- -- Admin manages HR Admin, Manager, Employee
-- INSERT INTO role_manage_rules(manager_role_id,target_role_id)
-- VALUES
-- (2,3),
-- (2,4),
-- (2,5);

-- -- HR Admin manages Manager and Employee
-- INSERT INTO role_manage_rules(manager_role_id,target_role_id)
-- VALUES
-- (3,4),
-- (3,5);

-- -- Manager manages Employee
-- INSERT INTO role_manage_rules(manager_role_id,target_role_id)
-- VALUES
-- (4,5);

INSERT IGNORE INTO role_manage_rules(manager_role_id,target_role_id)
SELECT r1.id, r2.id
FROM roles r1, roles r2
WHERE r1.name='Super Admin'
AND r2.name IN ('Admin','HR Admin','Manager','Employee');

-- Admin manages others
INSERT IGNORE INTO role_manage_rules(manager_role_id,target_role_id)
SELECT r1.id, r2.id
FROM roles r1, roles r2
WHERE r1.name='Admin'
AND r2.name IN ('HR Admin','Manager','Employee');

-- HR Admin manages Manager & Employee
INSERT IGNORE INTO role_manage_rules(manager_role_id,target_role_id)
SELECT r1.id, r2.id
FROM roles r1, roles r2
WHERE r1.name='HR Admin'
AND r2.name IN ('Manager','Employee');

-- Manager manages Employee
INSERT IGNORE INTO role_manage_rules(manager_role_id,target_role_id)
SELECT r1.id, r2.id
FROM roles r1, roles r2
WHERE r1.name='Manager'
AND r2.name='Employee';