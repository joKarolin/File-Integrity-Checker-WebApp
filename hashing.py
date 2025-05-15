import hashlib

HASH_ALGORITHMS = {
    "sha256": hashlib.sha256,
    "sha512": hashlib.sha512,
    "blake2b": hashlib.blake2b,
    "sha3_256": hashlib.sha3_256
}

def hybrid_hash(file_bytes: bytes, algo1: str, algo2: str) -> str:
    if algo1 not in HASH_ALGORITHMS or algo2 not in HASH_ALGORITHMS:
        raise ValueError("Unsupported algorithm")
    
    hash1 = HASH_ALGORITHMS[algo1](file_bytes).digest()
    hash2 = HASH_ALGORITHMS[algo2](file_bytes).digest()
    
    combined = hash1 + hash2
    final_hash = hashlib.sha256(combined).hexdigest()
    
    return final_hash
