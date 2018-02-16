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
    Mutations += `${mutation}\n  }\n`;
    typeDefs += RootQuery;
    typeDefs += Mutations;
    typeDefs += SchemaDefinition;
    return typeDefs;
  }

  createResolvers() {
    let mergedResolvers = {};
    let rootQuery = {};
    let rootMutations = {};
    readdirSync(this.path).forEach(dir => {
      if (existsSync(`${this.path}/${dir}/index.js`)) {
        /* eslint global-require: "off" */
        /* eslint import/no-dynamic-require: "off" */
        const { resolvers, queries, mutations } = require(`${this.path}/${dir}`);
        mergedResolvers = merge(mergedResolvers, resolvers);
        rootQuery = merge(rootQuery, queries);
        rootMutations = merge(rootMutations, mutations);
      }
    });

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
