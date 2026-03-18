-- Super Admin manages everyone
INSERT INTO role_manage_rules(manager_role_id,target_role_id)
VALUES
(1,2),
(1,3),
(1,4),
(1,5);

-- Admin manages HR Admin, Manager, Employee
INSERT INTO role_manage_rules(manager_role_id,target_role_id)
VALUES
(2,3),
(2,4),
(2,5);

-- HR Admin manages Manager and Employee
INSERT INTO role_manage_rules(manager_role_id,target_role_id)
VALUES
(3,4),
(3,5);

-- Manager manages Employee
INSERT INTO role_manage_rules(manager_role_id,target_role_id)
VALUES
(4,5);