export interface IProduct { // interface para la creación del nuevo producto.
    id: number;
    title: string;
    description: string;
    price: number;
    category: string;
    image: string;
}

export interface CardProps{
    product: IProduct;
    }