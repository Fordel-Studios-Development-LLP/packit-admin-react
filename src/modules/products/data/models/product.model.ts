import { ProductEntity } from "../../domain/entity/product.entity";
import { ImageModel } from "../../../../commons/models/ImageModel";

export class ProductModel {
  constructor(
    public id: string,
    public name: string,
    public price: string,
    public description: string,
    public productImages: ImageModel[]
  ) {}

  static fromJson(json: { [key: string]: any }): ProductModel {
    if (!json) throw new Error("Invalid Product JSON");
    return new ProductModel(
      json.id ?? "",
      json.name ?? "",
      json.price ?? "",
      json.description ?? "",
      (json.productImages || []).map((img: any) => ImageModel.fromJson(img))
    );
  }

  toJson(): any {
    return {
      id: this.id,
      name: this.name,
      price: this.price,
      description: this.description,
      productImages: this.productImages.map((img) => img.toJson()),
    };
  }

  toEntity(): ProductEntity {
    return new ProductEntity({
      id: this.id,
      name: this.name,
      price: this.price,
      description: this.description,
      images: this.productImages.map((img) => img.toEntity()),
    });
  }
}
