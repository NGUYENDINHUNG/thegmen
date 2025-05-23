import User from '../models/userModel.schema.js';
import Role from '../models/Role.js';

export const checkPermission = (requiredPermission) => {
    return async (req, res, next) => {
        try {
            const userId = req.user.id; // Giả sử user ID được lưu trong req.user sau khi xác thực
            const user = await User.findById(userId).populate({
                path: 'role',
                populate: {
                    path: 'permissions'
                }
            });

            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }

            const userPermissions = user.role.permissions.map(p => p.code);
            
            if (!userPermissions.includes(requiredPermission)) {
                return res.status(403).json({ 
                    message: 'You do not have permission to perform this action' 
                });
            }

            next();
        } catch (error) {
            console.error('Permission check error:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    };
}; 