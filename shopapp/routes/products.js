require("express-async-errors");
const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const { Product, Comment, validateProduct } = require("../models/product");
const isAdmin = require("../middleware/isAdmin");


router.get("/", async (req, res, next) => {
    // const products = await Product.find();
    // const products = await Product.find({ price: 10000, isActive: true }); // FİYATI 10K TL VE AKTİF OLANI GETİRİR 
    // const products = await Product.find({ isActive: true }).limit(1).select({ name: 1, price: 1 }); // AKTİF OLANLARI GETİRİR FAKAT SADECE NAME AND PRICE OLARAK
    // const products = await Product.find(); // HEPSİNİ GETİRİR
    // const products = await Product.find({ price: { $eq: 10000 } }); // FİYATI 10K TL OLANI GETİRİR
    // const products = await Product.find({ price: { $ne: 10000 } }); // FİYATI 10K TL OLANI GETİRİR
    // const products = await Product.find({ price: { $gt: 10000 } }); // price > 10000
    // const products = await Product.find({ price: { $gte: 10000 } }); // price >= 10000
    // const products = await Product.find({ price: { $lt: 10000 } }); // price < 10000
    // const products = await Product.find({ price: { $lte: 10000 } }); // price <= 10000
    // const products = await Product.find({ price: { $in: [10000, 20000] } }); // FİYATI 10K ve 20K TL OLANI GETİRİR
    // const products = await Product.find({ price: { $nin: [10000, 20000] } }); // FİYATI 10K VE 20K OLMAYANLARI GETİRİR
    // const products = await Product.find({ price: { $gte: 10000, $lte: 20000 } }); // 20000 >= price > 10000
    // const products = await Product.find({
    //     name: /.*iphone.*/
    // });

    const products = await Product.find()
        .populate("category", "name -_id")
        .select("-isActive -comments._id");

    res.send(products);
});

router.post("/", [auth, isAdmin], async (req, res) => {
    const { error } = validateProduct(req.body);

    if (error) {
        return res.status(400).send(error.details[0].message);
    }

    const product = new Product({
        name: req.body.name,
        price: req.body.price,
        description: req.body.description,
        imageUrl: req.body.imageUrl,
        isActive: req.body.isActive,
        category: req.body.category,
        comments: req.body.comments
    });

    const newProduct = await product.save();
    res.send(newProduct);
});

router.put("/comment/:id", [auth, isAdmin], async (req, res) => {
    const product = await Product.findById(req.params.id);

    if (!product) {
        return res.status(404).send("Aradığınız ürün bulunamadı");
    }

    const comment = new Comment({
        text: req.body.text,
        username: req.body.username
    });

    product.comments.push(comment);

    const updatedProduct = await product.save();
    res.send(updatedProduct);
});

router.delete("/comment/:id", auth, async (req, res) => {
    const product = await Product.findById(req.params.id);

    if (!product) {
        return res.status(404).send("Aradığınız ürün bulunamadı");
    }

    const comment = product.comments.id(req.body.commentid);
    comment.remove();
    const updatedProduct = await product.save();
    res.send(updatedProduct);
});

router.put("/:id", auth, async (req, res) => {
    // const product = await Product.findByIdAndUpdate(req.params.id, {
    //     $set: {
    //         name: req.body.name,
    //         price: req.body.price,
    //         description: req.body.description,
    //         imageUrl: req.body.imageUrl,
    //         isActive: req.body.isActive,
    //     }
    // }, { new: true });

    // res.send(product);



    // const result = await Product.update({ _id: req.params.id }, {
    //     $set: {
    //         name: req.body.name,
    //         price:req.body.price,
    //         description: req.body.description,
    //         imageUrl: req.body.imageUrl,
    //         isActive: req.body.isActive,
    //     }
    // });

    // res.send(result);



    //id'ye göre ürün al
    const product = await Product.findById(req.params.id);

    if (!product) {
        return res.status(404).send("Aradığınız ürün bulunamadı");
    }


    //validate yap
    const { error } = validateProduct(req.body);

    if (error) {
        return res.status(400).send(error.details[0].message);
    }


    // ekle
    product.name = req.body.name;
    product.price = req.body.price;
    product.description = req.body.description;
    product.imageUrl = req.body.imageUrl;
    product.isActive = req.body.isActive;
    product.category = req.body.category;

    const updatedProduct = await product.save();

    res.send(updatedProduct);
});

router.delete("/:id", auth, async (req, res) => {
    // const result = await Product.deleteOne({ _id: req.params.id });
    // res.send(result);

    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
        return res.status(404).send("Aradığınız ürün bulunamadı");
    }

    res.send(product);



    // const product = products.find(p => p.id == req.params.id);



    // const index = products.indexOf(product);
    // products.splice(index, 1);
    // res.send(product);
});

router.get("/:id", auth, async (req, res) => {
    const product = await Product.findById(req.params.id)
        .populate("category", "name -_id");

    if (!product) {
        return res.status(404).send("Aradığınız ürün bulunamadı");
    }

    res.send(product);
})


module.exports = router;