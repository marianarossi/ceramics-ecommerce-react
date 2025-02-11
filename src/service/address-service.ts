import { IAddress } from "@/commons/interfaces";
import { api } from "@/lib/axios";

const ADDRESS_URL = "/addresses";

const findAll = async (): Promise<any> => {
    let response;
    try {
        response = await api.get(ADDRESS_URL);
    } catch (error: any) {
        response = error.response;
    }
    return response;
};

const remove = async (id: number): Promise<any> => {
    let response;
    try {
        response = await api.delete(`${ADDRESS_URL}/${id}`);
    } catch (error: any) {
        response = error.response;
    }
    return response;
};

const save = async (address: IAddress): Promise<any> => {
    let response;
    try {
        response = await api.post(ADDRESS_URL, address);
    } catch (error: any) {
        response = error.response;
    }
    return response;
};

const findById = async (id: number): Promise<any> => {
    let response;
    try {
        response = await api.get(`${ADDRESS_URL}/${id}`);
    } catch (error: any) {
        response = error.response;
    }
    return response;
};

const AddressService = {
    findAll,
    remove,
    save,
    findById,
};

export default AddressService;
