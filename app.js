const express = require("express");
const { graphqlHTTP } = require("express-graphql");
const { buildSchema } = require("graphql");

const app = express();

app.use(express.json());
// app.use(express.json({ extended: true }));
// app.use(express.urlencoded({ extended: true }));

app.use(
  "/graphql",
  graphqlHTTP({
    schema: buildSchema(`
          type RootQuery {
              events: [String!]!
          }
          type RootMutation {
              createEvent(name: String): String
          }
          schema {
              query: RootQuery
              mutation: RootMutation
          }
      `),
    rootValue: {
      events: () => {
        return ["Romantic Cooking", "Sailing", "All-Night Coding"];
      },
      createEvent: (args) => {
        const eventName = args.name;
        return eventName;
      },
    },
    graphiql: true,
  })
);

app.listen(3000, () => {
  console.log("Server started on port 3000");
});
