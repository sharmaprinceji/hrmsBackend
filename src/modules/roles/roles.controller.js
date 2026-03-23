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

export const updateRole = async (req, res) => {
  try {
    const role = await RoleService.updateRole(
      req.params.id,
      req.body
    );

    res.json({ success: true, data: role });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const deleteRole = async (req, res) => {
  try {
    await RoleService.deleteRole(req.params.id);

    res.json({
      success: true,
      message: "Role deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};