# GraphQL Learning Notes

## What is GraphQL?

GraphQL is a query language for APIs. It lets clients request exactly the data they need instead of receiving a fixed data shape.

### Why GraphQL?

- Clients can request only the fields they want
- One endpoint can handle many queries
- Strongly typed schema helps developers understand available data
- Nested and related data can be requested in a single request

---

## Project Structure

This project uses these files:

- `server.js` - starts the Apollo GraphQL server
- `typeDefs.js` - defines the GraphQL schema
- `resolvers.js` - contains functions that return actual data for queries and mutations
- `_data.js` - mock data used to simulate users and posts
- `package.json` - project settings and dependencies

---

## What is `typeDefs`?

`typeDefs` is the GraphQL schema. It describes:

- the types of objects
- the fields on those objects
- the queries clients can run
- the mutations clients can use to change data

### Schema in this project

```graphql
type User {
  id: ID!
  name: String!
  age: Int!
  posts: [Post]
}

type Post {
  id: ID!
  content: String!
  user: User!
}

type Query {
  users: [User]!
  user(id: ID!): User!
  posts: [Post]!
}

type Mutation {
  createUser(name: String!, age: Int!): User!
  createPost(user_id: ID!, content: String!): Post!
}
```

### Notes about the schema

- `ID!` means the field is an identifier and it is required
- `String!` means the field must be a string and cannot be empty
- `Int!` means the field must be an integer and is required
- `[Post]` means a list of `Post` objects
- `User!` means the `user` field always returns a `User`

---

## What are Resolvers?

Resolvers are functions that tell GraphQL how to fetch data for each field.

In this project, `resolvers.js` contains:

- `Query` resolvers: read data
- `Mutation` resolvers: create new data
- type resolvers: connect related fields like `posts` on `User` and `user` on `Post`

### Query resolvers

```js
Query: {
  users: () => users,
  user: (_, args) => users.find(user => user.id == args.id),
  posts: () => posts,
}
```

### Mutation resolvers

```js
Mutation: {
  createUser: (_, args) => {
    const { name, age } = args;
    const newId = users.length + 1;
    users.push({ id: newId, name, age });
    return users.find(user => user.id === newId);
  },
  createPost: (_, args) => {
    const { user_id, content } = args;
    const newId = posts.length + 1;
    posts.push({ id: newId, content, user_id });
    return posts.find(post => post.id === newId);
  },
}
```

### Related field resolvers

These resolvers handle nested queries:

```js
User: {
  posts: (parent) => {
    return posts.filter(post => post.user_id == parent.id);
  },
},
Post: {
  user: (parent) => {
    return users.find(user => user.id == parent.user_id);
  },
},
```

- `parent` is the object returned from the previous resolver.
- In `User.posts`, `parent` is the user object.
- In `Post.user`, `parent` is the post object.

---

## Example GraphQL Requests

### Query all users and their posts

```graphql
query {
  users {
    id
    name
    age
    posts {
      id
      content
    }
  }
}
```

### Query a single user by ID

```graphql
query {
  user(id: 2) {
    id
    name
    age
    posts {
      content
    }
  }
}
```

### Create a new user

```graphql
mutation {
  createUser(name: "Aman", age: 30) {
    id
    name
    age
  }
}
```

### Create a new post

```graphql
mutation {
  createPost(user_id: 1, content: "New post content") {
    id
    content
    user {
      id
      name
    }
  }
}
```

---

## How to run this project

1. Install dependencies:
   ```bash
   npm install
   ```
2. Start the server:
   ```bash
   npm run dev
   ```
3. Open the browser at the URL shown in the terminal (usually `http://localhost:4000`).
4. Use GraphQL Playground or Apollo Studio to run queries and mutations.

---

## Key GraphQL Concepts Used

- **Schema**: The shape of your API data.
- **Query**: Read-only operations.
- **Mutation**: Operations that change data.
- **Resolver**: Code that returns values for schema fields.
- **Type relationship**: Nested fields like `User.posts` and `Post.user`.
- **Mock data**: Simple in-memory arrays used instead of a database.

---

## What this project teaches

- How to define types in GraphQL using `typeDefs`
- How to write Query and Mutation operations
- How resolvers return data for each query
- How to resolve nested relationships between types
- How to run a simple Apollo GraphQL server

---

## Simple way to remember it

- `typeDefs` = the rules and structure of your API
- `resolvers` = the code that follows those rules and returns actual data
- `Query` = ask for data
- `Mutation` = change or add data
- `parent` = the object from the previous step in nested queries
