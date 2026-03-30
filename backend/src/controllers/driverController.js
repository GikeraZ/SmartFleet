const { Driver, Bus } = require('../models');
const { Op } = require('sequelize');

const getAllDrivers = async (req, res) => {
  try {
    const { page = 1, limit = 10, search, status } = req.query;
    const offset = (page - 1) * limit;

    const where = {};
    if (search) {
      where[Op.or] = [
        { name: { [Op.like]: `%${search}%` } },
        { license_number: { [Op.like]: `%${search}%` } }
      ];
    }
    if (status) where.status = status;

    const { count, rows } = await Driver.findAndCountAll({
      where,
      include: [{ model: Bus, as: 'bus' }],
      limit: parseInt(limit),
      offset,
      order: [['created_at', 'DESC']]
    });

    res.json({
      success: true,
      data: {
        drivers: rows,
        pagination: {
          total: count,
          page: parseInt(page),
          limit: parseInt(limit),
          pages: Math.ceil(count / limit)
        }
      }
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching drivers'
    });
  }
};

const getDriverById = async (req, res) => {
  try {
    const driver = await Driver.findByPk(req.params.id, {
      include: [{ model: Bus, as: 'bus' }]
    });

    if (!driver) {
      return res.status(404).json({
        success: false,
        message: 'Driver not found'
      });
    }

    res.json({
      success: true,
      data: driver
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching driver'
    });
  }
};

const createDriver = async (req, res) => {
  try {
    const driver = await Driver.create(req.body);
    res.status(201).json({
      success: true,
      message: 'Driver created successfully',
      data: driver
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating driver'
    });
  }
};

const updateDriver = async (req, res) => {
  try {
    const driver = await Driver.findByPk(req.params.id);
    if (!driver) {
      return res.status(404).json({
        success: false,
        message: 'Driver not found'
      });
    }

    await driver.update(req.body);

    res.json({
      success: true,
      message: 'Driver updated successfully',
      data: driver
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating driver'
    });
  }
};

const deleteDriver = async (req, res) => {
  try {
    const driver = await Driver.findByPk(req.params.id);
    if (!driver) {
      return res.status(404).json({
        success: false,
        message: 'Driver not found'
      });
    }

    await driver.destroy();

    res.json({
      success: true,
      message: 'Driver deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting driver'
    });
  }
};

module.exports = {
  getAllDrivers,
  getDriverById,
  createDriver,
  updateDriver,
  deleteDriver
};
