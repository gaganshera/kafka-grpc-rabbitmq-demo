const express = require('express');
const router = express.Router();
const Products = require("../services/products_service")
const products = new Products()

/* GET products listing. */
router.get('/', async function (req, res, next) {
  const productList = await products.getAll(req, res);
  console.log(productList);
  res.json(productList).status(200);
});

router.get("/:productId", async function (req, res, next) {
  const product = await products.getDetails(req, res);
  res.json(product).status(200);
});

router.post("/order", async function (req, res, next) {
  const randomProduct = await products.placeOrder(req, res);
  console.log("RESPONSE", randomProduct);
  res.json(randomProduct).status(200);
});

module.exports = router;
