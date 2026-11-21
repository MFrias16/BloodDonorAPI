import { ObjectId } from "mongodb";

const OBJECT_ID_PATTERN = /^[0-9a-fA-F]{24}$/;

export function parseObjectId(id) {
    return OBJECT_ID_PATTERN.test(id) ? new ObjectId(id) : null;
}

export function withoutUndefined(data) {
    return Object.fromEntries(
        Object.entries(data).filter(([, value]) => value !== undefined),
    );
}
