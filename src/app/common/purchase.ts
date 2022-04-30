import { Address } from "./address";
import { Costumer } from "./costumer";
import { Order } from "./order";
import { OrderItem } from "./order-item";

export class Purchase {
    costumer: Costumer;
    shippingAddress : Address;
    billingAddress : Address;
    order : Order;
    orderItems : OrderItem[];
}
