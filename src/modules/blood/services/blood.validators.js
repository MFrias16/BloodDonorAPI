import { z } from "zod";
import { ValidationError } from "../../../errors/app.errors.js";
import { BLOOD_TYPES } from "../types/bloodType.js";

const requiredText = (field) =>
    z
        .string({ error: `El campo "${field}" debe ser un texto.` })
        .trim()
        .min(1, { error: `El campo "${field}" no puede estar vacío.` });

const distanceSchema = z
    .number({ error: 'El campo "distanceKm" debe ser un número.' })
    .min(0, { error: 'El campo "distanceKm" no puede ser negativo.' });

const unitsSchema = z
    .number({ error: 'El campo "unitsNeeded" debe ser un número.' })
    .int({ error: 'El campo "unitsNeeded" debe ser un número entero.' })
    .min(1, { error: 'El campo "unitsNeeded" debe ser mayor o igual a 1.' });

const donationsSchema = z
    .number({ error: 'El campo "donationsCount" debe ser un número.' })
    .int({ error: 'El campo "donationsCount" debe ser un número entero.' })
    .min(0, { error: 'El campo "donationsCount" no puede ser negativo.' });

export const bloodTypeSchema = z.enum(BLOOD_TYPES, {
    error: `Tipo de sangre inválido. Valores permitidos: ${BLOOD_TYPES.join(", ")}.`,
});

const createBloodRequestObject = z.object({
    patientName: requiredText("patientName"),
    bloodType: bloodTypeSchema,
    hospital: requiredText("hospital"),
    city: requiredText("city"),
    distanceKm: distanceSchema,
    unitsNeeded: unitsSchema,
    isUrgent: z.boolean({
        error: 'El campo "isUrgent" debe ser verdadero o falso.',
    }),
    timeAgo: requiredText("timeAgo"),
});

export const createBloodRequestSchema = createBloodRequestObject;
export const updateBloodRequestSchema = createBloodRequestObject.partial();

const createDonorObject = z.object({
    name: requiredText("name"),
    bloodType: bloodTypeSchema,
    city: requiredText("city"),
    distanceKm: distanceSchema,
    donationsCount: donationsSchema.optional(),
    isAvailable: z.boolean({
        error: 'El campo "isAvailable" debe ser verdadero o falso.',
    }),
    phone: requiredText("phone"),
});

export const createDonorSchema = createDonorObject;
export const updateDonorSchema = createDonorObject.partial();

const booleanQuery = z
    .enum(["true", "false"], {
        error: 'El parámetro debe ser "true" o "false".',
    })
    .transform((value) => value === "true");

const optionalCity = z
    .string({ error: "La ciudad debe ser un texto." })
    .trim()
    .min(1, { error: "La ciudad no puede estar vacía." })
    .optional();

export const bloodRequestFilterSchema = z.object({
    isUrgent: booleanQuery.optional(),
    city: optionalCity,
    bloodType: bloodTypeSchema.optional(),
});

export const donorFilterSchema = z.object({
    isAvailable: booleanQuery.optional(),
    city: optionalCity,
    bloodType: bloodTypeSchema.optional(),
});

export const compatibleDonorsQuerySchema = z.object({
    recipientType: bloodTypeSchema,
    onlyAvailable: booleanQuery.optional(),
    city: optionalCity,
});

export const idSchema = z
    .string({ error: "El id es obligatorio." })
    .trim()
    .min(1, { error: "El id no puede estar vacío." });

function formatIssues(error) {
    return error.issues.map((issue) => {
        const path = issue.path.join(".");
        return path ? `${path}: ${issue.message}` : issue.message;
    });
}

export function parseWith(schema, data) {
    const result = schema.safeParse(data);
    if (!result.success) {
        throw new ValidationError(
            "Los datos enviados no son válidos.",
            formatIssues(result.error),
        );
    }
    return result.data;
}

export function parseBloodType(value) {
    return parseWith(bloodTypeSchema, value);
}

export function parseId(value) {
    return parseWith(idSchema, value);
}
