const express = require('express');
const path = require('path');
const db = require('./config/connection');
// const routes = require('./routes');

const { typeDefs, resolvers } = require('./schemas');
// import apollo server express and authMiddleware
const { ApolloServer } = require('apollo-server-express');
const { authMiddleware } = require('./utils/auth');

const app = express();
const PORT = process.env.PORT || 3001;
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: authMiddleware
});

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// if we're in production, serve client/build as static assets
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));
}

// app.use(routes);

// create new instance of apollo server with graphQL schema
const startApolloServer = async (typeDefs, resolvers) => {
  await server.start();
  // integrate apollo server with express application as middleware
  server.applyMiddleware({ app });

  db.once('open', () => {
    app.listen(PORT, () => {
      console.log(`API server running on port ${PORT}`);
      // log where we can go to test our GQL API
      console.log(`Use GraphQL at http://localhost:${PORT}${server.graphqlPath}`);
    });
  });
}

// call async function to start server
startApolloServer(typeDefs, resolvers);


