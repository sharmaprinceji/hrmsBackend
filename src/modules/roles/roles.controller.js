import RoleService from "./roles.service.js";

export const createRole = async (req, res) => {
  try {
    const { name, description, permissions } = req.body;

    const role = await RoleService.createRole({
      name,
      description,
      permissions,
    });

    res.status(201).json({
      success: true,
      data: role,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getAllRoles = async (req, res) => {
  try {
    const roles = await RoleService.getAllRoles();

    res.json({
      success: true,
      data: roles,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};