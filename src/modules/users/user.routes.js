import express from 'express';
import UserController from './user.controller.js';
import authMiddleware from '../../middlewares/auth.middleware.js';

const router = express.Router();

router.post('/register', UserController.register);
router.post('/login', UserController.login);
router.get('/profile', authMiddleware, UserController.getProfile);
router.put('/update', authMiddleware, UserController.updateUser);
router.delete('/delete', authMiddleware, UserController.deleteUser);
router.get('/total', authMiddleware, UserController.listUsers);

export default router;