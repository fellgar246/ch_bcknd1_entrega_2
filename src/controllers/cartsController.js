import * as fs from 'fs';
const path = './src/db/carts.json';
import { getProductById } from './productsController.js';

const getCarts = async() => {
    if(fs.existsSync(path)){
        const data = await fs.promises.readFile(path,'utf-8');
        const carts = JSON.parse(data);
        return carts
    }
    return [];
}

export const getCartById = async(id) => {
    const carts = await getCarts();
    const cart = carts.find( cart => cart.id  === Number(id) )
    if(!cart) throw new Error("Cart not found");
    try {
        return cart.products
    } catch (error) {
        return error.message
    }
   
}

export const postCart = async( products ) => {
    if( !products.length ) throw new Error ("All fields are required");

    try {
        const carts = await getCarts();      

        const cart = {
            products: products,
        };
 
        if(carts.length === 0){
            cart.id = 1
        } else{
            cart.id = carts[carts.length-1].id+1;
        }
        carts.push(cart);
        await fs.promises.writeFile(path, JSON.stringify(carts,null,'\t'));
        return cart
    } catch (error) {
        return error.message
    }
    
}

export const postCartProduct = async(cid, pid, quantity) => {
    if( parseInt(cid) <= 0 || parseInt(pid) <= 0 || quantity <= 0 ) throw new Error ("It must be a digit above cero");

    const carts = await getCarts();     
    const findCart = carts.find(element => element.id === parseInt(cid) )
    if(!findCart) throw new Error("Cart not found");

    const productById = await getProductById(pid);
    if(!productById) throw new Error("Product not found");

    try {
        const findProduct = findCart.products.find(element => element.product === parseInt(pid))
        if(!findProduct) {
            const product = {
                product: parseInt(pid),
                quantity: quantity
            };
            findCart.products.push(product);
        } else {
            findProduct.quantity += quantity
        }

        await fs.promises.writeFile(path, JSON.stringify(carts,null,'\t'));
        return findCart
    } catch (error) {
        return error.message
    }
}