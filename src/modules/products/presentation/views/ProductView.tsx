// src/modules/products/presentation/views/ProductView.tsx
import { Button } from "@/components/ui/button";
import { useProductViewModel } from "../viewmodels/product.viewmodel";
import { useProductFormViewModel } from "../viewmodels/product-form.viewmodel";
import { ProductListComponent } from "./components/ProductListComponent";
import { ProductFormComponent } from "./components/ProductFormComponent";

export default function ProductView() {
  const { isModalOpen, openModal, closeModal, productListViewModel } =
    useProductViewModel();

  const { products, handleEdit, handleDelete, selectedProduct } =
    productListViewModel;

  const formViewModel = useProductFormViewModel(selectedProduct, closeModal);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight">
          Product Management
        </h2>
        <Button onClick={openModal}>Create New Product</Button>
      </div>

      <ProductListComponent
        products={products}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      {isModalOpen && (
        <ProductFormComponent
          product={selectedProduct}
          viewModel={formViewModel}
        />
      )}
    </div>
  );
}
