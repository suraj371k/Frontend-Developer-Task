import { Router } from "express";
import { deleteUser, getProfile, loginUser, logoutUser, signupUser, updateProfile } from "../controllers/user.controller.js";
import { isAuthenticated } from "../middlewares/auth.middleware.js";
const router = Router()


router.post('/signup' , signupUser)

router.post('/login' , loginUser)

router.put('/:id' , isAuthenticated , updateProfile)

router.post('/logout' , isAuthenticated , logoutUser)

router.delete('/:id' , isAuthenticated , deleteUser)

router.get('/profile' , isAuthenticated , getProfile)

export default router;