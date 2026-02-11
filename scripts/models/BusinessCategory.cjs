const mongoose = require('mongoose')

const BusinessCategorySchema = new mongoose.Schema(
    {   
         categoryId: {
              type: Number,
              required: true,
              unique: true, // 🔑 ensures no duplicates
            },
             
        
        name: { type: String, required: true, unique: true },
        parent: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'BusinessCategory',
            default: null,
        },
    },
    { timestamps: true }
)

 module.exports =
  mongoose.models.BusinessCategory ||
  mongoose.model('BusinessCategory', BusinessCategorySchema)

