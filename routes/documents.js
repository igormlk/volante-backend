// routes/document.routes.js
import {Document} from '../models/CustomerDocument.js';

const buildDocumentLinks = (customerId, documentId) => ({
    self: `/documents/${documentId}`,
    customer: `/customers/${customerId}`
});

export default async function documentRoutes(api, opts) {
    api.get('/', {preValidation: [api.authenticate]}, async (request, reply) => {
        const {
            page = 1,
            limit = 50
        } = request.query;

        const offset = page <= 1 ? 0 : (page - 1) * limit;

        try {
            const {count, rows} = await Document.findAndCountAll({
                where: {tenantId: request.user.tenant},
                limit: parseInt(limit, 10),
                offset,
                order: [['updatedAt', 'DESC']],
                distinct: true
            });

            const result = rows.map(d => ({
                ...d.toJSON(),
                _links: buildDocumentLinks(d.customer_id, d.id)
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
            const doc = await Document.findOne({
                where: {
                    id: request.params.id,
                    tenantId: request.user.tenant
                }
            });
            if (!doc) return reply.status(404).send({error: 'Document not found'});
            reply.send({...doc.toJSON(), _links: buildDocumentLinks(doc.customer_id, doc.id)});
        } catch (error) {
            reply.status(500).send({error: error.message});
        }
    });

    api.patch('/:id', {preValidation: [api.authenticate]}, async (request, reply) => {
        try {
            const doc = await Document.findOne({
                where: {
                    id: request.params.id,
                    tenantId: request.user.tenant
                }
            });
            if (!doc) return reply.status(404).send({error: 'Document not found'});
            await doc.update(request.body);
            reply.send({...doc.toJSON(), _links: buildDocumentLinks(doc.customer_id, doc.id)});
        } catch (error) {
            reply.status(500).send({error: error.message});
        }
    });

    api.delete('/:id', {preValidation: [api.authenticate]}, async (request, reply) => {
        try {
            const deleted = await Document.destroy({
                where: {
                    id: request.params.id,
                    tenantId: request.user.tenant
                }
            });
            if (!deleted) return reply.status(404).send({error: 'Document not found'});
            reply.status(204).send();
        } catch (error) {
            reply.status(500).send({error: error.message});
        }
    });
}

