const request = require('supertest')
const app = require("../app")
const fixtures = require("./testFixtures")
const {sequelize} = require("../models")
const pre = require("./preload")

beforeAll(async () => {
    await sequelize.sync({force: true})
    pre.preload(); //preload user and memory into DB so memory and comment tests can run
})

describe("POST /memories", () => {
    it("Should send a status code of 201 if user_uuid provided", async () => {
        const response = await request(app).post("/memories").send(fixtures.memory1)
        expect(response.statusCode).toBe(201)
    })
    it("Should return 400 if user_uuid is undefined", async () => {
        const response = await request(app).post("/memories").send({})
        expect(response.statusCode).toBe(400)
        expect(response.body).toBe("Memory creation failed.")
    })
});

describe("POST /comments", () => {
    it("Should return a status of 201 if all comment details provided", async () => {
        const response = await request(app).post("/comments").send({
            comment: fixtures.comment1
        })
        expect(response.statusCode).toBe(201)
    })
    it("Should return 400 if not all comment details are given", async () => {
        const response = await request(app).post("/comments").send({})
        expect(response.statusCode).toBe(400)
        expect(response.body).toBe("Unable to post comment.")
    })
})

describe("POST /adminCreateAccount", () => {
    it("Should create an Admin if all data is provided", async() => {
        const response = await request(app).post("/admin").send(fixtures.admin1)
        expect(response.statusCode).toBe(200)
    })
    it("Should return bad request if no display_name was provided", async () => {
        const response = await request(app).post("/admin").send(fixtures.admin2)
        expect(response.statusCode).toBe(400);
        expect(response.body).toBe("Unable to create account.");
    })
    it("Should return bad request if email not provided", async () => {
        const response = await request(app).post("/admin").send(fixtures.admin3);
        expect(response.statusCode).toBe(400)
        expect(response.body).toBe("Unable to create account.");
    })
    it("Should return bad request if password not provided", async () => {
        const response = await request(app).post("/admin").send(fixtures.admin4);
        expect(response.statusCode).toBe(400)
        expect(response.body).toBe("Unable to create account.");
    })
})

describe("POST /adminLogin", () => {
    it("Should return bad request if email not provided", async () => {
        const response = await request(app).post("/adminLogin").send(fixtures.admin3);
        expect(response.statusCode).toBe(400)
        expect(response.body).toBe("Missing required info.")
    })
    it("Should return bad request if password not provided", async () => {
        const response = await request(app).post("/adminLogin").send(fixtures.admin4);
        expect(response.statusCode).toBe(400)
        expect(response.body).toBe("Missing required info.")
    })

})


afterAll(async () => {
    await sequelize.close();
})