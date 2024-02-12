const mem = require("./controllers/memories-controller")
const com = require("./controllers/comments-controller")
const admin = require("./controllers/admin-controller")
const recap = require("./middleware/recaptcha")
const user = require("./controllers/users-controller")
const image = require("./controllers/images-controller")

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
   app.get("/images", image.getImageForMemory)
   app.delete("/images", admin.adminDeleteImage)
   app.get("/gallery", image.getGalleryImages)
   app.post("/gallery", image.saveGalleryImage)
   app.get("/randomize", image.createUniqueFileName)
}

module.exports = router;