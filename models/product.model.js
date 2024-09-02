import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

const productsCollection = "products";

const productsSchema = new mongoose.Schema({
    title: { type: String, required: true, max: 100 },  // Corregido "requiered" a "required"
    description: { type: String, required: true, max: 100 },  // Corregido "requiered" a "required"
    price: { type: Number, required: true },  // Corregido "requiered" a "required"
    category: { type: String, required: true, max: 100 },  // Corregido "requiered" a "required"
    code: { type: String, required: true, max: 100, unique: true },  // Corregido "requiered" a "required"
    stock: { type: String, required: true, max: 50 },  // Corregido "requiered" a "required"
    owner: { 
        type: String, 
        default: 'admin',
        validate: {
            validator: async function(value) {
                if (value === 'admin') return true;
                const user = await mongoose.model('users').findOne({ email: value });
                return user && user.role === 'premium';
            },
            message: 'Owner must be a premium user'
        }
    }
});

productsSchema.plugin(mongoosePaginate);
const productModel = mongoose.model(productsCollection, productsSchema);

export default productModel;