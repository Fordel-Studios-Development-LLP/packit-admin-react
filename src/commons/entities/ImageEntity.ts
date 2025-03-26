export class ImageEntity {
    public secure_url: string;

    constructor(image: ImageEntity) {
        this.secure_url = image.secure_url;
    }
  }