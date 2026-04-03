package com.meditrack.service;

import com.meditrack.dto.UserProfileDTO;
import com.meditrack.dto.UserProfileRequestDTO;
import com.meditrack.entity.UserProfile;
import com.meditrack.repository.UserProfileRepository;
import org.springframework.stereotype.Service;

@Service
public class UserProfileService {

    private final UserProfileRepository userProfileRepository;

    public UserProfileService(UserProfileRepository userProfileRepository) {
        this.userProfileRepository = userProfileRepository;
    }

    public UserProfileDTO getProfile() {
        UserProfile profile = userProfileRepository.findFirstByOrderById()
                .orElse(new UserProfile());
        return convertToDTO(profile);
    }

    public UserProfileDTO updateProfile(UserProfileRequestDTO dto) {
        UserProfile profile = userProfileRepository.findFirstByOrderById()
                .orElse(new UserProfile());
        
        profile.setFullName(dto.getFullName());
        profile.setDateOfBirth(dto.getDateOfBirth());
        profile.setBloodType(dto.getBloodType());
        profile.setAllergies(dto.getAllergies());
        profile.setPrimaryPhysicianName(dto.getPrimaryPhysicianName());
        profile.setPrimaryPhysicianPhone(dto.getPrimaryPhysicianPhone());
        
        return convertToDTO(userProfileRepository.save(profile));
    }

    private UserProfileDTO convertToDTO(UserProfile profile) {
        UserProfileDTO dto = new UserProfileDTO();
        dto.setId(profile.getId());
        dto.setFullName(profile.getFullName());
        dto.setDateOfBirth(profile.getDateOfBirth());
        dto.setBloodType(profile.getBloodType());
        dto.setAllergies(profile.getAllergies());
        dto.setPrimaryPhysicianName(profile.getPrimaryPhysicianName());
        dto.setPrimaryPhysicianPhone(profile.getPrimaryPhysicianPhone());
        dto.setCreatedAt(profile.getCreatedAt());
        dto.setUpdatedAt(profile.getUpdatedAt());
        return dto;
    }
}
