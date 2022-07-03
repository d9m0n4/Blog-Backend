class UserDto {
  id;
  email;
  fullName;
  createdAt;
  rating;
  avatar;

  constructor(model) {
    this.id = model.id;
    this.email = model.email;
    this.fullName = model.fullName;
    this.createdAt = model.createdAt;
    this.rating = model.rating;
    this.avatar = model.avatar;
  }
}

export default UserDto;
