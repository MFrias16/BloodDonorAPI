import { isBloodType } from "../types/bloodType.js";

const COMPATIBILITY_MAP = {
    "O-": ["O-"],
    "O+": ["O-", "O+"],
    "A-": ["O-", "A-"],
    "A+": ["O-", "O+", "A-", "A+"],
    "B-": ["O-", "B-"],
    "B+": ["O-", "O+", "B-", "B+"],
    "AB-": ["O-", "A-", "B-", "AB-"],
    "AB+": ["O-", "O+", "A-", "A+", "B-", "B+", "AB-", "AB+"],
};

export class BloodCompatibility {
    static getCompatibleDonors(recipientType) {
        if (!isBloodType(recipientType)) return [];
        return [...COMPATIBILITY_MAP[recipientType]];
    }
}
