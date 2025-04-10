// routes/address.routes.js
import {Address} from '../models/Address.js';

const buildAddressLinks = (customerId, addressId) => ({
    self: `/addresses/${addressId}`,
    customer: `/customers/${customerId}`
});

export default async function addressRoutes(api, opts) {
    api.get('/', { preValidation: [api.authenticate] }, async (request, reply) => {
        const {
            page = 1,
            limit = 50
        } = request.query;

        const offset = page <= 1 ? 0 : (page - 1) * limit;

        try {
            const { count, rows } = await Address.findAndCountAll({
                where: { tenantId: request.user.tenant },
                limit: parseInt(limit, 10),
                offset,
                order: [['createdAt', 'DESC']],
                distinct: true
            });

            const result = rows.map(a => ({
                ...a.toJSON(),
                _links: buildAddressLinks(a.customer_id, a.id)
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
            reply.status(500).send({ error: error.message });
        }
    });

    api.get('/:id', { preValidation: [api.authenticate] }, async (request, reply) => {
        try {
            const address = await Address.findOne({
                where: {
                    id: request.params.id,
                    tenantId: request.user.tenant
                }
            });
            if (!address) return reply.status(404).send({ error: 'Address not found' });
            reply.send({ ...address.toJSON(), _links: buildAddressLinks(address.customer_id, address.id) });
        } catch (error) {
            reply.status(500).send({ error: error.message });
        }
    });

    api.patch('/:id', { preValidation: [api.authenticate] }, async (request, reply) => {
        try {
            const address = await Address.findOne({
                where: {
                    id: request.params.id,
                    tenantId: request.user.tenant
                }
            });
            if (!address) return reply.status(404).send({ error: 'Address not found' });
            await address.update(request.body);
            reply.send({ ...address.toJSON(), _links: buildAddressLinks(address.customer_id, address.id) });
        } catch (error) {
            reply.status(500).send({ error: error.message });
        }
    });

    api.delete('/:id', { preValidation: [api.authenticate] }, async (request, reply) => {
        try {
            const deleted = await Address.destroy({
                where: {
                    id: request.params.id,
                    tenantId: request.user.tenant
                }
            });
            if (!deleted) return reply.status(404).send({ error: 'Address not found' });
            reply.status(204).send();
        } catch (error) {
            reply.status(500).send({ error: error.message });
        }
    });
}
