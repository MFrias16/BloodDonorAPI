import { BLOOD_REQUESTS_COLLECTION } from "../../../config/env.js";
import getMongoDb from "../../../config/db.js";
import { parseObjectId, withoutUndefined } from "./mongo.helpers.js";

function toBloodRequest({ _id, ...document }) {
    return { id: _id.toHexString(), ...document };
}

function buildFilter(filter) {
    const query = {};
    if (filter.isUrgent !== undefined) query.isUrgent = filter.isUrgent;
    if (filter.city !== undefined) query.city = filter.city;
    if (filter.bloodType !== undefined) query.bloodType = filter.bloodType;
    return query;
}

class BloodRequestRepository {
    async collection() {
        const db = await getMongoDb();
        return db.collection(BLOOD_REQUESTS_COLLECTION);
    }

    async create(data) {
        const collection = await this.collection();
        const result = await collection.insertOne({ ...data });
        return { id: result.insertedId.toHexString(), ...data };
    }

    async findAll(filter = {}) {
        const collection = await this.collection();
        const documents = await collection
            .find(buildFilter(filter))
            .sort({ isUrgent: -1, distanceKm: 1 })
            .toArray();
        return documents.map(toBloodRequest);
    }

    async findById(id) {
        const _id = parseObjectId(id);
        if (!_id) return null;

        const collection = await this.collection();
        const document = await collection.findOne({ _id });
        return document ? toBloodRequest(document) : null;
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
        return document ? toBloodRequest(document) : null;
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

export const bloodRequestRepository = new BloodRequestRepository();
