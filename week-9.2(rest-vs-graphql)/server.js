import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { resolvers } from "./resolvers.js";
import { typeDefs } from "./typeDefs.js";

/*
  This file starts the Apollo GraphQL server.
  - typeDefs: defines the GraphQL schema (types, queries, mutations)
  - resolvers: provides the functions that return actual data
*/
const server = new ApolloServer({
  typeDefs: typeDefs,
  resolvers: resolvers,
});

/*
  startStandaloneServer creates a simple HTTP server for GraphQL.
  Here we listen on port 4000 so GraphQL queries can be sent to http://localhost:4000.
*/
const { url } = await startStandaloneServer(server, {
  listen: 4000,
});

console.log("Server started:", url);

// Example GraphQL client requests.
// These are not executed in this file; they are just sample queries/mutations.
// You can run them in GraphQL Playground, Apollo Studio, or any GraphQL client.
`#graphql
mutation postanything($user_id: ID!, $content: String!) {
  createPost(user_id: $user_id, content: $content) {
    id
    content
    user {
      id
      age
      name
    }
  }
}

query ex {
  posts {
    id
    content
    user {
      id
      name
    }
  }
}`;
