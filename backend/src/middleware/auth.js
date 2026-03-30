const jwt = require('jsonwebtoken');
const { User, Role } = require('../models');

const verifyToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. No token provided.'
      });
    }

    const token = authHeader.split(' ')[1];
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    const user = await User.findByPk(decoded.id, {
      include: [{ model: Role, as: 'role' }]
    });

    if (!user || user.status !== 'active') {
      return res.status(401).json({
        success: false,
        message: 'Invalid or inactive user.'
      });
    }

    req.user = user;
    req.user.role = user.role;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token has expired.'
      });
    }
    return res.status(401).json({
      success: false,
      message: 'Invalid token.'
    });
  }
};

const checkRole = (allowedRoles) => {
  return (req, res, next) => {
    if (!req.user || !req.user.role) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required.'
      });
    }

    const userRole = req.user.role.name;
    
    if (!allowedRoles.includes(userRole)) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Insufficient permissions.'
      });
    }
    
    next();
  };
};

const isAdmin = (req, res, next) => {
  if (!req.user || !req.user.role) {
    return res.status(401).json({
      success: false,
      message: 'Authentication required.'
    });
  }

  if (req.user.role.name !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Access denied. Admin privileges required.'
    });
  }
  
  next();
};

const isDriver = (req, res, next) => {
  if (!req.user || !req.user.role) {
    return res.status(401).json({
      success: false,
      message: 'Authentication required.'
    });
  }

  if (req.user.role.name !== 'driver') {
    return res.status(403).json({
      success: false,
      message: 'Access denied. Driver privileges required.'
    });
  }
  
  next();
};

const isMechanic = (req, res, next) => {
  if (!req.user || !req.user.role) {
    return res.status(401).json({
      success: false,
      message: 'Authentication required.'
    });
  }

  if (req.user.role.name !== 'mechanic') {
    return res.status(403).json({
      success: false,
      message: 'Access denied. Mechanic privileges required.'
    });
  }
  
  next();
};

const isAdminOrDriver = (req, res, next) => {
  if (!req.user || !req.user.role) {
    return res.status(401).json({
      success: false,
      message: 'Authentication required.'
    });
  }

  const allowedRoles = ['admin', 'driver'];
  if (!allowedRoles.includes(req.user.role.name)) {
    return res.status(403).json({
      success: false,
      message: 'Access denied.'
    });
  }
  
  next();
};

const isAdminOrMechanic = (req, res, next) => {
  if (!req.user || !req.user.role) {
    return res.status(401).json({
      success: false,
      message: 'Authentication required.'
    });
  }

  const allowedRoles = ['admin', 'mechanic'];
  if (!allowedRoles.includes(req.user.role.name)) {
    return res.status(403).json({
      success: false,
      message: 'Access denied.'
    });
  }
  
  next();
};

const authenticate = verifyToken;

const authorize = (...roles) => {
  return checkRole(roles);
};

module.exports = {
  verifyToken,
  checkRole,
  isAdmin,
  isDriver,
  isMechanic,
  isAdminOrDriver,
  isAdminOrMechanic,
  authenticate,
  authorize
};
