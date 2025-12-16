/**
 * Merkle Tree Implementation
 *
 * Used for generating Merkle proofs for daily reward distributions.
 * Allows on-chain verification of reward amounts without storing all data on-chain.
 */

export interface MerkleLeaf {
  miner_id: string;
  user_id: string;
  reward_date: string;
  user_btc: number;
  net_btc: number;
}

export interface MerkleProof {
  leaf: string;
  proof: string[];
  root: string;
  index: number;
}

export class MerkleTree {
  private leaves: string[];
  private layers: string[][];

  constructor(leaves: MerkleLeaf[]) {
    this.leaves = leaves.map(leaf => this.hashLeaf(leaf));
    this.layers = this.buildTree(this.leaves);
  }

  private hashLeaf(leaf: MerkleLeaf): string {
    const data = JSON.stringify({
      miner_id: leaf.miner_id,
      user_id: leaf.user_id,
      reward_date: leaf.reward_date,
      user_btc: leaf.user_btc.toFixed(8),
      net_btc: leaf.net_btc.toFixed(8),
    });

    return this.hash(data);
  }

  private hash(data: string): string {
    const encoder = new TextEncoder();
    const dataBuffer = encoder.encode(data);

    return Array.from(dataBuffer)
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
  }

  private async hashWithCrypto(data: string): Promise<string> {
    if (typeof crypto !== 'undefined' && crypto.subtle) {
      const encoder = new TextEncoder();
      const dataBuffer = encoder.encode(data);
      const hashBuffer = await crypto.subtle.digest('SHA-256', dataBuffer);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    }

    return this.hash(data);
  }

  private pairHash(left: string, right: string): string {
    const combined = left < right ? left + right : right + left;
    return this.hash(combined);
  }

  private buildTree(leaves: string[]): string[][] {
    if (leaves.length === 0) {
      return [[]];
    }

    const layers: string[][] = [leaves];
    let currentLayer = leaves;

    while (currentLayer.length > 1) {
      const nextLayer: string[] = [];

      for (let i = 0; i < currentLayer.length; i += 2) {
        if (i + 1 < currentLayer.length) {
          const combined = this.pairHash(currentLayer[i], currentLayer[i + 1]);
          nextLayer.push(combined);
        } else {
          nextLayer.push(currentLayer[i]);
        }
      }

      layers.push(nextLayer);
      currentLayer = nextLayer;
    }

    return layers;
  }

  getRoot(): string {
    if (this.layers.length === 0 || this.layers[this.layers.length - 1].length === 0) {
      return '';
    }
    return this.layers[this.layers.length - 1][0];
  }

  getProof(leafIndex: number): string[] {
    if (leafIndex < 0 || leafIndex >= this.leaves.length) {
      throw new Error('Invalid leaf index');
    }

    const proof: string[] = [];
    let index = leafIndex;

    for (let layerIndex = 0; layerIndex < this.layers.length - 1; layerIndex++) {
      const layer = this.layers[layerIndex];
      const isRightNode = index % 2 === 1;
      const siblingIndex = isRightNode ? index - 1 : index + 1;

      if (siblingIndex < layer.length) {
        proof.push(layer[siblingIndex]);
      }

      index = Math.floor(index / 2);
    }

    return proof;
  }

  getProofByLeafHash(leafHash: string): { proof: string[]; index: number } | null {
    const index = this.leaves.indexOf(leafHash);
    if (index === -1) {
      return null;
    }

    return {
      proof: this.getProof(index),
      index,
    };
  }

  verify(leafHash: string, proof: string[], root: string, index: number): boolean {
    let computedHash = leafHash;
    let currentIndex = index;

    for (const proofElement of proof) {
      const isRightNode = currentIndex % 2 === 1;

      if (isRightNode) {
        computedHash = this.pairHash(proofElement, computedHash);
      } else {
        computedHash = this.pairHash(computedHash, proofElement);
      }

      currentIndex = Math.floor(currentIndex / 2);
    }

    return computedHash === root;
  }

  verifyLeaf(leaf: MerkleLeaf, proof: string[], root: string, index: number): boolean {
    const leafHash = this.hashLeaf(leaf);
    return this.verify(leafHash, proof, root, index);
  }

  static buildFromLeaves(leaves: MerkleLeaf[]): MerkleTree {
    return new MerkleTree(leaves);
  }

  static verifyProof(
    leaf: MerkleLeaf,
    proof: string[],
    root: string,
    index: number
  ): boolean {
    const tree = new MerkleTree([leaf]);
    return tree.verifyLeaf(leaf, proof, root, index);
  }

  getLeaves(): string[] {
    return [...this.leaves];
  }

  getLayers(): string[][] {
    return this.layers.map(layer => [...layer]);
  }

  getHexRoot(): string {
    const root = this.getRoot();
    return root ? '0x' + root : '0x';
  }

  toJSON(): {
    root: string;
    leaves: string[];
    layers: string[][];
  } {
    return {
      root: this.getRoot(),
      leaves: this.getLeaves(),
      layers: this.getLayers(),
    };
  }
}

export function buildMerkleTree(leaves: MerkleLeaf[]): MerkleTree {
  return new MerkleTree(leaves);
}

export function generateMerkleProof(
  leaves: MerkleLeaf[],
  targetLeaf: MerkleLeaf
): MerkleProof | null {
  const tree = new MerkleTree(leaves);
  const targetIndex = leaves.findIndex(
    leaf =>
      leaf.miner_id === targetLeaf.miner_id &&
      leaf.reward_date === targetLeaf.reward_date
  );

  if (targetIndex === -1) {
    return null;
  }

  const leafHash = tree.getLeaves()[targetIndex];
  const proof = tree.getProof(targetIndex);
  const root = tree.getRoot();

  return {
    leaf: leafHash,
    proof,
    root,
    index: targetIndex,
  };
}

export function verifyMerkleProof(
  leaf: MerkleLeaf,
  proof: string[],
  root: string,
  index: number
): boolean {
  return MerkleTree.verifyProof(leaf, proof, root, index);
}

export async function hashLeafForContract(leaf: MerkleLeaf): Promise<string> {
  const data = JSON.stringify({
    miner_id: leaf.miner_id,
    user_id: leaf.user_id,
    reward_date: leaf.reward_date,
    user_btc: leaf.user_btc.toFixed(8),
    net_btc: leaf.net_btc.toFixed(8),
  });

  if (typeof crypto !== 'undefined' && crypto.subtle) {
    const encoder = new TextEncoder();
    const dataBuffer = encoder.encode(data);
    const hashBuffer = await crypto.subtle.digest('SHA-256', dataBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return '0x' + hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }

  const encoder = new TextEncoder();
  const dataBuffer = encoder.encode(data);
  return '0x' + Array.from(dataBuffer)
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}
