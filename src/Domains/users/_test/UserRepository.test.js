const UserRepository = require('../UserRepository');

describe('Userrepository interface', () => {
  it('should throw error when invoke abstract behavior', async () => {
    // Arrange
    const userRepository = new UserRepository();

    // Action and Assert
    await expect(userRepository.addUser({})).rejects.toThrowError(
      'USER_REPOSITORY.METHOD_NOT_IMPLEMENTED'
    );
    await expect(
      userRepository.verifyAvailableUsername('')
    ).rejects.toThrowError('USER_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  });
});
