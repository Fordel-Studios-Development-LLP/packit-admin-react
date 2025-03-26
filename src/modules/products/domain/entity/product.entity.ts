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

  toModel(): ProductModel {
    return new ProductModel(
      this.id,
      this.name,
      this.price,
      this.description,
      this.images.map((img) => img.toModel())
    );
  }
}
