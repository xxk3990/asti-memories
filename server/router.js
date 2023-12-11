const mem = require("./controllers/memories-controller")
const router = (app) => {
   app.get("/memories", mem.getMemories)
   app.post("/memories", mem.createMemory)
   app.put("/memories", mem.likeMemory)
   app.post("/comments", mem.addComment)
}

module.exports = router;