package com.ucr.reco.repository;

import com.ucr.reco.model.Reservation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ReservationJpaRepository extends JpaRepository<Reservation, Integer> {
//    List<Reservation> findByEmail(String email);
//
//    List<Reservation> findByReservationDateBetween(LocalDateTime startDate, LocalDateTime endDate);

}
