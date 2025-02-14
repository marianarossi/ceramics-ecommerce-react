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
  findById,
  findProductInfoById,
    findProductsByCategory,
};

export default ProductService;
