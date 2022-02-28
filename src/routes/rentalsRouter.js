import { Router } from "express";
import { getRentals, postRentals, postIdRentals, deleteIdRentals } from "../controllers/rentalsController.js"

const rentalsRouter = Router ();

rentalsRouter.get('/rentals', getRentals)
rentalsRouter.post('/rentals', postRentals)
rentalsRouter.post('/rentals/:id/return', postIdRentals)
rentalsRouter.delete('/rentals/:id', deleteIdRentals)

export default rentalsRouter