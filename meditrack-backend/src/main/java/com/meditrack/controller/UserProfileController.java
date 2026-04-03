package com.meditrack.controller;

import com.meditrack.dto.UserProfileDTO;
import com.meditrack.dto.UserProfileRequestDTO;
import com.meditrack.service.UserProfileService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/profile")
@CrossOrigin(origins = "*")
public class UserProfileController {

    private final UserProfileService userProfileService;

    public UserProfileController(UserProfileService userProfileService) {
        this.userProfileService = userProfileService;
    }

    @GetMapping
    public UserProfileDTO getProfile() {
        return userProfileService.getProfile();
    }

    @PutMapping
    public UserProfileDTO updateProfile(@Valid @RequestBody UserProfileRequestDTO dto) {
        return userProfileService.updateProfile(dto);
    }
}
