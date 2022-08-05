const express = require('express');

const FilesController = require('../app/controller/FilesController');


const router = express.Router();


module.exports = router
    .get('/upload/:filename', FilesController.get)
    .post('/upload/add', FilesController.add)
    .post('/upload/delete', FilesController.delete);

