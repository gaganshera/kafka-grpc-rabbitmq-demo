"use strict";
const products = require("../dataset/mock_products_20.json");
const orderClient = require("../clients/order_client");
const util = require("util");
const placeOrder = util.promisify(orderClient.placeOrder).bind(orderClient);

class Products {
  async getAll(req, res) {
    try {
      return await products;
    } catch (err) {
      console.log("Error fetching products", err);
      return [];
    }
  }

  async getDetails(req, res) {
    try {
      const { productId } = req.params;
      if (!productId) {
        return {};
      }
      const product = products.find((p) => p.id === productId);
      return product;
    } catch (err) {
      return {};
    }
  }

  async placeOrder(req, res) {
    const { productId: product_id, quantity } = req.body;
    try {
      const response = await placeOrder({ product_id, quantity });
      return response;
    } catch (err) {
      console.log("Error while calling placeOrder", err);
      return {};
    }
  }
}

module.exports = Products;
