import express from 'express';
import morgan from 'morgan';
import handlebars from 'express-handlebars';
import { Server } from 'socket.io';

import __dirname from './utils.js';
import productsRouter from './routes/productsRouter.js';
import cartsRouter from './routes/cartsRouter.js';
import viewsRouter from './routes/viewsRouter.js';
import { ioSocket } from './sockets.js';

const app = express();
const PORT = 8080 

const server = app.listen(PORT, () => console.log(`listening on PORT ${PORT}`));
const io = new Server(server);

app.engine('handlebars', handlebars.engine());
app.set('views', `${__dirname}/views`);
app.set('view engine', 'handlebars');

app.use(express.static(`${__dirname}/public`));
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(morgan("dev"));

app.use('/', viewsRouter);
app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);

//contiene la lógica del socket, archivo sockets.io
ioSocket(io);





