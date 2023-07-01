const router = require("express").Router();
const userController = require("../controllers/userController");
const fileController = require("../controllers/fileController");
const mediaController = require("../controllers/mediaController");
const functions =require("../utils/functions");
// router.get('/:id',(req, res) => {
//     console.log(req.params);
//     mediaController.streamAudio(req, res,'./files/file_example_MP3_1MG.mp3');
// })

router.post("/login", async (req, res) => {
    userController.checkAndUpdateUser(req, res);
});

router.post("/upload",fileController.upload.single('video'), (req, res) => {
    console.log(req.file);
    console.log(req.file.path);
    console.log("uploading...");
    fileController.uploadToDB(req,res).then((result) => {
        res.send({id:result});
    })
   
  }),

  router.post("/convert/:id", async (req, res) => {
    console.log("in convert");
   const file = await fileController.getSingleFile(req, res);
   const audioFilePath =functions.getAudioFilePath(file.videoFilePath);
   mediaController.convertVideoToAudio(file.videoFilePath, audioFilePath);
    file.audioFilePath= audioFilePath;
    fileController.updateFile(req, res, file);
    mediaController.streamAudio(req, res, audioFilePath);
  })

  router.get('/view-all', async (req, res) => {
   const files = await fileController.getAllFiles(req, res);
   res.json(files);
  })

  router.get('/view/:id', async (req, res) => {
   const file= await fileController.getSingleFile(req, res);
    res.send(file);
  })

  router.post('/delete/:id', async (req, res) => {
    fileController.deleteFile(req, res);
  })

module.exports = router;
