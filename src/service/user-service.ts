import { api } from "@/lib/axios";
import {IUser} from "@/commons/interfaces.ts";

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

const update = async (user: IUser): Promise<any> => {
    const updatedUser: Partial<IUser> = { ...user };
    if (!updatedUser.password || updatedUser.password.trim() === "") {
        delete updatedUser.password;
    }
    let response;
    try {
        response = await api.put(`${USERS_URL}/${user.id}`, updatedUser);
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
