const SegmentosController = require('../app/controller/SegmentosController');
const express = require('express');
const router = express.Router();


module.exports = router

    .get('/segmentos',  SegmentosController.list)

    .post('/segmentos/crear', SegmentosController.add)

    .post('/segmentos/update', SegmentosController.update)
    
    .post('/segmentos/delete', SegmentosController.delete)
    
    .post('/segmentos/get', SegmentosController.get)

;
