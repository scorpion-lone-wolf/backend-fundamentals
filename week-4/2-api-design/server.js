import express from "express";
import swaggerUi from "swagger-ui-express";
import { deleteProduct, getAllProducts, getProductById, updateProduct } from "./product.api.js";
import { swaggerSpec } from "./swagger.js";

const PORT = 3007;

const app = express();

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use(express.json());

/**
 * @swagger
 * /products:
 *   post:
 *     summary: Create a new product
 *     requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                  name:
 *                      type: string
 *                  description:
 *                      type: string
 *                  price:
 *                      type: number
 *                  category:
 *                      type: string
 *                  brand:
 *                      type: string
 *                  stock:
 *                      type: number
 *                  rating:
 *                      type: number
 *                      example: 4.5
 *                  isAvailable:
 *                      type: boolean
 *     responses:
 *       201:
 *         description: Product created successfully
 */
// ✅ Create product
app.post("/products", (req, res) => {
  const newProduct = req.body;
  createProduct(newProduct);
  res.status(201).json(newProduct);
});

/**
 * @swagger
 * /products:
 *  get:
 *     summary: Get all products
 *     responses:
 *      200:
 *          description: List of all products
 */
// ✅ Get all products
app.get("/products", (req, res) => {
  const products = getAllProducts();
  res.json({ message: "Get all products", data: products });
});

// ✅ Get product by ID
app.get("/products/:id", (req, res) => {
  const productId = req.params.id;
  const product = getProductById(productId);

  if (product) {
    res.json({ message: "Get product by id", data: product });
  } else {
    res.status(404).json({ message: "Product not found" });
  }
});

// ✅ Update product
app.put("/products/:id", (req, res) => {
  const productId = req.params.id;
  const updatedData = req.body;

  const updatedProduct = updateProduct(productId, updatedData);

  if (updatedProduct) {
    res.json({
      message: "Product updated successfully",
      data: updatedProduct,
    });
  } else {
    res.status(404).json({ message: "Product not found" });
  }
});

// ✅ Delete product
app.delete("/products/:id", (req, res) => {
  const productId = req.params.id;
  const isDeleted = deleteProduct(productId);

  if (isDeleted) {
    res.json({ message: "Product deleted successfully" });
  } else {
    res.status(404).json({ message: "Product not found" });
  }
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
