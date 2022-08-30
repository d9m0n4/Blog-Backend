class UserDto {
  id;
  email;
  fullName;
  nickName;
  createdAt;
  rating;
  avatar;
  city;

  constructor(model) {
    this.id = model.id;
    this.email = model.email;
    this.fullName = model.fullName;
    this.createdAt = model.createdAt;
    this.rating = model.rating;
    this.avatar = model.file;
    this.city = model.city;
    this.nickName = model.nickName;
  }
}

export default UserDto;
