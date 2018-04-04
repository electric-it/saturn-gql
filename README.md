# Saturn-GQL

[![Build Status](https://travis-ci.org/electric-it/saturn-gql.svg?branch=master)](https://travis-ci.org/electric-it/saturn-gql)
[![npm](https://img.shields.io/npm/v/npm.svg)](https://www.npmjs.com/package/saturn-gql)


## Install
```
npm i saturn-gql
```

This library packages up your modularized [graphql-tools](https://github.com/apollographql/graphql-tools) schema. Modularizing your schema allows you
abstract your types, queries and mutations into like groups.

Currently, this modules assumes that you have your graphql schema modularized in the following fashion

```
graphql
  group-1
    index.js
    mutations.js
    queries.js
    resolver.js
    type.js
  group-2
    index.js
    mutations.js
    queries.js
    resolver.js
    type.js
```

## To Use
```
import Saturn from 'saturn-gql';
const saturn = new Saturn(`${__dirname}/graphql`);
```

```
// Graphql Schema
const schema = makeExecutableSchema(saturn.makeSchema());

// just types
const types = saturn.createTypes();

// just resolvers
const resolvers = saturn.createResolvers();
```

Note that `apollo-tools` is not a dependency of this library. This is avoid any duplication of the `graphl` package or have a mismatch in dependency versions.

## File layouts
Files should be laid in in a similar fashion

index.js
```
import { type, typeMutation, typeQuery } from './type';
import { queries, mutations, resolvers } from './queries';

export {
  type,
  typeMutation,
  typeQuery,
  queries,
  mutations,
  resolvers,
};
```

queries.js
```
export const queries = {
  posts: () => posts,
  author: (_, { id }) => find(authors, { id }),
};

export const mutations = {
  upvotePost: (_, { postId }) => {
    const post = find(posts, { id: postId });
    if (!post) {
      throw new Error(`Couldn't find post with id ${postId}`);
    }
    post.votes += 1;
    return post;
  },
};

export const resolvers = {
  Author: {
    posts: author => filter(posts, { authorId: author.id }),
  },
  Post: {
    author: post => find(authors, { id: post.authorId }),
  },
};
```

type.js
```
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
```
Queries, mutations and resolvers can also be split off into their own files as well.

queries.js
```
export const queries = {
  posts: () => posts,
  author: (_, { id }) => find(authors, { id }),
};
```

mutations.js
```
export const mutations = {
  upvotePost: (_, { postId }) => {
    const post = find(posts, { id: postId });
    if (!post) {
      throw new Error(`Couldn't find post with id ${postId}`);
    }
    post.votes += 1;
    return post;
  },
};
```

resolvers.js
```
export const resolvers = {
  Author: {
    posts: author => filter(posts, { authorId: author.id }),
  },
  Post: {
    author: post => find(authors, { id: post.authorId }),
  },
};
```


## License

```
Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
