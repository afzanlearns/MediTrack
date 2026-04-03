package com.meditrack.controller;

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import com.meditrack.entity.User;
import com.meditrack.repository.UserRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;
import java.util.Date;
import java.util.Map;
import java.util.Objects;

@RestController
@RequestMapping("/api/auth")
@SuppressWarnings("null")
public class AuthController {

    @Value("${app.jwt.secret}")
    private String jwtSecret;

    private final UserRepository userRepository;
    private final RestTemplate restTemplate = new RestTemplate();

    public AuthController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @PostMapping("/google")
    public ResponseEntity<?> googleLogin(@RequestBody Map<String, String> body) {
        String credential = body.get("credential");
        
        // 1. Verify token with Google
        String url = "https://oauth2.googleapis.com/tokeninfo?id_token=" + credential;
        @SuppressWarnings("unchecked")
        Map<String, Object> payload = restTemplate.getForObject(url, Map.class);
        
        if (payload == null || payload.get("sub") == null) {
            return ResponseEntity.status(401).body("Invalid Google Token");
        }

        String googleId = (String) payload.get("sub");
        String email = (String) payload.get("email");
        String name = (String) payload.get("name");
        String picture = (String) payload.get("picture");

        // 2. Find or create user
        User user = userRepository.findByGoogleId(googleId)
                .orElseGet(() -> {
                    User newUser = User.builder()
                            .googleId(googleId)
                            .email(email)
                            .fullName(name)
                            .avatarUrl(picture)
                            .build();
                    User saved = userRepository.save(newUser);
                    return Objects.requireNonNull(saved);
                });

        // 3. Generate JWT
        String token = JWT.create()
                .withSubject(user.getId().toString())
                .withClaim("email", user.getEmail())
                .withClaim("name", user.getFullName())
                .withExpiresAt(new Date(System.currentTimeMillis() + 7 * 24 * 60 * 60 * 1000))
                .sign(Algorithm.HMAC256(jwtSecret));

        // 4. Return results
        return ResponseEntity.ok(Map.of(
            "token", token,
            "user", Map.of(
                "id", user.getId(),
                "email", user.getEmail(),
                "fullName", user.getFullName(),
                "avatarUrl", user.getAvatarUrl()
            )
        ));
    }

    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser(@RequestAttribute("userId") Long userId) {
        return userRepository.findById(Objects.requireNonNull(userId))
                .map(user -> ResponseEntity.ok(Map.of(
                    "id", user.getId(),
                    "email", user.getEmail(),
                    "fullName", user.getFullName(),
                    "avatarUrl", user.getAvatarUrl()
                )))
                .orElse(ResponseEntity.status(401).build());
    }
}
