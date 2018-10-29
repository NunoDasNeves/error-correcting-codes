
// convert a regular string to an array of bits for use with an Encoder
function stringToBinaryArray(s: string): number[] {
    const ret: number[] = []

    for(let i = 0; i < s.length; ++i) {
        // get the ascii code
        let num: number = s.charCodeAt(i)

        // for each bit, push an element on the return array
        for (let j = 0; j < 8; ++j) {
            ret.push((num >> j) & 1)
        }
    }

    return ret
}

// convert an array produced by a Decoder to a string
function binaryArrayToString(bits: number[]): string {

    const nums: number[] = []
    // group array into arrays of 8 bits
    for(let i = 0; i < bits.length; i+=8) {
        let num: number = 0
        // reconstruct the ascii code from the bits
        for (let j = 0; j < 8 && j + i < bits.length; ++j) {
            num |= (bits[j + i] << j)
        }
        nums.push(num)
    }

    return String.fromCharCode(...nums)
}

// convert an array of bits into a number
function arrayToNumber(bits: number[]): number {
    let num: number = 0
    for (let i: number = 0; i < bits.length; ++i) {
        num |= bits[i] << i
    }
    return num
}

// convert a number into an array of bits of specified length
function numberToArray(num: number, len:number): number[] {
    let bits: number[] = []
    for (let i: number = 0; i < len; ++i) {
        bits.push((num >> i) & 1)
    }
    return bits
}


// A simple convolutional encoder
class Encoder {

    // input parameters
    n: number           // number of bits per output symbol
    K: number           // constraint length
    gen: number[][]     // n binary generator polynomials of length K
    input: number[]     // string of input bits

    // current state
    i: number           // the next output symbol will be the ith one
    reg: number[]       // K single bit shift registers

    // history
    states: number[][]  // stored states
    outputs: number[][] // stored outputs

    constructor(n: number, K: number, gen: number[][], input: number[]) {
        this.n = n
        this.K = K
        this.gen = gen
        this.input = input
        this.i = 0
        this.reg = new Array<number>(K).fill(0)
        this.states = new Array<number[]>()
        this.outputs = new Array<number[]>()

        // set up first input bit
        this.reg[0] = input[0]
    }

    // produce a simple example encoder
    static example(input: number[] = [1,0,1,1,0,0,0,1]) {
        return new Encoder(2, 3, [[1,1,1], [1,0,1]], input)
    }

    // retrieve next output symbol and return it
    next() {

        if (this.i > (this.input.length + this.K - 1)) {
            return undefined
        }

        // compute output bits
        const out_symbol: number[] = new Array(this.n).fill(0)
        // for each output bit
        for (let j: number = 0; j < this.n; ++j) {
            // use the jth generator polynomial to produce the bit
            out_symbol[j] = this.gen[j].reduce((acc, g, k) => (acc + this.reg[k]) % 2)
        }

        // bookkeeping
        this.i++
        this.states.push(Array.from(this.reg))
        this.outputs.push(Array.from(out_symbol))

        // update shift registers
        this.reg.pop()
        this.reg.unshift(this.input[this.i] ? this.input[this.i] : 0)

        return out_symbol
    }

}

// A Viterbi algorithm decoder
class Decoder {

    // input parameters
    n: number           // number of bits per encoded symbol
    N: number           // number of encoder states
    K: number           // constraint length (polynomial length)
    gen: number[][]     // n binary generator polynomials of length K
    input: number[]     // string of n-bit symbols generated by the encoder (length should be a multiple of n)

    // state transition graph, indexed by state number
    // in the decoder, the state is just an integer in [0, N)
    // [ { prev: [ number, number ], output_1: number[], output_0: number[] }, ... ]
    // prev contains the previous possible states
    // output_x contains the binary string of output we'd get on transitioning from this state on a
    // 1 or 0
    graph: any[]

    // current state
    i: number           // the index of the next encoded symbol in the input array. i/2 = table.length-1
    // (input.length/n) x N table of {hamming: number, prev: number}
    // hamming is the culmulative best hamming distance to this node, prev is the index of the
    // previous state
    table: any[][]

    constructor(n: number, K: number, gen: number[][], input: number[]) {
        this.n = n
        this.K = K
        this.N = Math.pow(2, K-1)
        this.gen = gen
        this.input = input
        this.i = 0
        this.table = new Array<any[]>()
        // fill first row with impossible states
        this.table.push(new Array<any>(this.N).fill({hamming: Number.MAX_SAFE_INTEGER, prev: -1}))
        // we start in state 0 with 0 accumulated hamming distance
        this.table[0][0] = { hamming: 0, prev: -1 } // note we need a new object here
        // initialise state transition graph
        this.graph = new Array<any>()
        // for each state
        for (let s: number = 0; s < this.N; ++s) {
            // encoder representation of state
            const state: number[] = numberToArray(s, K-1)
            this.graph.push({
                // two possible previous states
                prev: [ ((s << 1) & ~(1 << K-1)) + 1, (s << 1) & ~(1 << K-1) ],
                output_0: this.get_output(0, state),
                output_1: this.get_output(1, state)
            })
        }
    }

    // use generator polynomials to compute output for a given input + state
    // input is 1 or 0
    get_output(input: number, state: number[]) {
        const full_state: number[] = [input, ...state]
        // compute output bits
        const out_symbol: number[] = new Array(this.n).fill(0)
        // for each output bit
        for (let j: number = 0; j < this.n; ++j) {
            // use the jth generator polynomial to produce the bit
            out_symbol[j] = this.gen[j].reduce((acc, g, k) => (acc + full_state[k]) % 2)
        }
        return out_symbol
    }

    // produce a simple example decoder
    static example(input: number[]) {
        return new Decoder(2, 3, [[1,1,1], [1,0,1]], input)
    }

    // hamming distance between two bit strings of the same length
    // this acts as a likelihood function of observable symbol a being produced by actual symbol b
    hamming(a: number[], b: number[]) {
        return a.reduce((acc, a_i, i) => acc + (a_i ^ b[i]), 0) // add the xor of each bit
    }

    // do one step of the algorithm, return true if there are more steps to do
    next(): boolean {
        // consider the next n bits in the input
        //const bits: number[] = this.input.slice(this.i,this.i+2)
        return false
    }

    // get the path through the filled-in table
    get_path(): number[] {
        return []
    }

    // decode the remaining input string and return the most likely decoding
    decode(): number[] {
        // do all steps
        while(this.next());
        return this.get_path()
    }
}



function testEncoder() {
    const inCode = stringToBinaryArray("hello world")

    const encoder = Encoder.example(inCode)

    // encode the thing, and flatten to a bitstring
    let coded: number[] = []
    for (
          let curr = encoder.next();
          curr !== undefined;
          curr = encoder.next()) {

        coded = coded.concat(curr)
        console.log(curr)
        curr = encoder.next()
    }

    // TODO insert some bit-errors here

    const decoder = Decoder.example(coded)

    console.log(binaryArrayToString(decoder.decode()))

}

testEncoder()

