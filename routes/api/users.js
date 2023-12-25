import express from 'express';
import { Router } from 'express';
import usersController from '../../controllers/usersController.js'; 
import ROLES_LIST from '../../config/roles_list.js'; 
import verifyRoles from '../../middleware/verifyRoles.js'; 

const router = Router();

router.route('/')
    .get(verifyRoles(ROLES_LIST.admin), usersController.getAllUsers)
    .delete(verifyRoles(ROLES_LIST.admin), usersController.deleteUser);

router.route('/:id')
    .get(verifyRoles(ROLES_LIST.admin), usersController.getUser);

export default router;
