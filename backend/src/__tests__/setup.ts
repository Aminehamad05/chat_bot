global.console.log = jest.fn()
global.console.error = jest.fn()

// Clean up after each test
afterEach(() => {
  jest.clearAllMocks()
})