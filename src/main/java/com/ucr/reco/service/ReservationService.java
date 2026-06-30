package com.ucr.reco.service;

import com.ucr.reco.model.Reservation;
import com.ucr.reco.model.Space;
import com.ucr.reco.model.Status;
import com.ucr.reco.model.User;
import com.ucr.reco.model.dto.ReservationDTO;
import com.ucr.reco.repository.ReservationJpaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ReservationService {
    @Autowired
    ReservationJpaRepository reservationRepository;
    @Autowired
    SpaceService spaceService;
    @Autowired
    UserService userService;

    public List<Reservation> findAll() {
        return reservationRepository.findAll();
    }

    public Reservation add(ReservationDTO reservation) {
        Space space = spaceService.getById(reservation.getSpaceId());
        if (space == null) {
            throw new IllegalArgumentException("El espacio con ID " + reservation.getSpaceId() + " no existe");
        }
        User user = userService.getUserByEmail(reservation.getUserEmail());
        if (user == null) {
            throw new IllegalArgumentException("El usuario con email " + reservation.getUserEmail() + " no existe");
        }
        Reservation reservationTemp = new Reservation();

        reservationTemp.setSpace(space);
        reservationTemp.setUser(user);
        reservationTemp.setStartDate(reservation.getStartDate());
        reservationTemp.setEndDate(reservation.getEndDate());
        reservationTemp.setStatus(Status.PENDING);
        return reservationRepository.save(reservationTemp);
    }
}
