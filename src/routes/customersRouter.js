import { Router } from "express";
import { getCustomers, getIdCustomers, postCustomers, putCustomers } from "../controllers/customersController.js";

const customersRouter = Router ();

customersRouter.get('/customers', getCustomers)
customersRouter.get('/customers/:id', getIdCustomers)
customersRouter.post('/customers', postCustomers)
customersRouter.put('/customers/:id', putCustomers)

export default customersRouter;