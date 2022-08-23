const express =require('express'); 
const { Category } = require('../models/categorie');
const {Product}=require('../models/product');
const router=express.Router(); 
const multer = require('multer'); 
const mongoose= require('mongoose');

const FILE_TYPE_MAP ={
    'image/png' :'png',
    'image/jpeg' :'jpeg',
    'image/jpg' :'jpg'
}
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const isValid =FILE_TYPE_MAP[file.mimetype];
        let uploadError = new Error('invalid image type');
        if(isValid){
            uploadError = null
        }
      cb(uploadError, 'public/uploads')
    },
filename: function (req, file, cb) {

    const extension= FILE_TYPE_MAP[file.mimetype];
      const fileName=file.originalname;
      cb(null, `${fileName}.${extension}`)
    }
  })

const uploadOptions =multer ({ storage :storage})

router.get(`/`, async (req,res)=> {
   // http://localhost:3000/api/v1/products?categories=123456,1234567
    //get product by categories 
    let filter ={};
    if (req.query.categories)
    {
        filter ={category:req.query.categories.split(',')}
    }
    const productList = await Product.find(filter).populate('category');
   
    if(!productList){
        res.status(500).json({succes:false})
    }
    res.send(productList); 
})




router.get(`/:id`, async (req,res)=> {
    const product = await Product.findById(req.params.id).populate('category');
   
    if(!product){
        res.status(500).json({succes:false})
    }
    res.send(product); 
})



router.post(`/`, uploadOptions.single('image') , async (req,res)=> {

    const  category= await Category.findById(req.body.category);
    if(!category) return res.status(400).send('invalid')

   const file =req.file; 
   if(!file) return res.status(400).send('image is not defined ')

   const fileName=req.file.filename
   const basePath = `${req.protocol}://${req.get('host')}/public/uploads/`;
   let product = new Product({
    name : req.body.name,
    description:req.body.description,
    richDescription:req.body.richDescription, 
    image : `${basePath}${fileName}`,
    brand:req.body.brand,
    price: req.body.price,
    category:req.body.category,
    countInStock : req.body.countInStock,
    rating:req.body.rating,
    numReviews:req.body.numReviews,
    isFeatured: req.body.isFeatured,
    dateCreated:req.body.dateCreated

   })

   product.save(); 
   if(!product)
   return res.status(200).send('the product cannot be created')
   res.send(product); 
  
})



router.put('/:id',async (req ,res) =>{
    if (!mongoose.isValidObjectId(req.params.id)) {
        return res.status(400).send('Invalid Product Id');
    }
    const category = await Category.findById(req.body.category);
    if (!category) return res.status(402).send('Invalid Category');

    const product = await Product.findById(req.params.id);
    if (!product) return res.status(400).send('Invalid Product!');

    const file = req.file;
    let imagepath;

    if (file) {
        const fileName = file.filename;
        const basePath = `${req.protocol}://${req.get('host')}/public/uploads/`;
        imagepath = `${basePath}${fileName}`;
    } else {
        imagepath = product.image;
    }

    const updatedProduct = await Product.findByIdAndUpdate(
        req.params.id,
        {
            name: req.body.name,
            description: req.body.description,
            richDescription: req.body.richDescription,
            image: imagepath,
            brand: req.body.brand,
            price: req.body.price,
            category: req.body.category,
            countInStock: req.body.countInStock,
            rating: req.body.rating,
            numReviews: req.body.numReviews,
            isFeatured: req.body.isFeatured
        },
        { new: true }
    );

    if (!updatedProduct) return res.status(500).send('the product cannot be updated!');

    res.send(updatedProduct);
});


     router.put('/gallery-images/:id', uploadOptions.array('images', 10), async (req, res) => {
        if (!mongoose.isValidObjectId(req.params.id)) {
            return res.status(400).send('Invalid Product Id');
        }
        const files = req.files;
        let imagesPaths = [];
        const basePath = `${req.protocol}://${req.get('host')}/public/uploads/`;
    
        if (files) {
            files.map((file) => {
                imagesPaths.push(`${basePath}${file.filename}`);
            });
        }
    
        const product = await Product.findByIdAndUpdate(
            req.params.id,
            {
                images: imagesPaths
            },
            { new: true }
        );
    
        if (!product) return res.status(500).send('the gallery cannot be updated!');
    
        res.send(product);
    });

module.exports =router;