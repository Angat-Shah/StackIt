import mongoose from 'mongoose';

const answerSchema = new mongoose.Schema({
  content: {
    type: String,
    required: true,
    maxlength: 10000
  },
  question: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Question',
    required: true
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
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
  isAccepted: {
    type: Boolean,
    default: false
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

// Indexes
answerSchema.index({ question: 1, createdAt: -1 });
answerSchema.index({ author: 1, createdAt: -1 });
answerSchema.index({ isAccepted: 1, createdAt: -1 });

// Virtual for vote count
answerSchema.virtual('voteCount').get(function() {
  return this.votes.upvotes.length - this.votes.downvotes.length;
});

// Method to check if user has voted
answerSchema.methods.hasUserVoted = function(userId) {
  if (this.votes.upvotes.includes(userId)) return 'up';
  if (this.votes.downvotes.includes(userId)) return 'down';
  return null;
};

// Method to add vote
answerSchema.methods.addVote = function(userId, voteType) {
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

// Method to accept answer
answerSchema.methods.acceptAnswer = function() {
  this.isAccepted = true;
  return this.save();
};

// Pre-save middleware to update author stats
answerSchema.pre('save', async function(next) {
  if (this.isNew) {
    try {
      const User = this.model('User');
      await User.findByIdAndUpdate(this.author, {
        $inc: { 'stats.answersGiven': 1 }
      });
    } catch (error) {
      console.error('Error updating user stats:', error);
    }
  }
  next();
});

// Post-save middleware to update question when answer is accepted
answerSchema.post('save', async function() {
  if (this.isAccepted) {
    try {
      const Question = this.model('Question');
      const User = this.model('User');
      
      // Update question
      await Question.findByIdAndUpdate(this.question, {
        isSolved: true,
        acceptedAnswer: this._id
      });
      
      // Update user stats
      await User.findByIdAndUpdate(this.author, {
        $inc: { 'stats.acceptedAnswers': 1, reputation: 15 }
      });
    } catch (error) {
      console.error('Error updating question and user stats:', error);
    }
  }
});

const Answer = mongoose.model('Answer', answerSchema);

// Add pagination to Answer model
import { addPaginationToModel } from '../utils/pagination.js';
addPaginationToModel(Answer);

export default Answer; 