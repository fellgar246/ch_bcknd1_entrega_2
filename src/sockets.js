import { getProducts, createProduct, deleteProduct  } from './controllers/productsController.js';

export const ioSocket = (io) => {
    io.on('connection', socket =>{
        console.log("Cliente conectado");
        const emitProducts = async() => {
            const products = await getProducts()
            io.emit('server:loadProducts', products)
        } 
        emitProducts()
        
        socket.on('client:addProduct', async (newProduct) => {
            const { price, stock } = newProduct;

            const priceToNumber = Number(price);
            const stockToNumber = Number(stock);


            await createProduct({
                ...newProduct,
                price: priceToNumber,
                stock: stockToNumber
            })

        });

        socket.on('client:deleteProduct', async (id) => {
            await deleteProduct(id)
           
        })
    })
} 