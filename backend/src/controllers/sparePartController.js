const { SparePart, PartUsage, ServiceRecord } = require('../models');
const { Op } = require('sequelize');

const getAllSpareParts = async (req, res) => {
  try {
    const { page = 1, limit = 10, search, category, lowStock } = req.query;
    const offset = (page - 1) * limit;

    const where = {};
    if (search) {
      where[Op.or] = [
        { name: { [Op.like]: `%${search}%` } },
        { part_number: { [Op.like]: `%${search}%` } }
      ];
    }
    if (category) where.category = category;
    if (lowStock === 'true') {
      where[Op.and] = {
        quantity: { [Op.lte]: sequelize.col('min_quantity') }
      };
    }

    const { count, rows } = await SparePart.findAndCountAll({
      where,
      limit: parseInt(limit),
      offset,
      order: [['created_at', 'DESC']]
    });

    res.json({
      success: true,
      data: {
        spareParts: rows,
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
      message: 'Error fetching spare parts'
    });
  }
};

const getSparePartById = async (req, res) => {
  try {
    const sparePart = await SparePart.findByPk(req.params.id, {
      include: [{ model: PartUsage, as: 'partUsages' }]
    });

    if (!sparePart) {
      return res.status(404).json({
        success: false,
        message: 'Spare part not found'
      });
    }

    res.json({
      success: true,
      data: sparePart
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching spare part'
    });
  }
};

const createSparePart = async (req, res) => {
  try {
    const sparePart = await SparePart.create(req.body);
    res.status(201).json({
      success: true,
      message: 'Spare part created successfully',
      data: sparePart
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating spare part'
    });
  }
};

const updateSparePart = async (req, res) => {
  try {
    const sparePart = await SparePart.findByPk(req.params.id);
    if (!sparePart) {
      return res.status(404).json({
        success: false,
        message: 'Spare part not found'
      });
    }

    await sparePart.update(req.body);

    res.json({
      success: true,
      message: 'Spare part updated successfully',
      data: sparePart
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating spare part'
    });
  }
};

const deleteSparePart = async (req, res) => {
  try {
    const sparePart = await SparePart.findByPk(req.params.id);
    if (!sparePart) {
      return res.status(404).json({
        success: false,
        message: 'Spare part not found'
      });
    }

    await sparePart.destroy();

    res.json({
      success: true,
      message: 'Spare part deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting spare part'
    });
  }
};

const getLowStockAlerts = async (req, res) => {
  try {
    const lowStockParts = await SparePart.findAll({
      where: {
        quantity: { [Op.lte]: sequelize.col('min_quantity') }
      },
      order: [['quantity', 'ASC']]
    });

    res.json({
      success: true,
      data: lowStockParts
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching low stock alerts'
    });
  }
};

const adjustStock = async (req, res) => {
  try {
    const { adjustment, reason } = req.body;
    const sparePart = await SparePart.findByPk(req.params.id);
    
    if (!sparePart) {
      return res.status(404).json({
        success: false,
        message: 'Spare part not found'
      });
    }

    const newQuantity = sparePart.quantity + adjustment;
    if (newQuantity < 0) {
      return res.status(400).json({
        success: false,
        message: 'Cannot reduce stock below 0'
      });
    }

    await sparePart.update({ quantity: newQuantity });

    res.json({
      success: true,
      message: `Stock ${adjustment > 0 ? 'added' : 'reduced'} successfully`,
      data: sparePart
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error adjusting stock'
    });
  }
};

module.exports = {
  getAllSpareParts,
  getSparePartById,
  createSparePart,
  updateSparePart,
  deleteSparePart,
  getLowStockAlerts,
  adjustStock
};
