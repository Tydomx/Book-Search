// import gql tagged template function
const { gql } = require('apollo-server-express');

// create our typeDefs
const typeDefs = gql`
	type Book {
		_id: ID!
		bookId: String
		authors: [String]
		description: String
		title: String
		image: String
		link: String
	}

	type User {
		_id: ID!
		username: String
		email: String
		password: String
		bookCount: Int
		savedBooks: [Book]
	}

	type Auth {
		token: ID!
		user: User
	}

	type Query {
		me: User
	}

	type Mutation {
		loginUser(email: String!, password: String!): Auth
		addUser(username: String!, email: String!, password: String!): Auth
		saveBook(
			authors: [String], 
			description: String,
			title: String
			bookId: ID,
			image: String,
			link: String,): User
		removeBook(bookId: ID!): User
	}
`;

module.exports = typeDefs;