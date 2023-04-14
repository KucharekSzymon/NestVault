import api from "./api";

class FilesService {
  getMyFiles() {
    return api.get("/files/mine");
  }
  uploadFile(formData) {
    return api.post("/files/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  }
  previewFile(fileId) {
    return api.get("/files/preview/" + fileId, { responseType: "blob" });
  }
  downloadFile(fileId) {
    return api.get("/files/download/" + fileId, { responseType: "blob" });
  }
  removeFile(fileId) {
    return api.delete("/files/" + fileId);
  }
  share(data) {
    return api.post("/files/share", data);
  }
  revoke(data) {
    return api.post("/files/revoke", data);
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
