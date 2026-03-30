const { Bus, Driver, Route } = require('../models');
const { Op } = require('sequelize');

const getAllBuses = async (req, res) => {
  try {
    const { page = 1, limit = 10, search, status } = req.query;
    const offset = (page - 1) * limit;

    const where = {};
    if (search) {
      where[Op.or] = [
        { plate_number: { [Op.like]: `%${search}%` } },
        { model: { [Op.like]: `%${search}%` } }
      ];
    }
    if (status) where.status = status;

    const { count, rows } = await Bus.findAndCountAll({
      where,
      include: [
        { model: Driver, as: 'drivers' },
        { model: Route, as: 'routes' }
      ],
      limit: parseInt(limit),
      offset,
      order: [['created_at', 'DESC']]
    });

    res.json({
      success: true,
      data: {
        buses: rows,
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
      message: 'Error fetching buses'
    });
  }
};

const getBusById = async (req, res) => {
  try {
    const bus = await Bus.findByPk(req.params.id, {
      include: [
        { model: Driver, as: 'drivers' },
        { model: Route, as: 'routes' }
      ]
    });

    if (!bus) {
      return res.status(404).json({
        success: false,
        message: 'Bus not found'
      });
    }

    res.json({
      success: true,
      data: bus
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching bus'
    });
  }
};

const createBus = async (req, res) => {
  try {
    const bus = await Bus.create(req.body);
    res.status(201).json({
      success: true,
      message: 'Bus created successfully',
      data: bus
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating bus'
    });
  }
};

const updateBus = async (req, res) => {
  try {
    const bus = await Bus.findByPk(req.params.id);
    if (!bus) {
      return res.status(404).json({
        success: false,
        message: 'Bus not found'
      });
    }

    await bus.update(req.body);

    res.json({
      success: true,
      message: 'Bus updated successfully',
      data: bus
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating bus'
    });
  }
};

const deleteBus = async (req, res) => {
  try {
    const bus = await Bus.findByPk(req.params.id);
    if (!bus) {
      return res.status(404).json({
        success: false,
        message: 'Bus not found'
      });
    }

    await bus.destroy();

    res.json({
      success: true,
      message: 'Bus deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting bus'
    });
  }
};

const getBusStats = async (req, res) => {
  try {
    const stats = await Bus.findAll({
      attributes: [
        'status',
        [require('sequelize').fn('COUNT', require('sequelize').col('id')), 'count']
      ],
      group: ['status']
    });

    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching bus stats'
    });
  }
};

module.exports = {
  getAllBuses,
  getBusById,
  createBus,
  updateBus,
  deleteBus,
  getBusStats
};
