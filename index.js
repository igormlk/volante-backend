import Fastify from 'fastify'
import db from "./config/database.js";
import {Customer} from "./models/Customer.js";
import {Vehicle} from "./models/Vehicle.js";
import {Employee} from "./models/Employee.js";
import {InsuranceCompany} from "./models/InsuranceCompany.js";
import {Catalog} from './models/Catalog.js';
import {ServiceOrderItem} from './models/ServiceOrderItem.js';
import {ServiceOrder} from "./models/ServiceOrder.js";
import {Op, ValidationError} from 'sequelize';
import cors from '@fastify/cors'
import {Supplier} from './models/Supplier.js';
import fastifyJwt from 'fastify-jwt';

const INITIAL_PAGE = 1;
const PAGE_LIMIT = 50;

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
        api.log.error(err);
        process.exit(1);
    }
};

api.register(cors, {
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'], // Métodos HTTP permitidos
    allowedHeaders: ['Content-Type', 'Authorization'], // Cabeçalhos permitidos
});

db.authenticate()
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

const getPaginationOffset = (page, limit) => page <= 1 ? 0 : ((page - 1) * limit)

const createBasicCRUD = (name, route, table, methods = ['get_all', 'get_by_id', 'post', 'put', 'delete']) => {
    // Criar
    if (methods.includes('post')) {
        api.post(`/${route}`,{ preValidation: [api.authenticate] }, async (request, reply) => {
            try {
                const result = await table.create(request.body);
                reply.status(201).send(result);
            } catch (error) {
                if (error instanceof ValidationError) {
                    reply.status(400).send({error})
                }
                reply.status(400).send({error: error.message});
            }
        });
    }

    // Listar

    if (methods.includes('get_all')) {
        api.get(`/${route}`, { preValidation: [api.authenticate] }, async (request, reply) => {
            try {
                const result = await table.findAll();
                reply.status(200).send(result);
            } catch (error) {
                reply.status(500).send({error: error.message});
            }
        });
    }

    // Obter por ID
    if (methods.includes('get_by_id')) {
        api.get(`/${route}/:id`, { preValidation: [api.authenticate] },async (request, reply) => {
            try {
                const result = await table.findByPk(request.params.id);
                if (result) {
                    reply.status(200).send(result);
                } else {
                    reply.status(404).send({error: `${name} not found`});
                }
            } catch (error) {
                reply.status(500).send({error: error.message});
            }
        });
    }

    // Atualizar
    if (methods.includes('put')) {
        api.put(`/${route}/:id`,{ preValidation: [api.authenticate] }, async (request, reply) => {
            try {
                const [updated] = await table.update(request.body, {
                    where: {id: request.params.id}
                });
                if (updated) {
                    const result = await table.findByPk(request.params.id);
                    reply.status(200).send(result);
                } else {
                    reply.status(404).send({error: `${name} not found`});
                }
            } catch (error) {
                if (error instanceof ValidationError) {
                    const message = error.errors[0].message
                    reply.status(400).send({error: message})
                }
                reply.status(500).send({error: error.message});
            }
        });
    }

    // Excluir
    if (methods.includes('delete')) {
        api.delete(`/${route}/:id`,{ preValidation: [api.authenticate] }, async (request, reply) => {
            try {
                const deleted = await table.destroy({
                    where: {id: request.params.id}
                });
                if (deleted) {
                    reply.status(204).send();
                } else {
                    reply.status(404).send({error: `${name} not found`});
                }
            } catch (error) {
                reply.status(500).send({error: error.message});
            }
        });
    }
}

createBasicCRUD('Catalog Price Condition', 'catalog_price_conditions', Catalog)
createBasicCRUD('Customer', 'customers', Customer)
api.get('/customers/search', { preValidation: [api.authenticate] }, async ({query: {page = INITIAL_PAGE, limit = PAGE_LIMIT, searchValue = ''}}, reply) => {
    try {
        const {count, rows} = await Customer.findAndCountAll({
            where: {
                [Op.or]: [
                    {name: {[Op.like]: `%${searchValue}%`}},
                    {cpf: {[Op.like]: `%${searchValue}%`}},
                    {phone: {[Op.like]: `%${searchValue}%`}},
                    {email: {[Op.like]: `%${searchValue}%`}},
                ]
            },
            limit: parseInt(limit, 10) || PAGE_LIMIT,
            order: [['updatedAt', 'DESC'], ['name', 'ASC']],
            offset: getPaginationOffset(page, limit),
        });

        const response = {
            data: rows,
            meta: {
                page: Number(page),
                totalItems: count,
                totalPages: Math.ceil(count / limit)
            }
        }

        reply.status(200).send(response);
    } catch (error) {
        reply.status(500).send({error: error.message});
    }
});

createBasicCRUD('Employee', 'employees', Employee)
api.get('/employees/search', { preValidation: [api.authenticate] }, async ({query: {page = INITIAL_PAGE, limit = PAGE_LIMIT, searchValue = ''}}, reply) => {
    try {
        const {count, rows} = await Employee.findAndCountAll({
            limit,
            offset: getPaginationOffset(page, limit),
            order: [['name', 'ASC'], ['createdAt', 'DESC']],
            where: {
                [Op.or]: {
                    name: {[Op.like]: `%${searchValue}%`},
                    cpf: {[Op.like]: `%${searchValue}%`}
                }
            }
        })
        const response = {
            data: rows,
            meta: {
                page: Number(page),
                totalItems: count,
                totalPages: Math.ceil(count / limit)
            }
        }
        reply.status(200).send(response);
    } catch (error) {
        reply.status(500).send({error: error.message})
    }
})

createBasicCRUD('Supplier', 'suppliers', Supplier)
api.get('/suppliers/search', { preValidation: [api.authenticate] }, async ({query: {page = INITIAL_PAGE, limit = PAGE_LIMIT, searchValue = ''}}, reply) => {
    try {
        const {count, rows} = await Supplier.findAndCountAll({
            limit,
            offset: getPaginationOffset(page, limit),
            order: [['name', 'ASC'], ['createdAt', 'DESC']],
            where: {
                [Op.or]: {
                    name: {[Op.like]: `%${searchValue}%`},
                    cnpj: {[Op.like]: `%${searchValue}%`}
                }
            }
        })
        const response = {
            data: rows,
            meta: {
                page: Number(page),
                totalItems: count,
                totalPages: Math.ceil(count / limit)
            }
        }
        reply.status(200).send(response);
    } catch (error) {
        reply.status(500).send({error: error.message})
    }
})

createBasicCRUD('Insurance Company', 'insurance_companies', InsuranceCompany)
createBasicCRUD('Service Order', 'service_orders', ServiceOrder, ['put', 'delete', 'get_all'])

api.get('/service_orders/search', { preValidation: [api.authenticate] }, async ({
                                             query: {
                                                 page = INITIAL_PAGE,
                                                 limit = PAGE_LIMIT,
                                                 vehicle = '',
                                                 customer = ''
                                             }
                                         }, reply) => {
    try {
        const {count, rows} = await ServiceOrder.findAndCountAll({
            limit,
            offset: getPaginationOffset(page, limit),
            order: [['updatedAt', 'DESC']],
            include: [
                {
                    model: Customer,
                    attributes: ['id', 'name', 'cpf', 'phone', 'email', 'address'],
                    where: customer ? {
                        [Op.or]: [
                            {name: {[Op.like]: `%${customer}%`}},
                            {cpf: {[Op.like]: `%${customer}%`}},
                            {phone: {[Op.like]: `%${customer}%`}},
                            {email: {[Op.like]: `%${customer}%`}},
                        ]
                    } : null,
                    required: Boolean(customer)
                },
                {
                    model: Vehicle,
                    attributes: ['id', 'plate', 'chassi', 'brand', 'model', 'year', 'color', 'km', 'fuel'],
                    where: vehicle ? {
                        [Op.or]: [
                            {plate: {[Op.like]: `%${vehicle}%`}},
                            {brand: {[Op.like]: `%${vehicle}%`}},
                            {model: {[Op.like]: `%${vehicle}%`}}
                        ]
                    } : null,
                    required: Boolean(vehicle)
                },
                {
                    model: ServiceOrderItem,
                    attributes: ['serviceOrderId', 'id', 'description', 'value', 'quantity', 'discount', 'total', 'type']
                }
            ],
            // Remove o where global do ServiceOrder, aplicando busca apenas no Vehicle
        });

        const response = {
            data: rows,
            meta: {
                page: Number(page),
                totalItems: count,
                totalPages: Math.ceil(count / limit)
            }
        };

        reply.status(200).send(response);
    } catch (error) {
        reply.status(500).send({error: error.message});
    }
});


api.post('/service_orders', { preValidation: [api.authenticate] }, async (request, reply) => {
    if (!request.body.customer) {
        throw new Error('Customer cannot be empty')
    } else if (!request.body.vehicle) {
        throw new Error('Vehicle cannot be empty')
    }

    await db.transaction(async t => {
        try {

            const [customer] = await Customer.upsert(request.body.customer, {transaction: t})
            const [vehicle] = await Vehicle.upsert(request?.body?.vehicle, {transaction: t})

            const {status, insuranceCompanyId, service_order_items, startAt, endAt, note} = request.body

            const newSO = await ServiceOrder.upsert({
                id: request?.body?.id,
                status,
                customerId: customer.id,
                vehicleId: vehicle.id,
                insuranceCompanyId,
                startAt,
                endAt,
                note
            }, {transaction: t})
            let createdItems = []

            if (service_order_items && service_order_items.length > 0) {
                for (const item of service_order_items) {
                    const newItem = await ServiceOrderItem.upsert(
                        {serviceOrderId: request?.body?.id, ...item},
                        {transaction: t}
                    );
                    createdItems.push(newItem)
                }
            }

            reply.status(200).send({...newSO.dataValues, service_order_items: createdItems, customer, vehicle, note})
        } catch (error) {
            console.log(error)
            await t.rollback()
            reply.status(500).send({error})
        }
    })
    reply.status(204)
})


createBasicCRUD('Service Order Item', 'service_order_items', ServiceOrderItem)
createBasicCRUD('Vehicle', 'vehicles', Vehicle)
api.get('/vehicles/search', { preValidation: [api.authenticate] }, async ({query: {page = INITIAL_PAGE, limit = PAGE_LIMIT, searchValue = ''}}, reply) => {
    try {
        const {count, rows} = await Vehicle.findAndCountAll({
            where: {
                [Op.or]: [
                    {plate: {[Op.like]: `%${searchValue}%`}},
                    {brand: {[Op.like]: `%${searchValue}%`}},
                    {model: {[Op.like]: `%${searchValue}%`}},
                ]
            },
            limit: parseInt(limit, 10) || PAGE_LIMIT,
            order: [['updatedAt', 'DESC'], ['brand', 'ASC'], ['model', 'ASC']],
            offset: getPaginationOffset(page, limit),
        });

        const response = {
            data: rows,
            meta: {
                page: Number(page),
                totalItems: count,
                totalPages: Math.ceil(count / limit)
            }
        }
        reply.status(200).send(response);
    } catch (error) {
        reply.status(500).send({error: error.message});
    }
});


createBasicCRUD('Catalog', 'catalog', Catalog, ['get_by_id', 'post', 'put', 'delete'])
api.get('/catalog/search', { preValidation: [api.authenticate] }, async ({query: {page = INITIAL_PAGE, limit = PAGE_LIMIT, searchValue = ''}}, reply) => {
    try {
        const {count, rows} = await Catalog.findAndCountAll({
            limit,
            offset: getPaginationOffset(page, limit),
            order: [['description', 'ASC'], ['createdAt', 'DESC']],
            where: {
                [Op.or]: {
                    description: {[Op.like]: `%${searchValue}%`},
                    sku: {[Op.like]: `%${searchValue}%`}
                }
            }
        })
        const response = {
            data: rows,
            meta: {
                page: Number(page),
                totalItems: count,
                totalPages: Math.ceil(count / limit)
            }
        }
        reply.status(200).send(response);
    } catch (error) {
        reply.status(500).send({error})
    }
})