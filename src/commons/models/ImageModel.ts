export class ImageModel {
    public secure_url: string;

    constructor(image: ImageModel) {
        this.secure_url = image.secure_url;
    }
  }