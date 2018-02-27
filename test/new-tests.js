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

describe('NEW TESTS Combine Types', function () {
  let types;
  before(done => {
    const saturn = new Saturn(`${__dirname}/not-working`);
    types = saturn.createTypes();
    done();
  });

  it('should return a string', done => {
    expect(typeof types).toBe('string');
    done();
  });
});

describe('NEW TESTS Combine Resolvers', function () {
  let resolvers;
  before(done => {
    const saturn = new Saturn(`${__dirname}/not-working`);
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

  it('Mutations should have B1533EC23A57BFB7A5730D202C059C8E key and should be a function', done => {
    expect(resolvers.Mutations).toIncludeKey('B1533EC23A57BFB7A5730D202C059C8E');
    expect(resolvers.Mutations.B1533EC23A57BFB7A5730D202C059C8E).toBeA('function');
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

describe('NEW TESTS Make Schema', function () {
  let schema;
  before(done => {
    const saturn = new Saturn(`${__dirname}/not-working`);
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

  it('schema should return a B1533EC23A57BFB7A5730D202C059C8E mutation type', done => {
    const query = schema.getTypeMap().Mutations.getFields().B1533EC23A57BFB7A5730D202C059C8E;
    expect(query).toExist();
    expect(query.args[0].name).toBe('params');
    expect(query.args[0].type).toEqual('String!');
    done();
  });

  it('should have a String type', done => {
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
