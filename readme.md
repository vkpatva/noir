# Getting Started with Noir

## What is Noir?

Noir is a domain-specific language (DSL) for zero-knowledge (ZK) programming, designed to simplify the creation of ZK circuits. Released in October 2022, Noir provides a high-level programming experience similar to Rust, with platform-agnostic compilation that enables developers to build ZK proofs on various proving systems.

---

## Key Concepts

### Zero-Knowledge Proofs (ZKP)

A zero-knowledge proof is a cryptographic protocol where a prover demonstrates knowledge of a fact without revealing any information about the fact itself.

**Properties of ZKP:**

- **Privacy:** The verifier learns nothing about the actual data.
- **Succinctness:** Verifying the proof is computationally cheaper than directly verifying the data.

### zkSNARK

**Zero-Knowledge Succinct Non-Interactive Arguments of Knowledge (zkSNARK)** are a specific type of ZKP with:

- **Privacy:** No information about the data is revealed.
- **Succinctness:** Proofs are small and quick to verify.
- **Efficiency:** Proving and verifying is computationally efficient.

---

## Noir Overview

### Core Features

- **Rust-Like Syntax:** Noir adopts Rust’s syntax for familiarity but includes specific constructs for cryptographic applications.
- **Platform Agnostic:** Noir compiles programs to an intermediate representation (ACIR), which can then be used with different backends to create machine-specific proofs.

### Data Types in Noir

1. **Field Elements**: Represent the native field type of the proving backend. Example:
   ```rust
   fn main(x: Field, y: Field) {
       let z = x + y;
   }
   ```
2. **Unsigned and Signed Integers**: Noir supports `u8`, `u16`, `i8`, `i16`, etc., as abstractions over field elements.
3. **Boolean (`bool`)**: For true/false values.
4. **Compound Types**: Arrays, tuples, and structs are supported, with arrays being fixed-size.

### Functions

The `main` function serves as the entry point but has restrictions, such as disallowing variable-sized arrays as parameters.

---

## Getting Started

### Setup: Install and Initialize Noir Project

Use Noir’s package manager, [nargo](https://noir-lang.org/docs/reference/nargo_commands#nargo), to set up a new project:

```bash
nargo new hello_world
```

This creates:

- **`src/main.nr`**: The boilerplate circuit file.
- **`Nargo.toml`**: Configuration file with project metadata.

### Write a Basic Program

Example: Simple Arithmetic Check

```rust
fn main(age: u8, min_age: pub u8) {
    assert(age >= min_age);
}



#[test]
fn test_main() {
    main(12,10);
}
```

Run:

1. **Check for Errors**:

   ```bash
   nargo check
   ```

   Output:

   ```
   [hello_world] Constraint system successfully built!
   ```

2. **Provide Input Values**: Add values to `Prover.toml`:

   ```toml
   age="24"
   min_age="18"
   ```

3. **Compile and Execute**:
   ```bash
   nargo execute
   ```
   Output:
   ```
   [hello_world] Circuit witness successfully solved
   [hello_world] Witness saved to <path-of-your-project>/target/hello_world.gz
   ```

### Prove and Verify

1. **Generate Proof**:

   ```bash
   bb prove -b ./target/hello_world.json -w ./target/hello_world.gz -o ./target/proof
   ```

2. **Generate Verification Key**:

   ```bash
   bb write_vk -b ./target/hello_world.json -o ./target/vk
   ```

3. **Verify Proof**:
   ```bash
   bb verify -k ./target/vk -p ./target/proof
   ```

## Compilation Flow

Noir compiles to an intermediate representation called **Abstract Circuit Intermediate Representation (ACIR)**, which is then processed by backends to generate machine code for specific architectures.

### Visual Representation

![Noir Compilation Flow](Resource/image.png)

## Working with Smart Contract

Noir has the ability to generate a verifier contract in Solidity, which can be deployed in many EVM-compatible blockchains such as Ethereum.

### Verifying using Onchain using Smart Contract

```bash
nargo compile
bb write_vk -b ./target/hello_world.json
bb contract
```

A new contract folder would then be generated in your project directory, containing the Solidity file contract.sol. It can be deployed to any EVM blockchain acting as a verifier smart contract.

#### Foundry Setup

## Reference Code

Extract public inputs and proofs:

```bash
PUBLIC_INPUT_BYTES=32
HEX_PUBLIC_INPUTS=$(head -c $PUBLIC_INPUT_BYTES ./proof | od -An -v -t x1 | tr -d $' \n')
HEX_PROOF=$(tail -c +$(($PUBLIC_INPUT_BYTES + 1)) ./proof | od -An -v -t x1 | tr -d $' \n')

echo "Public inputs:"
echo $HEX_PUBLIC_INPUTS

echo "Proof:"
echo "0x$HEX_PROOF"
```

---

## Learn More

1. [Offical Documentation](https://noir-lang.org/docs/getting_started/quick_start)
2. Many part of the Readme has been reference from [Notion Note](https://zkshark.notion.site/Hot-Chocolate-Beginners-guide-14907561ca1a80e68bd1d9245a53fd95) by [@Abix](https://x.com/0xAbix)
<!-- 2.For an in-depth guide, visit the [zkShark](https://zkshark.notion.site/Hot-Chocolate-Beginners-guide-14907561ca1a80e68bd1d9245a53fd95). -->
