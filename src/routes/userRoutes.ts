import express from 'express';
import { registerUser, loginUser, getAllUsers, getUserById, updateUser, deleteUser } from '../controllers/userController';
import { authenticateUser } from '../middleware/authMiddleware';
import { registerUserRequest, userLoginRequest, updateUserRequest } from '../validators/userValidators';

const router = express.Router();

router.post('/register', registerUserRequest, registerUser);
router.post('/login', userLoginRequest, loginUser);
router.get('/users', authenticateUser, getAllUsers);
router.get('/users/:id', authenticateUser, getUserById);
router.put('/users/:id', authenticateUser, updateUserRequest, updateUser);
router.delete('/users/:id', authenticateUser, deleteUser);

export default router;
