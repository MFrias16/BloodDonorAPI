import { NotFoundError } from "../../../errors/app.errors.js";
import { donorRepository } from "../repositories/donor.repository.js";
import { bloodRequestRepository } from "../repositories/bloodRequest.repository.js";
import {
    createBloodRequestSchema,
    parseWith,
    updateBloodRequestSchema,
} from "./blood.validators.js";

class BloodRequestService {
    async create(data) {
        return bloodRequestRepository.create(
            parseWith(createBloodRequestSchema, data),
        );
    }

    async list(filter = {}) {
        return bloodRequestRepository.findAll(filter);
    }

    async getById(id) {
        const request = await bloodRequestRepository.findById(id);
        if (!request) {
            throw new NotFoundError(`No se encontró la solicitud con id "${id}".`);
        }
        return request;
    }

    async update(id, data) {
        const request = await bloodRequestRepository.update(
            id,
            parseWith(updateBloodRequestSchema, data),
        );
        if (!request) {
            throw new NotFoundError(`No se encontró la solicitud con id "${id}".`);
        }
        return request;
    }

    async remove(id) {
        const removed = await bloodRequestRepository.delete(id);
        if (!removed) {
            throw new NotFoundError(`No se encontró la solicitud con id "${id}".`);
        }
    }

    async getCompatibleDonors(id) {
        const request = await this.getById(id);
        return donorRepository.findCompatible(request.bloodType);
    }

    async count(filter = {}) {
        return bloodRequestRepository.count(filter);
    }
}

export const bloodRequestService = new BloodRequestService();
