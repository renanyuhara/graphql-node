const connectionString = 'Server=localhost;Database:tests_node;User Id: usr_tests;Password=Qwe123456';
const sql = require('mssql');

const graphql = require('graphql');

let userType = new graphql.GraphQLObjectType({
    name: 'User',
    fields: {
        id: { type: new graphql.GraphQLNonNull(graphql.GraphQLInt)},
        name: { type: new graphql.GraphQLNonNull(graphql.GraphQLString)},
        age: {type: graphql.GraphQLInt}
    }
});

const sequelize = require('sequelize');

const Conn = new sequelize('tests_node', 'usr_tests', 'Qwe123456', {
    host: 'localhost',
    dialect: 'mssql',
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    }
});

const UserModel = Conn.define('users', {
    id: {
        type: sequelize.INTEGER,
        primaryKey: true
    },
    name: {
        type: sequelize.STRING,
        allowNull: true
    },
    age: {
        type: sequelize.INTEGER,
        allowNull: true
    }
}, {
    timestamps: false
});

let schema = new graphql.GraphQLSchema({
    query: new graphql.GraphQLObjectType({
        name: 'Query',
        fields: {
            user: { //http://localhost:3000/user-mssql?query={user(id:1),{name,age}}
                type: userType,
                args: {
                    id: {
                        type: graphql.GraphQLInt
                    }
                },
                resolve: function(_, args) {
                    let opts = { where: args };
                    opts.where.id = args.id;
                    let response = UserModel.findOne(opts);
                    return response;
                }
            },
            users: { //http://localhost:3000/user-mssql?query={users,{name}}
                type: new graphql.GraphQLList(userType),
                resolve: function(_, args) {
                    let response = UserModel.findAll();
                    return response;
                }
            }
        }
    })
});

module.exports = schema;