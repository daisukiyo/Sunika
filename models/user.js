const mongoose = require('mongoose');
const bcrypt = require('bcryptjs')
const { Schema } = mongoose;

const UserSchema = new Schema({
    createdAt: { type: Date },
    updatedAt: { type: Date },
    password: { type: String, select: false },
    email: { type: String, unique: true, required: true },
    username: { type: String, unique: true, required: true},
    firstName: { type: String },
    lastName: { type: String },
    bio: { type: String },
    shoecollection: [{
        type: Schema.Types.ObjectId,
        ref: 'Shoe'
    }]
});

// Define the callback with a regular function to avoid problems with this
UserSchema.pre("save", function(next) {
  // SET createdAt AND updatedAt
  const now = new Date();
  this.updatedAt = now;
  if (!this.createdAt) {
    this.createdAt = now;
  }

  // encrypt password
  const user = this;
  if (!user.isModified('password')) {
      return next();
  }
  bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(user.password, salt, (err, hash) => {
          user.password = hash;
          next();
      });
  });
});

// need to use function to enable this.password to work
UserSchema.methods.comparePassword = function(password, done) {
    bcrypt.compare(password, this.password, (err, isMatch) => {
        done(err, isMatch);
    });
};

module.exports = mongoose.model("User", UserSchema);
