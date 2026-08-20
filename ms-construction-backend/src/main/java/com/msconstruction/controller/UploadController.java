package com.msconstruction.controller;

import com.msconstruction.model.MediaAsset;
import com.msconstruction.repository.MediaAssetRepository;
import com.msconstruction.service.CloudinaryService;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.util.Map;

/**
 * Authenticated endpoint for uploading media to Cloudinary.
 * The JWT filter (applied to all /api/admin/** routes in SecurityConfig)
 * ensures only a logged-in admin can reach this endpoint.
 */
@RestController
@RequestMapping("/api/admin/media")
public class UploadController {

    private final CloudinaryService cloudinaryService;
    private final MediaAssetRepository mediaAssetRepository;

    public UploadController(CloudinaryService cloudinaryService, MediaAssetRepository mediaAssetRepository) {
        this.cloudinaryService = cloudinaryService;
        this.mediaAssetRepository = mediaAssetRepository;
    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> uploadMedia(@RequestParam("file") MultipartFile file, @RequestParam(value = "folder", defaultValue = "ms-construction/general") String folder) {
        if (file.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("error", "No file provided"));
        }

        try {
            Map<String, Object> uploadResult = cloudinaryService.uploadFile(file, folder);
            
            MediaAsset asset = new MediaAsset();
            asset.setUrl((String) uploadResult.get("secure_url"));
            asset.setPublicId((String) uploadResult.get("public_id"));
            asset.setFolder(folder);
            asset.setFileName(file.getOriginalFilename());
            asset.setResourceType((String) uploadResult.get("resource_type"));
            asset.setCreatedAt(LocalDateTime.now());
            
            MediaAsset saved = mediaAssetRepository.save(asset);
            return ResponseEntity.ok(saved);
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                    .body(Map.of("error", "Upload failed: " + e.getMessage()));
        }
    }
    
    @GetMapping
    public ResponseEntity<?> getAllMedia() {
        return ResponseEntity.ok(mediaAssetRepository.findAllByOrderByCreatedAtDesc());
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteMedia(@PathVariable String id) {
        return mediaAssetRepository.findById(id).map(asset -> {
            try {
                if (asset.getPublicId() != null) {
                    cloudinaryService.deleteFile(asset.getPublicId());
                }
                mediaAssetRepository.delete(asset);
                return ResponseEntity.noContent().build();
            } catch (Exception e) {
                return ResponseEntity.internalServerError().body(Map.of("error", "Failed to delete from Cloudinary"));
            }
        }).orElse(ResponseEntity.notFound().build());
    }
}
