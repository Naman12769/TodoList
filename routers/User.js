import express from 'express'
// import { verify } from 'jsonwebtoken';
// import { verify } from 'jsonwebtoken';
import { login, verify, logout, addTask, removeTask, updateTask, getMyProfile, updatePassword, updateProfile, forgotPassword, resetPassword } from '../controllers/User.js';
import { register } from '../controllers/User.js';
// import register from '../controllers/User.js';
import {isAuthenticated} from '../middleware/auth.js';
const router=express.Router();
router.route('/register').post(register)
router.route('/verify').post(isAuthenticated,verify)
router.route('/login').post(login)
router.route('/logout').get(logout)
router.route('/newtask').post(isAuthenticated,addTask)
router.route('/me').get(isAuthenticated,getMyProfile)
router.route('/newtask/:taskId').delete(isAuthenticated,removeTask).get(isAuthenticated,updateTask)
router.route('/updateprofile').put(isAuthenticated,updateProfile)
router.route('/updateprofile').put(isAuthenticated,updatePassword)
router.route('/forgotpassword').post(forgotPassword)
router.route('/resetpassword').put(resetPassword)

export default router









































































































