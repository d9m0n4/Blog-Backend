class UserDto {
  id;
  email;
  fullName;
  createdAt;
  rating;

  constructor(model) {
    this.id = model.id;
    this.email = model.email;
    this.fullName = model.fullName;
    this.createdAt = model.createdAt;
    this.rating = model.rating;
  }
}

export default UserDto;
