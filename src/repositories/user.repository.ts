import { prisma } from "../prisma/client";

export const userRepository = {
  findByEmail(email: string) {
    return prisma.user.findUnique({ where: { email } });
  },

  findById(id: number) {
    return prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
        updatedAt: true,
        libraries: true,
      },
    });
  },

  create(data: { name: string; email: string; password: string }) {
    return prisma.user.create({ data });
  },

  async findMany(skip: number, take: number) {
    const [users, total] = await prisma.$transaction([
      prisma.user.findMany({
        select: {
          id: true,
          name: true,
          email: true,
          createdAt: true,
          updatedAt: true,
          libraries: true,
        },
        orderBy: { createdAt: "desc" },
        skip,
        take,
      }),
      prisma.user.count(),
    ]);
    return { users, total };
  },

  update(id: number, data: { name?: string; email?: string; password?: string }) {
    return prisma.user.update({
      where: { id },
      data,
      select: { id: true, name: true, email: true, updatedAt: true },
    });
  },

  delete(id: number) {
    return prisma.user.delete({ where: { id } });
  },
};
