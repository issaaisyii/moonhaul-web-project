import prisma from '../utils/prisma.js';

// 1. Get all categories
export const getCategories = async (req, res) => {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { name: 'asc' },
    });
    return res.status(200).json(categories);
  } catch (error) {
    console.error('Get categories error:', error);
    return res.status(500).json({ error: 'Internal server error.' });
  }
};

// 2. Get category by ID
export const getCategoryById = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: 'Invalid category ID.' });
    }

    const category = await prisma.category.findUnique({
      where: { id },
    });

    if (!category) {
      return res.status(404).json({ error: 'Category not found.' });
    }

    return res.status(200).json(category);
  } catch (error) {
    console.error('Get category by ID error:', error);
    return res.status(500).json({ error: 'Internal server error.' });
  }
};

// 3. Create category (ADMIN only)
export const createCategory = async (req, res) => {
  try {
    const { name } = req.body;

    // Validation
    if (!name || typeof name !== 'string') {
      return res.status(400).json({ error: 'Category name is required and must be a string.' });
    }

    const trimmedName = name.trim();
    if (trimmedName.length < 2 || trimmedName.length > 50) {
      return res.status(400).json({ error: 'Category name must be between 2 and 50 characters long.' });
    }

    // Check duplicate (case-insensitive check)
    // Note: Since name is unique in MySQL, unique lookup is natively case-insensitive by default in MySQL, 
    // but doing an explicit check allows us to return a friendly error message.
    const existingCategory = await prisma.category.findFirst({
      where: {
        name: trimmedName,
      },
    });

    if (existingCategory) {
      return res.status(400).json({ error: 'Category name already exists.' });
    }

    const newCategory = await prisma.category.create({
      data: {
        name: trimmedName,
      },
    });

    return res.status(201).json({
      message: 'Category created successfully.',
      category: newCategory,
    });
  } catch (error) {
    console.error('Create category error:', error);
    return res.status(500).json({ error: 'Internal server error.' });
  }
};

// 4. Update category (ADMIN only)
export const updateCategory = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: 'Invalid category ID.' });
    }

    const { name } = req.body;

    // Validation
    if (!name || typeof name !== 'string') {
      return res.status(400).json({ error: 'Category name is required and must be a string.' });
    }

    const trimmedName = name.trim();
    if (trimmedName.length < 2 || trimmedName.length > 50) {
      return res.status(400).json({ error: 'Category name must be between 2 and 50 characters long.' });
    }

    // Verify category exists
    const category = await prisma.category.findUnique({
      where: { id },
    });

    if (!category) {
      return res.status(404).json({ error: 'Category not found.' });
    }

    // Check duplicate if the name is changed
    if (category.name.toLowerCase() !== trimmedName.toLowerCase()) {
      const duplicate = await prisma.category.findFirst({
        where: { name: trimmedName },
      });

      if (duplicate) {
        return res.status(400).json({ error: 'Category name already exists.' });
      }
    }

    const updatedCategory = await prisma.category.update({
      where: { id },
      data: { name: trimmedName },
    });

    return res.status(200).json({
      message: 'Category updated successfully.',
      category: updatedCategory,
    });
  } catch (error) {
    console.error('Update category error:', error);
    return res.status(500).json({ error: 'Internal server error.' });
  }
};

// 5. Delete category (ADMIN only)
export const deleteCategory = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: 'Invalid category ID.' });
    }

    // Verify category exists
    const category = await prisma.category.findUnique({
      where: { id },
    });

    if (!category) {
      return res.status(404).json({ error: 'Category not found.' });
    }

    // Optional Check: Are there products associated with this category?
    // The schema specifies `Product` has relationship to `Category`. 
    // Delete will fail or set cascade, in our schema it uses RESTRICT on delete:
    // ALTER TABLE `Product` ADD CONSTRAINT `Product_categoryId_fkey` FOREIGN KEY (`categoryId`) REFERENCES `Category`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
    // So if there are products, MySQL RESTRICT will prevent deletion, but we can verify it cleanly.
    const productsCount = await prisma.product.count({
      where: { categoryId: id },
    });

    if (productsCount > 0) {
      return res.status(400).json({ error: 'Cannot delete category that contains products.' });
    }

    await prisma.category.delete({
      where: { id },
    });

    return res.status(200).json({
      message: 'Category deleted successfully.',
    });
  } catch (error) {
    console.error('Delete category error:', error);
    return res.status(500).json({ error: 'Internal server error.' });
  }
};
