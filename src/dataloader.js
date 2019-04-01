import DataLoader from 'dataloader';
import { Op } from 'sequelize';
import { Book, Author } from './connectors';

const createDataLoader = Model =>
  new DataLoader(async keys => {
    const responses = await Model.findAll({
      raw: true,
      where: { id: { [Op.in]: keys } }
    });
    return keys.map(key => responses.find(response => response.id === key));
  });

export const createDataLoaders = () => ({
  Book: createDataLoader(Book),
  Author: createDataLoader(Author)
});
