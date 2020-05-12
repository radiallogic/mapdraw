var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const request = require('supertest');
const app = require('../app');
const async = require("async");
describe("POST /signup", () => {
    it("should return 200 OK", () => __awaiter(this, void 0, void 0, function* () {
        return yield request(app).post("/login")
            .field("email", "test@gmail.com")
            .field("password", "foo")
            .expect(200);
    }));
});
describe("POST /login", () => {
    it("can login with correct details", (done) => __awaiter(this, void 0, void 0, function* () {
        return yield request(app).post("/login")
            .field("email", "test@gmail.com")
            .field("password", "foo")
            .expect(200);
    }));
});
describe("POST /login", () => {
    it("blank password returns an error", (done) => __awaiter(this, void 0, void 0, function* () {
        return yield request(app).post("/login")
            .field("email", "test@gmail.com")
            .field("password", "")
            .expect(302);
    }));
});
describe("POST /login", () => {
    it("should return some defined error message with valid parameters", (done) => __awaiter(this, void 0, void 0, function* () {
        return yield request(app).post("/login")
            .field("email", "john@me.com")
            .field("password", "Hunter2")
            .expect(302);
    }));
});
describe("GET /reset", () => {
    it("should return 302 Found for redirection", () => __awaiter(this, void 0, void 0, function* () {
        return yield request(app).get("/reset/1")
            .expect(302);
    }));
});
//# sourceMappingURL=user.test.js.map