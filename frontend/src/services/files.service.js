import api from "./api";

class FilesService {
  getMyFiles() {
    return api.get("/files/mine");
  }
  getSharedWithMe() {
    return api.get("files/sharedwithme");
  }
  getSharedByMe() {
    return api.get("files/shared");
  }
  uploadFile(formData) {
    return api.post("/files/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  }
  getAuthorized(fileId) {
    return api.get("/files/sharedTo/" + fileId);
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
  revokeAll(fileId) {
    return api.get("/files/revokeAll/" + fileId);
  }
  getStats() {
    return api.get("/files/stats/");
  }
  getMyStats() {
    return api.get("/files/stats/mine");
  }
  getAdminStats() {
    return api.get("/files/adminStats");
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
