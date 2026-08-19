import { prisma } from "../prisma/client";

export const libraryRepository = {
  create(data: { name: string; address?: string; userId: number }) {
    return prisma.library.create({ data });
  },

  async findManyByUser(userId: number, skip: number, take: number) {
    const [libraries, total] = await prisma.$transaction([
      prisma.library.findMany({
        where: { userId },
        include: { user: { select: { id: true, name: true, email: true } } },
        orderBy: { createdAt: "desc" },
        skip,
        take,
      }),
      prisma.library.count({ where: { userId } }),
    ]);
    return { libraries, total };
  },

  findById(id: number) {
    return prisma.library.findUnique({ where: { id } });
  },

  update(id: number, data: { name?: string; address?: string }) {
    return prisma.library.update({ where: { id }, data });
  },

  delete(id: number) {
    return prisma.library.delete({ where: { id } });
  },
};
