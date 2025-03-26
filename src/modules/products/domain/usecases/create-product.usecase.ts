// admin/src/modules/products/domain/usecases/create-product.usecase.ts

import { ProductEntity } from "../entity/product.entity";
import { ProductRepository } from "../repositories/product.repository";

export class CreateProductUseCase {
  constructor(private productRepository: ProductRepository) {}

  execute(product: ProductEntity, images: File[]): Promise<ProductEntity> {
    return this.productRepository.createProduct(product, images);
  }
}
