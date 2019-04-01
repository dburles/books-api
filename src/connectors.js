import Sequelize from 'sequelize';

const sequelize = new Sequelize('rate', null, null, {
  dialect: 'sqlite',
  storage: './database.sqlite',
  operatorsAliases: false
});

export const Book = sequelize.define('book', {
  title: {
    type: Sequelize.STRING
  }
});

export const Author = sequelize.define('author', {
  name: {
    type: Sequelize.STRING
  }
});

Book.belongsTo(Author);

sequelize.sync();

export const getIdsFromQueryResponse = response =>
  response.map(doc => doc.toJSON().id);
