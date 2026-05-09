import { posts, users } from "./_data.js";

/*
  Resolvers map GraphQL fields to functions that return data.
  - Query: resolves data for read operations.
  - Mutation: resolves data for write operations.
  - Type resolvers: resolve fields on custom types like User and Post.
*/
export const resolvers = {
  Query: {
    users: () => {
      // Return the list of all users
      return users;
    },
    user: (_, args) => {
      // args contains the GraphQL query arguments
      return users.find(user => user.id == args.id);
    },
    posts: () => {
      // Return the list of all posts
      return posts;
    },
  },
  Mutation: {
    createUser: (_, args) => {
      // Create a new user from the provided arguments
      const { name, age } = args;
      console.log("args", args);
      const newId = users.length + 1;
      users.push({
        id: newId,
        name: name,
        age: age,
      });
      return users.find(user => user.id === newId);
    },
    createPost: (_, args) => {
      // Create a new post with a reference to user_id
      const { user_id, content } = args;
      const newId = posts.length + 1;
      posts.push({
        id: newId,
        content,
        user_id,
      });
      return posts.find(post => post.id === newId);
    },
  },

  // Field resolvers for nested relationships
  User: {
    posts: (parent, args) => {
      // parent is the User object returned by the users query or another resolver
      console.log("parent is ", parent);
      return posts.filter(post => post.user_id == parent.id);
    },
  },
  Post: {
    user: (parent, args, context) => {
      // parent is the Post object returned by the posts query or another resolver
      return users.find(user => user.id == parent.user_id);
    },
  },
};
