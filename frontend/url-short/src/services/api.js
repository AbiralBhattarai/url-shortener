import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

// Create axios instance with base URL
const apiClient = axios.create({
    baseURL: `${API_BASE_URL}/api`,
    headers: {
    'Content-Type': 'application/json',
},
})
export const shortenUrl = async (longUrl) => {
    try {
    const response = await apiClient.post('/shorten/', {
        original_url: longUrl,
    })
    return response.data
    } catch (error) {
    const errorData = error.response?.data || { error: 'Failed to shorten URL' }
    
    //throw rate limit error with status code for URLForm to catch
    if (error.response?.status === 429) {
        throw {
        status: 429,
        ...errorData,
        }
    }
    
    throw errorData
    }
}
export const getAllUrls = async (page = 1, pageSize = 10) => {
    try {
    const response = await apiClient.get('/urls/', {
        params: {
        page,
        page_size: pageSize,
        },
    })
    return response.data
    } catch (error) {
    throw error.response?.data || { error: 'Failed to fetch URLs' }
    }
}

export const getAnalytics = async (alias) => {
    try {
    const response = await apiClient.get(`/clicks/${alias}/`)
    return response.data
    } catch (error) {
    throw error.response?.data || { error: 'Failed to fetch analytics' }
    }
}

export default apiClient
