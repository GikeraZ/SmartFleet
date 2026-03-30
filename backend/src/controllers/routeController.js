const { Route, Driver, Bus } = require('../models');
const { Op } = require('sequelize');

const getAllRoutes = async (req, res) => {
  try {
    const { page = 1, limit = 10, search, shift, status } = req.query;
    const offset = (page - 1) * limit;

    const where = {};
    if (search) {
      where[Op.or] = [
        { name: { [Op.like]: `%${search}%` } },
        { origin: { [Op.like]: `%${search}%` } },
        { destination: { [Op.like]: `%${search}%` } }
      ];
    }
    if (shift) where.shift = shift;
    if (status) where.status = status;

    const { count, rows } = await Route.findAndCountAll({
      where,
      include: [
        { model: Driver, as: 'driver' },
        { model: Bus, as: 'bus' }
      ],
      limit: parseInt(limit),
      offset,
      order: [['created_at', 'DESC']]
    });

    res.json({
      success: true,
      data: {
        routes: rows,
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
      message: 'Error fetching routes'
    });
  }
};

const getRouteById = async (req, res) => {
  try {
    const route = await Route.findByPk(req.params.id, {
      include: [
        { model: Driver, as: 'driver' },
        { model: Bus, as: 'bus' }
      ]
    });

    if (!route) {
      return res.status(404).json({
        success: false,
        message: 'Route not found'
      });
    }

    res.json({
      success: true,
      data: route
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching route'
    });
  }
};

const createRoute = async (req, res) => {
  try {
    const route = await Route.create(req.body);
    res.status(201).json({
      success: true,
      message: 'Route created successfully',
      data: route
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating route'
    });
  }
};

const updateRoute = async (req, res) => {
  try {
    const route = await Route.findByPk(req.params.id);
    if (!route) {
      return res.status(404).json({
        success: false,
        message: 'Route not found'
      });
    }

    await route.update(req.body);

    res.json({
      success: true,
      message: 'Route updated successfully',
      data: route
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating route'
    });
  }
};

const deleteRoute = async (req, res) => {
  try {
    const route = await Route.findByPk(req.params.id);
    if (!route) {
      return res.status(404).json({
        success: false,
        message: 'Route not found'
      });
    }

    await route.destroy();

    res.json({
      success: true,
      message: 'Route deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting route'
    });
  }
};

module.exports = {
  getAllRoutes,
  getRouteById,
  createRoute,
  updateRoute,
  deleteRoute
};
