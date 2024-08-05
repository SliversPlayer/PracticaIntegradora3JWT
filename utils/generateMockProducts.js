import { faker } from '@faker-js/faker';

// Función para generar un producto falso
const generateProduct = () => {
    return {
        title: faker.commerce.productName(),
        description: faker.commerce.productDescription(),
        price: parseFloat(faker.commerce.price()),
        category: faker.commerce.department(),
        code: faker.string.alpha(10),
        stock: faker.number.int({ min: 0, max: 100 }).toString()
    };
};

// Generar una lista de 100 productos falsos
const generateMockProducts = (count = 100) => {
    const products = [];
    for (let i = 0; i < count; i++) {
        products.push(generateProduct());
    }
    return products;
};

export default generateMockProducts;
