import prisma from '../utils/prisma.js';

// 1. Get all products (supports search, categoryId filter, name ordering)
export const getProducts = async (req, res) => {
  try {
    const { search, categoryId } = req.query;

    const where = {};

    if (search) {
      where.productName = {
        contains: search,
      };
    }

    if (categoryId) {
      const parsedCatId = parseInt(categoryId);
      if (!isNaN(parsedCatId)) {
        where.categoryId = parsedCatId;
      }
    }

    const products = await prisma.product.findMany({
      where,
      include: {
        category: true,
      },
      orderBy: {
        productName: 'asc',
      },
    });

    return res.status(200).json(products);
  } catch (error) {
    console.error('Get products error:', error);
    return res.status(500).json({ error: 'Internal server error.' });
  }
};

// 2. Get product by ID
export const getProductById = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: 'Invalid product ID.' });
    }

    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        category: true,
      },
    });

    if (!product) {
      return res.status(404).json({ error: 'Product not found.' });
    }

    return res.status(200).json(product);
  } catch (error) {
    console.error('Get product by ID error:', error);
    return res.status(500).json({ error: 'Internal server error.' });
  }
};

// 3. Create product (ADMIN only)
export const createProduct = async (req, res) => {
  try {
    const { productName, price, stock, categoryId, description, imageUrl } = req.body;

    // Validation
    if (!productName || typeof productName !== 'string') {
      return res.status(400).json({ error: 'Product name is required and must be a string.' });
    }

    const trimmedName = productName.trim();
    if (trimmedName.length < 2 || trimmedName.length > 100) {
      return res.status(400).json({ error: 'Product name must be between 2 and 100 characters long.' });
    }

    if (price === undefined || typeof price !== 'number' || price <= 0) {
      return res.status(400).json({ error: 'Price is required and must be a number greater than 0.' });
    }

    if (stock === undefined || !Number.isInteger(stock) || stock < 0) {
      return res.status(400).json({ error: 'Stock is required and must be a non-negative integer.' });
    }

    if (categoryId === undefined || isNaN(parseInt(categoryId))) {
      return res.status(400).json({ error: 'Valid Category ID is required.' });
    }

    const parsedCatId = parseInt(categoryId);

    // Verify Category exists
    const categoryExists = await prisma.category.findUnique({
      where: { id: parsedCatId },
    });

    if (!categoryExists) {
      return res.status(400).json({ error: 'Category does not exist.' });
    }

    // Check duplicate name within the same category
    const existingProduct = await prisma.product.findFirst({
      where: {
        categoryId: parsedCatId,
        productName: trimmedName,
      },
    });

    if (existingProduct) {
      return res.status(400).json({ error: 'Product name already exists in this category.' });
    }

    const newProduct = await prisma.product.create({
      data: {
        productName: trimmedName,
        price,
        stock,
        categoryId: parsedCatId,
        description: description || null,
        imageUrl: imageUrl || null,
      },
      include: {
        category: true,
      },
    });

    return res.status(201).json({
      message: 'Product created successfully.',
      product: newProduct,
    });
  } catch (error) {
    console.error('Create product error:', error);
    return res.status(500).json({ error: 'Internal server error.' });
  }
};

// 4. Update product (ADMIN only)
export const updateProduct = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: 'Invalid product ID.' });
    }

    const { productName, price, stock, categoryId, description, imageUrl } = req.body;

    // Verify product exists
    const product = await prisma.product.findUnique({
      where: { id },
    });

    if (!product) {
      return res.status(404).json({ error: 'Product not found.' });
    }

    const data = {};

    if (productName !== undefined) {
      if (typeof productName !== 'string') {
        return res.status(400).json({ error: 'Product name must be a string.' });
      }
      const trimmedName = productName.trim();
      if (trimmedName.length < 2 || trimmedName.length > 100) {
        return res.status(400).json({ error: 'Product name must be between 2 and 100 characters long.' });
      }
      data.productName = trimmedName;
    }

    if (price !== undefined) {
      if (typeof price !== 'number' || price <= 0) {
        return res.status(400).json({ error: 'Price must be a number greater than 0.' });
      }
      data.price = price;
    }

    if (stock !== undefined) {
      if (!Number.isInteger(stock) || stock < 0) {
        return res.status(400).json({ error: 'Stock must be a non-negative integer.' });
      }
      data.stock = stock;
    }

    let parsedCatId = product.categoryId;
    if (categoryId !== undefined) {
      if (isNaN(parseInt(categoryId))) {
        return res.status(400).json({ error: 'Valid Category ID is required.' });
      }
      parsedCatId = parseInt(categoryId);
      const categoryExists = await prisma.category.findUnique({
        where: { id: parsedCatId },
      });
      if (!categoryExists) {
        return res.status(400).json({ error: 'Category does not exist.' });
      }
      data.categoryId = parsedCatId;
    }

    if (description !== undefined) {
      data.description = description || null;
    }

    if (imageUrl !== undefined) {
      data.imageUrl = imageUrl || null;
    }

    // Check duplicate name within the same category if the name or category changed
    const targetName = data.productName || product.productName;
    if (
      (data.productName && product.productName.toLowerCase() !== data.productName.toLowerCase()) ||
      (data.categoryId && product.categoryId !== data.categoryId)
    ) {
      const duplicate = await prisma.product.findFirst({
        where: {
          categoryId: parsedCatId,
          productName: targetName,
        },
      });
      if (duplicate && duplicate.id !== id) {
        return res.status(400).json({ error: 'Product name already exists in this category.' });
      }
    }

    const updatedProduct = await prisma.product.update({
      where: { id },
      data,
      include: {
        category: true,
      },
    });

    return res.status(200).json({
      message: 'Product updated successfully.',
      product: updatedProduct,
    });
  } catch (error) {
    console.error('Update product error:', error);
    return res.status(500).json({ error: 'Internal server error.' });
  }
};

// 5. Delete product (ADMIN only)
export const deleteProduct = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: 'Invalid product ID.' });
    }

    // Verify product exists
    const product = await prisma.product.findUnique({
      where: { id },
    });

    if (!product) {
      return res.status(404).json({ error: 'Product not found.' });
    }

    await prisma.product.delete({
      where: { id },
    });

    return res.status(200).json({
      message: 'Product deleted successfully.',
    });
  } catch (error) {
    console.error('Delete product error:', error);
    return res.status(500).json({ error: 'Internal server error.' });
  }
};
