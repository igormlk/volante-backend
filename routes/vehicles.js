// routes/vehicle.routes.js
import {Vehicle} from '../models/Vehicle.js';
import {Customer} from '../models/Customer.js';
import {Op} from 'sequelize';

const INITIAL_PAGE = 1;
const PAGE_LIMIT = 50;
const getPaginationOffset = (page, limit) => page <= 1 ? 0 : ((page - 1) * limit);

const buildVehicleLinks = (id) => ({
    self: `/vehicles/${id}`,
    customers: `/vehicles/${id}/customers`
});

export default async function vehicleRoutes(api, opts) {
    api.get('/', {preValidation: [api.authenticate]}, async (request, reply) => {
        const {
            page = 1,
            limit = 50
        } = request.query;

        const offset = page <= 1 ? 0 : (page - 1) * limit;

        try {
            const {count, rows} = await Vehicle.findAndCountAll({
                where: {
                    tenantId: request.user.tenant
                },
                limit: parseInt(limit, 10),
                offset,
                order: [['updatedAt', 'DESC']],
                distinct: true
            });

            const result = rows.map(v => ({
                ...v.toJSON(),
                _links: {
                    self: `/vehicles/${v.id}`
                }
            }));

            reply.send({
                data: result,
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
            const vehicle = await Vehicle.findOne({
                where: {
                    id: request.params.id,
                    tenantId: request.user.tenant
                }
            });

            if (!vehicle) return reply.status(404).send({error: 'Vehicle not found'});

            reply.send({
                ...vehicle.toJSON(),
                _links: buildVehicleLinks(vehicle.id)
            });
        } catch (error) {
            reply.status(500).send({error: error.message});
        }
    });

    api.patch('/:id', {preValidation: [api.authenticate]}, async (request, reply) => {
        try {
            const vehicle = await Vehicle.findOne({
                where: {
                    id: request.params.id,
                    tenantId: request.user.tenant
                }
            });

            if (!vehicle)
                return reply.status(404).send({error: 'Vehicle not found'});

            await vehicle.update(request.body);

            reply.send({...vehicle.toJSON(), _links: buildVehicleLinks(vehicle.id)});
        } catch (error) {
            reply.status(500).send({error: error.message});
        }
    });

    api.delete('/:id', {preValidation: [api.authenticate]}, async (request, reply) => {
        try {
            const deleted = await Vehicle.destroy({
                where: {
                    id: request.params.id,
                    tenantId: request.user.tenant
                }
            });
            if (!deleted) return reply.status(404).send({error: 'Vehicle not found'});
            reply.status(204).send();
        } catch (error) {
            reply.status(500).send({error: error.message});
        }
    });

    api.get('/:id/customers', {preValidation: [api.authenticate]}, async (request, reply) => {
        try {
            const vehicle = await Vehicle.findOne({
                where: {
                    id: request.params.id,
                    tenantId: request.user.tenant
                },
                include: [{model: Customer, as: 'customers', through: {attributes: []}}]
            });
            if (!vehicle) return reply.status(404).send({error: 'Vehicle not found'});
            const customers = vehicle.customers.map(c => ({
                ...c.toJSON(),
                _links: {
                    self: `/customers/${c.id}`,
                    vehicles: `/customers/${c.id}/vehicles`
                }
            }));
            reply.send(customers);
        } catch (error) {
            reply.status(500).send({error: error.message});
        }
    });

    api.get('/search', {preValidation: [api.authenticate]}, async (request, reply) => {
        const {
            page = INITIAL_PAGE,
            limit = PAGE_LIMIT,
            searchValue = ''
        } = request.query;

        try {
            const {count, rows} = await Vehicle.findAndCountAll({
                where: {
                    [Op.or]: [
                        {plate: {[Op.iLike]: `%${searchValue}%`}},
                        {brand: {[Op.iLike]: `%${searchValue}%`}},
                        {model: {[Op.iLike]: `%${searchValue}%`}}
                    ],
                    tenantId: request.user.tenant
                },
                limit: parseInt(limit, 10),
                offset: getPaginationOffset(page, limit),
                order: [['updatedAt', 'DESC'], ['brand', 'ASC'], ['model', 'ASC']],
                distinct: true
            });

            const data = rows.map(v => ({...v.toJSON(), _links: buildVehicleLinks(v.id)}));
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
