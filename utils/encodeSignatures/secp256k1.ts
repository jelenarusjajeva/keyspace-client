import {
  encodeAbiParameters,
  encodePacked,
  type Hex,
  hexToBigInt,
} from "viem";
import { SignReturnType } from "viem/accounts";
import { getPublicKeyPoint } from "../keyspace";
import { dummyConfigProof } from "./utils";


export function buildDummySignature() {
  const dummyPublicKey = new Uint8Array(65);
  dummyPublicKey[0] = 4;
  return encodeSignature({
    signature: {
      r: "0x0000000000000000000000000000000000000000000000000000000000000000",
      s: "0x0000000000000000000000000000000000000000000000000000000000000000",
      v: 0n,
    },
    publicKey: dummyPublicKey,
    configProof: dummyConfigProof,
  });
}

export function encodePackedSignature(signature: SignReturnType): Hex {
  return encodePacked(
    ["bytes32", "bytes32", "uint8"],
    [
      signature.r,
      signature.s,
      parseInt(signature.v.toString()),
    ],
  );
}

export function encodeSignature({
  signature,
  publicKey,
  configProof,
}: {
  signature: SignReturnType;
  publicKey: Uint8Array;
  configProof: Hex;
}): Hex {
  const publicKeyPoint = getPublicKeyPoint(publicKey);
  return encodeAbiParameters([
    { name: "sig", type: "bytes" },
    { name: "publicKeyX", type: "uint256" },
    { name: "publicKeyY", type: "uint256" },
    { name: "stateProof", type: "bytes" },
  ], [
    encodePackedSignature(signature),
    hexToBigInt("0x" + Buffer.from(publicKeyPoint.x).toString("hex") as Hex),
    hexToBigInt("0x" + Buffer.from(publicKeyPoint.y).toString("hex") as Hex),
    configProof,
  ])
}

