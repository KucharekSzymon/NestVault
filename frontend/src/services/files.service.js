import api from "./api";

class FilesService {
  getMyFiles() {
    return api.get("/files/mine");
  }
  async uploadFile(formData) {
    return await api.post("/files/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  }
}

export default new FilesService();
