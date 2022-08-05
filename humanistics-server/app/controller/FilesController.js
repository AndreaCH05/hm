let fs = require('fs');
let mime = require('mime');

/**
 * @class FilesController.js
 * @description
 */

const storage = './storage/uploads/';

class FilesController{

    /**
     * @static
     * @memberof FilesController
     *
     * @method add
     * @description
     * */
    static add = async (request, response) =>{
        let file = request.files.file;
        if (file == undefined) return response.status(500).send({ message : "No es posible subir el archivo." })
        let fileSplit = file.name.split(".");
        let fileName = Math.random().toString(36).substring(2, 15) + "." + fileSplit[fileSplit.length -1];
        if (!fs.existsSync(storage)) {
            fs.mkdirSync(storage, { recursive: true })
        }
        file.mv(storage + `${fileName}`,err => {
            if(err) return response.status(500).send({ message : err })
            return response.status(200).send({
                message : 'File upload' ,
                filename: fileName
            })
        })
    };

    /**
     * @static
     * @memberof FilesController
     *
     * @method delete
     * @description
     * */
    static delete = async (request, response) =>{
        fs.unlink(`./storage/uploads/${request.body.filename}`, function (err) {
            if (err)  return response.status(500).send({
                message : 'El archivo no existe' ,
                filename: request.body.filename
            });
            return response.status(200).send({
                message : 'Archivo eliminado'
            })
        })
    };

    /**
     * @static
     * @memberof FilesController
     *
     * @method get
     * @description
     * */
    static get = async (request, response) =>{
        let filename = request.params.filename;
        if (filename == undefined)
            return response.status(404);

        filename = `./storage/uploads/${filename}`;

        if (fs.existsSync(filename)) {
            fs.readFile(filename, function(err, data){
                if (err) {
                    return response.status(404).end("File not found.");
                    // return res.end("File not found.");
                }
                return response
                    .header("Content-Type", mime.getType(filename))
                    .status(200)
                    .end(data);
            });
        } else {
            return response
                .status(403)
                .end("Forbidden.");
        }
    };
}
module.exports = FilesController;
