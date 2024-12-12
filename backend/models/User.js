import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    neighborhoodId: { type: mongoose.Schema.Types.ObjectId, ref: 'neighborhoods' },
    profilePic: { type: String, default: 'default_profile_pic_url' },
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
  },
  { timestamps: true }
);

const UserModel = mongoose.model("users", userSchema);
export default UserModel;
