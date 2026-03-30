const { Vehicle, ServiceRecord, User } = require('../models');
const { Op } = require('sequelize');

const getAllVehicles = async (req, res) => {
  try {
    const { page = 1, limit = 10, search, status } = req.query;
    const offset = (page - 1) * limit;

    const where = {};
    if (search) {
      where[Op.or] = [
        { registration_number: { [Op.like]: `%${search}%` } },
        { client_name: { [Op.like]: `%${search}%` } },
        { make: { [Op.like]: `%${search}%` } },
        { model: { [Op.like]: `%${search}%` } }
      ];
    }
    if (status) where.status = status;

    const { count, rows } = await Vehicle.findAndCountAll({
      where,
      include: [{ model: ServiceRecord, as: 'serviceRecords' }],
      limit: parseInt(limit),
      offset,
      order: [['created_at', 'DESC']]
    });

    res.json({
      success: true,
      data: {
        vehicles: rows,
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
      message: 'Error fetching vehicles'
    });
  }
};

const getVehicleById = async (req, res) => {
  try {
    const vehicle = await Vehicle.findByPk(req.params.id, {
      include: [{ model: ServiceRecord, as: 'serviceRecords' }]
    });

    if (!vehicle) {
      return res.status(404).json({
        success: false,
        message: 'Vehicle not found'
      });
    }

    res.json({
      success: true,
      data: vehicle
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching vehicle'
    });
  }
};

const createVehicle = async (req, res) => {
  try {
    const vehicle = await Vehicle.create(req.body);
    res.status(201).json({
      success: true,
      message: 'Vehicle created successfully',
      data: vehicle
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating vehicle'
    });
  }
};

const updateVehicle = async (req, res) => {
  try {
    const vehicle = await Vehicle.findByPk(req.params.id);
    if (!vehicle) {
      return res.status(404).json({
        success: false,
        message: 'Vehicle not found'
      });
    }

    await vehicle.update(req.body);

    res.json({
      success: true,
      message: 'Vehicle updated successfully',
      data: vehicle
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating vehicle'
    });
  }
};

const deleteVehicle = async (req, res) => {
  try {
    const vehicle = await Vehicle.findByPk(req.params.id);
    if (!vehicle) {
      return res.status(404).json({
        success: false,
        message: 'Vehicle not found'
      });
    }

    await vehicle.destroy();

    res.json({
      success: true,
      message: 'Vehicle deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting vehicle'
    });
  }
};

module.exports = {
  getAllVehicles,
  getVehicleById,
  createVehicle,
  updateVehicle,
  deleteVehicle
};
