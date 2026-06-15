package com.ucr.reco.controller;

import com.ucr.reco.model.Space;
import com.ucr.reco.service.SpaceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/spaces")
public class SpaceController {

    @Autowired
    private SpaceService service;

    @GetMapping("/all")
    public ResponseEntity<List<?>> getAll() {
        List<Space> spaces = service.findAll();
        if (spaces.isEmpty()) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.ok(spaces);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getById(@PathVariable Integer id) {
        Space space = service.getById(id);
        if (space == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(space);
    }

    @PostMapping("/add")
    public ResponseEntity<?> add(@RequestBody Space space) {
        if (service.add(space) == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("El espacio ya está registrado o faltan campos obligatorios");
        }
        return ResponseEntity.ok("Espacio registrado exitosamente");
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> update(@PathVariable Integer id, @RequestBody Space space) {
        if (service.update(space) == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok("Espacio actualizado exitosamente");
    }

    @DeleteMapping({"/{id}"})
    public ResponseEntity<?> delete(@PathVariable Integer id) {

        if (service.delete(id) == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok("Espacio eliminado exitosamente");
    }

    @PatchMapping("/change/{id}")
    public ResponseEntity<?> changePrice(@PathVariable Integer id, @RequestBody Space space) {
        if (service.changePrice(id, space.getPrice()) == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok("Precio actualizado exitosamente");
    }

}
