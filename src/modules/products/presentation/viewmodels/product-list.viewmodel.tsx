// admin/src/modules/products/presentation/viewmodels/product-list.viewmodel.tsx
import { useState, useEffect } from "react";
import { ProductEntity } from "../../domain/entity/product.entity"; // Import ProductEntity
import { useProductContext } from "../providers/ProductProvider"; // Access use cases

export interface ProductListViewModel {
  products: ProductEntity[]; // Change ProductDTO[] to ProductEntity[]
  isLoading: boolean;
  handleEdit: (product: ProductEntity) => void; // Use ProductEntity instead of ProductDTO
  handleDelete: (productId: string) => Promise<void>;
  selectedProduct: ProductEntity | undefined; // Use ProductEntity instead of ProductDTO
  setSelectedProduct: (product: ProductEntity | undefined) => void; // Use ProductEntity instead of ProductDTO
}

export const useProductListViewModel = (): ProductListViewModel => {
  const { getProductsUseCase, deleteProductUseCase } = useProductContext(); // Use cases for fetching and deleting products
  const [products, setProducts] = useState<ProductEntity[]>([]); // Use ProductEntity[]
  const [selectedProduct, setSelectedProduct] = useState<
    ProductEntity | undefined
  >(undefined); // Use ProductEntity
  const [isLoading, setIsLoading] = useState(false);

  const handleEdit = (product: ProductEntity) => {
    setSelectedProduct(product);
  };

  const handleDelete = async (productId: string) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      setIsLoading(true);
      try {
        await deleteProductUseCase.execute(productId);
        setProducts((prev) =>
          prev.filter((product) => product.id !== productId)
        );
      } catch (error) {
        console.error("Failed to delete product:", error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  // Fetch the products initially when the viewmodel is initialized
  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      const productList = await getProductsUseCase.execute(); // Assuming this returns ProductEntity[]
      setProducts(productList);
    } catch (error) {
      console.error("Failed to fetch products:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts(); // Call fetchProducts when the component mounts or the viewmodel is initialized
  }, []);

  return {
    products,
    isLoading,
    handleEdit,
    handleDelete,
    selectedProduct,
    setSelectedProduct,
  };
};
