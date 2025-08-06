const mongoose = require("mongoose");

const CacheSchema = new mongoose.Schema({
  fdcId: String,
  data: Object,
  fetchedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("USDA_Cache", CacheSchema);
