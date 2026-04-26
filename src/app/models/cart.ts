import { IProductDTO } from './../models/products/product-response-models';

export interface ICartItemDTO extends IProductDTO {
    quantity: number;
    itemTotal: number;
}

export interface ICartDTO {
    id: string;
    items: ICartItemDTO[];
    totalQuantity: number;
    subTotal: number;
    tax?: number;
    shippingFee?: number;
    totalAmount: number;
}

export interface ICartItemRequest {
    productId: string; 
    quantity: number;
}