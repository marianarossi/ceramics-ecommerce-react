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

const calculateShipment = async (data: any): Promise<any> => {
    try {
        const response = await fetch("/melhorenvio/me/shipment/calculate", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiIxIiwianRpIjoiMDQ2ZjI5MmM5MTBlMzBiNzRlNWYxZmRiMmZkODUxZjEyNjc5Mzk3MGIwZjQ1OGUxYzk0MTI1MGNmNmExYzMzNzE1MDJmYWQzYmFhYzhlYmYiLCJpYXQiOjE3Mzk2NzEyMTcuNjAxMTc5LCJuYmYiOjE3Mzk2NzEyMTcuNjAxMTgxLCJleHAiOjE3NzEyMDcyMTcuNTg4NzM5LCJzdWIiOiI5ZTMyNWVjZi0wM2U1LTRkZmItODkzNC1lMTFlN2ZjMDY1NTMiLCJzY29wZXMiOlsic2hpcHBpbmctY2FsY3VsYXRlIl19.xI_N2nG-9CGD9RaFAuZv2OCN51FAvHB8iv5Q7-NsdDm-te1pCXNnDfybM7IiLeQJ9To9d8QgW8iahcXnQ8ZFUjbtRstVcJm_p8R7lUhHtaDdEvR9yhSLmybCOaxWVb_4mrKwraGcQ8cceStdKVRtjSLXkd2m-4h4zYkXO4_Vxqu5Ajk1f3eYE4Muk85eRXbdpujzES8hsGD4NCW6R8Y52p4MV7nncwfj0CXPpurlYPdfb5qhASX7xhP9BKFmF8PyWMy3MvQOSrLQTf4ga6ELACERnNNqGFwa_zvbWrZDWeqVuCOiZRIcoilfvZALET1LzYeeGq5k3E4WKAv0c2tB7uLVgBZDepP7RNI3oF_2JRkuZ6YR9_ayPLdmp9_vtZeqQAGSVJ6JbpC2fgdeVUIq8cIHL4CBH9VtEoaBq0bN4g_vQ99DQnRv3kJ3zY51JfEP3rZ8ZNnQg3nmZXGOSlto3Wtai-Ze2omAUofvC0jIAwZ2iiYiB8zC5D6BHT1THX-t-Ra4XDLvLIluPl3HQ9LmJVo8wlwABhM_prCsuV_VaBaWrAJb6qpxl5V6mb0ppTvyX4abJrxzlE0wkB8ZXUH_P3YRZ7Ilv9SnehtjSRR2N0Xn_u5hL-nuD1ZgFyzQOuAj5e0Vf9nPlBr7_XyAHIRGPGEKckRFhB7dbd899muYfcE", // Replace with your token
                "Accept": "application/json",
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            throw new Error(`Error ${response.status}: ${response.statusText}`);
        }

        return await response.json();
    } catch (error) {
        console.error("Error calculating shipment:", error);
        return null;
    }
};


const AddressService = {
    findAll,
    remove,
    save,
    update,
    getAddressByCEP,
    findById,
    calculateShipment
};

export default AddressService;
