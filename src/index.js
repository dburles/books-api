import { ApolloServer } from 'apollo-server';
import schema from './schema';

const host = process.env.GRAPHQL_HOST || 'localhost';
const port = process.env.GRAPHQL_PORT || 3010;

const wait = ms => new Promise(resolve => setTimeout(() => resolve(), ms));

const server = new ApolloServer({
  schema,
  async context() {
    // Fake latency
    // await wait(1000);
  },
  formatError(error) {
    console.log(error);
    return error;
  },
  formatResponse(response) {
    return response;
  },
  cors: '*'
});

server.listen({ host, port }).then(({ url }) => {
  // eslint-disable-next-line no-console
  console.log(`🚀  Server ready at ${url}`);
});
