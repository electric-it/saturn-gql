# Saturn-GQL

[![Build Status](https://travis-ci.org/electric-it/saturn-gql.svg?branch=master)](https://travis-ci.org/electric-it/saturn-gql)
[![npm](https://img.shields.io/npm/v/npm.svg)](https://www.npmjs.com/package/saturn-gql)


## Install
```
npm i saturn-gql
```

Has your GraphQL api code grown out of control? Does your GraphQL api sit in a single file with thousands of lines of code? Unsure of the best way to logically separate it all? Saturn-GQL is here to help!

Saturn-GQL takes care of packaging up your modularized [graphql-tools](https://github.com/apollographql/graphql-tools) schema, allowing you to separate your types, queries and mutations into logical groupings.

To get started, you'll need to split your graphql api into a directory structure similar to the diagram below. If you are already using [graphql-tools](https://github.com/apollographql/graphql-tools) this should be a fairly trivial step.

 Any file not labeled **optional** in the below diagram is required in order for Saturn-GQL to work. Feel free to checkout this [blog post](https://itnext.io/introducing-saturn-gql-an-opinionated-way-to-develop-graphql-apis-d99bf4d0790e) for a deeper explanation and example.

``` shell
graphql
  group-1
    index.js
    mutations.js <- optional
    queries.js
    resolver.js <- optional
    type.js
  group-2
    index.js
    mutations.js <- optional
    queries.js
    resolver.js <- optional
    type.js
```

## To Use

``` javascript
import Saturn from 'saturn-gql';
const saturn = new Saturn(`${__dirname}/graphql`);
```

``` javascript
// Graphql Schema
const schema = makeExecutableSchema(saturn.makeSchema());

// just types
const types = saturn.createTypes();

// just resolvers
const resolvers = saturn.createResolvers();
```

Note that `apollo-tools` is not a dependency of this library. This is to avoid any duplication or version misatches of the `graphql` package.

## File layouts

Files should be laid in in a similar fashion

``` javascript
/* index.js */

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

``` javascript
/* queries.js */

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

``` javascript
/* type.js */

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

--- 
Mutations and resolvers can also be split off into their own files.

``` javascript
/* queries.js */

export const queries = {
  posts: () => posts,
  author: (_, { id }) => find(authors, { id }),
};
```


``` javascript
/* mutations.js */

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

``` javascript
/* resolvers.js */

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
