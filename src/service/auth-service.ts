import { IUserLogin, IUserSignUp } from "@/commons/interfaces";
import { api } from "@/lib/axios";

/**
 * Função para cadastrar um novo usuário
 * @param user - Dados do usuário que será cadastrado do tipo IUserSignUp
 * @returns - Retorna a resposta da API
 */
const signup = async (user: IUserSignUp): Promise<any> => {
  let response;
  try {
    response = await api.post("/users", user);
  } catch (err: any) {
    response = err.response;
  }
  return response;
};

const  AuthService  = {
	signup,
};

export  default  AuthService;