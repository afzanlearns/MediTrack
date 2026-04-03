package com.meditrack.controller;

import com.meditrack.dto.IceContactDTO;
import com.meditrack.dto.IceContactRequestDTO;
import com.meditrack.service.IceContactService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/ice-contacts")
@CrossOrigin(origins = "*")
public class IceContactController {

    private final IceContactService iceContactService;

    public IceContactController(IceContactService iceContactService) {
        this.iceContactService = iceContactService;
    }

    @GetMapping
    public List<IceContactDTO> getAllContacts() {
        return iceContactService.getAllContacts();
    }

    @PostMapping
    public ResponseEntity<IceContactDTO> createContact(@Valid @RequestBody IceContactRequestDTO dto) {
        return new ResponseEntity<>(iceContactService.createContact(dto), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public IceContactDTO updateContact(@PathVariable Long id, @Valid @RequestBody IceContactRequestDTO dto) {
        return iceContactService.updateContact(id, dto);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteContact(@PathVariable Long id) {
        iceContactService.deleteContact(id);
        return ResponseEntity.noContent().build();
    }
}
