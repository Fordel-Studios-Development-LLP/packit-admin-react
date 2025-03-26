// admin/src/modules/products/domain/entity/product.entity.ts
import { ImageEntity } from "../../../../commons/entities/ImageEntity";
import { ProductModel } from "../../data/models/product.model";

export interface ProductEntityProps {
  id: string;
  name: string;
  price: string;
  description: string;
  images: ImageEntity[];
}

export class ProductEntity {
  public id: string;
  public name: string;
  public price: string;
  public description: string;
  public images: ImageEntity[];

  constructor(props: ProductEntityProps) {
    this.id = props.id;
    this.name = props.name;
    this.price = props.price;
    this.description = props.description;
    this.images = props.images;
  }

  // Add this to transform the ProductEntity to ProductModel (if that's the intended behavior)
  toModel(): ProductModel {
    return new ProductModel({
      id: this.id,
      name: this.name,
      price: this.price,
      description: this.description,
      productImages: this.images.map((img) => ({
        secure_url: img.secure_url,
      })),
    });
  }
}
