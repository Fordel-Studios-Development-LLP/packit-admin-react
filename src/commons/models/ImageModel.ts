export class ImageModel {
  constructor(public secure_url: string) {}

  static fromJson(json: { [key: string]: any }): ImageModel {
    if (!json || !json.secure_url) {
      throw new Error("Invalid Image JSON");
    }
    return new ImageModel(json.secure_url);
  }

  toJson(): any {
    return {
      secure_url: this.secure_url,
    };
  }

  toEntity(): any {
    return {
      secure_url: this.secure_url,
    };
  }
}
