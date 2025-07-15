/* eslint-env node, jest */
// Sample unit test - replace with your actual service tests
// --log-level debug
describe('Sample Unit Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should demonstrate unit testing setup', () => {
    const mockUser = testUtils.createMockUser();

    expect(mockUser).toBeValidUser();
    expect(mockUser.username).toBe('Test User');
    expect(mockUser.email).toBe('test@example.com');
  });

  afterEach(() => {
    jest.clearAllTimers();
  });
});
