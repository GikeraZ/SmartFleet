const { User, Role } = require('../models');
const { Op } = require('sequelize');

const getAllUsers = async (req, res) => {
  try {
    const { page = 1, limit = 10, search, role, status } = req.query;
    const offset = (page - 1) * limit;

    const where = {};
    if (search) {
      where[Op.or] = [
        { name: { [Op.like]: `%${search}%` } },
        { email: { [Op.like]: `%${search}%` } }
      ];
    }
    if (role) where.role_id = role;
    if (status) where.status = status;

    const { count, rows } = await User.findAndCountAll({
      where,
      include: [{ model: Role, as: 'role' }],
      limit: parseInt(limit),
      offset,
      order: [['created_at', 'DESC']]
    });

    res.json({
      success: true,
      data: {
        users: rows.map(u => u.toJSON()),
        pagination: {
          total: count,
          page: parseInt(page),
          limit: parseInt(limit),
          pages: Math.ceil(count / limit)
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching users'
    });
  }
};

const getUserById = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id, {
      include: [{ model: Role, as: 'role' }]
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      data: user.toJSON()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching user'
    });
  }
};

const createUser = async (req, res) => {
  try {
    const user = await User.create(req.body);
    const userWithRole = await User.findByPk(user.id, {
      include: [{ model: Role, as: 'role' }]
    });

    res.status(201).json({
      success: true,
      message: 'User created successfully',
      data: userWithRole.toJSON()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating user'
    });
  }
};

const updateUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    await user.update(req.body);
    const updatedUser = await User.findByPk(user.id, {
      include: [{ model: Role, as: 'role' }]
    });

    res.json({
      success: true,
      message: 'User updated successfully',
      data: updatedUser.toJSON()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating user'
    });
  }
};

const deleteUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    if (user.id === req.user.id) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete your own account'
      });
    }

    await user.destroy();

    res.json({
      success: true,
      message: 'User deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting user'
    });
  }
};

const getRoles = async (req, res) => {
  try {
    const roles = await Role.findAll();
    res.json({
      success: true,
      data: roles
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching roles'
    });
  }
};

module.exports = {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  getRoles
};
