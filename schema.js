const graphql = require('graphql');
const users = require('./users.json');

let bookType = new graphql.GraphQLObjectType({
    name: 'Book',
    fields: {
        id: { type: new graphql.GraphQLNonNull(graphql.GraphQLInt) },
        author: { type: graphql.GraphQLString },
        title: { type: graphql.GraphQLString }
    }
});

let userType = new graphql.GraphQLObjectType({
    name: 'User',
    fields: {
        id: { type: new graphql.GraphQLNonNull(graphql.GraphQLInt)},
        name: { type: new graphql.GraphQLNonNull(graphql.GraphQLString)},
        age: {type: graphql.GraphQLInt},
        books: { type: new graphql.GraphQLList(bookType) }
    }
});

let schema = new graphql.GraphQLSchema({
    query: new graphql.GraphQLObjectType({
        name: 'Query',
        fields: {
            user: {
                type: userType,
                args: {
                    id: {
                        type: graphql.GraphQLInt
                    }
                },
                resolve: function(_, args) {
                    let response = users.find(function(user) {
                        return (user.id == args.id)
                    });
                    return response;
                }
            }
        }
    })
});

module.exports = schema;