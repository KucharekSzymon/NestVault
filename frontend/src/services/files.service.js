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
    var fileSizeInMb = size / (1024 * 1024);
    var fileSizeInGb = size / (1024 * 1024 * 1024);

    return fileSizeInGb >= 1
      ? fileSizeInGb.toFixed(2) + "Gb"
      : fileSizeInMb.toFixed(2) + "Mb";
  }
}

export default new FilesService();
