
class BitArray {

    length: number  // length in bits (not all numbers may be 'full' of bits
    // Bits are stored right-to-left in each number, but numbers are stored left-to-right
    // this makes sense because pushing/popping happens on the right of the array
    // but << goes from the lowest bit to the highest
    array: number[]

    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Bitwise_Operators
    // javascript bitwise operators treat numbers as 32 bit integers
    static BITS_PER_NUM = 32

    constructor() {
        this.length = 0
        this.array = [ 0 ]
    }

    static from(arr: BitArray) : BitArray {
        const newArr: BitArray = new BitArray()
        newArr.length = arr.length
        newArr.array = Array.from(arr.array)
        return newArr
    }

    static fromNumber(num: number, len:number): BitArray {

        if (len > BitArray.BITS_PER_NUM) throw Error("Invalid len passed to BitArray.fromNumber")

        const arr: BitArray = new BitArray()
        arr.length = len
        arr.array[0] = num
        return arr
    }

    static fromAsciiString(s: string): BitArray {
        let arr: BitArray = new BitArray()

        for (let i = 0; i < s.length; ++i) {
            // get the ascii code
            let num: number = s.charCodeAt(i)
            const numArr: BitArray = BitArray.fromNumber(num, 8)
            arr = arr.concat(numArr)
        }

        return arr
    }

    // print as string of 1's and 0's
    toString(): string {
        let str: string = ''
        for (let i: number = 0; i < this.length; ++i) {
            str += this.getBit(i)
        }
        return str
    }

    toAsciiString(): string {
        if (this.length % 8 != 0) throw Error("BitArray cannot be converted to ascii string")

        let bytes: number[] = []

        let b: number = 0 // number to hold the byte we're building
        let i: number = 0 // 0 - length for getting bits
        let j: number = 0 // 0 - 8      for pushing bits
        for (; i < this.length; ++i) {

            b |= this.getBit(i) << j

            j = (j + 1) % 8
            // if done with this byte, push it and start again
            if (j == 0) {
                bytes.push(b)
                b = 0
            }
        }

        const str: string = String.fromCharCode(...bytes)
        return str
    }

    // return a new array that is the concatenation of this and arr
    concat(arr: BitArray): BitArray {
        // make a copy
        const newArr: BitArray = BitArray.from(this)

        // iterate through bits of new array, pushing them on
        for (let i = 0; i < arr.length; ++i) {
            newArr.pushBit(arr.getBit(i))
        }

        return newArr
    }

    // modify BitArray in place
    // bit should be 1 or 0
    pushBit(bit: number) {
        // get index of last number
        const lastArrayIndex = Math.trunc(this.length/BitArray.BITS_PER_NUM)
        const nextBitIndex = this.length - lastArrayIndex * BitArray.BITS_PER_NUM
        // check if there's space in the last number
        if (nextBitIndex < BitArray.BITS_PER_NUM) {
            // clear the bit
            this.array[lastArrayIndex] &= ~(1 << nextBitIndex)
            // set it
            this.array[lastArrayIndex] |= (bit << nextBitIndex)
        } else {
            // append a new number, which just has the bit in it
            this.array.push(bit)
        }
        this.length++
    }

    getBit(index: number): number {
        if (index >= this.length) throw Error("Invalid index passed to getBit")
        const arrayIndex = Math.trunc(index/BitArray.BITS_PER_NUM)
        const bitIndex = index - arrayIndex * BitArray.BITS_PER_NUM
        return (this.array[arrayIndex] >> bitIndex) & 1 // just the bit by itself, as a number
    }

    setBit(index: number, bit: number) {
        if (index >= this.length) throw Error("Invalid index passed to setBit")
        const arrayIndex = Math.trunc(index/BitArray.BITS_PER_NUM)
        const bitIndex = index - arrayIndex * BitArray.BITS_PER_NUM
        // clear it
        this.array[arrayIndex] &= ~(1 << bitIndex)
        // set it
        this.array[arrayIndex] |= ((bit & 1) << bitIndex)
    }

    // shift by 1
    rightShift() {
        if (this.length == 0) return
        for (let i: number = 0; i < this.length; ++i) {
            // we don't wanna lose bits off to the right for array indexes > 0
            if (i > 0) {
                // get bit that will be removed
                const bit: number = this.array[i] & 1
                // clear and set leftmost bit in previous array entry
                this.array[i-1] &= ~(1 << (BitArray.BITS_PER_NUM - 1))
                this.array[i-1] |= (bit << (BitArray.BITS_PER_NUM - 1))
            }
            this.array[i] = this.array[i] >> 1
        }
        this.length -= 1
    }

    is(arr: BitArray): boolean {
        // easy case
        if (this.length != arr.length) return false

        // clear extra bits
        const lastArrayIndex = Math.trunc(this.length/BitArray.BITS_PER_NUM)
        const nextBitIndex = this.length - lastArrayIndex * BitArray.BITS_PER_NUM
        this.array[lastArrayIndex] &= ~((~0) << nextBitIndex)
        arr.array[lastArrayIndex] &= ~((~0) << nextBitIndex)

        // compare each number
        for (let i: number = 0; i < this.length; ++i) {
            if (this.array[i] != arr.array[i]) return false
        }

        return true
    }
}

// A simple convolutional encoder
class Encoder {

    // input parameters
    n: number           // number of bits per output symbol
    K: number           // constraint length
    gen: BitArray[]     // n binary generator polynomials of length K
    input: BitArray     // string of input bits

    // current state
    i: number           // the next output symbol will be the ith one
    reg: BitArray       // K single bit shift registers

    // history
    states: BitArray[]  // stored states
    outputs: BitArray[] // stored outputs

    constructor(n: number, K: number, gen: BitArray[], input: BitArray) {
        this.n = n
        this.K = K
        this.gen = gen
        this.input = input
        this.i = 0
        this.reg = BitArray.fromNumber(0, K)
        this.states = new Array<BitArray>()
        this.outputs = new Array<BitArray>()
    }

    // produce a simple example encoder
    static example(input: BitArray = BitArray.fromAsciiString("example string")) {
        const poly_1: BitArray = BitArray.fromNumber(7, 3)
        const poly_2: BitArray = BitArray.fromNumber(5, 3)
        return new Encoder(2, 3, [poly_1, poly_2], input)
    }

    // retrieve next output symbol and return it
    next() {

        if (this.i >= this.input.length) {
            return undefined
        }

        //console.log(this.reg)

        // update shift register
        this.reg.rightShift()
        this.reg.pushBit(this.input.getBit(this.i))

        const out_symbol: BitArray = BitArray.fromNumber(0, this.n)

        // for each output bit
        for (let j: number = 0; j < this.n; ++j) {
            // use the jth generator polynomial to produce the bit
            let bit: number = 0
            // for each coefficient (1 or 0)
            for (let k: number = 0; k < this.K; ++k) {
                // if 0, skip
                if (this.gen[j].getBit(k) == 0) continue
                // otherwise, add
                bit += this.reg.getBit(k)
            }
            // set the bit. mod 2 implied but not necessary
            out_symbol.setBit(j, bit/*&1*/)
        }

        //console.log("state: "+this.reg)
        //console.log("out: "+out_symbol)

        // bookkeeping
        this.i++
        this.states.push(BitArray.from(this.reg))
        this.outputs.push(BitArray.from(out_symbol))

        return out_symbol
    }

}

// A Viterbi algorithm decoder
    /*
class Decoder {

    // input parameters
    n: number           // number of bits per encoded symbol
    N: number           // number of encoder states
    K: number           // constraint length (polynomial length)
    gen: number[][]     // n binary generator polynomials of length K
    input: number[]     // string of n-bit symbols generated by the encoder (length should be a multiple of n)

    // state transition graph, indexed by state number
    // in the decoder, the state is just an integer in [0, N)
    // [ { prev: [ number, number ], output: [ number[], number[] ] }, ... ]
    // prev contains the previous possible states in no particular order
    // output contains the binary strings of output for this state indexed by input (0 or 1)
    graph: any[]

    // current state
    i: number           // the index of the next encoded symbol in the input array. i/2 = table.length-1
    // (input.length/n) x N table of { hamming: number, prev: number, bit: number }
    // hamming is the culmulative best hamming distance to this node
    // prev is the previous state as just an index
    // bit is the bit that was most likely transitioned on to get to this state
    table: any[][]

    constructor(n: number, K: number, gen: BitArray[], input: BitArray) {
        this.n = n
        this.K = K
        this.N = Math.pow(2, K-1)
        this.gen = gen
        this.input = input
        this.i = 0
        this.table = new Array<any[]>()
        // fill first row with impossible states
        this.table.push(new Array<any>(this.N).fill({hamming: Number.MAX_SAFE_INTEGER, prev: -1, bit: -1}))
        // we start in state 0 with 0 accumulated hamming distance
        this.table[0][0] = { hamming: 0, prev: -1, bit: -1 } // note we need a new object here
        // initialise state transition graph
        this.graph = new Array<any>()
        // for each state
        for (let s: number = 0; s < this.N; ++s) {
            // encoder representation of state
            const state: number[] = numberToArray(s, K-1)

            this.graph.push({
                // two possible previous states
                prev: [ (s << 1) & ~(1 << K-1), ((s << 1) & ~(1 << K-1)) + 1 ],
                // two possible outputs, 0 input and 1 input
                output: [ this.get_output(0, state), this.get_output(1, state) ]
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
            out_symbol[j] = this.gen[j].reduce((acc, g, k) => g ? (acc + full_state[k]) % 2 : acc, 0)
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

        // return early
        if (this.i >= this.input.length) return false

        // array to push on to table
        let entry: any[] = []

        // consider the next n bits in the input
        const out_bits: number[] = this.input.slice(this.i,this.i+2)
        // enumerate the states
        for (let s: number = 0; s < this.N; ++s) {
            // for each previous possible state, compute the outputs generated by transitioning to s
            // compare the outputs to out_bits and choose the lowest hamming distance
            const prev_1: number = this.graph[s].prev[0]
            const prev_2: number = this.graph[s].prev[1]

            // the leftmost bit is the one that was transitioned on to get to this state
            const bit: number = s >> this.K-2

            const hamming_1: number = this.table[this.i/2][prev_1].hamming + this.hamming(out_bits, this.graph[prev_1].output[bit])
            const hamming_2: number = this.table[this.i/2][prev_2].hamming + this.hamming(out_bits, this.graph[prev_2].output[bit])

            // console.log(`state ${s} can come from ${prev_1}: ${this.graph[prev_1].output[bit]} or ${prev_2}: ${this.graph[prev_2].output[bit]}`)

            let obj: any = {}

            if (hamming_1 < hamming_2) {
                obj = { hamming: hamming_1, prev: prev_1, bit }
            } else {
                obj = { hamming: hamming_2, prev: prev_2, bit }
            }

            entry.push(obj)
        }

        this.table.push(entry)
        this.i += 2

        if (this.i >= this.input.length) return false
        return true
    }

    // get the path through the filled-in table
    get_path(): number[] {
        //console.log("table length")
        //console.log(this.table.length)
        //console.log(this.table)
        let decoded: number[] = []

        // find argmin of hamming distance of last entry in table
        let curr: number = 0
        let min: number = Number.MAX_SAFE_INTEGER
        for (let i: number = 0; i < this.N; ++i) {
            const hamming: number = this.table[this.table.length -1][i].hamming
            curr = hamming < min ? i : curr
            min = hamming < min ? hamming : min
        }

        for (let i: number = this.table.length-1; i > 0; --i) {
            decoded[i-1] = this.table[i][curr].bit
            curr = this.table[i][curr].prev
        }
        //console.log(decoded)

        return decoded
    }

    // decode the remaining input string and return the most likely decoding
    decode(): number[] {
        // do all steps
        while(this.next());
        return this.get_path()
    }
}

*/

function testEncoder() {

    /*
    let test: BitArray = BitArray.fromNumber('a'.charCodeAt(0), 8)
    console.log(test)
    console.log(test.toString())

    test = BitArray.fromAsciiString('abcd')
    console.log(test)
    console.log(test.toString())
    test = test.concat(BitArray.fromAsciiString('e'))
    console.log(test.toAsciiString())

    console.log(BitArray.fromAsciiString("abcdefg Hey you!").toAsciiString())
    */

    const inCode: BitArray = BitArray.fromAsciiString("Hello, Viterbi!")

    //console.log("in code length")
    //console.log(inCode.length)
    //console.log(inCode)
    const encoder = Encoder.example(inCode)

    // encode the thing, and flatten to a bitstring
    let coded: BitArray = new BitArray()
    let i: number = 0
    for (
          let curr = encoder.next();
          curr !== undefined;
          curr = encoder.next()) {
        i++
        coded = coded.concat(curr)
        console.log(curr.toString())
    }
    //console.log("coded length")
    //console.log(coded.length)

    // some bit-errors
    /*
    coded[1] = ~coded[1]
    coded[3] = ~coded[3]
    coded[14] = ~coded[13]
    coded[14] = ~coded[14]
    coded[21] = ~coded[21]
    coded[22] = ~coded[22]
     */
    //coded[23] = ~coded[23] // this will cause an error as

    //const decoder = Decoder.example(coded)

    //console.log(binaryArrayToString(decoder.decode()))

}

testEncoder()

