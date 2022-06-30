import PostDto from '../dtos/postDto.js';
import UserDto from '../dtos/userDto.js';
import { Post, Tag, User } from '../models/models.js';

class PostService {
  create = async (title, text, tags, userId) => {
    const post = await Post.create({ title, text, userId });
    const postTags = await Tag.create({ items: tags, postId: post.id });

    return { ...post, tags: postTags };
  };
  getAllPosts = async () => {
    const posts = await Post.findAll({
      include: [{ model: Tag, attributes: ['items'] }, { model: User }],
    });

    const postsData = posts.map((post) => {
      const postItem = new PostDto(post);
      const postUser = new UserDto(post.user);

      return { ...postItem, user: postUser };
    });
    return postsData;
  };
}

export default new PostService();
