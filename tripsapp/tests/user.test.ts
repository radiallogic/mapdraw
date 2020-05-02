const request = require('supertest')
const app = require('../app')
const async = require("async");


describe("POST /signup", () => {
    it("should return 200 OK", async () => {
        return await request(app).post("/login")
            .field("email", "test@gmail.com")
            .field("password", "foo")
            .expect(200);
    });
});

describe("POST /login", () => {
    it("can login with correct details", async (done) => {
        return await request(app).post("/login")
            .field("email", "test@gmail.com")
            .field("password", "foo")
            .expect(200);

    });
});

describe("POST /login", () => {
    it("blank password returns an error", async (done) => {
        return await request(app).post("/login")
            .field("email", "test@gmail.com")
            .field("password", "")
            .expect(302)

    });
});

describe("POST /login", () => {
    it("should return some defined error message with valid parameters", async (done) => {
        return await request(app).post("/login")
            .field("email", "john@me.com")
            .field("password", "Hunter2")
            .expect(302)
    });
});

describe("GET /reset", () => {
    it("should return 302 Found for redirection", async () => {
        return await request(app).get("/reset/1")
            .expect(302);
    });
});

