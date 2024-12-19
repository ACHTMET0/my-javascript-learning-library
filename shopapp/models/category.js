const { mongoose, Schema } = require('mongoose');
const Joi = require("joi");

const categorySchema = mongoose.Schema({
    name: String,
    products: [{ type: Schema.Types.ObjectId, ref: "Product" }]
});

function validateCategory(category) {
    const schema = new Joi.object({
        name: Joi.string().min(3).max(30).required(),
        products: Joi.array()
    });

    return schema.validate(category);
}

const Category = mongoose.model("Category", categorySchema);

module.exports = { Category, validateCategory };


// reference
var egitmen = {
    id: 1,
    name: "Sadık",
}

var kurs = {
    title: "node.js",
    egitmen: "ref",
}


// embedded documents
var kurs = {
    title: "asp.net",
    egitmen: {
        name: "Sadık",
        bio: ""
    }
}


// hybrid
var kurs = {
    title: "asp.net",
    egitmen: {
        name: "Sadık",
        id: "ref"
    }
}

var product = {
    name: "Samsung S22",
    price: 20000,
    desc: ""
}

var order = {
    id: 1,
    date: "",
    product: {
        name: "Samsung S22",
        price: 20000,
    }
}