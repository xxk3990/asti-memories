const mem = require("./controllers/memories-controller")
const router = (app) => {
   app.get("/memories", mem.getMemories)
   app.post("/memories", mem.createMemory)
}

module.exports = router;