const { User, Role, ServiceRecord } = require('../models');
const { Op } = require('sequelize');

const getAllMechanics = async (req, res) => {
  try {
    const mechanics = await User.findAll({
      include: [{
        model: Role,
        as: 'role',
        where: { name: 'mechanic' }
      }]
    });

    const mechanicsWithStats = await Promise.all(
      mechanics.map(async (mechanic) => {
        const completedJobs = await ServiceRecord.count({
          where: {
            mechanic_id: mechanic.id,
            status: 'completed'
          }
        });
        const pendingJobs = await ServiceRecord.count({
          where: {
            mechanic_id: mechanic.id,
            status: { [Op.in]: ['pending', 'in_progress'] }
          }
        });

        return {
          ...mechanic.toJSON(),
          completedJobs,
          pendingJobs
        };
      })
    );

    res.json({
      success: true,
      data: mechanicsWithStats
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching mechanics'
    });
  }
};

const getMechanicById = async (req, res) => {
  try {
    const mechanic = await User.findByPk(req.params.id, {
      include: [{
        model: Role,
        as: 'role',
        where: { name: 'mechanic' }
      }]
    });

    if (!mechanic) {
      return res.status(404).json({
        success: false,
        message: 'Mechanic not found'
      });
    }

    const services = await ServiceRecord.findAll({
      where: { mechanic_id: mechanic.id },
      order: [['created_at', 'DESC']],
      limit: 20
    });

    res.json({
      success: true,
      data: {
        ...mechanic.toJSON(),
        services
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching mechanic'
    });
  }
};

const getMechanicPerformance = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    const where = {
      mechanic_id: req.params.id
    };

    if (startDate && endDate) {
      where.service_date = {
        [Op.between]: [startDate, endDate]
      };
    }

    const totalJobs = await ServiceRecord.count({ where });
    const completedJobs = await ServiceRecord.count({
      where: { ...where, status: 'completed' }
    });
    const inProgressJobs = await ServiceRecord.count({
      where: { ...where, status: 'in_progress' }
    });

    const revenue = await ServiceRecord.sum('total_cost', {
      where: { ...where, status: 'completed' }
    }) || 0;

    const avgLaborHours = await ServiceRecord.findOne({
      where,
      attributes: [
        [require('sequelize').fn('AVG', require('sequelize').col('labor_hours')), 'avgHours']
      ]
    });

    res.json({
      success: true,
      data: {
        totalJobs,
        completedJobs,
        inProgressJobs,
        revenue: parseFloat(revenue),
        avgLaborHours: parseFloat(avgLaborHours?.dataValues?.avgHours || 0)
      }
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching mechanic performance'
    });
  }
};

module.exports = {
  getAllMechanics,
  getMechanicById,
  getMechanicPerformance
};
