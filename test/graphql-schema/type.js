export const type = `
  type Author {
    id: Int!
    firstName: String
    lastName: String
    posts: [Post] # the list of Posts by this author
  }

  type Post {
    id: Int!
    title: String
    author: Author
    votes: Int
  }
`;

export const typeQuery = `
  posts: [Post]
  author(id: Int!): Author
`;

export const typeMutation = `
  upvotePost(postId: Int!): Post
`;
