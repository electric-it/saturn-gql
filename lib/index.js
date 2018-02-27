'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _fs = require('fs');

var _lodash = require('lodash');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var GraphGen = function () {
  function GraphGen(path) {
    _classCallCheck(this, GraphGen);

    this.path = path;
  }

  _createClass(GraphGen, [{
    key: 'createTypes',
    value: function createTypes() {
      var _this = this;

      var SchemaDefinition = '\n    schema {\n      query: RootQuery\n      mutation: Mutations\n    }\n  ';
      var RootQuery = '\n      # the schema allows the following queries:\n      type RootQuery {\n    ';
      var typeDefs = '';
      var query = '';

      // this type is required by graphql.
      // Because of this, if the graphql collections
      // passed into saturn do not have a mutations file,
      // we must create a dummy one, hence
      // B1533EC23A57BFB7A5730D202C059C8E
      var Mutations = '\n      type Mutations {\n    ';

      var mutation = '';
      (0, _fs.readdirSync)(this.path).forEach(function (dir) {
        if ((0, _fs.existsSync)(_this.path + '/' + dir + '/index.js')) {
          /* eslint global-require: "off" */
          /* eslint import/no-dynamic-require: "off" */
          var _require = require(_this.path + '/' + dir),
              type = _require.type,
              typeQuery = _require.typeQuery,
              typeMutation = _require.typeMutation;

          typeDefs += type;
          query += typeQuery || '';
          mutation += typeMutation || '';
        }
      });

      RootQuery += query + '\n  }\n';

      if (mutation.length === 0) {
        Mutations += 'B1533EC23A57BFB7A5730D202C059C8E(params: String!): String\n  }\n';
      } else {
        Mutations += mutation + '\n  }\n';
      }
      typeDefs += RootQuery;
      typeDefs += Mutations;
      typeDefs += SchemaDefinition;
      return typeDefs;
    }
  }, {
    key: 'createResolvers',
    value: function createResolvers() {
      var _this2 = this;

      var mergedResolvers = {};
      var rootQuery = {};
      var rootMutations = {};
      var foundMutations = false;
      (0, _fs.readdirSync)(this.path).forEach(function (dir) {
        if ((0, _fs.existsSync)(_this2.path + '/' + dir + '/index.js')) {
          /* eslint global-require: "off" */
          /* eslint import/no-dynamic-require: "off" */
          var _require2 = require(_this2.path + '/' + dir),
              resolvers = _require2.resolvers,
              queries = _require2.queries,
              mutations = _require2.mutations;

          mergedResolvers = (0, _lodash.merge)(mergedResolvers, resolvers);
          rootQuery = (0, _lodash.merge)(rootQuery, queries);
          if (mutations) {
            // if empty, don't run merge.
            foundMutations = true;
            rootMutations = (0, _lodash.merge)(rootMutations, mutations);
          }
        }
      });

      var objToReturn = _extends({}, mergedResolvers);
      objToReturn.RootQuery = rootQuery;
      if (foundMutations) {
        objToReturn.Mutations = rootMutations;
      } else {
        // return empty random mutation to satisfy graphql.
        rootMutations = { B1533EC23A57BFB7A5730D202C059C8E: function B1533EC23A57BFB7A5730D202C059C8E() {} };
      }

      return _extends({
        RootQuery: rootQuery,
        Mutations: rootMutations
      }, mergedResolvers);
    }
  }, {
    key: 'makeSchema',
    value: function makeSchema() {
      return {
        typeDefs: this.createTypes(),
        resolvers: this.createResolvers()
      };
    }
  }]);

  return GraphGen;
}();

exports.default = GraphGen;