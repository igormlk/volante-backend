// routes/contact.routes.js
import {Contact} from '../models/Contact.js';

const buildContactLinks = (customerId, contactId) => ({
    self: `/contacts/${contactId}`,
    customer: `/customers/${customerId}`
});

export default async function contactRoutes(api, opts) {
    api.get('/', { preValidation: [api.authenticate] }, async (request, reply) => {
        const {
            page = 1,
            limit = 50
        } = request.query;

        const offset = page <= 1 ? 0 : (page - 1) * limit;

        try {
            const { count, rows } = await Contact.findAndCountAll({
                where: { tenantId: request.user.tenant },
                limit: parseInt(limit, 10),
                offset,
                order: [['createdAt', 'DESC']],
                distinct: true
            });

            const result = rows.map(c => ({
                ...c.toJSON(),
                _links: buildContactLinks(c.customer_id, c.id)
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
            const contact = await Contact.findOne({
                where: {
                    id: request.params.id,
                    tenantId: request.user.tenant
                }
            });
            if (!contact) return reply.status(404).send({ error: 'Contact not found' });
            reply.send({ ...contact.toJSON(), _links: buildContactLinks(contact.customer_id, contact.id) });
        } catch (error) {
            reply.status(500).send({ error: error.message });
        }
    });

    api.patch('/:id', { preValidation: [api.authenticate] }, async (request, reply) => {
        try {
            const contact = await Contact.findOne({
                where: {
                    id: request.params.id,
                    tenantId: request.user.tenant
                }
            });
            if (!contact) return reply.status(404).send({ error: 'Contact not found' });
            await contact.update(request.body);
            reply.send({ ...contact.toJSON(), _links: buildContactLinks(contact.customer_id, contact.id) });
        } catch (error) {
            reply.status(500).send({ error: error.message });
        }
    });

    api.delete('/:id', { preValidation: [api.authenticate] }, async (request, reply) => {
        try {
            const deleted = await Contact.destroy({
                where: {
                    id: request.params.id,
                    tenantId: request.user.tenant
                }
            });
            if (!deleted) return reply.status(404).send({ error: 'Contact not found' });
            reply.status(204).send();
        } catch (error) {
            reply.status(500).send({ error: error.message });
        }
    });
}
