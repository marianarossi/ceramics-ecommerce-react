import { api } from "@/lib/axios";

const PRODUCT_URL = "/products";

const findAll = async (): Promise<any> => {
  let response;
  try {
    response = await api.get(PRODUCT_URL);
  } catch (error: any) {
    response = error.response;
  }
  return response;
};

const findAllPageable = async (page: number): Promise<any> => {
    let response;
    try {
        response = await api.get(`${PRODUCT_URL}/page?page=${page}&size=3`);
    }catch(error: any)
    {
        response = error.response;
    }
    return response
}

const findById = async (id: number): Promise<any> => {
  let response;
  try {
    response = await api.get(`${PRODUCT_URL}/${id}`);
  } catch (error: any) {
    response = error.response;
  }
  return response;
};


const findProductInfoById = async (id: number): Promise<any> => {
  let response;
  try{
    response = await api.get(`${PRODUCT_URL}/info/${id}`)
  }catch(error: any){
    response = error.response;
  }
  return response;
}

const findProductsByCategory = async (categoryId: string): Promise<any> => {
    let response;
    try {
        response = await api.get(`${PRODUCT_URL}/category/${categoryId}`);
    } catch (error: any) {
        response = error.response;
    }
    return response;
}

const ProductService = {
  findAll,
  findAllPageable,
  findById,
  findProductInfoById,
    findProductsByCategory,
};

export default ProductService;
