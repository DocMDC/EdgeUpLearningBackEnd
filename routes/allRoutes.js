import { Router } from 'express'; 
import { handleRegister } from '../controllers/registerController.js';
import { handleLogin } from '../controllers/loginController.js'; 
import { handleLogout } from '../controllers/logoutController.js'; 
import { handleForgotPassword } from '../controllers/forgotPasswordController.js'; 
import { handleResetPassword } from '../controllers/resetPasswordController.js'; 

const router = Router(); 

router.post('/register', handleRegister);
router.post('/login', handleLogin);
router.get('/logout', handleLogout);
router.post('/forgot', handleForgotPassword);
router.patch('/reset', handleResetPassword);

export default router; 
