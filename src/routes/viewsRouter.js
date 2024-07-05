import { Router } from 'express';
import { getProducts } from '../controllers/productsController.js';

const viewsRouter = Router();

viewsRouter.get('/', async (req, res) => {
    res.render('home', {
        products: await getProducts()
    })
});
viewsRouter.get('/realtimeproducts', (req, res) => {
    res.render('realTimeProducts')
});


export default viewsRouter;