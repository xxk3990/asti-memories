const mem = require("./controllers/memories-controller")
const com = require("./controllers/comments-controller")
const admin = require("./controllers/admin-controller")
const recap = require("./middleware/recaptcha")
const user = require("./controllers/users-controller")
const file = require("./controllers/files-controller")

const router = (app) => {
   app.get("/memories", mem.getMemories)
   app.post("/memories", mem.createMemory)
   app.put("/memories", mem.likeMemory)
   app.delete("/memories", admin.adminDeleteMemory)
   app.get("/comments", com.getComments)
   app.get("/commentCount", com.getNumberOfComments)
   app.post("/comments", com.addComment)
   app.delete('/comments', admin.adminDeleteComment)
   app.post("/admin", admin.createAdminAccount)
   app.post("/adminLogin", admin.adminLogin)
   app.post("/recaptcha", recap.verifyRecaptcha)
   app.get("/users", user.checkForUser)
   app.post("/users", user.createTemporaryUser)
   app.get("/images", file.getImageForMemory)
   app.delete("/images", admin.adminDeleteImage)
   app.get("/audio", file.getAudioFromS3)
   app.get("/gallery", file.getGalleryImages)
   app.post("/gallery", file.saveGalleryImage)
   app.get("/randomize", file.createUniqueFileName)
}

module.exports = router;