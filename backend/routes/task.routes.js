import { Router } from "express";
import { isAuthenticated } from "../middlewares/auth.middleware.js";
import { createTask, deleteTask, getUserTasks, updateTask } from "../controllers/task.controller.js";
const router = Router()


router.post('/' , isAuthenticated , createTask)

router.get('/' , isAuthenticated , getUserTasks)

router.delete('/:id' , isAuthenticated , deleteTask)

router.put('/:id' , isAuthenticated , updateTask)

export default router;