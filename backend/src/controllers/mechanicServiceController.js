const { MechanicServiceRecord } = require('../models');
const { Op } = require('sequelize');

const createMechanicServiceRecord = async (req, res) => {
  try {
    const { vehicle_type, number_plate, problem_description, spare_part_description, spare_part_price, service_date } = req.body;

    const serviceRecord = await MechanicServiceRecord.create({
      mechanic_id: req.user.id,
      vehicle_type,
      number_plate,
      problem_description,
      spare_part_description,
      spare_part_price: spare_part_price || 0,
      service_date,
      status: 'completed'
    });

    res.status(201).json({
      success: true,
      message: 'Service record created successfully',
      data: serviceRecord
    });
  } catch (error) {
    console.error('Error creating service record:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating service record'
    });
  }
};

const getMyServiceRecords = async (req, res) => {
  try {
    const records = await MechanicServiceRecord.findAll({
      where: { mechanic_id: req.user.id },
      order: [['created_at', 'DESC']]
    });

    res.json({
      success: true,
      data: records
    });
  } catch (error) {
    console.error('Error fetching service records:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching service records'
    });
  }
};

const getAllMechanicServiceRecords = async (req, res) => {
  try {
    const { page = 1, limit = 10, search } = req.query;
    const offset = (page - 1) * limit;

    const where = {};
    if (search) {
      where[Op.or] = [
        { number_plate: { [Op.like]: `%${search}%` } },
        { problem_description: { [Op.like]: `%${search}%` } }
      ];
    }

    const { count, rows } = await MechanicServiceRecord.findAndCountAll({
      where,
      include: [{ model: require('../models/User'), as: 'mechanic', attributes: ['id', 'name', 'email'] }],
      limit: parseInt(limit),
      offset,
      order: [['created_at', 'DESC']]
    });

    res.json({
      success: true,
      data: {
        records: rows,
        pagination: {
          total: count,
          page: parseInt(page),
          limit: parseInt(limit),
          pages: Math.ceil(count / limit)
        }
      }
    });
  } catch (error) {
    console.error('Error fetching service records:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching service records'
    });
  }
};

const getMechanicServiceRecordById = async (req, res) => {
  try {
    const record = await MechanicServiceRecord.findByPk(req.params.id, {
      include: [{ model: require('../models/User'), as: 'mechanic', attributes: ['id', 'name', 'email'] }]
    });

    if (!record) {
      return res.status(404).json({
        success: false,
        message: 'Service record not found'
      });
    }

    if (req.user.role.name !== 'admin' && record.mechanic_id !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. You can only view your own records.'
      });
    }

    res.json({
      success: true,
      data: record
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching service record'
    });
  }
};

const updateMechanicServiceRecord = async (req, res) => {
  try {
    if (req.user.role.name !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Only admin can edit service records.'
      });
    }

    const record = await MechanicServiceRecord.findByPk(req.params.id);
    if (!record) {
      return res.status(404).json({
        success: false,
        message: 'Service record not found'
      });
    }

    await record.update(req.body);

    res.json({
      success: true,
      message: 'Service record updated successfully',
      data: record
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating service record'
    });
  }
};

const deleteMechanicServiceRecord = async (req, res) => {
  try {
    if (req.user.role.name !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Only admin can delete service records.'
      });
    }

    const record = await MechanicServiceRecord.findByPk(req.params.id);
    if (!record) {
      return res.status(404).json({
        success: false,
        message: 'Service record not found'
      });
    }

    await record.destroy();

    res.json({
      success: true,
      message: 'Service record deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting service record'
    });
  }
};

module.exports = {
  createMechanicServiceRecord,
  getMyServiceRecords,
  getAllMechanicServiceRecords,
  getMechanicServiceRecordById,
  updateMechanicServiceRecord,
  deleteMechanicServiceRecord
};
