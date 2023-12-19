const mem = require("./controllers/memories-controller")
const com = require("./controllers/comments-controller")
const admin = require("./controllers/admin-controller")
const router = (app) => {
   app.get("/memories", mem.getMemories)
   app.post("/memories", mem.createMemory)
   app.put("/memories", mem.likeMemory)
   app.delete("/memories", admin.adminDeleteMemory)
   app.get("/comments", com.getComments)
   app.post("/comments", com.addComment)
   app.delete('/comments', admin.adminDeleteComment)
   app.post("/admin", admin.createAdminAccount)
   app.post("/adminLogin", admin.adminLogin)
   

}

module.exports = router;