package com.msconstruction.service;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;

/**
 * Wraps the Cloudinary Java SDK so that the rest of the application only
 * sees a single {@code uploadImage} method returning the hosted URL.
 */
@Service
public class CloudinaryService {

    private final Cloudinary cloudinary;

    public CloudinaryService(
            @Value("${cloudinary.cloud-name}") String cloudName,
            @Value("${cloudinary.api-key}")    String apiKey,
            @Value("${cloudinary.api-secret}") String apiSecret) {

        this.cloudinary = new Cloudinary(ObjectUtils.asMap(
                "cloud_name", cloudName,
                "api_key",    apiKey,
                "api_secret", apiSecret,
                "secure",     true
        ));
    }

    /**
     * Uploads {@code file} to Cloudinary and returns the Cloudinary response map.
     *
     * @param file the multipart image file
     * @param folder the destination folder in Cloudinary
     * @return the Cloudinary response map
     * @throws IOException if the upload fails
     */
    public Map<String, Object> uploadFile(MultipartFile file, String folder) throws IOException {
        @SuppressWarnings("unchecked")
        Map<String, Object> result = cloudinary.uploader().upload(
                file.getBytes(),
                ObjectUtils.asMap(
                        "folder",         folder,
                        "resource_type",  "auto",
                        "use_filename",   true,
                        "unique_filename", true
                )
        );
        return result;
    }
    
    public void deleteFile(String publicId) throws IOException {
        cloudinary.uploader().destroy(publicId, ObjectUtils.emptyMap());
    }
}
