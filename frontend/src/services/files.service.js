import api from "./api";

class FilesService {
  getMyFiles() {
    return api.get("/files/mine");
  }
}

export default new FilesService();
