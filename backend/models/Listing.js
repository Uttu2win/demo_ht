import mongoose from "mongoose";

const listingSchema = new mongoose.Schema({
  title: { 
    type: String, 
    required: true 
  },
  description: { 
    type: String, 
    required: true 
  },
  price: { 
    type: Number,
    required: true
  },
  category: { 
    type: String, 
    enum: ['paid', 'free'],
    required: true 
  },
  imageUrl: { 
    type: String,
    required: true
  },
  createdBy: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'users', 
    required: true 
  },
  neighborhoodId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'neighborhoods', 
    required: true 
  }
}, { 
  timestamps: true 
});

// Virtual field to display price based on category
listingSchema.virtual('displayPrice').get(function() {
  return this.category === 'free' ? 'Free' : `$${this.price}`;
});

const ListingModel = mongoose.model('listings', listingSchema);
export default ListingModel;