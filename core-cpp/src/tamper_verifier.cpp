#include "tamper_verifier.hpp"
#include <sstream>
#include <iomanip>
#include <cmath>
#include <ctime>

namespace dayspark {

TamperVerifier::TamperVerifier() = default;

uint64_t TamperVerifier::fnv1a_64(const uint8_t* data, size_t length) const {
    uint64_t hash = 14695981039346656037ULL;
    for (size_t i = 0; i < length; ++i) {
        hash ^= static_cast<uint64_t>(data[i]);
        hash *= 1099511628211ULL;
    }
    return hash;
}

std::string TamperVerifier::to_hex(uint64_t val) const {
    std::stringstream ss;
    ss << std::hex << std::setw(16) << std::setfill('0') << val;
    return ss.str();
}

std::string TamperVerifier::compute_perceptual_hash(const std::vector<uint8_t>& image_buffer) {
    if (image_buffer.empty()) {
        return "0000000000000000";
    }
    
    // Low-frequency DCT / sample approximation
    uint64_t hash_accum = fnv1a_64(image_buffer.data(), image_buffer.size());
    
    // Sample step stride across buffer
    size_t step = std::max(size_t{1}, image_buffer.size() / 64);
    uint64_t phash = 0;
    
    double mean = 0.0;
    size_t samples = 0;
    for (size_t i = 0; i < image_buffer.size() && samples < 64; i += step, ++samples) {
        mean += image_buffer[i];
    }
    mean /= (samples > 0 ? samples : 1);
    
    samples = 0;
    for (size_t i = 0; i < image_buffer.size() && samples < 64; i += step, ++samples) {
        if (image_buffer[i] >= mean) {
            phash |= (1ULL << samples);
        }
    }
    
    return to_hex(phash ^ hash_accum);
}

std::string TamperVerifier::generate_integrity_digest(
    const std::string& user_id,
    const std::string& action_type,
    int64_t timestamp_ms,
    const std::string& payload_hash
) {
    std::string canonical = user_id + "|" + action_type + "|" + std::to_string(timestamp_ms) + "|" + payload_hash;
    uint64_t d1 = fnv1a_64(reinterpret_cast<const uint8_t*>(canonical.data()), canonical.size());
    
    std::string salt = "DAYSPARK_PROOF_V1_VERIFIED";
    std::string salted = canonical + salt;
    uint64_t d2 = fnv1a_64(reinterpret_cast<const uint8_t*>(salted.data()), salted.size());
    
    return to_hex(d1) + to_hex(d2);
}

VerificationResult TamperVerifier::verify_camera_proof(
    const std::vector<uint8_t>& image_buffer,
    int64_t capture_timestamp_ms,
    double ambient_lux,
    double device_acceleration_norm
) {
    VerificationResult res;
    
    auto now = std::chrono::system_clock::now();
    int64_t current_ms = std::chrono::duration_cast<std::chrono::milliseconds>(now.time_since_epoch()).count();
    
    // Check capture freshness (within reasonable drift window of 30 seconds)
    int64_t time_delta = std::abs(current_ms - capture_timestamp_ms);
    bool freshness_ok = (time_delta < 30000);
    
    // Buffer minimum size check
    bool buffer_valid = (image_buffer.size() > 1024);
    
    // Ambient sensor physical coherence check
    bool sensors_coherent = (ambient_lux >= 0.0) && (device_acceleration_norm > 0.01);
    
    res.perceptual_hash = compute_perceptual_hash(image_buffer);
    res.integrity_digest = generate_integrity_digest("local-user", "CAMERA_CAPTURE", capture_timestamp_ms, res.perceptual_hash);
    
    double score = 0.0;
    if (freshness_ok) score += 0.40;
    if (buffer_valid) score += 0.35;
    if (sensors_coherent) score += 0.25;
    
    res.confidence_score = score;
    res.is_authentic = (score >= 0.75);
    
    std::stringstream diag;
    diag << "Buffer: " << image_buffer.size() << " bytes | Freshness: " 
         << (freshness_ok ? "OK" : "DRIFT_EXCEEDED") 
         << " (" << time_delta << "ms) | Sensor Coherence: "
         << (sensors_coherent ? "VERIFIED" : "UNSTABLE");
    res.diagnostics = diag.str();
    
    time_t raw_time = current_ms / 1000;
    char time_str[64];
    strftime(time_str, sizeof(time_str), "%Y-%m-%dT%H:%M:%SZ", gmtime(&raw_time));
    res.timestamp_utc = time_str;
    
    return res;
}

} // namespace dayspark
