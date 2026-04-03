package com.meditrack.service;

import com.meditrack.dto.IceContactDTO;
import com.meditrack.dto.IceContactRequestDTO;
import com.meditrack.entity.IceContact;
import com.meditrack.exception.ResourceNotFoundException;
import com.meditrack.repository.IceContactRepository;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Service
@SuppressWarnings("null")
public class IceContactService {

    private final IceContactRepository iceContactRepository;

    public IceContactService(IceContactRepository iceContactRepository) {
        this.iceContactRepository = iceContactRepository;
    }

    public List<IceContactDTO> getAllContacts() {
        return iceContactRepository.findAllByOrderByPriorityOrderAsc().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public IceContactDTO createContact(IceContactRequestDTO dto) {
        IceContact contact = new IceContact();
        updateEntityFromDTO(contact, dto);
        return convertToDTO(iceContactRepository.save(contact));
    }

    public IceContactDTO updateContact(Long id, IceContactRequestDTO dto) {
        IceContact contact = iceContactRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("ICE Contact not found with id: " + id));
        updateEntityFromDTO(contact, dto);
        return convertToDTO(iceContactRepository.save(contact));
    }

    public void deleteContact(Long id) {
        if (!iceContactRepository.existsById(id)) {
            throw new ResourceNotFoundException("ICE Contact not found with id: " + id);
        }
        iceContactRepository.deleteById(id);
    }

    private void updateEntityFromDTO(IceContact contact, IceContactRequestDTO dto) {
        contact.setFullName(dto.getFullName());
        contact.setRelationship(dto.getRelationship());
        contact.setPhonePrimary(dto.getPhonePrimary());
        contact.setPhoneSecondary(dto.getPhoneSecondary());
        contact.setEmail(dto.getEmail());
        contact.setPriorityOrder(dto.getPriorityOrder());
    }

    private IceContactDTO convertToDTO(IceContact contact) {
        IceContactDTO dto = new IceContactDTO();
        dto.setId(contact.getId());
        dto.setFullName(contact.getFullName());
        dto.setRelationship(contact.getRelationship());
        dto.setPhonePrimary(contact.getPhonePrimary());
        dto.setPhoneSecondary(contact.getPhoneSecondary());
        dto.setEmail(contact.getEmail());
        dto.setPriorityOrder(contact.getPriorityOrder());
        dto.setCreatedAt(contact.getCreatedAt());
        return dto;
    }
}
