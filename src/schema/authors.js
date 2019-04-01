import { gql } from 'apollo-server';
import { Author, Book } from '../connectors';

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
    books({ id }) {
      return Book.findAll({
        // attributes: ['id'],
        where: { authorId: id },
        order: [['createdAt', 'DESC']]
      });
    },
    mostPopularBook() {
      return Book.findByPk(1);
    }
  },
  Query: {
    author(obj, { id }) {
      return Author.findByPk(id);
    },
    authors() {
      return Author.findAll({
        order: [['createdAt', 'DESC']]
      });
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
