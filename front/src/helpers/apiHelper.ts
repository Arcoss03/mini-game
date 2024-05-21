import ky from 'ky'

interface ApiResponse {
    success: boolean
    data: Record<string, unknown>
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
        const response:Record<string, unknown> = await api.post(url, { 
            json: data,
            headers: {
                Authorization: `Bearer ${token}`
            }
        }).json();
        return { success: true, data: response} as ApiResponse;
    } catch (error) {
        console.error(error);
        return { success: false, data: {} } as ApiResponse;
    }
};

const kyPut = async (url: string, data: any, token:string): Promise<ApiResponse> => {
    try {
        const response:Record<string, unknown> = await api.put(url, { 
            json: data,
            headers: {
                Authorization: `Bearer ${token}`
            }
        }).json();
        return { success: true, data: response} as ApiResponse;
    } catch (error) {
        console.error(error);
        return { success: false, data: {} } as ApiResponse;
    }
}

const kyDelete = async (url: string, token:string): Promise<ApiResponse> => {
    try {
        const response:Record<string, unknown> = await api.delete(url, { 
            headers: {
                Authorization: `Bearer ${token}`
            }
        }).json();
        return { success: true, data: response} as ApiResponse;
    } catch (error) {
        console.error(error);
        return { success: false, data: {} } as ApiResponse;
    }
}

const kyGet = async (url: string): Promise<ApiResponse> => {
    try {
        const response:Record<string, unknown> = await api.get(url).json();
        return { success: true, data: response} as ApiResponse;
    } catch (error) {
        console.error(error);
        return { success: false, data: {} } as ApiResponse;
    }
}

const kyPostWithoutToken = async (url: string, data: any): Promise<ApiResponse> => {
    try {
        const response:Record<string, unknown> = await api.post(url, { json: data }).json();
        return { success: true, data: response } as ApiResponse;
    } catch (error) {
        console.error(error);
        return { success: false, data: {} } as ApiResponse;
    }
}

export default { kyPost, kyPut, kyDelete, kyGet, kyPostWithoutToken }
