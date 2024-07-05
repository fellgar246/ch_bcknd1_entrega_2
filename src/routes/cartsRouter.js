import { Router } from 'express';
import { postCart, getCartById, postCartProduct } from '../controllers/cartsController.js';
import { HttpStatus } from '../constants/httpStatusCodes.js';

const cartsRouter = Router();

cartsRouter.get("/:cid", async(req, res) => {
    const {cid} = req.params;
    
    try {
        const cartById = await getCartById(cid);
        res.status(HttpStatus.OK).json(cartById);
    } catch (error) {
        res.status(HttpStatus.BAD_REQUEST).json({error: error.message})
    }
})

cartsRouter.post("/", async(req, res) => {
    const { products } = req.body;
    try {
        const addCart = await postCart( products )
        res.status(HttpStatus.CREATED).json(addCart);
    } catch (error) {
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({msg: error.message});
    }
})

cartsRouter.post("/:cid/product/:pid", async(req,res) => {
    const {cid, pid} = req.params;
    const { quantity } = req.body
    
    try {
        const cartById = await postCartProduct(cid, pid, quantity);
        res.status(HttpStatus.CREATED).json(cartById);
    } catch (error) {
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({error: error.message})
    }
})

export default cartsRouter;