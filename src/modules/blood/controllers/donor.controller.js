import { donorService } from "../services/donor.service.js";
import {
    compatibleDonorsQuerySchema,
    donorFilterSchema,
    parseId,
    parseWith,
} from "../services/blood.validators.js";

export const donorController = {
    async create(req, res) {
        const donor = await donorService.create(req.body);
        res.status(201).json({ status: 201, data: donor });
    },

    async list(req, res) {
        const filter = parseWith(donorFilterSchema, req.query);
        const donors = await donorService.list(filter);
        res.status(200).json({
            status: 200,
            count: donors.length,
            data: donors,
        });
    },

    async findCompatible(req, res) {
        const query = parseWith(compatibleDonorsQuerySchema, req.query);
        const donors = await donorService.findCompatible(query.recipientType, {
            onlyAvailable: query.onlyAvailable,
            city: query.city,
        });
        res.status(200).json({
            status: 200,
            count: donors.length,
            data: donors,
        });
    },

    async getById(req, res) {
        const donor = await donorService.getById(parseId(req.params.id));
        res.status(200).json({ status: 200, data: donor });
    },

    async update(req, res) {
        const donor = await donorService.update(
            parseId(req.params.id),
            req.body,
        );
        res.status(200).json({ status: 200, data: donor });
    },

    async remove(req, res) {
        await donorService.remove(parseId(req.params.id));
        res.status(204).send();
    },
};
