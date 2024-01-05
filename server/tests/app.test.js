const request = require('supertest')
const app = require("../app")
const fixtures = require("./test-fixtures")
const {
    sequelize
} = require("../models")
const pre = require("./preload")
const prefixes = require("./preloaded-fixtures")

beforeAll(async () => {
    await sequelize.sync({
        force: true
    })
    pre.preload(); //preload user, comment, admin, and memory into DB so user, comment, admin, and memory tests can run
})

describe("GET /memories", () => {
    //happy path
    it("should return 200 if memories exist", async () => {
        const response = await request(app).get("/memories")
        expect(response.statusCode).toBe(200);
    })

    /*
    There is no way to test the no content path for memories, as in order for the tests below to run,
    memories have to be pre-loaded into the test DB. Any 204 path test for /memories will always fail.
    */
})

describe("POST /memories", () => {
    //happy path
    it("should create memory if user_uuid provided", async () => {
        const response = await request(app).post("/memories").send(fixtures.test_memory)
        expect(response.statusCode).toBe(201)
    })

    //bad path
    it("should return 400 if user_uuid is undefined", async () => {
        const response = await request(app).post("/memories").send({})
        expect(response.statusCode).toBe(400)
        expect(response.body).toBe("Memory creation failed.")
    })
});

describe("PUT /memories likes", () => {
    //happy path
    it("should increase # of likes by 1 if memory_uuid provided", async () => {
        const response = await request(app).put("/memories").send(fixtures.memory_new_like_good)
        expect(response.statusCode).toBe(200)
    })

    //bad path
    it("should return 404 if memory_uuid not provided", async () => {
        const response = await request(app).put("/memories").send(fixtures.memory_new_like_bad)
        expect(response.statusCode).toBe(404)
    })
})

describe("GET /comments", () => {
    //happy path
    it("should return list of comments given memory_uuid and comments exist", async () => {
        const response = await request(app).get(`/comments?memory_uuid=${prefixes.preloaded_comment.memory_uuid}`)
        expect(response.statusCode).toBe(200);
    })

    //no content path
    it("should return 204 if memory exists but it has no comments", async () => {
        const response = await request(app).get(`/comments?memory_uuid=${prefixes.preloaded_memory_without_comment.uuid}`)
        expect(response.statusCode).toBe(204)
    })

    //bad path – no memory_uuid
    it("should send 404 if no memory_uuid provided", async () => {
        const response = await request(app).get("/comments")
        expect(response.statusCode).toBe(404)
        expect(response.body).toBe("Memory not found.")
    })

})

describe("POST /comments", () => {
    //happy path
    it("should create comment if all comment details provided", async () => {
        const response = await request(app).post("/comments").send({
            comment: fixtures.test_comment
        })
        expect(response.statusCode).toBe(201)
    })

    //bad path
    it("should return 400 if not all comment details are given", async () => {
        const response = await request(app).post("/comments").send({})
        expect(response.statusCode).toBe(400)
        expect(response.body).toBe("Unable to post comment.")
    })
})

describe("POST /adminCreateAccount", () => {
    //happy path
    it("should create an Admin if all data is provided", async () => {
        const response = await request(app).post("/admin").send(fixtures.admin_good)
        expect(response.statusCode).toBe(201)
    })

    //bad paths
    it("should return 400 if no display_name was provided", async () => {
        const response = await request(app).post("/admin").send(fixtures.admin_no_name)
        expect(response.statusCode).toBe(400);
        expect(response.body).toBe("Unable to create account.");
    })
    it("should return 400 if email not provided", async () => {
        const response = await request(app).post("/admin").send(fixtures.admin_no_email);
        expect(response.statusCode).toBe(400)
        expect(response.body).toBe("Unable to create account.");
    })
    it("should return 400 if password not provided", async () => {
        const response = await request(app).post("/admin").send(fixtures.admin_no_password);
        expect(response.statusCode).toBe(400)
        expect(response.body).toBe("Unable to create account.");
    })
})

describe("POST /adminLogin", () => {
    //happy path
    it("should be successful if details match existing admin", async () => {
        const response = await request(app).post("/adminLogin").send(fixtures.admin_login_good)
        expect(response.statusCode).toBe(200)
    })

    //bad paths – missing fields
    it("should return 400 if email not provided", async () => {
        const response = await request(app).post("/adminLogin").send(fixtures.admin_no_email);
        expect(response.statusCode).toBe(400)
        expect(response.body).toBe("Missing required info.")
    })
    it("should return 400 if password not provided", async () => {
        const response = await request(app).post("/adminLogin").send(fixtures.admin_no_password);
        expect(response.statusCode).toBe(400)
        expect(response.body).toBe("Missing required info.")
    })

    //bad paths – 401
    it("should return 401 if email does not match existing admin", async () => {
        const response = await request(app).post("/adminLogin").send(fixtures.admin_login_unauthorized_email)
        expect(response.statusCode).toBe(401)
    })
    it("should return 401 if password does not match existing admin", async () => {
        const response = await request(app).post("/adminLogin").send(fixtures.admin_login_unauthorized_password)
        expect(response.statusCode).toBe(401)
    })

})


afterAll(async () => {
    await sequelize.close();
})