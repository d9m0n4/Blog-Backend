class PostDto {
  id;
  title;
  tags;
  text;
  user;
  likes;
  views;
  comments;
  previewImage;
  createdAt;

  constructor(model) {
    this.id = model.id;
    this.title = model.title;
    this.tags = model.tags;
    this.text = model.text;
    this.user = model.user;
    this.likes = model.likes;
    this.views = model.viewsCount;
    this.comments = model.comments;
    this.previewImage = model.previewImage;
    this.createdAt = model.createdAt;
  }
}

export default PostDto;
