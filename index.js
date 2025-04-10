import Fastify from 'fastify'
import db from "./config/database.js";
import cors from '@fastify/cors'
import fastifyJwt from 'fastify-jwt';
import customerRoutes from "./routes/customers.js";
import vehicleRoutes from "./routes/vehicles.js";
import documentRoutes from "./routes/documents.js";
import addressRoutes from "./routes/addresses.js";
import contactRoutes from "./routes/contacts.js";


const api = Fastify({logger: false})

api.register(fastifyJwt, {
    secret: process.env.JWT_SECRET
})

api.decorate('authenticate', async (request, reply) => {
    try {
        await request.jwtVerify();
    } catch (err) {
        reply.send(err);
    }
});

const startServer = async () => {
    try {
        const port = process.env.PORT || 8080
        await api.listen({port: port, host: "0.0.0.0"});
        console.log('Server running at port ' + port);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

api.register(cors, {
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'], // Métodos HTTP permitidos
    allowedHeaders: ['Content-Type', 'Authorization'], // Cabeçalhos permitidos
});

db.authenticate()
    // .then(() => {
    //     db.sync({ alter: true })
    //         .then(() => console.log("Tabelas sincronizadas com sucesso!"))
    //         .catch(err => console.error("Erro ao sincronizar tabelas:", err));
    // })
    .then(() => {
        startServer()
    })
    .catch(error => {
            console.error('Error connecting to DB:', error);
        }
    );

api.get("/", async (resquest, reply) => {
    reply.status(200).send("API Volante running succesfully!")
})

api.register(customerRoutes, {prefix: '/customers'})
api.register(vehicleRoutes, {prefix: '/vehicles'})
api.register(documentRoutes, {prefix: '/documents'})
api.register(addressRoutes, {prefix: '/addresses'})
api.register(contactRoutes, {prefix: '/contacts'})


