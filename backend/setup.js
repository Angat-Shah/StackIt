import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';
import Question from './models/Question.js';
import Answer from './models/Answer.js';

dotenv.config();

const setupDatabase = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/stack-bloom-verse');
    console.log('✅ Connected to MongoDB');

    // Create admin user if it doesn't exist
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@qa-platform.com';
    const existingAdmin = await User.findOne({ email: adminEmail });
    
    if (!existingAdmin) {
      const adminUser = new User({
        firebaseUid: 'admin-firebase-uid',
        email: adminEmail,
        displayName: 'Admin',
        isAdmin: true,
        reputation: 1000
      });
      
      await adminUser.save();
      console.log('✅ Admin user created');
    } else {
      console.log('✅ Admin user already exists');
    }

    // Create demo user (Angat Shah) if it doesn't exist
    const demoEmail = '22amtics097@gmail.com';
    const existingDemoUser = await User.findOne({ email: demoEmail });
    
    if (!existingDemoUser) {
      const demoUser = new User({
        firebaseUid: 'demo-user-firebase-uid',
        email: demoEmail,
        displayName: 'Angat Shah',
        isAdmin: false,
        reputation: 150,
        bio: 'Demo user for testing admin features'
      });
      
      await demoUser.save();
      console.log('✅ Demo user (Angat Shah) created');
    } else {
      console.log('✅ Demo user (Angat Shah) already exists');
    }

    // Create some sample data if database is empty
    const questionCount = await Question.countDocuments();
    if (questionCount === 0) {
      console.log('📝 Creating sample questions...');
      
      const sampleUsers = [
        { firebaseUid: 'user1', email: 'sarah.chen@example.com', displayName: 'Sarah Chen' },
        { firebaseUid: 'user2', email: 'mike.j@example.com', displayName: 'Mike Johnson' },
        { firebaseUid: 'user3', email: 'emily.r@example.com', displayName: 'Emily Rodriguez' }
      ];

      // Create sample users
      const createdUsers = [];
      for (const userData of sampleUsers) {
        const existingUser = await User.findOne({ email: userData.email });
        if (!existingUser) {
          const user = new User(userData);
          await user.save();
          createdUsers.push(user);
        } else {
          createdUsers.push(existingUser);
        }
      }

      // Create sample questions
      const sampleQuestions = [
        {
          title: 'How to implement React Router with TypeScript?',
          content: 'I\'m trying to set up React Router in my TypeScript project but getting type errors. Can someone help me with the proper types and configuration?',
          tags: ['react', 'typescript', 'routing'],
          author: createdUsers[0]._id,
          votes: { upvotes: [createdUsers[1]._id, createdUsers[2]._id], downvotes: [] },
          views: 145
        },
        {
          title: 'Best practices for API error handling in Next.js',
          content: 'What are the recommended patterns for handling API errors in Next.js applications? I need to handle both client and server-side errors gracefully.',
          tags: ['nextjs', 'javascript', 'api', 'error-handling'],
          author: createdUsers[1]._id,
          votes: { upvotes: [createdUsers[0]._id], downvotes: [] },
          views: 89
        },
        {
          title: 'Database design for e-commerce application',
          content: 'I\'m designing a database schema for an e-commerce platform. What are the key considerations for products, orders, and user management?',
          tags: ['database', 'design', 'ecommerce', 'sql'],
          author: createdUsers[2]._id,
          votes: { upvotes: [], downvotes: [] },
          views: 76
        }
      ];

      const createdQuestions = [];
      for (const questionData of sampleQuestions) {
        const question = new Question(questionData);
        await question.save();
        createdQuestions.push(question);
      }

      // Create sample answers
      const sampleAnswers = [
        {
          content: 'You need to install @types/react-router-dom and properly type your components. Here\'s a complete example...',
          question: createdQuestions[0]._id,
          author: createdUsers[1]._id,
          votes: { upvotes: [createdUsers[0]._id, createdUsers[2]._id], downvotes: [] },
          isAccepted: true
        },
        {
          content: 'For Next.js API error handling, I recommend using try-catch blocks and proper HTTP status codes...',
          question: createdQuestions[1]._id,
          author: createdUsers[0]._id,
          votes: { upvotes: [createdUsers[1]._id], downvotes: [] },
          isAccepted: false
        }
      ];

      for (const answerData of sampleAnswers) {
        const answer = new Answer(answerData);
        await answer.save();
      }

      console.log('✅ Sample data created');
    } else {
      console.log('✅ Sample data already exists');
    }

    console.log('🎉 Database setup completed successfully!');
    console.log('\n📋 Next steps:');
    console.log('1. Start the server: npm run dev');
    console.log('2. Test the API: curl http://localhost:5000/api/health');
    console.log('3. Admin credentials: admin@qa-platform.com / admin123');
    console.log('4. Demo user: 22amtics097@gmail.com (Angat Shah)');

  } catch (error) {
    console.error('❌ Database setup failed:', error);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
  }
};

setupDatabase(); 