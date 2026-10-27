# DaySpark Core C++ Engine (C++20)

High-performance native proof verification and anti-tampering engine for DaySpark.

## Overview
DaySpark requires mathematically verifiable camera proofs to guarantee that photos taken for fitness, habits, and mindful reflection originate from the physical camera sensor in real time, preventing device gallery spoofing and retro-active injection.

This C++20 engine provides:
- **Zero-Copy Perceptual Hashing (pHash):** Ultra-fast 64-bit image frequency hash generation for instant deduplication.
- **Physical Sensor Coherence Validation:** Correlates camera frame timestamps with device IMU (accelerometer) and ambient light sensor (lux) telemetry.
- **Cryptographic Proof Digesting:** FNV-1a 128-bit salted proof signature generation for zero-knowledge offline synchronization.

## Build Instructions

```bash
mkdir build && cd build
cmake ..
cmake --build .
./dayspark_verifier
```
