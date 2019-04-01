import { gql } from 'apollo-server';
import { makeExecutableSchema } from 'graphql-tools';
import * as authors from './authors';
import * as books from './books';

const rootSchema = gql`
  type Query {
    book(id: Int!): Book
    books: [Book]
    author(id: Int!): Author
    authors: [Author]
  }

  type Mutation {
    bookAdd(input: BookAddInput!): BookAddPayload
    bookRemove(input: BookRemoveInput!): BookRemovePayload
    authorAdd(input: AuthorAddInput!): AuthorAddPayload
  }

  schema {
    query: Query
    mutation: Mutation
  }
`;

const executableSchema = makeExecutableSchema({
  typeDefs: [rootSchema, books.schema, authors.schema],
  resolvers: [books.resolvers, authors.resolvers]
});

export default executableSchema;
