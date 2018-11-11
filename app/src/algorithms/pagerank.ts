
// random adjacency matrix for a directed graph with N nodes
export function random_graph(N: number): number[][] {
  // N x N zero-filled matrix
  const g: number[][] = new Array<number[]>(N).fill([]).map((a:number[]) => new Array<number>(N).fill(0))
  return g.map((row: number[], i: number) => row.map((_: number, j: number) => i === j ? 0 : Math.floor((3/5)*2*Math.random())))
}
