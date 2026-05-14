import express from "express";
import swaggerUi from "swagger-ui-express";
import { deleteProduct, getAllProducts, getProductById, updateProduct } from "./product.api.js";
import { productSchema } from "./product.schema.js";
import { swaggerSpec } from "./swagger.js";
import { validateProductData } from "./validate.js";

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
app.post("/products", validateProductData(productSchema), (req, res) => {
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

/**
 * @swagger
 * /products/{id}:
 *   get:
 *     summary: Get a product by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Product ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Product found
 *       404:
 *         description: Product not found
 */
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

/**
 * @swagger
 * /products/{id}:
 *   put:
 *     summary: Update a product by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Product ID
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               price:
 *                 type: number
 *               category:
 *                 type: string
 *               brand:
 *                 type: string
 *               stock:
 *                 type: number
 *               rating:
 *                 type: number
 *               isAvailable:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Product updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 name:
 *                   type: string
 *                 description:
 *                   type: string
 *                 price:
 *                   type: number
 *                 category:
 *                   type: string
 *                 brand:
 *                   type: string
 *                 stock:
 *                   type: number
 *                 rating:
 *                   type: number
 *                 isAvailable:
 *                   type: boolean
 *       404:
 *         description: Product not found
 */
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

/**
 *
 * @swagger
 * /products/{id}:
 *   delete:
 *     summary: Delete a product by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Product ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Product deleted successfully
 *       404:
 *         description: Product not found
 */

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
