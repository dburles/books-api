import { gql } from 'apollo-server';
import { Book, Author } from '../connectors';

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
    author({ authorId }) {
      return Author.findByPk(authorId);
    }
  },
  Query: {
    book(obj, { id }) {
      return Book.findByPk(id);
    },
    books() {
      return Book.findAll({
        order: [['createdAt', 'DESC']]
      });
    }
  },
  Mutation: {
    async bookAdd(
      obj,
      {
        input: { title, authorId }
      }
    ) {
      const author = await Author.findByPk(authorId);
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
