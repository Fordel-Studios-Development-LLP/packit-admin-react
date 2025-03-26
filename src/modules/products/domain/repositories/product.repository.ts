// admin/src/modules/products/domain/repositories/product.repository.ts

import { ProductEntity } from "../entity/product.entity";

export interface ProductRepository {
  getProducts(): Promise<ProductEntity[]>;
  createProduct(
    product: Omit<ProductEntity, "id">,
    images: File[]
  ): Promise<ProductEntity>;
  updateProduct(
    id: string,
    product: Partial<ProductEntity>,
    images?: File[]
  ): Promise<ProductEntity>;
  deleteProduct(id: string): Promise<boolean>;
}
