import { Tag } from '../models/models.js';

class TagsController {
  getTags = async (req, res, next) => {
    const tags = await Tag.findAll();
    const items = tags.map((item) => item.items.map((item) => item.trim())).flat();

    res.json([...items]);
  };
}

export default TagsController;
