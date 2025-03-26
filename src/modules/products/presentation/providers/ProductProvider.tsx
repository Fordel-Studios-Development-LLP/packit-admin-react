// admin/src/modules/products/presentation/providers/product.provider.tsx
import React, { createContext, useContext, ReactNode } from "react";
import { ProductRepositoryImpl } from "../../data/repositories/product-repository-impl";
import { ProductRemoteDataSource } from "../../data/datasources/product-remote.datasource";
import { AxiosClient } from "../../../../commons/utils/AxiosClient";

import { CreateProductUseCase } from "../../domain/usecases/create-product.usecase";
import { UpdateProductUseCase } from "../../domain/usecases/update-product.usecase";
import { GetProductsUseCase } from "../../domain/usecases/get-products.usecase";
import { DeleteProductUseCase } from "../../domain/usecases/delete-product.usecase";
import { AuthService } from "../../../../commons/utils/services/AuthService";

// Create the context and define its type
interface ProductContextType {
  createProductUseCase: CreateProductUseCase;
  updateProductUseCase: UpdateProductUseCase;
  getProductsUseCase: GetProductsUseCase;
  deleteProductUseCase: DeleteProductUseCase;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

// Create the Provider component
export const ProductProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const authService = new AuthService(); // Instantiate the AuthService
  const axiosClient = new AxiosClient(authService); // Pass the authService to AxiosClient
  const remoteDataSource = new ProductRemoteDataSource(axiosClient);
  const productRepository = new ProductRepositoryImpl(remoteDataSource);

  // implementation of repository in the usecases
  const createProductUseCase = new CreateProductUseCase(productRepository);
  const updateProductUseCase = new UpdateProductUseCase(productRepository);
  const getProductsUseCase = new GetProductsUseCase(productRepository);
  const deleteProductUseCase = new DeleteProductUseCase(productRepository);

  return (
    <ProductContext.Provider
      value={{
        createProductUseCase,
        updateProductUseCase,
        getProductsUseCase,
        deleteProductUseCase,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};

// Custom hook to use the context in components
export const useProductContext = (): ProductContextType => {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error("useProductContext must be used within a ProductProvider");
  }
  return context;
};
