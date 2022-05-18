package com.wanderFerb.ecommerce.dto;

import com.wanderFerb.ecommerce.entity.Address;
import com.wanderFerb.ecommerce.entity.Customer;
import com.wanderFerb.ecommerce.entity.Order;
import com.wanderFerb.ecommerce.entity.OrderItem;
import lombok.Data;

import java.util.Set;

@Data
public class Purchase {

    private Customer customer;
    private Address shippingAddress;
    private Address billingAddress;
    private Order order;
    private Set<OrderItem> orderItems;

}
