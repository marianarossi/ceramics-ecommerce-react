import { api } from "@/lib/axios";
import { IUserUpdate} from "@/commons/interfaces.ts";

const USERS_URL = "/users";

const findAll = async (): Promise<any> => {
    let response;
    try {
        response = await api.get(USERS_URL);
    } catch (error: any) {
        response = error.response;
    }
    return response;
};

const remove = async (id: number): Promise<any> => {
    let response;
    try {
        response = await api.delete(`${USERS_URL}/${id}`);
    } catch (error: any) {
        response = error.response;
    }
    return response;
};

const update = async (user: IUserUpdate): Promise<any> => {
    let response;
    try {
        response = await api.put(`${USERS_URL}/${user.id}`, user);
    } catch (error: any) {
        response = error.response;
    }
    return response;
};

const findById = async (id: number): Promise<any> => {
    let response;
    try {
        response = await api.get(`${USERS_URL}/${id}`);
    } catch (error: any) {
        response = error.response;
    }
    return response;
};



const UserService = {
    findAll,
    remove,
    update,
    findById,
};

export default UserService;
