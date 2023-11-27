export const ProdutorAPIRepository = jest.fn().mockImplementation(() => ({
  create: jest.fn(),
  findByCPF: jest.fn().mockImplementation(() => Promise.resolve(undefined)),
  update: jest.fn(),
  getSyncInfo: jest.fn(),
}));
