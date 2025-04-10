// routes/customer.routes.js
import {Customer} from '../models/Customer.js';
import {Vehicle} from '../models/Vehicle.js';
import {Document} from '../models/CustomerDocument.js';
import {Contact} from '../models/Contact.js';
import {Op} from 'sequelize';
import {Address} from "../models/Address.js";

const INITIAL_PAGE = 1;
const PAGE_LIMIT = 50;
const getPaginationOffset = (page, limit) => page <= 1 ? 0 : ((page - 1) * limit);

const buildCustomerLinks = (id) => ({
    self: `/customers/${id}`,
    vehicles: `/customers/${id}/vehicles`,
    contacts: `/customers/${id}/contacts`,
    documents: `/customers/${id}/documents`,
    address: `/customers/${id}/address`
});

export default async function customerRoutes(api, opts) {
    api.get('/', {preValidation: [api.authenticate]}, async (request, reply) => {
        const {
            page = 1,
            limit = 50
        } = request.query;

        const offset = page <= 1 ? 0 : (page - 1) * limit;

        try {
            const {count, rows} = await Customer.findAndCountAll({
                where: {tenantId: request.user.tenant},
                limit: parseInt(limit, 10),
                offset,
                order: [['updatedAt', 'DESC']],
            });

            const data = rows.map(c => ({
                ...c.toJSON(),
                _links: buildCustomerLinks(c.id)
            }));

            reply.send({
                data,
                meta: {
                    page: Number(page),
                    totalItems: count,
                    totalPages: Math.ceil(count / limit)
                }
            });
        } catch (error) {
            reply.status(500).send({error: error.message});
        }
    });


    api.get('/:id', {preValidation: [api.authenticate]}, async (request, reply) => {
        try {
            const customer = await Customer.findByPk(request.params.id, {});
            if (!customer) return reply.status(404).send({error: 'Customer not found'});
            reply.send({...customer.toJSON(), _links: buildCustomerLinks(customer.id)});
        } catch (error) {
            reply.status(500).send({error: error.message});
        }
    });

    api.post('/', {preValidation: [api.authenticate]}, async (request, reply) => {
        try {
            const insert = {...request.body, tenantId: request.user.tenant, createdBy: request.user.createdBy};
            const customer = await Customer.create(insert);
            reply.status(201).send({...customer.toJSON(), _links: buildCustomerLinks(customer.id)});
        } catch (error) {
            reply.status(400).send({error: error.message});
        }
    });

    api.patch('/:id', {preValidation: [api.authenticate]}, async (request, reply) => {
        try {
            const customer = await Customer.findOne({
                where: {
                    id: request.params.id,
                    tenantId: request.user.tenant
                }
            });
            if (!customer) return reply.status(404).send({error: 'Customer not found'});

            await customer.update(request.body);

            reply.send({
                ...customer.toJSON(),
                _links: buildCustomerLinks(customer.id)
            });
        } catch (error) {
            reply.status(500).send({error: error.message});
        }
    });


    api.delete('/:id', {preValidation: [api.authenticate]}, async (request, reply) => {
        try {
            const deleted = await Customer.destroy({where: {id: request.params.id}});
            if (!deleted) return reply.status(404).send({error: 'Customer not found'});
            reply.status(204).send();
        } catch (error) {
            reply.status(500).send({error: error.message});
        }
    });


    //VEHICLES
    api.get('/:id/vehicles', {preValidation: [api.authenticate]}, async (request, reply) => {
        try {
            const customer = await Customer.findByPk(request.params.id, {
                include: [{model: Vehicle, as: 'vehicles', through: {attributes: []}}]
            });
            if (!customer) return reply.status(404).send({error: 'Customer not found'});
            const vehicles = customer.vehicles.map(v => ({
                ...v.toJSON(),
                _links: {
                    self: `/vehicles/${v.id}`,
                    owner: `/customers/${customer.id}`
                }
            }));
            reply.send(vehicles);
        } catch (error) {
            reply.status(500).send({error: error.message});
        }
    });

    api.post('/:id/vehicles', {preValidation: [api.authenticate]}, async (request, reply) => {
        try {
            const customer = await Customer.findByPk(request.params.id);
            if (!customer) return reply.status(404).send({error: 'Customer not found'});
            const vehicle = await Vehicle.create({
                ...request.body,
                tenantId: request.user.tenant,
                createdBy: request.user.user_id
            });
            await customer.addVehicle(vehicle);
            reply.status(201).send({
                ...vehicle.toJSON(),
                _links: {
                    self: `/vehicles/${vehicle.id}`,
                    owner: `/customers/${customer.id}`
                }
            });
        } catch (error) {
            reply.status(500).send({error: error.message});
        }
    });


    //CONTACTS
    api.get('/:id/contacts', {preValidation: [api.authenticate]}, async (request, reply) => {
        try {
            const contacts = await Contact.findAll({
                where: {
                    customer_id: request.params.id,
                    tenantId: request.user.tenant
                }
            });
            const result = contacts.map(c => ({
                ...c.toJSON(),
                _links: {
                    self: `/customers/${request.params.id}/contacts/${c.id}`,
                    customer: `/customers/${request.params.id}`
                }
            }));
            reply.send(result);
        } catch (error) {
            reply.status(500).send({error: error.message});
        }
    });


    api.post('/:id/contacts', {preValidation: [api.authenticate]}, async (request, reply) => {
        try {
            const customer = await Customer.findByPk(request.params.id);
            if (!customer) return reply.status(404).send({error: 'Customer not found'});
            const contact = await Contact.create({
                ...request.body,
                tenantId: request.user.tenant,
                createdBy: request.user.user_id,
                customer_id: customer.id
            });

            reply.status(201).send({
                ...contact.toJSON(),
                _links: {
                    self: `/contacts/${contact.id}`,
                    owner: `/customers/${customer.id}`
                }
            });
        } catch (error) {
            reply.status(500).send({error: error.message});
        }
    });

    //DOCUMENTS
    api.get('/:id/documents', {preValidation: [api.authenticate]}, async (request, reply) => {
        try {
            const documents = await Document.findAll({
                where: {
                    customer_id: request.params.id,
                    tenantId: request.user.tenant
                }
            });
            const result = documents.map(d => ({
                ...d.toJSON(),
                _links: {
                    self: `/documents/${d.id}`,
                    customer: `/customers/${request.params.id}`
                }
            }));
            reply.send(result);
        } catch (error) {
            reply.status(500).send({error: error.message});
        }
    });

    api.post('/:id/documents', {preValidation: [api.authenticate]}, async (request, reply) => {
        try {
            const customer = await Customer.findByPk(request.params.id);
            if (!customer) return reply.status(404).send({error: 'Customer not found'});
            const document = await Document.create({
                ...request.body,
                tenantId: request.user.tenant,
                createdBy: request.user.user_id,
                customer_id: customer.id
            });

            reply.status(201).send({
                ...document.toJSON(),
                _links: {
                    self: `/documents/${document.id}`,
                    owner: `/customers/${customer.id}`
                }
            });
        } catch (error) {
            reply.status(500).send({error: error.message});
        }
    });

    //ADDRESS
    api.get('/:id/addresses', {preValidation: [api.authenticate]}, async (request, reply) => {
        try {
            const address = await Address.findAll({
                where: {
                    customer_id: request.params.id,
                    tenantId: request.user.tenant,
                }
            });

            const result = address.map(d => ({
                ...d.toJSON(),
                _links: {
                    self: `/addresses/${d.id}`,
                    customer: `/customers/${request.params.id}`
                }
            }));

            reply.send(result);
        } catch (error) {
            reply.status(500).send({error: error.message});
        }
    });

    api.post('/:id/addresses', {preValidation: [api.authenticate]}, async (request, reply) => {
        try {
            const customer = await Customer.findByPk(request.params.id);
            if (!customer) return reply.status(404).send({error: 'Customer not found'});
            const address = await Address.create({
                ...request.body,
                tenantId: request.user.tenant,
                createdBy: request.user.user_id,
                customer_id: customer.id
            });

            reply.status(201).send({
                ...address.toJSON(),
                _links: {
                    self: `/addresses/${address.id}`,
                    owner: `/customers/${customer.id}`
                }
            });
        } catch (error) {
            reply.status(500).send({error: error.message});
        }
    });

    api.get('/search', {preValidation: [api.authenticate]}, async (request, reply) => {
        const {
            page = INITIAL_PAGE,
            limit = PAGE_LIMIT,
            search = '',
            status = 'active'
        } = request.query;

        try {
            const {count, rows} = await Customer.findAndCountAll({
                where: {
                    [Op.and]: [
                        {tenantId: request.user.tenant},
                        status ? {status} : {},
                        {
                            [Op.or]: [
                                {name: {[Op.iLike]: `%${search}%`}},
                                {'$documents.value$': {[Op.iLike]: `%${search}%`}},
                                {'$contacts.number$': {[Op.iLike]: `%${search}%`}}
                            ]
                        }
                    ]
                },
                include: [
                    {model: Document, as: 'documents', required: false},
                    {model: Contact, as: 'contacts', required: false}
                ],
                subQuery: false,
                limit: parseInt(limit, 10),
                offset: getPaginationOffset(page, limit),
                order: [['updatedAt', 'DESC'], ['name', 'ASC']],
                distinct: true
            });

            const data = rows.map(c => ({...c.toJSON(), _links: buildCustomerLinks(c.id)}));
            reply.send({
                data,
                meta: {
                    page: Number(page),
                    totalItems: count,
                    totalPages: Math.ceil(count / limit)
                }
            });
        } catch (error) {
            reply.status(500).send({error: error.message});
        }
    });

}

