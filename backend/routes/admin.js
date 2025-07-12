import express from 'express';
import User from '../models/User.js';
import Question from '../models/Question.js';
import Answer from '../models/Answer.js';
import Notification from '../models/Notification.js';
import { authenticateToken, requireAdmin } from '../middleware/auth.js';

const router = express.Router();

// Apply admin middleware to all routes
router.use(requireAdmin);

// GET /api/admin/dashboard - Get admin dashboard stats
router.get('/dashboard', async (req, res) => {
  try {
    const [
      totalUsers,
      totalQuestions,
      totalAnswers,
      bannedUsers,
      reportedQuestions,
      reportedAnswers,
      recentUsers,
      recentQuestions
    ] = await Promise.all([
      User.countDocuments(),
      Question.countDocuments({ isDeleted: false }),
      Answer.countDocuments({ isDeleted: false }),
      User.countDocuments({ isBanned: true }),
      Question.countDocuments({ isReported: true }),
      Answer.countDocuments({ isReported: true }),
      User.find().sort({ createdAt: -1 }).limit(5).select('displayName email joinDate'),
      Question.find({ isDeleted: false }).sort({ createdAt: -1 }).limit(5).populate('author', 'displayName')
    ]);

    const stats = {
      totalUsers,
      totalQuestions,
      totalAnswers,
      bannedUsers,
      reportedQuestions,
      reportedAnswers,
      recentUsers,
      recentQuestions
    };

    res.json(stats);
  } catch (error) {
    console.error('Error fetching admin dashboard:', error);
    res.status(500).json({ error: 'Failed to fetch dashboard stats' });
  }
});

// GET /api/admin/users - Get all users with filters
router.get('/users', async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      search,
      status,
      sort = 'newest'
    } = req.query;

    const query = {};
    
    if (search) {
      query.$or = [
        { displayName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }
    
    if (status === 'banned') {
      query.isBanned = true;
    } else if (status === 'active') {
      query.isBanned = false;
    }

    let sortObj = {};
    switch (sort) {
      case 'reputation':
        sortObj = { reputation: -1 };
        break;
      case 'questions':
        sortObj = { 'stats.questionsAsked': -1 };
        break;
      case 'answers':
        sortObj = { 'stats.answersGiven': -1 };
        break;
      case 'newest':
      default:
        sortObj = { createdAt: -1 };
    }

    const options = {
      page: parseInt(page),
      limit: parseInt(limit),
      sort: sortObj,
      select: '-password'
    };

    const users = await User.paginate(query, options);
    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// PUT /api/admin/users/:id/ban - Ban/unban user
router.put('/users/:id/ban', async (req, res) => {
  try {
    const { isBanned, reason } = req.body;
    
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (user.isAdminUser()) {
      return res.status(403).json({ error: 'Cannot ban admin users' });
    }

    user.isBanned = isBanned;
    user.banReason = isBanned ? reason : null;
    await user.save();

    // Send notification to user
    if (isBanned) {
      await Notification.create({
        recipient: user._id,
        type: 'admin',
        title: 'Account Banned',
        message: `Your account has been banned. Reason: ${reason}`,
        sender: req.user._id
      });
    }

    res.json({ 
      message: `User ${isBanned ? 'banned' : 'unbanned'} successfully`,
      user: {
        _id: user._id,
        displayName: user.displayName,
        email: user.email,
        isBanned: user.isBanned,
        banReason: user.banReason
      }
    });
  } catch (error) {
    console.error('Error banning user:', error);
    res.status(500).json({ error: 'Failed to ban user' });
  }
});

// PUT /api/admin/users/:id/role - Change user role
router.put('/users/:id/role', async (req, res) => {
  try {
    const { isAdmin } = req.body;
    
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    user.isAdmin = isAdmin;
    await user.save();

    res.json({ 
      message: `User role updated successfully`,
      user: {
        _id: user._id,
        displayName: user.displayName,
        email: user.email,
        isAdmin: user.isAdmin
      }
    });
  } catch (error) {
    console.error('Error updating user role:', error);
    res.status(500).json({ error: 'Failed to update user role' });
  }
});

// GET /api/admin/questions - Get reported questions
router.get('/questions', async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      reported = true
    } = req.query;

    const query = { isDeleted: false };
    if (reported === 'true') {
      query.$or = [{ isReported: true }, { isInappropriate: true }];
    }

    const options = {
      page: parseInt(page),
      limit: parseInt(limit),
      sort: { createdAt: -1 },
      populate: 'author'
    };

    const questions = await Question.paginate(query, options);
    res.json(questions);
  } catch (error) {
    console.error('Error fetching questions:', error);
    res.status(500).json({ error: 'Failed to fetch questions' });
  }
});

// PUT /api/admin/questions/:id/moderate - Moderate question
router.put('/questions/:id/moderate', async (req, res) => {
  try {
    const { action, reason } = req.body;
    
    const question = await Question.findById(req.params.id);
    if (!question) {
      return res.status(404).json({ error: 'Question not found' });
    }

    switch (action) {
      case 'approve':
        question.isReported = false;
        question.isInappropriate = false;
        question.reportReason = null;
        break;
      case 'delete':
        question.isDeleted = true;
        break;
      case 'mark_inappropriate':
        question.isInappropriate = true;
        question.reportReason = reason;
        break;
      default:
        return res.status(400).json({ error: 'Invalid action' });
    }

    await question.save();

    // Notify question author
    if (action === 'delete' || action === 'mark_inappropriate') {
      await Notification.create({
        recipient: question.author,
        type: 'admin',
        title: 'Question Moderated',
        message: `Your question "${question.title}" has been ${action === 'delete' ? 'deleted' : 'marked as inappropriate'}. ${reason ? `Reason: ${reason}` : ''}`,
        sender: req.user._id,
        question: question._id
      });
    }

    res.json({ 
      message: `Question ${action}d successfully`,
      question: {
        _id: question._id,
        title: question.title,
        isDeleted: question.isDeleted,
        isInappropriate: question.isInappropriate
      }
    });
  } catch (error) {
    console.error('Error moderating question:', error);
    res.status(500).json({ error: 'Failed to moderate question' });
  }
});

// GET /api/admin/answers - Get reported answers
router.get('/answers', async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      reported = true
    } = req.query;

    const query = { isDeleted: false };
    if (reported === 'true') {
      query.$or = [{ isReported: true }, { isInappropriate: true }];
    }

    const options = {
      page: parseInt(page),
      limit: parseInt(limit),
      sort: { createdAt: -1 },
      populate: ['author', 'question']
    };

    const answers = await Answer.paginate(query, options);
    res.json(answers);
  } catch (error) {
    console.error('Error fetching answers:', error);
    res.status(500).json({ error: 'Failed to fetch answers' });
  }
});

// PUT /api/admin/answers/:id/moderate - Moderate answer
router.put('/answers/:id/moderate', async (req, res) => {
  try {
    const { action, reason } = req.body;
    
    const answer = await Answer.findById(req.params.id);
    if (!answer) {
      return res.status(404).json({ error: 'Answer not found' });
    }

    switch (action) {
      case 'approve':
        answer.isReported = false;
        answer.isInappropriate = false;
        answer.reportReason = null;
        break;
      case 'delete':
        answer.isDeleted = true;
        break;
      case 'mark_inappropriate':
        answer.isInappropriate = true;
        answer.reportReason = reason;
        break;
      default:
        return res.status(400).json({ error: 'Invalid action' });
    }

    await answer.save();

    // Notify answer author
    if (action === 'delete' || action === 'mark_inappropriate') {
      await Notification.create({
        recipient: answer.author,
        type: 'admin',
        title: 'Answer Moderated',
        message: `Your answer has been ${action === 'delete' ? 'deleted' : 'marked as inappropriate'}. ${reason ? `Reason: ${reason}` : ''}`,
        sender: req.user._id,
        answer: answer._id
      });
    }

    res.json({ 
      message: `Answer ${action}d successfully`,
      answer: {
        _id: answer._id,
        content: answer.content.substring(0, 100) + '...',
        isDeleted: answer.isDeleted,
        isInappropriate: answer.isInappropriate
      }
    });
  } catch (error) {
    console.error('Error moderating answer:', error);
    res.status(500).json({ error: 'Failed to moderate answer' });
  }
});

// GET /api/admin/stats - Get detailed stats
router.get('/stats', async (req, res) => {
  try {
    const [
      userStats,
      questionStats,
      answerStats,
      dailyStats
    ] = await Promise.all([
      User.aggregate([
        {
          $group: {
            _id: null,
            totalUsers: { $sum: 1 },
            bannedUsers: { $sum: { $cond: ['$isBanned', 1, 0] } },
            adminUsers: { $sum: { $cond: ['$isAdmin', 1, 0] } },
            avgReputation: { $avg: '$reputation' }
          }
        }
      ]),
      Question.aggregate([
        { $match: { isDeleted: false } },
        {
          $group: {
            _id: null,
            totalQuestions: { $sum: 1 },
            solvedQuestions: { $sum: { $cond: ['$isSolved', 1, 0] } },
            reportedQuestions: { $sum: { $cond: ['$isReported', 1, 0] } },
            avgViews: { $avg: '$views' }
          }
        }
      ]),
      Answer.aggregate([
        { $match: { isDeleted: false } },
        {
          $group: {
            _id: null,
            totalAnswers: { $sum: 1 },
            acceptedAnswers: { $sum: { $cond: ['$isAccepted', 1, 0] } },
            reportedAnswers: { $sum: { $cond: ['$isReported', 1, 0] } }
          }
        }
      ]),
      Question.aggregate([
        {
          $match: {
            createdAt: {
              $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
            }
          }
        },
        {
          $group: {
            _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
            count: { $sum: 1 }
          }
        },
        { $sort: { _id: 1 } }
      ])
    ]);

    const stats = {
      users: userStats[0] || {},
      questions: questionStats[0] || {},
      answers: answerStats[0] || {},
      dailyActivity: dailyStats
    };

    res.json(stats);
  } catch (error) {
    console.error('Error fetching admin stats:', error);
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
});

export default router; 