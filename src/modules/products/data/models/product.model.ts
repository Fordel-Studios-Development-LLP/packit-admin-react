// admin / src / modules / products / data / models / product.model.ts;
import { ImageModel } from "../../../../commons/models/ImageModel";
import { ProductEntity } from "../../domain/entity/product.entity";

export class ProductModel {
  public id: string;
  public name: string;
  public price: string;
  public description: string;
  public productImages: ImageModel[];

  constructor(product: {
    id: string;
    name: string;
    price: string;
    description: string;
    productImages: ImageModel[];
  }) {
    this.id = product.id;
    this.name = product.name;
    this.price = product.price;
    this.description = product.description;
    this.productImages = product.productImages;
  }

  toEntity(): ProductEntity {
    return new ProductEntity({
      id: this.id,
      name: this.name,
      price: this.price,
      description: this.description,
      images: this.productImages,
    });
  }
}
