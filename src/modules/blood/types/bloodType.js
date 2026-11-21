export const BLOOD_TYPES = [
    "O-",
    "O+",
    "A-",
    "A+",
    "B-",
    "B+",
    "AB-",
    "AB+",
];

export function isBloodType(value) {
    return typeof value === "string" && BLOOD_TYPES.includes(value);
}
