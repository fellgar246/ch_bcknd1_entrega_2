import * as fs from 'fs';
const path = './src/db/products.json';

export const getProducts = async() => {
    if(fs.existsSync(path)){
        const data = await fs.promises.readFile(path,'utf-8');
        const products = JSON.parse(data);
        return products
    }
    return [];
}

export const getProductById = async(id) => {
    const products = await getProducts();
    const product = products.find( product => product.id  === Number(id) )
    if(!product) throw new Error("Product not found");

    try {
        return product
    } catch (error) {
        return error.message
    }
   
}

export const createProduct = async(product) => {
    const { title, description, code, price, stock, category, thumbnail } = product;
    if( !title || !description || !price || !category || !code || !stock ) throw new Error ("All fields are required");

    const products = await getProducts();

    const productDuplicated = products.find( product => product.code === code )
    if(productDuplicated) throw new Error("Product with duplicate code, enter a new code please") ;    

    try {
        const product = {
            title: title, 
            description: description, 
            code: code,
            price: price, 
            status: true,
            stock: stock,
            category: category,
            thumbnail: thumbnail || [], 
        }
        if(products.length === 0){
            product.id = 1
        } else{
            product.id = products[products.length-1].id+1;
        }
        products.push(product);
        await fs.promises.writeFile(path, JSON.stringify(products,null,'\t'));
        return product
    } catch (error) {
        return error.message
    }
    
}

export const updateProduct = async(updatedFields, id) => {
    const parseId = parseInt(id)
    const products = await getProducts();

    if(updatedFields.code) {
        const duplicateCode = products.find( product => product.code  === updatedFields.code );
        if(duplicateCode) throw new Error("Product modification with duplicate code, enter another code please")
    };

    if(updatedFields.id) {
        throw new Error("You cannot modify this field")
    };
  
    let index = products.findIndex((product) => product.id === parseId );
    if (index === -1) {
        throw new Error("Product not found");
    }

    try { 
        const productToUpdate = { ...products[index], ...updatedFields };
        products[index] = productToUpdate;
        
        await fs.promises.writeFile(path, JSON.stringify(products,null,'\t'));
        return productToUpdate
    } catch (error) {
        throw error;
    }
}

export const deleteProduct= async(id) => {
    const products = await getProducts();
    const product = products.find( product => product.id  === id )   
    if(!product) throw new Error("Product not found");

    try {
        const productsFiltered = products.filter( product => product.id != id)
        
        await fs.promises.writeFile(path, JSON.stringify(productsFiltered,null,'\t'));
        return "product deleted successfully"
    } catch (error) {
        return error.message
    }
}

