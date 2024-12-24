import { compile, createFileManager } from "@noir-lang/noir_wasm";
import { UltraHonkBackend } from "@aztec/bb.js";
import { Noir } from "@noir-lang/noir_js";
import initNoirC from "@noir-lang/noirc_abi";
import initACVM from "@noir-lang/acvm_js";
import acvm from "@noir-lang/acvm_js/web/acvm_js_bg.wasm?url";
import noirc from "@noir-lang/noirc_abi/web/noirc_abi_wasm_bg.wasm?url";
await Promise.all([initACVM(fetch(acvm)), initNoirC(fetch(noirc))]);
import circuitJson from "./target/hello_world.json";

export async function getCircuit() {
  const fm = createFileManager("/");
  if (circuitJson) {
    return { program: circuitJson };
  }
  return await compile(fm);
}

function uint8ArrayToHex(uint8Array) {
  return Array.from(uint8Array)
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}
document.getElementById("submit").addEventListener("click", async () => {
  try {
    const { program } = await getCircuit();
    const noir = new Noir(program);
    const backend = new UltraHonkBackend(program.bytecode);
    const age = document.getElementById("age").value;
    const { witness } = await noir.execute({ age, min_age: 18 });
    const proof = await backend.generateProof(witness);
    console.log(proof);
    console.log(uint8ArrayToHex(proof.proof));
    const isValid = await backend.verifyProof(proof);
    alert(isValid ? "Valid" : "Invalid");
  } catch (err) {
    console.error(err);
    if (err.message == "Cannot satisfy constraint") {
      alert(err.message);
      return;
    } else {
      alert("something went wrong 💔");
    }
  }
});
