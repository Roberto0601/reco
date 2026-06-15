package com.ucr.reco.service;


import com.ucr.reco.model.Space;
import com.ucr.reco.repository.SpaceJpaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SpaceService {

    @Autowired
    private SpaceJpaRepository repository;


    public List<Space> findAll() {
        return repository.findAll();
    }

    public Space getById(Integer id) {
        return repository.getById(id);
    }

    public Space add(Space space) {
        Space spaceExits = repository.getByName(space.getName());
        if (spaceExits != null) {
            return null;
        } else {
            if (space.getName() == null || space.getLocation() == null || space.getType() == null || space.getPrice() == null) {
                return null;
            }
        }
        return repository.save(space);
    }

    public Space update(Space space) {
        Space spaceExits = repository.getById(space.getId());
        if (spaceExits != null) {
            if (space.getName() != null) {
                spaceExits.setName(space.getName());
            }
            if (space.getLocation() != null) {
                spaceExits.setLocation(space.getLocation());
            }
            if (space.getType() != null) {
                spaceExits.setType(space.getType());
            }
            if (space.getPrice() != null) {
                spaceExits.setPrice(space.getPrice());
            }

        } else {
            return null;
        }
        return repository.save(spaceExits);
    }

    public Space delete(Integer id) {
        Space spaceExits = repository.getById(id);
        if (spaceExits != null) {
            repository.deleteById(id);
            return spaceExits;
        }
        return null;
    }


    public Space changePrice(Integer id, Double price) {
        Space spaceExits = repository.getById(id);
        if (spaceExits != null) {
            spaceExits.setPrice(price);
            return repository.save(spaceExits);
        }
        return null;
    }

}
