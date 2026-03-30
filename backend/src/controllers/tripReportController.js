const { TripReport, Driver, Bus } = require('../models');
const { Op } = require('sequelize');

const createTripReport = async (req, res) => {
  try {
    const { farm_name, trip_date, departure_time, arrival_time, bus_condition_before, bus_condition_after, fuel_before, fuel_after } = req.body;

    const driver = await Driver.findOne({ where: { user_id: req.user.id } });
    
    let busId = null;
    if (driver && driver.bus_id) {
      busId = driver.bus_id;
    }

    const tripReport = await TripReport.create({
      driver_id: driver ? driver.id : req.user.id,
      bus_id: busId,
      farm_name,
      trip_date,
      departure_time,
      arrival_time,
      bus_condition_before,
      bus_condition_after,
      fuel_before,
      fuel_after,
      status: 'completed'
    });

    res.status(201).json({
      success: true,
      message: 'Trip report submitted successfully',
      data: tripReport
    });
  } catch (error) {
    console.error('Error creating trip report:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating trip report'
    });
  }
};

const getMyTripReports = async (req, res) => {
  try {
    const driver = await Driver.findOne({ where: { user_id: req.user.id } });
    
    if (!driver) {
      return res.status(404).json({
        success: false,
        message: 'Driver profile not found'
      });
    }

    const reports = await TripReport.findAll({
      where: { driver_id: driver.id },
      include: [
        { model: Bus, as: 'bus' }
      ],
      order: [['created_at', 'DESC']]
    });

    res.json({
      success: true,
      data: reports
    });
  } catch (error) {
    console.error('Error fetching trip reports:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching trip reports'
    });
  }
};

const getAllTripReports = async (req, res) => {
  try {
    const { page = 1, limit = 10, search, startDate, endDate } = req.query;
    const offset = (page - 1) * limit;

    const where = {};
    if (search) {
      where[Op.or] = [
        { farm_name: { [Op.like]: `%${search}%` } }
      ];
    }
    if (startDate && endDate) {
      where.trip_date = { [Op.between]: [startDate, endDate] };
    }

    const { count, rows } = await TripReport.findAndCountAll({
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
        reports: rows,
        pagination: {
          total: count,
          page: parseInt(page),
          limit: parseInt(limit),
          pages: Math.ceil(count / limit)
        }
      }
    });
  } catch (error) {
    console.error('Error fetching trip reports:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching trip reports'
    });
  }
};

const getTripReportById = async (req, res) => {
  try {
    const report = await TripReport.findByPk(req.params.id, {
      include: [
        { model: Driver, as: 'driver' },
        { model: Bus, as: 'bus' }
      ]
    });

    if (!report) {
      return res.status(404).json({
        success: false,
        message: 'Trip report not found'
      });
    }

    const driver = await Driver.findOne({ where: { user_id: req.user.id } });
    
    if (req.user.role.name !== 'admin' && driver && report.driver_id !== driver.id) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. You can only view your own reports.'
      });
    }

    res.json({
      success: true,
      data: report
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching trip report'
    });
  }
};

const updateTripReport = async (req, res) => {
  try {
    if (req.user.role.name !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Only admin can edit trip reports.'
      });
    }

    const report = await TripReport.findByPk(req.params.id);
    if (!report) {
      return res.status(404).json({
        success: false,
        message: 'Trip report not found'
      });
    }

    await report.update(req.body);

    res.json({
      success: true,
      message: 'Trip report updated successfully',
      data: report
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating trip report'
    });
  }
};

const deleteTripReport = async (req, res) => {
  try {
    if (req.user.role.name !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Only admin can delete trip reports.'
      });
    }

    const report = await TripReport.findByPk(req.params.id);
    if (!report) {
      return res.status(404).json({
        success: false,
        message: 'Trip report not found'
      });
    }

    await report.destroy();

    res.json({
      success: true,
      message: 'Trip report deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting trip report'
    });
  }
};

module.exports = {
  createTripReport,
  getMyTripReports,
  getAllTripReports,
  getTripReportById,
  updateTripReport,
  deleteTripReport
};
