/**
 * Mock Prisma Client for Development
 *
 * This is a temporary workaround until Prisma can be properly installed
 */

// Mock Prisma Client that returns empty data
export const prisma = {
  customer: {
    findUnique: async () => null,
    findMany: async () => [],
    create: async (data: any) => data,
    update: async (data: any) => data,
  },
  transaction: {
    findUnique: async () => null,
    findMany: async () => [],
    create: async (data: any) => data,
    update: async (data: any) => data,
  },
  dispute: {
    findUnique: async () => null,
    findMany: async () => [],
    create: async (data: any) => data,
    update: async (data: any) => data,
  },
  analyst: {
    findUnique: async () => null,
    findMany: async () => [],
    create: async (data: any) => data,
    update: async (data: any) => data,
  },
  authorizedUser: {
    findMany: async () => [],
  },
  deviceFingerprint: {
    findMany: async () => [],
  },
  gpsHistory: {
    findMany: async () => [],
  },
  fraudFlag: {
    findMany: async () => [],
  },
};

export default prisma;
