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

const remove = async (address: IAddress): Promise<any> => {
    let response;
    try {
        response = await api.delete(`${ADDRESS_URL}/${address.id}`);
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

const getAddressByCEP = async (zip: string): Promise<any> => {
    try {
        const response = await fetch(`https://viacep.com.br/ws/${zip}/json/`);
        const data = await response.json();

        if (data.erro) {
            console.error("ZIP code not found.");
        }

        return data;
    } catch (error) {
        console.error("Failed to fetch ZIP code:", error);
        return null;
    }
};

const update = async (address: IAddress): Promise<any> => {
    let response;
    try {
        response = await api.put(`${ADDRESS_URL}/${address.id}`, address);
    } catch (error: any) {
        response = error.response;
    }
    return response;
}

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
    update,
    getAddressByCEP,
    findById,
};

export default AddressService;
