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

const getAddressByCEP = async (cep: string): Promise<any> => {
    try {
        const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
        const data = await response.json();

        if (data.erro) {
            throw new Error("CEP não encontrado.");
        }

        return data;
    } catch (error) {
        console.error("Erro ao buscar o CEP:", error);
        return null;
    }
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
    getAddressByCEP,
    findById,
};

export default AddressService;
