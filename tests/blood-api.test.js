import assert from "node:assert/strict";
import { after, before, test } from "node:test";
import app from "../src/app.js";
import { BloodCompatibility } from "../src/modules/blood/models/bloodCompatibility.model.js";
import {
    createDonorSchema,
    parseWith,
} from "../src/modules/blood/services/blood.validators.js";

let server;
let baseUrl;

before(async () => {
    server = app.listen(0);
    await new Promise((resolve) => server.once("listening", resolve));
    baseUrl = `http://127.0.0.1:${server.address().port}`;
});

after(async () => {
    await new Promise((resolve, reject) => {
        server.close((error) => (error ? reject(error) : resolve()));
    });
});

test("root route returns a health response", async () => {
    const response = await fetch(`${baseUrl}/`);
    assert.equal(response.status, 200);
    assert.equal((await response.json()).status, 200);
});

test("unknown routes return a JSON 404", async () => {
    const response = await fetch(`${baseUrl}/missing`);
    assert.equal(response.status, 404);
    assert.match((await response.json()).message, /GET \/missing/);
});

test("invalid donor payload returns validation details without connecting to MongoDB", async () => {
    const response = await fetch(`${baseUrl}/api/donors`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ bloodType: "invalid" }),
    });

    assert.equal(response.status, 400);
    const body = await response.json();
    assert.equal(body.status, 400);
    assert.ok(body.details.length > 0);
});

test("A+ recipient compatibility includes only the expected donor types", () => {
    assert.deepEqual(BloodCompatibility.getCompatibleDonors("A+"), [
        "O-",
        "O+",
        "A-",
        "A+",
    ]);
});

test("donor validation trims text and rejects negative distance", () => {
    const donor = parseWith(createDonorSchema, {
        name: "  Alex  ",
        bloodType: "O-",
        city: "  Quito ",
        distanceKm: 2,
        isAvailable: true,
        phone: "555-0100",
    });
    assert.equal(donor.name, "Alex");
    assert.equal(donor.city, "Quito");

    assert.throws(
        () =>
            parseWith(createDonorSchema, {
                ...donor,
                distanceKm: -1,
            }),
        { statusCode: 400 },
    );
});
