import 'dotenv/config';
import prisma from '../utils/prisma.js';
import bcrypt from 'bcrypt';

async function main() {
  console.log('Seeding database with Categories, Products, and Users...');

  // 1. Seed Users (idempotently)
  const adminHashed = await bcrypt.hash('admin123', 10);
  const customerHashed = await bcrypt.hash('customer123', 10);

  const admin = await prisma.user.upsert({
    where: { email: 'admin@moonhaul.com' },
    update: {},
    create: {
      name: 'Super Admin',
      email: 'admin@moonhaul.com',
      password: adminHashed,
      role: 'ADMIN',
    },
  });
  console.log('Admin seeded successfully:', admin.email);

  const customer = await prisma.user.upsert({
    where: { email: 'customer@moonhaul.com' },
    update: {},
    create: {
      name: 'John Customer',
      email: 'customer@moonhaul.com',
      password: customerHashed,
      role: 'CUSTOMER',
    },
  });
  console.log('Customer seeded successfully:', customer.email);

  // 2. Seed Categories
  const categoryData = [
    { name: 'Plushies' },
    { name: 'Lightsticks' },
    { name: 'Albums' }
  ];

  const categoriesMap = {};
  for (const cat of categoryData) {
    const createdCat = await prisma.category.upsert({
      where: { name: cat.name },
      update: {},
      create: { name: cat.name }
    });
    categoriesMap[cat.name] = createdCat.id;
  }
  console.log('Categories seeded successfully.');

  // 3. Seed Products
  const productsData = [
    // Plushies
    {
      productName: 'enchin',
      price: 186000,
      stock: 99,
      description: 'Gantungan kunci lucu',
      imageUrl: 'https://www.byitkpop.com/cdn/shop/files/9a4d742ceabd7624cc2cdc46624f0fe2.png?v=1779330211',
      categoryName: 'Plushies'
    },
    {
      productName: 'bbnexdo',
      price: 203000,
      stock: 100,
      description: 'Gantungan kunci lucu',
      imageUrl: 'https://down-id.img.susercontent.com/file/id-11134207-8224z-mi2pmep2wufaef',
      categoryName: 'Plushies'
    },
    {
      productName: 'miniteen',
      price: 175000,
      stock: 100,
      description: 'Gantungan kunci lucu',
      imageUrl: 'https://images.tokopedia.net/img/cache/700/aphluv/1997/1/1/5d9caade12d8477aaab63c11d781b418~.jpeg.webp',
      categoryName: 'Plushies'
    },
    {
      productName: 'ppulbatu',
      price: 184000,
      stock: 100,
      description: 'Gantungan kunci lucu',
      imageUrl: 'https://www.byitkpop.com/cdn/shop/files/85cc9ec77b84bb57f77e0bd12255cb07.png?v=1759196009',
      categoryName: 'Plushies'
    },
    // Lightsticks
    {
      productName: 'tws',
      price: 763000,
      stock: 100,
      description: 'Lightstick TWS',
      imageUrl: 'https://sukoshi.com/cdn/shop/files/tws-offcial-light-stick-1_1024x1024.jpg?v=1737922410',
      categoryName: 'Lightsticks'
    },
    {
      productName: 'seventeen ver 3',
      price: 758000,
      stock: 100,
      description: 'Lightstick seventeen ver 3',
      imageUrl: 'https://www.melodiary.com/image/cache/catalog/2022%20PREORDER/SEVENTEEN%20-%20Official%20Lightstick%20Ver.3%2010th%20Anniv.%20c-500x500.png',
      categoryName: 'Lightsticks'
    },
    {
      productName: 'enhypen ver 2v',
      price: 749000,
      stock: 100,
      description: 'Lightstick enhypen ver 2v',
      imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR2iHSc3EIn9SDKd3xtKQA-SaFROKGuz5pP1PW2vi8evxO5Ju15L6x-5cU&s=10',
      categoryName: 'Lightsticks'
    },
    {
      productName: 'txt',
      price: 778000,
      stock: 100,
      description: 'Lightstick txt',
      imageUrl: 'https://sukoshi.com/cdn/shop/files/tomorrow-x-together-txt-official-lightstick-ver2-1_1024x1024.jpg?v=1730069035',
      categoryName: 'Lightsticks'
    },
    {
      productName: 'boynextdoor set',
      price: 847000,
      stock: 100,
      description: 'Lightstick boynextdoor set',
      imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT8JcnRtGWv7XD7Pryh0VnRAdCqMVMf3e54YDXLxrZ7cxkf_ubBLMe6Q68&s=10',
      categoryName: 'Lightsticks'
    },
    // Albums
    {
      productName: 'best album 17’ right here',
      price: 487000,
      stock: 100,
      description: 'Best album 17’ right here',
      imageUrl: 'https://down-id.img.susercontent.com/file/id-11134207-7r992-ltkl5kxzzlvc45',
      categoryName: 'Albums'
    },
    {
      productName: 'romance : untold daydream',
      price: 438000,
      stock: 100,
      description: 'Album Enhypen romance : untold daydream',
      imageUrl: 'https://baro7.com/cdn/shop/files/enhypen-romance-untold-daydream-best-kpop-store-421094.jpg?v=1728966124',
      categoryName: 'Albums'
    },
    {
      productName: 'blue hour minisode',
      price: 427000,
      stock: 100,
      description: 'Album blue hour minisode',
      imageUrl: 'https://m.media-amazon.com/images/I/51+rREmx9ZL.jpg',
      categoryName: 'Albums'
    },
    {
      productName: '2nd ep (how?)',
      price: 423000,
      stock: 99,
      description: 'Album 2nd ep (how?)',
      imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSVwL7qA3PuQQ8mZUyhaN-BS_18IYZUWrmA7bDELjJlTw&s=10',
      categoryName: 'Albums'
    }
  ];

  for (const prod of productsData) {
    const categoryId = categoriesMap[prod.categoryName];
    if (!categoryId) continue;

    // Check if product already exists by name to remain idempotent
    const existingProduct = await prisma.product.findFirst({
      where: { productName: prod.productName }
    });

    if (existingProduct) {
      await prisma.product.update({
        where: { id: existingProduct.id },
        data: {
          price: prod.price,
          stock: prod.stock,
          description: prod.description,
          imageUrl: prod.imageUrl,
          categoryId: categoryId
        }
      });
    } else {
      await prisma.product.create({
        data: {
          productName: prod.productName,
          price: prod.price,
          stock: prod.stock,
          description: prod.description,
          imageUrl: prod.imageUrl,
          categoryId: categoryId
        }
      });
    }
  }
  console.log('Products seeded successfully.');
  console.log('Database seeding finished.');
}

main()
  .catch((e) => {
    console.error('Error during database seed execution:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
