class PostDto {
  id;
  title;
  tags;
  text;
  user;
  likes;
  viewsCount;
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
    this.viewsCount = model.viewsCount;
    this.comments = model.comments;
    this.previewImage = model.file;
    this.createdAt = model.createdAt;
  }
}

export default PostDto;
