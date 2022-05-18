package com.wanderFerb.ecommerce.dao;

import com.wanderFerb.ecommerce.entity.Customer;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CustomerRepository extends JpaRepository<Customer, Long> {


}
