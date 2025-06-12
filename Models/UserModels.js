const mongoose=('mongoose');

const userSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true, // no duplicate emails
    lowercase: true
  },
  password: {
    type: String,
    required: true
  }
}, {
  timestamps: true // automatically adds createdAt and updatedAt fields
});

const User = mongoose.model("User", userSchema);

modules.export=User;
