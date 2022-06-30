class UserDto {
  email;
  fullName;
  createdAt;

  constructor(model) {
    this.email = model.email;
    this.fullName = model.fullName;
    this.createdAt = model.createdAt;
  }
}

export default UserDto;
