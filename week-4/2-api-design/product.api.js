import { products } from "./products.js";

// ✅ Create a product
function createProduct(product) {
  const id = `p${String(products.length + 1).padStart(3, "0")}`;
  const newProduct = {
    id,
    ...product,
    createdAt: new Date().toISOString(),
  };

  products.push(newProduct);
  return newProduct;
}

// ✅ Get all products
function getAllProducts() {
  return products;
}

// ✅ Get a product by id
function getProductById(id) {
  return products.find(pd => pd.id === id) || null;
}

// ✅ Update a product by id
function updateProduct(id, updatedData) {
  const productIndex = products.findIndex(pd => pd.id === id);

  if (productIndex === -1) {
    return null;
  }

  const updatedProduct = {
    ...products[productIndex],
    ...updatedData,
  };

  products[productIndex] = updatedProduct;
  return updatedProduct;
}

// ✅ Delete a product by id
function deleteProduct(id) {
  const productIndex = products.findIndex(pd => pd.id === id);

  if (productIndex === -1) {
    return false;
  }

  products.splice(productIndex, 1);
  return true;
}

export { createProduct, deleteProduct, getAllProducts, getProductById, updateProduct };
