import { api } from "@/lib/axios";
import { IUserSignUp} from "@/commons/interfaces.ts";

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

const save = async (user: IUserSignUp): Promise<any> => {
    let response;
    try {
        response = await api.post(USERS_URL, user);
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
    save,
    findById,
};

export default UserService;
