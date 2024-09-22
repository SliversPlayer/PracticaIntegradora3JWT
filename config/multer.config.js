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
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

// Filtrar los tipos de archivos permitidos
const fileFilter = (req, file, cb) => {
    // Aceptar solo imágenes, documentos PDF y otros tipos específicos según sea necesario
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' || file.mimetype === 'application/pdf') {
        cb(null, true);
    } else {
        cb(new Error('Tipo de archivo no permitido'), false);
    }
};

const upload = multer({ 
    storage: storage,
    fileFilter: fileFilter,
    limits: { fileSize: 1024 * 1024 * 5 }  // Limitar tamaño a 5MB
});

export default upload;