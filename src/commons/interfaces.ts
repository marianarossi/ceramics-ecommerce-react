
export interface IUserSignUp
{
    displayName: string;
    email: string;
    password: string;
    ssn: string;
    birthDate: Date;
    gender: string; 
    phone: string;
}

export interface IUserLogin
{
    email: string;
    password: string;
}

export interface ICategory
{
    id?: number;
    name: string;
}

export interface IProduct
{
    id?: number;
    title: string;
    text: string;
    img: string;
    price: number;
    installment: string;
    color: string;
    height: string;
    width: string;
    recommended_environment: string;
    recommended_for_plants: string;
    img1: string;
    img2: string;
    img3: string;
    category: ICategory;
}