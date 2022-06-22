const express = require('express');

const colors = require('colors');
const cors = require('cors');

require('dotenv').config();

const { graphqlHTTP } = require('express-graphql');
const schema = require('./schema/schema');

const connectDb = require('./config/db');

const port = process.env.PORT || 5000;

const app = express();

// connect to mongo db
connectDb();

app.use(cors());

app.use('/graphql', graphqlHTTP({
    schema,
    graphiql: true,
}));

app.listen(port, console.log(`Server is running on port ${port}`));
