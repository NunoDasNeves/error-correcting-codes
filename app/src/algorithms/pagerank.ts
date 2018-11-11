
// random adjacency matrix for a directed graph with N nodes
export function random_graph(N: number): number[][] {
  // N x N zero-filled matrix
  const g: number[][] = new Array<number[]>(N).fill([]).map((a:number[]) => new Array<number>(N).fill(0))
  return g.map((row: number[], i: number) => row.map((_: number, j: number) => i === j ? 0 : Math.floor((3/5)*2*Math.random())))
}

// last array has 2 elements; top and bottom of a fraction
export function get_G1_matrix(graph: number[][]): number[][][] {
    const links_count: number[] = graph.map((a:number[]) => a.reduce((acc:number, curr:number) => acc+curr))
    const mat: number[][][] = links_count.map((count:number, i:number) => {
      const row = new Array<number[]>(graph.length).fill([0,0])
      if (count === 0) {
        return row
      } else {
        return graph[i].map((curr:number) => curr ? [1,count] : [0,0])
      }
    })
    return mat
  }
