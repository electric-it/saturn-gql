/* eslint prefer-arrow-callback: [0, "error"] */
/* eslint func-names: [0, "error"] */
import expect from 'expect';
import { makeExecutableSchema } from 'graphql-tools';

import {
  GraphQLList,
  GraphQLInt,
  GraphQLNonNull,
  GraphQLString,
} from 'graphql';
import Saturn from '../src';

describe('Combine Types', function() {
  let types;
  before(done => {
    const saturn = new Saturn(`${__dirname}/working`);
    types = saturn.createTypes();
    done();
  });

  it('should return a string', done => {
    expect(typeof types).toBe('string');
    done();
  });
});

describe('Combine Resolvers', function() {
  let resolvers;
  before(done => {
    const saturn = new Saturn(`${__dirname}/working`);
    resolvers = saturn.createResolvers();
    done();
  });

  it('should return an object', done => {
    expect(typeof resolvers).toBe('object');
    done();
  });

  it('should return an RootQuery key', done => {
    expect(resolvers).toIncludeKey('RootQuery');
    done();
  });

  it('RootQuery should have posts and author keys and they should both be functions', done => {
    expect(resolvers.RootQuery).toIncludeKeys(['posts', 'author']);
    expect(resolvers.RootQuery.posts).toBeA('function');
    expect(resolvers.RootQuery.author).toBeA('function');
    done();
  });

  it('should return an Mutations key', done => {
    expect(resolvers).toIncludeKey('Mutations');
    done();
  });

  it('Mutations should have upvotePost key and should be a function', done => {
    expect(resolvers.Mutations).toIncludeKey('upvotePost');
    expect(resolvers.Mutations.upvotePost).toBeA('function');
    done();
  });

  it('should return an Author key', done => {
    expect(resolvers).toIncludeKey('Author');
    done();
  });

  it('Author should have posts key and should be a function', done => {
    expect(resolvers.Author).toIncludeKey('posts');
    expect(resolvers.Author.posts).toBeA('function');
    done();
  });

  it('should return an Post key', done => {
    expect(resolvers).toIncludeKey('Author');
    done();
  });

  it('Post should have author key and should be a function', done => {
    expect(resolvers.Post).toIncludeKey('author');
    expect(resolvers.Post.author).toBeA('function');
    done();
  });
});

describe('Make Schema', function() {
  let schema;
  before(done => {
    const saturn = new Saturn(`${__dirname}/working`);
    schema = makeExecutableSchema(saturn.makeSchema());
    done();
  });

  it('should return a graphql schema', done => {
    expect(schema).toExist();
    done();
  });

  it('schema should return a posts root query type', done => {
    const query = schema.getTypeMap().RootQuery.getFields().posts;
    expect(query).toExist();
    const post = schema.getTypeMap().Post;
    expect(query.type).toEqual(new GraphQLList(post));
    done();
  });

  it('schema should return a author root query type', done => {
    const query = schema.getTypeMap().RootQuery.getFields().author;
    expect(query).toExist();
    const author = schema.getTypeMap().Author;
    expect(query.type).toBe(author);
    expect(query.args[0].name).toBe('id');
    expect(query.args[0].type).toEqual(new GraphQLNonNull(GraphQLInt));
    done();
  });

  it('schema should return a upvotePost mutation type', done => {
    const query = schema.getTypeMap().Mutations.getFields().upvotePost;
    expect(query).toExist();
    const post = schema.getTypeMap().Post;
    expect(query.type).toBe(post);
    expect(query.args[0].name).toBe('postId');
    expect(query.args[0].type).toEqual(new GraphQLNonNull(GraphQLInt));
    done();
  });

  it('should have a Author type', done => {
    const type = schema.getTypeMap().Author;
    expect(type).toExist();
    const fields = type.getFields();
    expect(fields).toContainKeys(['id', 'firstName', 'lastName', 'posts']);
    expect(fields.id.type).toEqual(new GraphQLNonNull(GraphQLInt));
    expect(fields.firstName.type).toBe(GraphQLString);
    expect(fields.lastName.type).toBe(GraphQLString);
    const post = schema.getTypeMap().Post;
    expect(fields.posts.type).toEqual(new GraphQLList(post));
    done();
  });

  it('should have a Post type', done => {
    const type = schema.getTypeMap().Post;
    expect(type).toExist();
    const fields = type.getFields();
    expect(fields).toContainKeys(['id', 'title', 'author', 'votes']);
    expect(fields.id.type).toEqual(new GraphQLNonNull(GraphQLInt));
    expect(fields.title.type).toBe(GraphQLString);
    const author = schema.getTypeMap().Author;
    expect(fields.author.type).toBe(author);
    expect(fields.votes.type).toBe(GraphQLInt);
    done();
  });
});

describe('Not Working Combine Types', function() {
  let types;
  before(done => {
    const saturn = new Saturn(`${__dirname}/no-mutations`);
    types = saturn.createTypes();
    done();
  });

  it('should return a string', done => {
    expect(typeof types).toBe('string');
    done();
  });
});

describe('Not Working Combine Resolvers', function() {
  let resolvers;
  before(done => {
    const saturn = new Saturn(`${__dirname}/no-mutations`);
    resolvers = saturn.createResolvers();
    done();
  });

  it('should return an object', done => {
    expect(typeof resolvers).toBe('object');
    done();
  });

  it('should return an RootQuery key', done => {
    expect(resolvers).toIncludeKey('RootQuery');
    done();
  });

  it('RootQuery should have posts and author keys and they should both be functions', done => {
    expect(resolvers.RootQuery).toIncludeKeys(['posts', 'author']);
    expect(resolvers.RootQuery.posts).toBeA('function');
    expect(resolvers.RootQuery.author).toBeA('function');
    done();
  });

  it('should return an Mutations key', done => {
    expect(resolvers).toNotIncludeKey('Mutations');
    done();
  });

  it('should return an Author key', done => {
    expect(resolvers).toIncludeKey('Author');
    done();
  });

  it('Author should have posts key and should be a function', done => {
    expect(resolvers.Author).toIncludeKey('posts');
    expect(resolvers.Author.posts).toBeA('function');
    done();
  });

  it('should return an Post key', done => {
    expect(resolvers).toIncludeKey('Author');
    done();
  });

  it('Post should have author key and should be a function', done => {
    expect(resolvers.Post).toIncludeKey('author');
    expect(resolvers.Post.author).toBeA('function');
    done();
  });
});

describe('Not Working Make Schema', function() {
  let schema;
  before(done => {
    const saturn = new Saturn(`${__dirname}/no-mutations`);
    schema = makeExecutableSchema(saturn.makeSchema());
    done();
  });

  it('should return a graphql schema', done => {
    expect(schema).toExist();
    done();
  });

  it('schema should return a posts root query type', done => {
    const query = schema.getTypeMap().RootQuery.getFields().posts;
    expect(query).toExist();
    const post = schema.getTypeMap().Post;
    expect(query.type).toEqual(new GraphQLList(post));
    done();
  });

  it('schema should return a author root query type', done => {
    const query = schema.getTypeMap().RootQuery.getFields().author;
    expect(query).toExist();
    const author = schema.getTypeMap().Author;
    expect(query.type).toBe(author);
    expect(query.args[0].name).toBe('id');
    expect(query.args[0].type).toEqual(new GraphQLNonNull(GraphQLInt));
    done();
  });

  it('schema should NOT return a upvotePost mutation type', done => {
    const query = schema.getTypeMap().Mutations;
    expect(query).toNotExist();
    done();
  });

  it('should have a Author type', done => {
    const type = schema.getTypeMap().Author;
    expect(type).toExist();
    const fields = type.getFields();
    expect(fields).toContainKeys(['id', 'firstName', 'lastName', 'posts']);
    expect(fields.id.type).toEqual(new GraphQLNonNull(GraphQLInt));
    expect(fields.firstName.type).toBe(GraphQLString);
    expect(fields.lastName.type).toBe(GraphQLString);
    const post = schema.getTypeMap().Post;
    expect(fields.posts.type).toEqual(new GraphQLList(post));
    done();
  });

  it('should have a Post type', done => {
    const type = schema.getTypeMap().Post;
    expect(type).toExist();
    const fields = type.getFields();
    expect(fields).toContainKeys(['id', 'title', 'author', 'votes']);
    expect(fields.id.type).toEqual(new GraphQLNonNull(GraphQLInt));
    expect(fields.title.type).toBe(GraphQLString);
    const author = schema.getTypeMap().Author;
    expect(fields.author.type).toBe(author);
    expect(fields.votes.type).toBe(GraphQLInt);
    done();
  });
});


describe('Not Working Query Combine Types', function() {
  let types;
  before(done => {
    const saturn = new Saturn(`${__dirname}/no-queries`);
    types = saturn.createTypes();
    done();
  });

  it('should return a string', done => {
    expect(typeof types).toBe('string');
    done();
  });
});

describe('Not Working Query Combine Resolvers', function() {
  let resolvers;
  before(done => {
    const saturn = new Saturn(`${__dirname}/no-queries`);
    resolvers = saturn.createResolvers();
    done();
  });

  it('should return an object', done => {
    expect(typeof resolvers).toBe('object');
    done();
  });

  it('should return an RootQuery key', done => {
    expect(resolvers).toNotIncludeKey('RootQuery');
    done();
  });

  it('should return an Mutations key', done => {
    expect(resolvers).toIncludeKey('Mutations');
    done();
  });

  it('should return an Author key', done => {
    expect(resolvers).toIncludeKey('Author');
    done();
  });

  it('Author should have posts key and should be a function', done => {
    expect(resolvers.Author).toIncludeKey('posts');
    expect(resolvers.Author.posts).toBeA('function');
    done();
  });

  it('should return an Post key', done => {
    expect(resolvers).toIncludeKey('Author');
    done();
  });

  it('Post should have author key and should be a function', done => {
    expect(resolvers.Post).toIncludeKey('author');
    expect(resolvers.Post.author).toBeA('function');
    done();
  });
});

describe('Not Working Query Make Schema', function() {
  let schema;
  before(done => {
    const saturn = new Saturn(`${__dirname}/no-queries`);
    schema = makeExecutableSchema(saturn.makeSchema());
    done();
  });

  it('should return a graphql schema', done => {
    expect(schema).toExist();
    done();
  });

  it('schema should NOT return a posts root query type', done => {
    const query = schema.getTypeMap().RootQuery;
    expect(query).toNotExist();
    done();
  });

  it('schema should return a author root query type', done => {
    const query = schema.getTypeMap().RootQuery;
    expect(query).toNotExist();
    done();
  });

  it('schema should return a upvotePost mutation type', done => {
    const query = schema.getTypeMap().Mutations;
    expect(query).toExist();
    done();
  });

  it('should have a Author type', done => {
    const type = schema.getTypeMap().Author;
    expect(type).toExist();
    const fields = type.getFields();
    expect(fields).toContainKeys(['id', 'firstName', 'lastName', 'posts']);
    expect(fields.id.type).toEqual(new GraphQLNonNull(GraphQLInt));
    expect(fields.firstName.type).toBe(GraphQLString);
    expect(fields.lastName.type).toBe(GraphQLString);
    const post = schema.getTypeMap().Post;
    expect(fields.posts.type).toEqual(new GraphQLList(post));
    done();
  });

  it('should have a Post type', done => {
    const type = schema.getTypeMap().Post;
    expect(type).toExist();
    const fields = type.getFields();
    expect(fields).toContainKeys(['id', 'title', 'author', 'votes']);
    expect(fields.id.type).toEqual(new GraphQLNonNull(GraphQLInt));
    expect(fields.title.type).toBe(GraphQLString);
    const author = schema.getTypeMap().Author;
    expect(fields.author.type).toBe(author);
    expect(fields.votes.type).toBe(GraphQLInt);
    done();
  });
});