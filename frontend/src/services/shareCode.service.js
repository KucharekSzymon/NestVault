import api from "./api";

class ShareCodesService {
  newUrl(formData) {
    return api.post("/share-codes/new", formData);
  }
  getMyUrls() {
    return api.get("/share-codes/mine");
  }
  urlUses(fileId) {
    return api.get("/share-codes/uses/" + fileId);
  }
  use(fileId) {
    return api.get("/share-codes/" + fileId);
  }
  remove(codeID) {
    return api.delete("share-codes/" + codeID);
  }
}

export default new ShareCodesService();
