package com.meditrack.repository;

import com.meditrack.entity.IceContact;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface IceContactRepository extends JpaRepository<IceContact, Long> {
    List<IceContact> findAllByOrderByPriorityOrderAsc();
}
