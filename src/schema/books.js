import { gql } from 'apollo-server';
import { getIdsFromQueryResponse, Book } from '../connectors';

export const schema = gql`
  input BookAddInput {
    title: String!
    authorId: Int!
  }

  input BookRemoveInput {
    id: Int!
  }

  type BookAddPayload {
    book: Book
  }

  type BookRemovePayload {
    book: Book
  }

  type Book {
    id: Int!
    title: String!
    author: Author!
  }
`;

export const resolvers = {
  Book: {
    author({ authorId }, args, { dataloader }) {
      return dataloader.Author.load(authorId);
    }
  },
  Query: {
    book(obj, { id }, { dataloader }) {
      return dataloader.Book.load(id);
    },
    async books(obj, args, { dataloader }) {
      const response = await Book.findAll({
        attributes: ['id'],
        order: [['createdAt', 'DESC']]
      });
      return dataloader.Book.loadMany(getIdsFromQueryResponse(response));
    }
  },
  Mutation: {
    async bookAdd(
      obj,
      {
        input: { title, authorId }
      },
      { dataloader }
    ) {
      const author = await dataloader.Author.load(authorId);
      if (!author) throw Error('Author not found');

      const book = await Book.create({
        title,
        authorId
      });

      return { book };
    },
    async bookRemove(
      obj,
      {
        input: { id }
      },
      { dataloader }
    ) {
      const book = await dataloader.Book.load(id);
      if (!book) throw Error('Book not found');

      Book.destroy({ where: { id } });

      return { book };
    }
  }
};
