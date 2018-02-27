import { readdirSync, existsSync } from 'fs';
import { merge, isEmpty } from 'lodash';

class GraphGen {
  constructor(path) {
    this.path = path;
  }

  createTypes() {
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
    typeDefs += query.length !== 0 ? RootQuery : '';
    typeDefs += mutation.length !== 0 ? Mutations : '';
    const SchemaDefinition = `
    schema {
    ${query.length !== 0 ? 'query: RootQuery\n' : ''}
    ${mutation.length !== 0 ? 'mutation: Mutations\n' : ''}
  }
  `;
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

    const objToReturn = { ...mergedResolvers };
    if (!isEmpty(rootQuery)) {
      objToReturn.RootQuery = rootQuery;
    }

    if (!isEmpty(rootMutations)) {
      objToReturn.Mutations = rootMutations;
    }

    return objToReturn;
  }

  makeSchema() {
    return {
      typeDefs: this.createTypes(),
      resolvers: this.createResolvers(),
    };
  }
}

export default GraphGen;
