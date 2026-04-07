package com.meditrack.controller;

import com.meditrack.dto.PushSubscriptionRequest;
import com.meditrack.entity.PushSubscription;
import com.meditrack.entity.User;
import com.meditrack.repository.PushSubscriptionRepository;
import com.meditrack.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/push")
public class PushSubscriptionController {

    @Autowired
    private PushSubscriptionRepository subscriptionRepository;

    @Autowired
    private UserRepository userRepository;

    @PostMapping("/subscribe")
    public ResponseEntity<?> subscribe(@RequestBody PushSubscriptionRequest request, Authentication authentication) {
        String email = authentication.getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Check if endpoint already exists
        Optional<PushSubscription> existing = subscriptionRepository.findByEndpoint(request.getEndpoint());
        if (existing.isPresent()) {
            return ResponseEntity.ok("Already subscribed");
        }

        PushSubscription subscription = new PushSubscription();
        subscription.setUser(user);
        subscription.setEndpoint(request.getEndpoint());
        subscription.setP256dh(request.getKeys().getP256dh());
        subscription.setAuth(request.getKeys().getAuth());
        
        subscriptionRepository.save(subscription);

        return ResponseEntity.ok("Subscribed successfully");
    }

    @DeleteMapping("/unsubscribe")
    public ResponseEntity<?> unsubscribe(@RequestParam String endpoint) {
        subscriptionRepository.deleteByEndpoint(endpoint);
        return ResponseEntity.ok("Unsubscribed");
    }
}
