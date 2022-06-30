class UserDto {
  id;
  email;
  fullName;
  createdAt;

  constructor(model) {
    this.id = model.id;
    this.email = model.email;
    this.fullName = model.fullName;
    this.createdAt = model.createdAt;
  }
}

export default UserDto;
