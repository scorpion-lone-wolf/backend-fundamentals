export const typeDefs = `#graphql
    # Type definitions declare the shape of data in GraphQL.
    # Each type describes the fields that can be requested.
    # ! sign means it is required field

    type User {
        id: ID!           # Unique identifier for the user
        name: String!     # User name
        age: Int!         # User age
        posts: [Post]     # Related posts written by this user
    }

    type Post {
        id: ID!           # Unique identifier for the post
        content: String!  # Post content text
        user: User!       # The user who created the post
    }

    type Query {
        # Read operations that fetch data
        users: [User]!            # Get all users
        user(id: ID!): User!       # Get one user by id
        posts: [Post]!            # Get all posts
    }

    type Mutation {
        # Write operations that change data
        createUser(
            name: String!
            age: Int!
        ): User!              # Create a new user and return it

        createPost(
            user_id: ID!
            content: String!
        ): Post!              # Create a new post and return it
    }
`;
