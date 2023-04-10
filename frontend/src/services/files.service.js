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
  async previewFile(fileId) {
    return api.get("/files/preview/" + fileId, { responseType: "blob" });
  }
  convertSize(size) {
    const units = ["B", "KB", "MB", "GB", "TB"];
    let index = 0;
    while (size > 1024) {
      size /= 1024;
      index++;
    }
    return size != null ? `${size.toFixed(2)} ${units[index]}` : 0;
  }
}

export default new FilesService();
