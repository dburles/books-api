import { gql } from 'apollo-server';
import { getIdsFromQueryResponse, Author, Book } from '../connectors';

export const schema = gql`
  input AuthorAddInput {
    name: String!
  }

  type AuthorAddPayload {
    author: Author
  }

  type Author {
    id: Int!
    name: String!
    books: [Book]
    mostPopularBook: Book
  }
`;

export const resolvers = {
  Author: {
    async books({ id }, args, { dataloader }) {
      const response = await Book.findAll({
        attributes: ['id'],
        where: { authorId: id },
        order: [['createdAt', 'DESC']]
      });
      return dataloader.Book.loadMany(getIdsFromQueryResponse(response));
    },
    mostPopularBook(obj, args, { dataloader }) {
      return dataloader.Book.load(1);
    }
  },
  Query: {
    author(obj, { id }, { dataloader }) {
      return dataloader.Author.load(id);
    },
    async authors(obj, args, { dataloader }) {
      const response = await Author.findAll({
        attributes: ['id'],
        order: [['createdAt', 'DESC']]
      });
      return dataloader.Author.loadMany(getIdsFromQueryResponse(response));
    }
  },
  Mutation: {
    async authorAdd(
      obj,
      {
        input: { name }
      }
    ) {
      const author = await Author.create({
        name
      });

      return { author };
    }
  }
};
