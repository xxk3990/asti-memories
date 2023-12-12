const mem = require("./controllers/memories-controller")
const com = require("./controllers/comments-controller")
const router = (app) => {
   app.get("/memories", mem.getMemories)
   app.post("/memories", mem.createMemory)
   app.put("/memories", mem.likeMemory)
   app.get("/comments", com.getComments)
   app.post("/comments", com.addComment)

}

module.exports = router;