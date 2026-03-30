const { ServiceRecord, Vehicle, User, SparePart, PartUsage } = require('../models');
const { Op } = require('sequelize');

const getAllServices = async (req, res) => {
  try {
    const { page = 1, limit = 10, search, status } = req.query;
    const offset = (page - 1) * limit;

    const where = {};
    if (search) {
      where[Op.or] = [
        { service_number: { [Op.like]: `%${search}%` } },
        { service_type: { [Op.like]: `%${search}%` } }
      ];
    }
    if (status) where.status = status;

    const { count, rows } = await ServiceRecord.findAndCountAll({
      where,
      include: [
        { model: Vehicle, as: 'vehicle' },
        { model: User, as: 'mechanic' }
      ],
      limit: parseInt(limit),
      offset,
      order: [['created_at', 'DESC']]
    });

    res.json({
      success: true,
      data: {
        services: rows,
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
      message: 'Error fetching services'
    });
  }
};

const getServiceById = async (req, res) => {
  try {
    const service = await ServiceRecord.findByPk(req.params.id, {
      include: [
        { model: Vehicle, as: 'vehicle' },
        { model: User, as: 'mechanic' },
        { model: PartUsage, as: 'partUsages', include: [{ model: SparePart, as: 'sparePart' }] }
      ]
    });

    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'Service record not found'
      });
    }

    res.json({
      success: true,
      data: service
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching service'
    });
  }
};

const createService = async (req, res) => {
  try {
    const { parts_used, ...serviceData } = req.body;
    
    const service = await ServiceRecord.create(serviceData);

    if (parts_used && parts_used.length > 0) {
      for (const part of parts_used) {
        const sparePart = await SparePart.findByPk(part.spare_part_id);
        if (sparePart) {
          await sparePart.update({
            quantity: sparePart.quantity - part.quantity_used
          });

          await PartUsage.create({
            service_record_id: service.id,
            spare_part_id: part.spare_part_id,
            quantity_used: part.quantity_used,
            unit_price: sparePart.selling_price,
            total_price: part.quantity_used * sparePart.selling_price
          });
        }
      }
    }

    await Vehicle.update(
      { status: 'under_service' },
      { where: { id: serviceData.vehicle_id } }
    );

    const fullService = await ServiceRecord.findByPk(service.id, {
      include: [
        { model: Vehicle, as: 'vehicle' },
        { model: User, as: 'mechanic' }
      ]
    });

    res.status(201).json({
      success: true,
      message: 'Service record created successfully',
      data: fullService
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating service record'
    });
  }
};

const updateService = async (req, res) => {
  try {
    const service = await ServiceRecord.findByPk(req.params.id);
    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'Service record not found'
      });
    }

    const { parts_used, ...serviceData } = req.body;

    await service.update(serviceData);

    if (serviceData.status === 'delivered') {
      await Vehicle.update(
        { status: 'delivered' },
        { where: { id: service.vehicle_id } }
      );
    } else if (serviceData.status === 'completed') {
      await Vehicle.update(
        { status: 'completed' },
        { where: { id: service.vehicle_id } }
      );
    }

    res.json({
      success: true,
      message: 'Service record updated successfully',
      data: service
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating service record'
    });
  }
};

const deleteService = async (req, res) => {
  try {
    const service = await ServiceRecord.findByPk(req.params.id);
    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'Service record not found'
      });
    }

    await service.destroy();

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
  getAllServices,
  getServiceById,
  createService,
  updateService,
  deleteService
};
