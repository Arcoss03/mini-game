import ky from 'ky'

interface ApiResponse {
    success: boolean
    data: Record<string, any>
}

const api = ky.create({
  prefixUrl: import.meta.env.VITE_API_URL as string,
  headers: {
    'Content-Type': 'application/json',
    'X-API-KEY': import.meta.env.VITE_API_KEY as string
  }
})

const kyPost = async (url: string, data: any, token:string): Promise<ApiResponse> => {
    try {
        const response = await api.post(url, { 
            json: data,
            headers: {
                Authorization: `Bearer ${token}`
            }
        }).json();
        return response as ApiResponse;
    } catch (error) {
        console.error(error);
        return { success: false, data: {} };
    }
};

const kyPut = async (url: string, data: any, token:string): Promise<ApiResponse> => {
    try {
        const response = await api.put(url, { 
            json: data,
            headers: {
                Authorization: `Bearer ${token}`
            }
        }).json();
        return response as ApiResponse;
    } catch (error) {
        console.error(error);
        return { success: false, data: {} };
    }
}

const kyDelete = async (url: string, token:string): Promise<ApiResponse> => {
    try {
        const response = await api.delete(url, { 
            headers: {
                Authorization: `Bearer ${token}`
            }
        }).json();
        return response as ApiResponse;
    } catch (error) {
        console.error(error);
        return { success: false, data: {} };
    }
}

const kyGet = async (url: string): Promise<ApiResponse> => {
    try {
        const response = await api.get(url).json();
        return response as ApiResponse;
    } catch (error) {
        console.error(error);
        return { success: false, data: {} };
    }
}

const kyPostWithoutToken = async (url: string, data: any): Promise<ApiResponse> => {
    try {
        const response = await api.post(url, { json: data }).json();
        return response as ApiResponse;
    } catch (error) {
        console.error(error);
        return { success: false, data: {} };
    }
}

export default { kyPost, kyPut, kyDelete, kyGet, kyPostWithoutToken }
