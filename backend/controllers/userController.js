const User = require('../models/User');

// Middleware to check user role
exports.authorize = (roles = []) => {
    if (typeof roles === 'string') {
        roles = [roles];
    }
    return (req, res, next) => {
        if (roles.length && !roles.includes(req.user.role)) {
            return res.status(403).json({ message: 'Unauthorized' });
        }
        next();
    };
};

// Controller to create a new user
exports.createUser = async (req, res) => {
    try {
        const { username, email, password, role } = req.body;
        const requestingUser = req.user;

        // Determine if the requesting user can create a user with the specified role
        const canCreate = () => {
            if (requestingUser.role === 'Super Admin' || requestingUser.role === 'IT Head') {
                return true;
            }
            const requestingUserRoleIndex = ['Viewer', 'Content Creator', 'Editor', 'IT Head', 'Super Admin'].indexOf(requestingUser.role);
            const newUserRoleIndex = ['Viewer', 'Content Creator', 'Editor', 'IT Head', 'Super Admin'].indexOf(role);
            return newUserRoleIndex <= requestingUserRoleIndex && role !== 'Super Admin' && role !== 'IT Head';
        };

        if (!canCreate()) {
            return res.status(403).json({ message: 'Unauthorized to create a user with this role' });
        }

        const existingUser = await User.findOne({ $or: [{ username }, { email }] });
        if (existingUser) {
            return res.status(400).json({ message: 'Username or email already exists' });
        }

        const newUser = new User({ username, email, password, role, invitedBy: requestingUser._id });
        await newUser.save();
        res.status(201).json({ message: 'User created successfully', user: { id: newUser._id, username: newUser.username, email: newUser.email, role: newUser.role } });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error creating user' });
    }
};

// Controller to get all users (requires admin role)
exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find().populate('invitedBy', 'username email');
        res.status(200).json(users);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching users' });
    }
};

// ... other user management controllers (e.g., update user, delete user)