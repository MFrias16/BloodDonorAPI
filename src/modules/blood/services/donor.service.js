import { NotFoundError } from "../../../errors/app.errors.js";
import { donorRepository } from "../repositories/donor.repository.js";
import {
    createDonorSchema,
    parseBloodType,
    parseWith,
    updateDonorSchema,
} from "./blood.validators.js";

class DonorService {
    async create(data) {
        return donorRepository.create(parseWith(createDonorSchema, data));
    }

    async list(filter = {}) {
        return donorRepository.findAll(filter);
    }

    async getById(id) {
        const donor = await donorRepository.findById(id);
        if (!donor) {
            throw new NotFoundError(`No se encontró el donante con id "${id}".`);
        }
        return donor;
    }

    async update(id, data) {
        const donor = await donorRepository.update(
            id,
            parseWith(updateDonorSchema, data),
        );
        if (!donor) {
            throw new NotFoundError(`No se encontró el donante con id "${id}".`);
        }
        return donor;
    }

    async remove(id) {
        const removed = await donorRepository.delete(id);
        if (!removed) {
            throw new NotFoundError(`No se encontró el donante con id "${id}".`);
        }
    }

    async findCompatible(recipientType, options = {}) {
        return donorRepository.findCompatible(
            parseBloodType(recipientType),
            options,
        );
    }

    async count(filter = {}) {
        return donorRepository.count(filter);
    }
}

export const donorService = new DonorService();
