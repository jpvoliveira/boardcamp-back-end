import { Router } from "express";
import { getCategories, getAddCategories } from '../controllers/categoriesController.js'

const categoriesRouter = Router();

categoriesRouter.get('/categories', getCategories)
categoriesRouter.post('/categories', getAddCategories)

export default categoriesRouter;