const express = require('express');
const verificar = require('../app/middleware/TokenVerifier');
const router = express.Router();


const ProductosController = require('../app/controller/ProductosController');

module.exports = router
.get('/productos',verificar, ProductosController.list)
.post('/productos',verificar , ProductosController.list)
.post('/productos/id',verificar, ProductosController.get)
.post('/productos/add',verificar, ProductosController.add)
.post('/productos/update/delete-image',verificar,ProductosController.deleteImage)
.put('/productos/update',verificar,ProductosController.update)
.delete('/productos/delete',verificar,ProductosController.delete)

.post('/productos/cambioEstatus',verificar , ProductosController.cambioEstatus);




