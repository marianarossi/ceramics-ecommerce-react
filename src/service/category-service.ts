import { api } from "@/lib/axios";

const CATEGORY_URL = "/categories";

const findAll = async (): Promise<any> => {
  let response;
  try {
    response = await api.get(CATEGORY_URL);
  } catch (error: any) {
    response = error.response;
  }
  return response;
};

const findById = async (id: number): Promise<any> => {
  let response;
  try {
    response = await api.get(`${CATEGORY_URL}/${id}`);
  } catch (error: any) {
    response = error.response;
  }
  return response;
}

const CategoryService = {
  findAll,
  findById,
};

export default CategoryService;
