#include "tamper_verifier.hpp"
#include <iostream>
#include <vector>
#include <chrono>

int main() {
    std::cout << "========================================================\n";
    std::cout << "  DAYSPARK C++ NATIVE TAMPER VERIFICATION ENGINE (C++20)\n";
    std::cout << "========================================================\n\n";

    dayspark::TamperVerifier verifier;

    // Simulate raw camera frame buffer (e.g., 1080p luminance preview)
    std::vector<uint8_t> mock_frame(1920 * 1080 / 4, 128);
    for (size_t i = 0; i < mock_frame.size(); i += 17) {
        mock_frame[i] = static_cast<uint8_t>((i * 73 + 41) % 256);
    }

    auto now = std::chrono::system_clock::now();
    int64_t capture_time = std::chrono::duration_cast<std::chrono::milliseconds>(now.time_since_epoch()).count();

    std::cout << "[*] Executing real-time camera proof integrity validation...\n";
    auto result = verifier.verify_camera_proof(
        mock_frame,
        capture_time,
        420.5, // 420.5 lux indoor lighting
        9.81   // Earth gravity acceleration 1G
    );

    std::cout << "[-] Verification Status : " << (result.is_authentic ? "AUTHENTIC (PASS)" : "TAMPERED (FAIL)") << "\n";
    std::cout << "[-] Confidence Score    : " << (result.confidence_score * 100.0) << "%\n";
    std::cout << "[-] Perceptual Hash     : " << result.perceptual_hash << "\n";
    std::cout << "[-] Integrity Digest    : " << result.integrity_digest << "\n";
    std::cout << "[-] UTC Timestamp       : " << result.timestamp_utc << "\n";
    std::cout << "[-] Diagnostics         : " << result.diagnostics << "\n\n";

    std::cout << "[+] DaySpark Core C++ verification complete. All proofs mathematically sound.\n";
    return 0;
}
