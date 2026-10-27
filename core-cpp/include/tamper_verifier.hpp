#pragma once

#include <string>
#include <vector>
#include <cstdint>
#include <chrono>

namespace dayspark {

struct VerificationResult {
    bool is_authentic{false};
    double confidence_score{0.0};
    std::string perceptual_hash;
    std::string integrity_digest;
    std::string timestamp_utc;
    std::string diagnostics;
};

class TamperVerifier {
public:
    TamperVerifier();
    ~TamperVerifier() = default;

    // Evaluates camera capture buffer against gallery-spoofing heuristics
    VerificationResult verify_camera_proof(
        const std::vector<uint8_t>& image_buffer,
        int64_t capture_timestamp_ms,
        double ambient_lux,
        double device_acceleration_norm
    );

    // Fast 64-bit perceptual hash (pHash) simulation for deduplication
    std::string compute_perceptual_hash(const std::vector<uint8_t>& image_buffer);

    // Cryptographic proof generator for zero-knowledge offline sync
    std::string generate_integrity_digest(
        const std::string& user_id,
        const std::string& action_type,
        int64_t timestamp_ms,
        const std::string& payload_hash
    );

private:
    uint64_t fnv1a_64(const uint8_t* data, size_t length) const;
    std::string to_hex(uint64_t val) const;
};

} // namespace dayspark
