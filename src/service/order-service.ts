import { IOrder } from "@/commons/interfaces";
import { api } from "@/lib/axios";

const ORDER_URL = "/order";

const findAll = async (): Promise<any> => {
    let response;
    try {
        response = await api.get(ORDER_URL);
    } catch (error: any) {
        response = error.response;
    }
    return response;
};

const remove = async (id: number): Promise<any> => {
    let response;
    try {
        response = await api.delete(`${ORDER_URL}/${id}`);
    } catch (error: any) {
        response = error.response;
    }
    return response;
};

const save = async (order: IOrder): Promise<any> => {
    let response;
    try {
        response = await api.post(ORDER_URL, order);
    } catch (error: any) {
        response = error.response;
    }
    return response;
};

const findById = async (id: number): Promise<any> => {
    let response;
    try {
        response = await api.get(`${ORDER_URL}/${id}`);
    } catch (error: any) {
        response = error.response;
    }
    return response;
};



const OrderService = {
    findAll,
    remove,
    save,
    findById,
};

export default OrderService;
