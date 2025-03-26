// admin/src/modules/products/presentation/views/product.view.tsx
import { Button } from "../../../../components/ui/button";
import { useProductViewModel } from "../viewmodels/product.viewmodel";

import { useProductFormViewModel } from "../viewmodels/product-form.viewmodel";
import { ProductListComponent } from "../components/ProductListComponent";
import { ProductFormComponent } from "../components/ProductFormComponent";

export default function ProductView() {
  const {
    isModalOpen,
    openModal,
    closeModal,
    handleLogout,
    productListViewModel,
  } = useProductViewModel();

  const { products, handleEdit, handleDelete, selectedProduct } =
    productListViewModel;

  const formViewModel = useProductFormViewModel(selectedProduct, closeModal);

  return (
    <div className="grid min-h-screen w-full ">
      <div className="flex flex-col">
        <header className="flex h-14 lg:h-[60px] items-center gap-4 border-b bg-gray-100/40 px-6 dark:bg-gray-800/40">
          <Button onClick={handleLogout}>Logout</Button>
        </header>
        <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">
          <div className="flex justify-end">
            <Button className="w-40" onClick={openModal}>
              Create New Product
            </Button>
          </div>

          <ProductListComponent
            products={products}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </main>
      </div>

      {isModalOpen && (
        <ProductFormComponent
          product={selectedProduct}
          viewModel={formViewModel}
        />
      )}
    </div>
  );
}
