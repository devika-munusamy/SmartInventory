import AuditLog from '../models/AuditLog.js';

// Middleware to log actions
export const logAction = (action, resource = null) => {
    return async (req, res, next) => {
        try {
            // Store original json method
            const originalJson = res.json;

            // Override json method to capture response
            res.json = function (data) {
                // Only log if request was successful
                if (data.success !== false && req.user) {
                    // Create audit log asynchronously (don't wait)
                    AuditLog.create({
                        user: req.user._id,
                        action: action,
                        resource: resource,
                        resourceId: data.data?._id || req.params.id || null,
                        details: `${action.replace(/_/g, ' ')} by ${req.user.name}`,
                        ipAddress: req.ip || req.connection.remoteAddress,
                        userAgent: req.get('user-agent'),
                    }).catch((err) => console.error('Audit log error:', err));
                }

                // Call original json method
                return originalJson.call(this, data);
            };

            next();
        } catch (error) {
            next();
        }
    };
};
