import { libraryRepository } from "../repositories/library.repository";
import { AppError } from "../utils/errors";

async function assertOwnership(id: number, userId: number) {
  const library = await libraryRepository.findById(id);
  if (!library || library.userId !== userId) {
    throw new AppError("LIBRARY_NOT_FOUND", 404, "المكتبة غير موجودة");
  }
  return library;
}

export const libraryService = {
  async create(userId: number, body: { name: string; address?: string }) {
    if (!body.name) {
      throw new AppError("MISSING_FIELDS", 400, "اسم المكتبة مطلوب");
    }

    try {
      return await libraryRepository.create({ name: body.name, address: body.address, userId });
    } catch (error: any) {
      if (error.code === "P2002") {
        throw new AppError("DUPLICATE_LIBRARY", 409, "لديك مكتبة بهذا الاسم مسبقًا");
      }
      throw error;
    }
  },

  async list(userId: number, page: number, limit: number) {
    const skip = (page - 1) * limit;
    const { libraries, total } = await libraryRepository.findManyByUser(userId, skip, limit);
    return {
      data: libraries,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
  },

  async getById(userId: number, id: number) {
    return assertOwnership(id, userId);
  },

  async update(userId: number, id: number, body: { name?: string; address?: string }) {
    await assertOwnership(id, userId);

    const data: { name?: string; address?: string } = {};
    if (body.name) data.name = body.name;
    if (body.address !== undefined) data.address = body.address;

    if (Object.keys(data).length === 0) {
      throw new AppError("NO_DATA", 400, "لا توجد بيانات لتحديثها");
    }

    try {
      return await libraryRepository.update(id, data);
    } catch (error: any) {
      if (error.code === "P2002") {
        throw new AppError("DUPLICATE_LIBRARY", 409, "لديك مكتبة بهذا الاسم مسبقًا");
      }
      throw error;
    }
  },

  async remove(userId: number, id: number) {
    await assertOwnership(id, userId);
    await libraryRepository.delete(id);
  },
};
