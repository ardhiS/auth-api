const RegisteredUser = require('../../../Domains/users/entities/RegisteredUser');
const RegisterUser = require('../../../Domains/users/entities/RegisterUser');
const UserRepository = require('../../../Domains/users/UserRepository');
const PasswordHash = require('../../security/PasswordHash');
const AddUserUseCase = require('../AddUserUserCase');

describe('AddUserUseCase', () => {
  it('should orchestrating the add user action properly', async () => {
    // Arrange
    const useCasePayload = {
      username: 'dicoding',
      password: 'secret',
      fullname: 'Dicoding Indonesia',
    };

    const mockRegisteredUser = new RegisteredUser({
      id: 'user-123',
      username: useCasePayload.username,
      fullname: useCasePayload.fullname,
    });

    // Creating dependencies of use case
    const mockUserRepository = new UserRepository();
    const mockPasswordHash = new PasswordHash();

    // Mocking needed function
    mockUserRepository.verifyAvailableUsername = jest
      .fn()
      .mockImplementation(() => Promise.resolve());
    mockPasswordHash.hash = jest
      .fn()
      .mockImplementation(() => Promise.resolve('encrypted_password'));
    mockUserRepository.addUser = jest
      .fn()
      .mockImplementation(() => Promise.resolve(mockRegisteredUser));

    // Creating use case instance
    const getUserRepository = new AddUserUseCase({
      userRepository: mockUserRepository,
      passwordHash: mockPasswordHash,
    });
    // Action
    const registeredUser = await getUserRepository.execute(useCasePayload);

    // Assert
    expect(registeredUser).toStrictEqual(
      new RegisteredUser({
        id: 'user-123',
        username: useCasePayload.username,
        fullname: useCasePayload.fullname,
      })
    );
    expect(mockUserRepository.verifyAvailableUsername).toBeCalledWith(
      useCasePayload.username
    );
    expect(mockPasswordHash.hash).toBeCalledWith(useCasePayload.password);
    expect(mockUserRepository.addUser).toBeCalledWith(
      new RegisterUser({
        username: useCasePayload.username,
        password: 'encrypted_password',
        fullname: useCasePayload.fullname,
      })
    );
  });
});
