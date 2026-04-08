export const validateProductData = productSchema => {
  return (req, res, next) => {
    try {
      const validatedData = productSchema.parse(req.body);
      next();
    } catch (error) {
      //   const invalidField = error.message[0].path[0];
      const erroObject = JSON.parse(error.message);
      const invalidField = erroObject[0].path[0];
      const errorMessage = `Invalid value for field ${invalidField}: ${erroObject[0].message}`;
      res.status(400).json({ error: errorMessage });
    }
  };
};
