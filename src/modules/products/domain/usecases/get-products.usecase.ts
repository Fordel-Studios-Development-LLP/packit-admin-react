// admin/src/modules/products/domain/usecases/get-products.usecase.ts

import { ProductEntity } from "../entity/product.entity";
import { ProductRepository } from "../repositories/product.repository";

export class GetProductsUseCase {
  constructor(private productRepository: ProductRepository) {}

  execute(): Promise<ProductEntity[]> {
    return this.productRepository.getProducts();
  }
}
