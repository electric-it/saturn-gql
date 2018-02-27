import { readdirSync, existsSync } from 'fs';
import { merge } from 'lodash';

class GraphGen {
  constructor(path) {
    this.path = path;
  }

  createTypes() {
    const SchemaDefinition = `
    schema {
      query: RootQuery
      mutation: Mutations
    }
  `;
    let RootQuery = `
      # the schema allows the following queries:
      type RootQuery {
    `;
    let typeDefs = '';
    let query = '';

    // this type is required by graphql.
    // Because of this, if the graphql collections
    // passed into saturn do not have a mutations file,
    // we must create a dummy one, hence
    // B1533EC23A57BFB7A5730D202C059C8E
    let Mutations = `
      type Mutations {
    `;

    let mutation = '';
    readdirSync(this.path).forEach(dir => {
      if (existsSync(`${this.path}/${dir}/index.js`)) {
        /* eslint global-require: "off" */
        /* eslint import/no-dynamic-require: "off" */
        const { type, typeQuery, typeMutation } = require(`${this.path}/${dir}`);
        typeDefs += type;
        query += typeQuery || '';
        mutation += typeMutation || '';
      }
    });


    RootQuery += `${query}\n  }\n`;

    if (mutation.length === 0) {
      Mutations += 'B1533EC23A57BFB7A5730D202C059C8E(params: String!): String\n  }\n';
    } else {
      Mutations += `${mutation}\n  }\n`;
    }
    typeDefs += RootQuery;
    typeDefs += Mutations;
    typeDefs += SchemaDefinition;
    return typeDefs;
  }

  createResolvers() {
    let mergedResolvers = {};
    let rootQuery = {};
    let rootMutations = {};
    let foundMutations = false;
    readdirSync(this.path).forEach(dir => {
      if (existsSync(`${this.path}/${dir}/index.js`)) {
        /* eslint global-require: "off" */
        /* eslint import/no-dynamic-require: "off" */
        const { resolvers, queries, mutations } = require(`${this.path}/${dir}`);
        mergedResolvers = merge(mergedResolvers, resolvers);
        rootQuery = merge(rootQuery, queries);
        if (mutations) { // if empty, don't run merge.
          foundMutations = true;
          rootMutations = merge(rootMutations, mutations);
        }
      }
    });

    const objToReturn = {
      ...mergedResolvers,
    };
    objToReturn.RootQuery = rootQuery;
    if (foundMutations) {
      objToReturn.Mutations = rootMutations;
    } else { // return empty random mutation to satisfy graphql.
      rootMutations = { B1533EC23A57BFB7A5730D202C059C8E: () => { } };
    }

    return {
      RootQuery: rootQuery,
      Mutations: rootMutations,
      ...mergedResolvers,
    };
  }

  makeSchema() {
    return {
      typeDefs: this.createTypes(),
      resolvers: this.createResolvers(),
    };
  }
}

export default GraphGen;
