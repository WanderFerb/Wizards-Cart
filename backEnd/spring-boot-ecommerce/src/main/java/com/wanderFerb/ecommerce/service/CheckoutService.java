package com.wanderFerb.ecommerce.service;

import com.wanderFerb.ecommerce.dto.Purchase;
import com.wanderFerb.ecommerce.dto.PurchaseResponse;

public interface CheckoutService {

    PurchaseResponse placeOrder(Purchase purchase);

}
