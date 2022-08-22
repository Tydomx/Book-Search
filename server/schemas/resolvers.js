// importing 
const { User } = require('../models');
const { AuthenticationError } = require('apollo-server-express');
const { signToken } = require('../utils/auth');

const resolvers = {
	Query: {
		// retrieve user using usernmae
		me: async (parent, args, context) => {
			if (context.user) {
				const userData = await User.findbyId(context.user._id)
					.select('-__v -password')
					.populate('books')

				return userData;
			};

			throw new AuthenticationError('User is not logged in!');
		}
	},
	// mutation property
	Mutation: {
		addUser: async (parent, args) => {
			const user = await User.create(args);
			const token = signToken(user);

			return { token, user };
		},
		loginUser: async (parent, { email, password }) => {
			const user = await User.findOne({ email });

			if (!user) {
				throw new AuthenticationError('Incorrect credentials!');
			};

			const correctPWord = await user.isCorrectPWord(password);

			if (!correctPWord) {
				throw new AuthenticationError('Incorrect credentials detected!');
			};

			const token = signToken(user);
			return { token, user };
		},
		saveBook: async (parent, args, context) => {
			if (context.user) {
				const updatedUser = await User.findByIdAndUpdate(
					{ _id: context.user_id },
					// takes input type to replace 'body'
					{ $addToSett: { savedBooks: args.input } },
					{ new: true, runValidators: true }
				);

				return updatedUser;
			};

			throw new AuthenticationError('User must be logged in!');
		},
		removeBook: async (parent, args, context) => {
			if (context.user) {
				const updatedUser = await User.findOneAndUpdate(
					{ _id: context.user._id },
					{ $pull: { savedBooks: { bookId: args.bookId } } },
					{ new: true }
				);

				return updatedUser;
			}

			throw new AuthenticationError('User must be logged in!');
		}
	}
};

module.exports = resolvers;