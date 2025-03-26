// admin/src/modules/products/domain/usecases/update-product.usecase.ts
import { ProductEntity } from "../entity/product.entity";
import { ProductRepository } from "../repositories/product.repository";

export class UpdateProductUseCase {
  constructor(private productRepository: ProductRepository) {}

  execute(
    id: string,
    product: Partial<ProductEntity>,
    images?: File[]
  ): Promise<ProductEntity> {
    return this.productRepository.updateProduct(id, product, images);
  }
}
