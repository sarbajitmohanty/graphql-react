const express = require("express");
const { graphqlHTTP } = require("express-graphql");
const { buildSchema } = require("graphql");
const mongoose = require("mongoose");

const Event = require("./models/event");

const app = express();

const PORT = process.env.PORT || 3000;

app.use(express.json());
// app.use(express.json({ extended: true }));
// app.use(express.urlencoded({ extended: true }));

// const events = [];

app.use(
  "/graphql",
  graphqlHTTP({
    schema: buildSchema(`
          type Event {
            _id: ID!
            title: String!
            description: String!
            price: Float!
            date: String!
          }

          input EventInput {
            title: String!
            description: String!
            price: Float!
            date: String!
          }

          type RootQuery {
              events: [Event!]!
          }

          type RootMutation {
              createEvent(eventInput: EventInput): Event
          }
          schema {
              query: RootQuery
              mutation: RootMutation
          }
      `),
    rootValue: {
      events: () => {
        Event.find()
          .then((events) => {
            return events.map((event) => {
              return { ...event._doc };
            });
          })
          .catch((err) => {
            throw err;
          });
      },
      createEvent: (args) => {
        // const event = {
        //   _id: Math.random().toString(),
        //   title: args.eventInput.title,
        //   description: args.eventInput.description,
        //   price: +args.eventInput.price,
        //   date: args.eventInput.date,
        // };

        const event = new Event({
          title: args.eventInput.title,
          description: args.eventInput.description,
          price: +args.eventInput.price,
          date: new Date(args.eventInput.date),
        });
        // events.push(event);
        return event
          .save()
          .then((result) => {
            console.log(result);
            return { ...result._doc };
          })
          .catch((err) => {
            console.log(err);
            throw err;
          });
      },
    },
    graphiql: true,
  })
);

mongoose
  .connect("mongodb://localhost:27017/reactGraphqlDB", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() =>
    app.listen(PORT, () => console.log(`Server running on port: ${PORT}`))
  )
  .catch((error) => console.log(error.message));
