import mongoose from 'mongoose';

const questionSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    maxlength: 300
  },
  content: {
    type: String,
    required: true,
    maxlength: 10000
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  tags: [{
    type: String,
    required: true,
    maxlength: 20
  }],
  votes: {
    upvotes: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }],
    downvotes: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }]
  },
  views: {
    type: Number,
    default: 0
  },
  isSolved: {
    type: Boolean,
    default: false
  },
  acceptedAnswer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Answer',
    default: null
  },
  isReported: {
    type: Boolean,
    default: false
  },
  reportReason: {
    type: String,
    default: null
  },
  isInappropriate: {
    type: Boolean,
    default: false
  },
  isDeleted: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Indexes for search and performance
questionSchema.index({ title: 'text', content: 'text', tags: 'text' });
questionSchema.index({ author: 1, createdAt: -1 });
questionSchema.index({ isSolved: 1, createdAt: -1 });
questionSchema.index({ 'votes.upvotes': 1, createdAt: -1 });

// Virtual for vote count
questionSchema.virtual('voteCount').get(function() {
  return this.votes.upvotes.length - this.votes.downvotes.length;
});

// Virtual for answer count
questionSchema.virtual('answerCount').get(function() {
  return this.model('Answer').countDocuments({ question: this._id });
});

// Method to check if user has voted
questionSchema.methods.hasUserVoted = function(userId) {
  if (this.votes.upvotes.includes(userId)) return 'up';
  if (this.votes.downvotes.includes(userId)) return 'down';
  return null;
};

// Method to add vote
questionSchema.methods.addVote = function(userId, voteType) {
  // Remove existing vote
  this.votes.upvotes = this.votes.upvotes.filter(id => !id.equals(userId));
  this.votes.downvotes = this.votes.downvotes.filter(id => !id.equals(userId));
  
  // Add new vote
  if (voteType === 'up') {
    this.votes.upvotes.push(userId);
  } else if (voteType === 'down') {
    this.votes.downvotes.push(userId);
  }
  
  return this.save();
};

// Method to increment views
questionSchema.methods.incrementViews = function() {
  this.views += 1;
  return this.save();
};

// Pre-save middleware to update author stats
questionSchema.pre('save', async function(next) {
  if (this.isNew) {
    try {
      const User = this.model('User');
      await User.findByIdAndUpdate(this.author, {
        $inc: { 'stats.questionsAsked': 1 }
      });
    } catch (error) {
      console.error('Error updating user stats:', error);
    }
  }
  next();
});

const Question = mongoose.model('Question', questionSchema);

// Add pagination to Question model
import { addPaginationToModel } from '../utils/pagination.js';
addPaginationToModel(Question);

export default Question; 