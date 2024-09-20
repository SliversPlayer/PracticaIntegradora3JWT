import multer from 'multer';
import path from 'path';

// Configuración de almacenamiento para diferentes tipos de archivos
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        // Definir destino según el tipo de archivo
        if (file.fieldname === 'profile') {
            cb(null, 'uploads/profiles'); // Carpeta para perfiles
        } else if (file.fieldname === 'product') {
            cb(null, 'uploads/products'); // Carpeta para productos
        } else if (file.fieldname === 'document') {
            cb(null, 'uploads/documents'); // Carpeta para documentos
        } else {
            cb(new Error('Tipo de archivo no soportado'), false);
        }
    },
    filename: (req, file, cb) => {
        // Configuración del nombre del archivo
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

// Middleware de Multer configurado
const upload = multer({ storage });

export default upload;
