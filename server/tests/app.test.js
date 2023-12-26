const request = require('supertest')
const app = require("../app")
const entries = require("./testEntries")

describe("POST /memories", () => {
    it("Should send a status code of 200 if user_uuid provided", async () => {
        const response = await request(app).post("/memories").send(entries.memory1)
        expect(response.statusCode).toEqual(200)
    })
    it("Should return 400 if user_uuid is undefined", async () => {
        const response = await request(app).post("/memories").send({})
        expect(response.statusCode).toEqual(400)
        expect(response.body).toEqual("Memory creation failed.")
    })
});

describe("POST /comments", () => {
    it("Should return a status of 200 if all comment details provided", async () => {
        const response = await request(app).post("/comments").send({
            comment: entries.comment1
        })
        expect(response.statusCode).toEqual(200)
    })
    it("Should return 400 if not all comment details are given", async () => {
        const response = await request(app).post("/comments").send({})
        expect(response.statusCode).toEqual(400)
        expect(response.body).toEqual("Unable to post comment.")
    })
})

describe("POST /adminCreateAccount", () => {
    it("Should create an Admin if all data is provided", async() => {
        const response = await request(app).post("/admin").send(entries.admin1)
        expect(response.statusCode).toEqual(200)
    })
    it("Should return bad request if no display_name was provided", async () => {
        const response = await request(app).post("/admin").send(entries.admin2)
        expect(response.statusCode).toEqual(400);
        expect(response.body).toEqual("Unable to create account.");
    })
    it("Should return bad request if email not provided", async () => {
        const response = await request(app).post("/admin").send(entries.admin3);
        expect(response.statusCode).toEqual(400)
        expect(response.body).toEqual("Unable to create account.");
    })
    it("Should return bad request if password not provided", async () => {
        const response = await request(app).post("/admin").send(entries.admin4);
        expect(response.statusCode).toEqual(400)
        expect(response.body).toEqual("Unable to create account.");
    })
})

describe("POST /adminLogin", () => {
    it("Should return bad request if email not provided", async () => {
        const response = await request(app).post("/adminLogin").send(entries.admin3);
        expect(response.statusCode).toEqual(400)
        expect(response.body).toEqual("Missing required info.")
    })
    it("Should return bad request if password not provided", async () => {
        const response = await request(app).post("/adminLogin").send(entries.admin4);
        expect(response.statusCode).toEqual(400)
        expect(response.body).toEqual("Missing required info.")
    })
})