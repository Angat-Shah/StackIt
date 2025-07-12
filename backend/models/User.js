import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  firebaseUid: {
    type: String,
    required: true,
    unique: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  displayName: {
    type: String,
    required: true
  },
  avatar: {
    type: String,
    default: null
  },
  bio: {
    type: String,
    maxlength: 500,
    default: ''
  },
  reputation: {
    type: Number,
    default: 1
  },
  joinDate: {
    type: Date,
    default: Date.now
  },
  isAdmin: {
    type: Boolean,
    default: false
  },
  isBanned: {
    type: Boolean,
    default: false
  },
  banReason: {
    type: String,
    default: null
  },
  lastSeen: {
    type: Date,
    default: Date.now
  },
  preferences: {
    emailNotifications: {
      type: Boolean,
      default: true
    },
    displayAs: {
      type: String,
      enum: ['public', 'anonymous'],
      default: 'public'
    }
  },
  stats: {
    questionsAsked: {
      type: Number,
      default: 0
    },
    answersGiven: {
      type: Number,
      default: 0
    },
    acceptedAnswers: {
      type: Number,
      default: 0
    },
    totalVotes: {
      type: Number,
      default: 0
    }
  }
}, {
  timestamps: true
});

// Index for search
userSchema.index({ displayName: 'text', email: 'text' });

// Virtual for initials
userSchema.virtual('initials').get(function() {
  return this.displayName.split(' ').map(n => n[0]).join('').toUpperCase();
});

// Method to update stats
userSchema.methods.updateStats = function() {
  return this.model('Question').countDocuments({ author: this._id })
    .then(questionsCount => {
      this.stats.questionsAsked = questionsCount;
      return this.model('Answer').countDocuments({ author: this._id });
    })
    .then(answersCount => {
      this.stats.answersGiven = answersCount;
      return this.model('Answer').countDocuments({ 
        author: this._id, 
        isAccepted: true 
      });
    })
    .then(acceptedCount => {
      this.stats.acceptedAnswers = acceptedCount;
      return this.save();
    });
};

// Method to check if user is admin
userSchema.methods.isAdminUser = function() {
  return this.isAdmin || this.email === process.env.ADMIN_EMAIL;
};

const User = mongoose.model('User', userSchema);

// Add pagination to User model
import { addPaginationToModel } from '../utils/pagination.js';
addPaginationToModel(User);

export default User; 