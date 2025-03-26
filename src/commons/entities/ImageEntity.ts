/**
 * Image.entity.ts
 * ----------------------------------------------------------------------------
 * Domain entity representing an image used in the product context.
 * ----------------------------------------------------------------------------
 */

export class ImageEntity {
  public secure_url: string;

  constructor(params: { secure_url: string }) {
    this.secure_url = params.secure_url;
  }

  /**
   * Create an ImageEntity from a raw object (e.g., from JSON)
   */
  static fromJson(json: { [key: string]: any }): ImageEntity {
    if (!json || !json.secure_url) {
      throw new Error("Invalid Image JSON");
    }
    return new ImageEntity({ secure_url: json.secure_url });
  }

  /**
   * Convert this entity to plain JSON
   */
  toJson(): any {
    return {
      secure_url: this.secure_url,
    };
  }

  /**
   * Convert this entity to the corresponding ImageModel
   */
  toModel(): any {
    return {
      secure_url: this.secure_url,
    };
  }
}
