import express from 'express';
import { body, validationResult } from 'express-validator';
import Question from '../models/Question.js';
import User from '../models/User.js';
import Notification from '../models/Notification.js';
import { authenticateToken, requireOwnership } from '../middleware/auth.js';

const router = express.Router();

// Validation middleware
const validateQuestion = [
  body('title').trim().isLength({ min: 10, max: 300 }).withMessage('Title must be between 10 and 300 characters'),
  body('content').trim().isLength({ min: 20, max: 10000 }).withMessage('Content must be between 20 and 10000 characters'),
  body('tags').isArray({ min: 1, max: 5 }).withMessage('Must have 1-5 tags'),
  body('tags.*').trim().isLength({ min: 1, max: 20 }).withMessage('Each tag must be 1-20 characters')
];

// GET /api/questions - Get all questions with filters
router.get('/', async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      sort = 'newest',
      tag,
      search,
      solved,
      author
    } = req.query;

    const query = { isDeleted: false };
    
    // Apply filters
    if (tag) query.tags = tag;
    if (solved !== undefined) query.isSolved = solved === 'true';
    if (author) query.author = author;
    if (search) {
      query.$text = { $search: search };
    }

    // Build sort object
    let sortObj = {};
    switch (sort) {
      case 'votes':
        sortObj = { voteCount: -1 };
        break;
      case 'answers':
        sortObj = { answerCount: -1 };
        break;
      case 'views':
        sortObj = { views: -1 };
        break;
      case 'newest':
      default:
        sortObj = { createdAt: -1 };
    }

    const options = {
      page: parseInt(page),
      limit: parseInt(limit),
      sort: sortObj,
      populate: [
        { path: 'author', select: 'displayName email avatar' },
        { path: 'acceptedAnswer', select: 'content author' }
      ]
    };

    const questions = await Question.paginate(query, options);
    
    // Add vote status for authenticated users
    if (req.user) {
      questions.docs = questions.docs.map(q => {
        const voteStatus = q.hasUserVoted(req.user._id);
        return {
          ...q.toObject(),
          userVote: voteStatus
        };
      });
    }

    res.json(questions);
  } catch (error) {
    console.error('Error fetching questions:', error);
    res.status(500).json({ error: 'Failed to fetch questions' });
  }
});

// GET /api/questions/:id - Get single question
router.get('/:id', async (req, res) => {
  try {
    const question = await Question.findById(req.params.id)
      .populate('author', 'displayName email avatar reputation')
      .populate({
        path: 'answers',
        populate: { path: 'author', select: 'displayName email avatar reputation' }
      })
      .populate('acceptedAnswer');

    if (!question || question.isDeleted) {
      return res.status(404).json({ error: 'Question not found' });
    }

    // Increment views
    await question.incrementViews();

    // Add vote status for authenticated users
    if (req.user) {
      question.userVote = question.hasUserVoted(req.user._id);
      
      // Add vote status to answers
      if (question.answers) {
        question.answers = question.answers.map(answer => ({
          ...answer.toObject(),
          userVote: answer.hasUserVoted(req.user._id)
        }));
      }
    }

    res.json(question);
  } catch (error) {
    console.error('Error fetching question:', error);
    res.status(500).json({ error: 'Failed to fetch question' });
  }
});

// POST /api/questions - Create new question
router.post('/', authenticateToken, validateQuestion, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { title, content, tags } = req.body;

    const question = new Question({
      title,
      content,
      tags: tags.map(tag => tag.toLowerCase()),
      author: req.user._id
    });

    await question.save();

    // Populate author info
    await question.populate('author', 'displayName email avatar');

    res.status(201).json(question);
  } catch (error) {
    console.error('Error creating question:', error);
    res.status(500).json({ error: 'Failed to create question' });
  }
});

// PUT /api/questions/:id - Update question
router.put('/:id', authenticateToken, validateQuestion, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const question = await Question.findById(req.params.id);
    
    if (!question) {
      return res.status(404).json({ error: 'Question not found' });
    }

    if (!question.author.equals(req.user._id) && !req.user.isAdminUser()) {
      return res.status(403).json({ error: 'Not authorized to edit this question' });
    }

    const { title, content, tags } = req.body;

    question.title = title;
    question.content = content;
    question.tags = tags.map(tag => tag.toLowerCase());

    await question.save();
    await question.populate('author', 'displayName email avatar');

    res.json(question);
  } catch (error) {
    console.error('Error updating question:', error);
    res.status(500).json({ error: 'Failed to update question' });
  }
});

// DELETE /api/questions/:id - Delete question
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const question = await Question.findById(req.params.id);
    
    if (!question) {
      return res.status(404).json({ error: 'Question not found' });
    }

    if (!question.author.equals(req.user._id) && !req.user.isAdminUser()) {
      return res.status(403).json({ error: 'Not authorized to delete this question' });
    }

    // Soft delete
    question.isDeleted = true;
    await question.save();

    res.json({ message: 'Question deleted successfully' });
  } catch (error) {
    console.error('Error deleting question:', error);
    res.status(500).json({ error: 'Failed to delete question' });
  }
});

// POST /api/questions/:id/vote - Vote on question
router.post('/:id/vote', authenticateToken, async (req, res) => {
  try {
    const { voteType } = req.body;
    
    if (!['up', 'down'].includes(voteType)) {
      return res.status(400).json({ error: 'Invalid vote type' });
    }

    const question = await Question.findById(req.params.id);
    
    if (!question || question.isDeleted) {
      return res.status(404).json({ error: 'Question not found' });
    }

    if (question.author.equals(req.user._id)) {
      return res.status(400).json({ error: 'Cannot vote on your own question' });
    }

    await question.addVote(req.user._id, voteType);

    // Update user reputation
    const reputationChange = voteType === 'up' ? 10 : -2;
    await User.findByIdAndUpdate(req.user._id, {
      $inc: { reputation: reputationChange }
    });

    res.json({ 
      message: 'Vote recorded',
      voteCount: question.voteCount,
      userVote: voteType
    });
  } catch (error) {
    console.error('Error voting on question:', error);
    res.status(500).json({ error: 'Failed to record vote' });
  }
});

// GET /api/questions/tags/popular - Get popular tags
router.get('/tags/popular', async (req, res) => {
  try {
    const tags = await Question.aggregate([
      { $match: { isDeleted: false } },
      { $unwind: '$tags' },
      { $group: { _id: '$tags', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 20 }
    ]);

    res.json(tags.map(tag => ({ name: tag._id, count: tag.count })));
  } catch (error) {
    console.error('Error fetching popular tags:', error);
    res.status(500).json({ error: 'Failed to fetch popular tags' });
  }
});

export default router; 