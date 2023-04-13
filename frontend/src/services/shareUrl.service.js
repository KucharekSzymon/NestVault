import api from "./api";

class ShareUrlService {
  newUrl(formData) {
    return api.post("/share-urls/upload", formData);
  }
  getMyUrls() {
    "";
    return api.get("/share-urls/mine");
  }
  urlUses(fileId) {
    return api.get("/share-urls/uses/" + fileId);
  }
  use(fileId) {
    return api.get("/share-urls/" + fileId);
  }
}

export default new ShareUrlService();

ShareUrlService;
