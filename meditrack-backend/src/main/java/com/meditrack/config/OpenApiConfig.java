package com.meditrack.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.Contact;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * OpenAPI / Swagger UI configuration.
 * Access the auto-generated API docs at: http://localhost:8080/swagger-ui.html
 */
@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI mediTrackOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("MediTrack API")
                        .version("1.0.0")
                        .description("REST API for MediTrack — Personal Medicine & Health Tracker")
                        .contact(new Contact()
                                .name("MediTrack")
                                .email("support@meditrack.app")));
    }
}
