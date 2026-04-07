package com.meditrack.service;

import com.meditrack.entity.PushSubscription;
import com.meditrack.repository.PushSubscriptionRepository;
import nl.martijndwars.webpush.Notification;
import nl.martijndwars.webpush.PushService;
import org.bouncycastle.jce.provider.BouncyCastleProvider;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import jakarta.annotation.PostConstruct;
import java.security.Security;
import java.util.List;

@Service
public class PushNotificationService {

    @Value("${vapid.public.key}")
    private String publicKey;

    @Value("${vapid.private.key}")
    private String privateKey;

    private PushService pushService;
    private final PushSubscriptionRepository subscriptionRepository;

    public PushNotificationService(PushSubscriptionRepository subscriptionRepository) {
        this.subscriptionRepository = subscriptionRepository;
    }

    @PostConstruct
    private void init() {
        try {
            if (Security.getProvider(BouncyCastleProvider.PROVIDER_NAME) == null) {
                Security.addProvider(new BouncyCastleProvider());
            }
            pushService = new PushService();
            pushService.setPublicKey(publicKey);
            pushService.setPrivateKey(privateKey);
            // Subject is commonly a mailto link or URL for the VAPID keys creator
            pushService.setSubject("mailto:admin@meditrack.com");
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    public void sendNotification(PushSubscription subscription, String payload) {
        try {
            Notification notification = new Notification(
                    subscription.getEndpoint(),
                    subscription.getP256dh(),
                    subscription.getAuth(),
                    payload
            );
            pushService.send(notification);
        } catch (Exception e) {
            e.printStackTrace();
            // If the endpoint is gone (410) or not found (404), we should delete it.
            if (e.getMessage() != null && (e.getMessage().contains("410") || e.getMessage().contains("404"))) {
                subscriptionRepository.deleteByEndpoint(subscription.getEndpoint());
            }
        }
    }

    public void sendNotificationToUser(Long userId, String payload) {
        List<PushSubscription> subscriptions = subscriptionRepository.findByUserId(userId);
        for (PushSubscription sub : subscriptions) {
            sendNotification(sub, payload);
        }
    }
}
