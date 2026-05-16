/**
 * Middleware to check if user owns a resource
 * Must be used after :id parameter is available in the route
 */
const requireOwnership = (Model) => {
    return async (req, res, next) => {
        try {
            const resource = await Model.findById(req.params.id);

            if (!resource) {
                return res.status(404).json({ 
                    success: false, 
                    message: "Resource not found" 
                });
            }

            // Check if user is the owner or is an admin
            const ownerId = resource.createdBy || resource.faculty;
            if (
                ownerId.toString() !== req.user._id.toString() && 
                req.user.role !== 'admin'
            ) {
                return res.status(403).json({ 
                    success: false, 
                    message: "You do not have permission to access this resource" 
                });
            }

            // Attach resource to request for use in controller
            req.resource = resource;
            next();
        } catch (error) {
            return res.status(500).json({ 
                success: false, 
                message: error.message 
            });
        }
    };
};

module.exports = requireOwnership;
