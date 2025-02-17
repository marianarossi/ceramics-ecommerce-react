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


const CategoryService = {
  findAll,
};

export default CategoryService;
