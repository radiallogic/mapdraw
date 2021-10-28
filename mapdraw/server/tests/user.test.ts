// const request = require('supertest')
// const app = require('../app')
// const async = require("async");

/**
 * @jest-environment node
 */

// describe("POST /user/signup", () => {
//     it(" signup needs confirmed password", (done) => {
//         let foo = request(app).post("/user/signup")
//             .set('Accept', 'application/json')
//             .set('Content-Type', 'application/json')
//             .send({"email":"psykx.in@gmail.com", "password": "foop" })
//             .expect('Content-Type', /json/)
//             .expect(422)
//             .end(function(err, res) {
//                 console.log('res.body', res.body);
//                 if (err) return done(err);
//                 done();

//             });
//     });
// });

// describe("POST /user/signup", () => {
//     it("signup with working data should return 200 OK", (done) => {
//         request(app).post("/user/signup")
//             .set('Accept', 'application/json')
//             .set('Content-Type', 'application/json')
//             .send({"email":"psykx.in@gmail.com", "password": "foop", "confirmPassword": "foop" })
//             .expect(200)
//             .end(function(err, res) {
//                 console.log('res.body', res.body);
//                 if (err) return done(err);
//                 done();

//             });
//     });
// });

// describe("POST /user/signup", () => {
//     it("duplicate signup should error", (done) => {
//         request(app).post("/user/signup")
//             .set('Accept', 'application/json')
//             .set('Content-Type', 'application/json')
//             .send({"email":"psykx.in@gmail.com", "password": "foop", "confirmPassword": "foop" })
//             .expect(422, done);
//     });
// });

// describe("POST /login", () => {
//     it("can login with correct details", (done) => {
//         request(app).post("/user/login")
//             .set('Accept', 'application/json')
//             .set('Content-Type', 'application/json')
//             .send({"email":"psykx.in@gmail.com", "password": "foop"})
//             .expect(200)
//             .end(function(err, res) {
//                 if (err) throw err;
//             });

//     });
// });

// describe("POST /login", () => {
//     it("blank password returns an error",  (done) => {
//         request(app).post("/login")
//             .set('Accept', 'application/json')
//             .set('Content-Type', 'application/json')
//             .send({"email":"psykx.in@gmail.com", "password": "" })
//             .expect(422)
//             .end(function(err, res) {
//                 if (err) throw err;
//               });

//     });
// });


// describe("POST /isloggedin", () => {
//     it("if logged in it returns true",  (done) => {
//         request(app).post("/user/login")
//             .set('Accept', 'application/json')
//             .set('Content-Type', 'application/json')
//             .send({"email":"psykx.in@gmail.com", "password": "foop"})
//             .expect(200, done);

//         request(app).post("/user/isloggedin")
//             .set('Accept', 'application/json')
//             .set('Content-Type', 'application/json')
//             .expect(function(res) {
//                 console.log(res.body);
//                 //res.body
//               })
//             .expect(200, done);

//     });
// });


// describe("POST /logout", () => {
//     it("should return some defined error message with valid parameters", async (done) => {
//         return await request(app).post("/login")
//             .field("email", "john@me.com")
//             .field("password", "Hunter2")
//             .expect(302)
//     });
// });

// describe("GET /reset", () => {
//     it("should return 302 Found for redirection", async () => {
//         return await request(app).get("/reset/1")
//             .expect(302);
//     });
// });

