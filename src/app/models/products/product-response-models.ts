export interface IProductDTO {
  id: string;
  name: string;
  price: number;
  description: string;
  imageUrl: string | null;
  categoryName: string;
  stockQuantity: number;
}

export interface IGetProductsResponse {
  items: IProductDTO[];
  totalCount: number;
}