class PostDto {
  id;
  title;
  tags;
  text;
  user;
  likes;
  views;
  comments;

  constructor(model) {
    this.id = model.id;
    this.title = model.title;
    this.tags = model.tags;
    this.text = model.text;
    this.user = model.user;
    this.likes = model.likes;
    this.views = model.viewsCount;
    this.comments = model.comments;
  }
}

export default PostDto;
