
// basic recursive gcd
function gcd(a: number, b: number): number {
    if (b === 0) {
        return a;
    }

    return gcd(b, a % b);
};

// basic reduction of fraction
function reduce_frac(frac:number[]): number[] {
  const div: number = gcd(frac[0], frac[1])
  return [frac[0]/div, frac[1]/div]
}

// add fraction without reducing
function add_frac(a:number[], b:number[]) {
  if (a[0] === 0) return b
  if (b[0] === 0) return a
  return [a[0]*b[1] + b[0]*a[1], a[1]*b[1]]
}

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

export function get_G2_matrix(g1: number[][][]): number[][][] {
  return g1.map((row:number[][], i:number) => {
    if (row.filter((el:number[]) => el[0] != 0).length > 0) {
      return row
    } else {
      return row.map((el:number[]) => [1,g1.length])
    }
  })
}

// alpha as a fraction array thing
export function get_G_matrix(g2: number[][][], alpha: number[]): number[][][] {
  // 1 - alpha
  const inv_alpha: number[] = [alpha[1] - alpha[0], alpha[1]]
  // (1 - alpha) / N
  const inv_alpha_N: number[] = reduce_frac([inv_alpha[0], inv_alpha[1]*g2.length])

  return g2.map((row:number[][], i:number) => {
    // if row is full of 1/N then do nothing
    if (row[0][1] === g2.length) { // first element is enough to know
      return row
    } else {
      // otherwise, it's a row with links, so multiply by alpha and add (1 - alpha)/N
      return row.map((el:number[]) => {
        // zero elements become (1 - alpha)/N
        if (el[0] === 0) {
          return inv_alpha_N
        // link elements become (1 - alpha)/N + alpha/num_links_from_this_page
        } else {
          // alpha / num_links_from_this_page
          const alpha_links: number[] = reduce_frac([alpha[0], alpha[1]*el[1]])
          // fraction addition!
          return reduce_frac(add_frac(alpha_links, inv_alpha_N))
        }
      })
    }
  })
}

// multiply the row vector rho by g, producing a new row vector
export function pagerank_iterate(rho: number[][], g: number[][][]): number[][] {
    return rho.map((_, col:number) =>
      reduce_frac(
        rho.reduce((acc:number[], el: number[], row:number) =>
          add_frac(acc, [ el[0]*g[row][col][0], el[1]*g[row][col][1] ]),
          [0,0]
        )
      )
    )
}
