import { bloodRequestService } from "../services/bloodRequest.service.js";
import {
    bloodRequestFilterSchema,
    parseId,
    parseWith,
} from "../services/blood.validators.js";

export const bloodRequestController = {
    async create(req, res) {
        const request = await bloodRequestService.create(req.body);
        res.status(201).json({ status: 201, data: request });
    },

    async list(req, res) {
        const filter = parseWith(bloodRequestFilterSchema, req.query);
        const requests = await bloodRequestService.list(filter);
        res.status(200).json({
            status: 200,
            count: requests.length,
            data: requests,
        });
    },

    async getById(req, res) {
        const request = await bloodRequestService.getById(parseId(req.params.id));
        res.status(200).json({ status: 200, data: request });
    },

    async update(req, res) {
        const request = await bloodRequestService.update(
            parseId(req.params.id),
            req.body,
        );
        res.status(200).json({ status: 200, data: request });
    },

    async remove(req, res) {
        await bloodRequestService.remove(parseId(req.params.id));
        res.status(204).send();
    },

    async getCompatibleDonors(req, res) {
        const donors = await bloodRequestService.getCompatibleDonors(
            parseId(req.params.id),
        );
        res.status(200).json({
            status: 200,
            count: donors.length,
            data: donors,
        });
    },
};
