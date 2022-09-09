

import axios from 'axios';

const BASE_PATH = process.env.API_BASE_PATH || "http://localhost"
class API {
  async uploadFile(selectedFile: { file: File; expiration: number }) {
    const bodyFormData = new FormData();
    bodyFormData.append("file", selectedFile.file);
    const requestConfig = {
      headers: {
        "Content-Type": "multipart/form-data",
        "Expiration-Time": selectedFile.expiration,
      },
    };
    const response = await axios.put(BASE_PATH + "/v1/file", bodyFormData, requestConfig);
    return response.data;
  }
}

const api = new API();

export default api;