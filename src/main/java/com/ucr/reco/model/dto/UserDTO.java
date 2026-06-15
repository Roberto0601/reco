package com.ucr.reco.model.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

public class UserDTO {
    @NotBlank(message = "El nombre no puede venir en blanco")
    private String name;
    @Email(message = "El correo no es valido")
    @NotBlank(message = "El correo no puede estar en blanco")
    private String email;
    @Pattern(regexp = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@#$%^&*!?]).{8,}$",
            message = "Mínimo 8–12 caracteres, al menos una letra mayúscula (A-Z), " +
                    "al menos una letra minúscula (a-z), al menos un " +
                    "número (0-9), al menos un carácter especial (@ # $ % & * ! ?)," +
                    " no usar espacios, no usar información" +
                    "personal (nombre, fecha, teléfono) y evitar palabras comunes o " +
                    "secuencias (123456, password, qwerty).")
    private String password;
    @NotBlank(message = "Debe seleccionar un rol")
    private String role;

    public UserDTO() {
    }

    public UserDTO(String name, String email, String password, String role) {
        this.name = name;
        this.email = email;
        this.password = password;
        this.role = role;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }
}
