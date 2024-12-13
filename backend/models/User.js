import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    neighborhoodId: { type: mongoose.Schema.Types.ObjectId, ref: 'neighborhoods' },
    profilePic: { type: String, default: 'https://cdn.pixabay.com/photo/2023/02/18/11/00/icon-7797704_960_720.png' },
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
  },
  { timestamps: true }
);

const UserModel = mongoose.model("users", userSchema);
export default UserModel;
