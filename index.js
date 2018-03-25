const graphql = require('graphql');
const graphqlHTTP = require('express-graphql');
const express = require('express');
const users = require('./schema');
const usersmssql = require('./mssql');
const app = express();

app.use('/user', graphqlHTTP({schema:users, pretty: true}));

app.use('/user-mssql', graphqlHTTP({schema:usersmssql, pretty: true}));

app.listen(3000, function () {
  console.log('Server on.')
});