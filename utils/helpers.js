// helpers.js
export const multiply = (a, b) => a * b;

export const formatPrice = (value) =>{
    if (typeof value !== 'number') return value;
    return value.toFixed(2); // Redondea a 2 decimales
};

export const eq = (a, b) => a === b;