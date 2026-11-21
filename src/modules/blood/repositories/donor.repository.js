import { DONORS_COLLECTION } from "../../../config/env.js";
import getMongoDb from "../../../config/db.js";
import { BloodCompatibility } from "../models/bloodCompatibility.model.js";
import { parseObjectId, withoutUndefined } from "./mongo.helpers.js";

function toDonor({ _id, ...document }) {
    return { id: _id.toHexString(), ...document };
}

function buildFilter(filter) {
    const query = {};
    if (filter.isAvailable !== undefined) query.isAvailable = filter.isAvailable;
    if (filter.city !== undefined) query.city = filter.city;
    if (filter.bloodType !== undefined) query.bloodType = filter.bloodType;
    return query;
}

class DonorRepository {
    async collection() {
        const db = await getMongoDb();
        return db.collection(DONORS_COLLECTION);
    }

    async create(data) {
        const collection = await this.collection();
        const document = {
            ...data,
            donationsCount: data.donationsCount ?? 0,
        };
        const result = await collection.insertOne({ ...document });
        return { id: result.insertedId.toHexString(), ...document };
    }

    async findAll(filter = {}) {
        const collection = await this.collection();
        const documents = await collection
            .find(buildFilter(filter))
            .sort({ isAvailable: -1, distanceKm: 1 })
            .toArray();
        return documents.map(toDonor);
    }

    async findById(id) {
        const _id = parseObjectId(id);
        if (!_id) return null;

        const collection = await this.collection();
        const document = await collection.findOne({ _id });
        return document ? toDonor(document) : null;
    }

    async findCompatible(recipientType, options = {}) {
        const compatibleTypes =
            BloodCompatibility.getCompatibleDonors(recipientType);
        if (compatibleTypes.length === 0) return [];

        const query = { bloodType: { $in: compatibleTypes } };
        if (options.onlyAvailable ?? true) query.isAvailable = true;
        if (options.city !== undefined) query.city = options.city;

        const collection = await this.collection();
        const documents = await collection
            .find(query)
            .sort({ distanceKm: 1 })
            .toArray();
        return documents.map(toDonor);
    }

    async update(id, data) {
        const _id = parseObjectId(id);
        if (!_id) return null;

        const $set = withoutUndefined(data);
        if (Object.keys($set).length === 0) return this.findById(id);

        const collection = await this.collection();
        const document = await collection.findOneAndUpdate(
            { _id },
            { $set },
            { returnDocument: "after" },
        );
        return document ? toDonor(document) : null;
    }

    async delete(id) {
        const _id = parseObjectId(id);
        if (!_id) return false;

        const collection = await this.collection();
        const result = await collection.deleteOne({ _id });
        return result.deletedCount === 1;
    }

    async count(filter = {}) {
        const collection = await this.collection();
        return collection.countDocuments(buildFilter(filter));
    }
}

export const donorRepository = new DonorRepository();
