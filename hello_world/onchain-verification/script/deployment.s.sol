// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Script, console} from "forge-std/Script.sol";
import {UltraVerifier} from "../src/contract.sol";

contract UltraVerifierDeployer is Script {
   

    function setUp() public {}

    function run() public {
        vm.startBroadcast();
        UltraVerifier verifier = new UltraVerifier();
        console.log("Contract deployed at:", address(verifier));
        vm.stopBroadcast();
    }
}
