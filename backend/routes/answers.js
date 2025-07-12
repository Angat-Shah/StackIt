import express from 'express';
import { body, validationResult } from 'express-validator';
import Answer from '../models/Answer.js';
import Question from '../models/Question.js';
import User from '../models/User.js';
import Notification from '../models/Notification.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Validation middleware
const validateAnswer = [
  body('content').trim().isLength({ min: 10, max: 10000 }).withMessage('Content must be between 10 and 10000 characters')
];

// GET /api/answers/question/:questionId - Get answers for a question
router.get('/question/:questionId', async (req, res) => {
  try {
    const { questionId } = req.params;
    const { sort = 'votes' } = req.query;

    let sortObj = {};
    switch (sort) {
      case 'newest':
        sortObj = { createdAt: -1 };
        break;
      case 'oldest':
        sortObj = { createdAt: 1 };
        break;
      case 'votes':
      default:
        sortObj = { voteCount: -1, createdAt: -1 };
    }

    const answers = await Answer.find({ 
      question: questionId, 
      isDeleted: false 
    })
    .sort(sortObj)
    .populate('author', 'displayName email avatar reputation');

    // Add vote status for authenticated users
    if (req.user) {
      answers.forEach(answer => {
        answer.userVote = answer.hasUserVoted(req.user._id);
      });
    }

    res.json(answers);
  } catch (error) {
    console.error('Error fetching answers:', error);
    res.status(500).json({ error: 'Failed to fetch answers' });
  }
});

// POST /api/answers - Create new answer
router.post('/', authenticateToken, validateAnswer, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { questionId, content } = req.body;

    // Check if question exists
    const question = await Question.findById(questionId);
    if (!question || question.isDeleted) {
      return res.status(404).json({ error: 'Question not found' });
    }

    // Check if user already answered this question
    const existingAnswer = await Answer.findOne({
      question: questionId,
      author: req.user._id,
      isDeleted: false
    });

    if (existingAnswer) {
      return res.status(400).json({ error: 'You have already answered this question' });
    }

    const answer = new Answer({
      content,
      question: questionId,
      author: req.user._id
    });

    await answer.save();
    await answer.populate('author', 'displayName email avatar reputation');

    // Send notification to question author
    if (!question.author.equals(req.user._id)) {
      await Notification.create({
        recipient: question.author,
        type: 'answer',
        title: 'New Answer',
        message: `${req.user.displayName} answered your question "${question.title}"`,
        sender: req.user._id,
        question: questionId,
        answer: answer._id
      });
    }

    res.status(201).json(answer);
  } catch (error) {
    console.error('Error creating answer:', error);
    res.status(500).json({ error: 'Failed to create answer' });
  }
});

// PUT /api/answers/:id - Update answer
router.put('/:id', authenticateToken, validateAnswer, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const answer = await Answer.findById(req.params.id);
    
    if (!answer || answer.isDeleted) {
      return res.status(404).json({ error: 'Answer not found' });
    }

    if (!answer.author.equals(req.user._id) && !req.user.isAdminUser()) {
      return res.status(403).json({ error: 'Not authorized to edit this answer' });
    }

    const { content } = req.body;
    answer.content = content;
    await answer.save();
    await answer.populate('author', 'displayName email avatar reputation');

    res.json(answer);
  } catch (error) {
    console.error('Error updating answer:', error);
    res.status(500).json({ error: 'Failed to update answer' });
  }
});

// DELETE /api/answers/:id - Delete answer
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const answer = await Answer.findById(req.params.id);
    
    if (!answer || answer.isDeleted) {
      return res.status(404).json({ error: 'Answer not found' });
    }

    if (!answer.author.equals(req.user._id) && !req.user.isAdminUser()) {
      return res.status(403).json({ error: 'Not authorized to delete this answer' });
    }

    // Soft delete
    answer.isDeleted = true;
    await answer.save();

    res.json({ message: 'Answer deleted successfully' });
  } catch (error) {
    console.error('Error deleting answer:', error);
    res.status(500).json({ error: 'Failed to delete answer' });
  }
});

// POST /api/answers/:id/vote - Vote on answer
router.post('/:id/vote', authenticateToken, async (req, res) => {
  try {
    const { voteType } = req.body;
    
    if (!['up', 'down'].includes(voteType)) {
      return res.status(400).json({ error: 'Invalid vote type' });
    }

    const answer = await Answer.findById(req.params.id);
    
    if (!answer || answer.isDeleted) {
      return res.status(404).json({ error: 'Answer not found' });
    }

    if (answer.author.equals(req.user._id)) {
      return res.status(400).json({ error: 'Cannot vote on your own answer' });
    }

    await answer.addVote(req.user._id, voteType);

    // Update user reputation
    const reputationChange = voteType === 'up' ? 10 : -2;
    await User.findByIdAndUpdate(req.user._id, {
      $inc: { reputation: reputationChange }
    });

    res.json({ 
      message: 'Vote recorded',
      voteCount: answer.voteCount,
      userVote: voteType
    });
  } catch (error) {
    console.error('Error voting on answer:', error);
    res.status(500).json({ error: 'Failed to record vote' });
  }
});

// POST /api/answers/:id/accept - Accept answer
router.post('/:id/accept', authenticateToken, async (req, res) => {
  try {
    const answer = await Answer.findById(req.params.id);
    
    if (!answer || answer.isDeleted) {
      return res.status(404).json({ error: 'Answer not found' });
    }

    const question = await Question.findById(answer.question);
    
    if (!question || question.isDeleted) {
      return res.status(404).json({ error: 'Question not found' });
    }

    if (!question.author.equals(req.user._id)) {
      return res.status(403).json({ error: 'Only question author can accept answers' });
    }

    // Unaccept all other answers for this question
    await Answer.updateMany(
      { question: answer.question, _id: { $ne: answer._id } },
      { isAccepted: false }
    );

    // Accept this answer
    answer.isAccepted = true;
    await answer.save();

    // Update question
    question.isSolved = true;
    question.acceptedAnswer = answer._id;
    await question.save();

    // Send notification to answer author
    await Notification.create({
      recipient: answer.author,
      type: 'accept',
      title: 'Answer Accepted',
      message: `Your answer was accepted for the question "${question.title}"`,
      sender: req.user._id,
      question: question._id,
      answer: answer._id
    });

    res.json({ 
      message: 'Answer accepted successfully',
      answer: {
        _id: answer._id,
        isAccepted: answer.isAccepted
      }
    });
  } catch (error) {
    console.error('Error accepting answer:', error);
    res.status(500).json({ error: 'Failed to accept answer' });
  }
});

export default router; 