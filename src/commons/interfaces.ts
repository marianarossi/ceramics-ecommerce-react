
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

export interface IUser
{
    id?: number;
    displayName: string;
    email: string;
    password: string;
    ssn: string;
    birthDate: string;
    gender: string;
    phone: string;
}

export interface IUserLogin
{
    email: string;
    password: string;
}

export interface IOrderItem {
    id: number | null;
    productName: string;
    price: number;
    quantity: number;
}

export interface IOrder {
    id: number;
    date: string;
    shipping: number;
    status: string;
    payment: string;
    items: IOrderItem[];
}


export interface IAddress
{
    id?: number;
    street: string,
    number: number,
    complement: string,
    neighborhood: string,
    city: string,
    state: string,
    country: string,
    zip: string
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

export interface ICartItem {
    id: number;
    title: string;
    price: number;
    quantity: number;
    img: string;
}
