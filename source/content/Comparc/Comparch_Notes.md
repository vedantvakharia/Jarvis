# Computer Architecture (CS F342) Notes

Source: lecture slides till 29 Sept (Dr Kanchan Manna, BITS Pilani Goa). Books: Patterson and Hennessy COD (MIPS Edition), Hamacher ch5.
Images are in the folder `comparch_images/`. Keep that folder next to this note in your vault.

## Contents
1. [[#1. Computation basics and building blocks]]
2. [[#2. Special purpose vs general purpose processor]]
3. [[#3. Big picture, history, future]]
4. [[#4. MIPS ISA]]
5. [[#5. MARS simulator and assembly]]
6. [[#6. Von Neumann model and instruction cycle]]
7. [[#7. Single-cycle datapath]]
8. [[#8. Control for single-cycle]]
9. [[#9. Performance analysis (formulas and worked numbers)]]
10. [[#10. Multi-cycle datapath]]
11. [[#11. Control unit for multi-cycle: FSM, microprogrammed, hardwired]]
12. [[#12. Single-cycle vs multi-cycle]]
13. [[#13. Pipelining]]
14. [[#14. IPC greater than 1: superscalar and VLIW]]
15. [[#15. ISA and processor design steps]]
16. [[#16. Formula sheet and exam quick reference]]
17. [[#17. Homework and practice questions from slides]]

---

## 1. Computation basics and building blocks

### 1.1 Computable vs uncomputable
- **Computable**: an algorithm exists that solves it. Example: is a number prime?
- **Not known to be computable / unsolved**: no algorithm known so far. Examples listed: is a number random, is P = NP.
- **Automatic computation**: a machine follows the algorithm by itself with no human in the loop.

### 1.2 Example problem: adding two numbers (-2 + 8 = 6)
Steps to go from a human problem to hardware:
1. Represent numbers (sign and magnitude, binary, fixed width).
2. Find an algorithm: build from 1-bit adders.

**Half adder** (adds 2 bits):

$$S = A \oplus B, \qquad C_{out} = A \cdot B$$

**Full adder** (adds 2 bits plus carry in):

$$S = A \oplus B \oplus C_{in}$$
$$C_{out} = A B + A C_{in} + B C_{in}$$

The slide's method: write the truth table, then find the relation between inputs and outputs to compress it.

![[comparch_images/slide_011.jpg|700]]

**Ripple-carry adder**: chain n full adders; the carry-out of bit i feeds the carry-in of bit i+1. Simple but slow because the carry has to travel through all bits.

A processor = **Datapath** (where data moves and gets computed) + **Controller** (tells the datapath what to do and when).

### 1.3 Storage elements (how data is stored in hardware)
- **Variable / data** in a program is stored in **registers** (fast, inside the processor) or **memory**.
- A 32-bit register has bit positions 31 down to 0. Each bit is a **latch or flip-flop** (types: RS, D, T).
- **D latch**: output follows input while clock is active (level sensitive).
- **D flip-flop (D-FF)**: captures input only at a clock edge (edge sensitive). Built from two latches (master and slave).
- **Clock**: a square wave with period T. It tells every flip-flop when to capture data, so the whole circuit updates in step. Without it, we cannot define "when" a value is stable.

![[comparch_images/slide_016.jpg|700]]

### 1.4 Mapping program elements to hardware

| High-level construct | Hardware | Type |
|---|---|---|
| Scalar / variable | Register or wire | Sequential (if register) |
| Array | Memory | Sequential |
| Operators (+, -, *, /) | Functional unit (ALU etc.) | Combinational |
| Control flow (if-else, switch, loop) | Control unit | Combinational or sequential |

Specific mappings:
- `if (sel) a=10; else a=5;` becomes a **multiplexer** (picks which value goes to `a`).
- `if (sel) a=10; else b=5;` becomes a **decoder** (picks which register gets written).
- **Memory read**: a multiplexer chooses which location goes out. **Memory write**: a decoder enables only the chosen location.
- `for (i=10; i>0; i--)` becomes a **counter**: load max value, decrement every clock, a Zero detector says when to stop.
- Nested loops use two counters; stop = 1 only when both counters are zero.
- **Comparison** (<, =, >) becomes a **comparator**.

![[comparch_images/slide_022.jpg|700]]
![[comparch_images/slide_023.jpg|700]]

### 1.5 Timing: clock period, setup and hold
Terms:
- $t_{cq}$ (clock-to-Q): delay after the clock edge before the flop's output changes.
- $T_L$: time for the combinational logic between two flops.
- $t_{su}$ (setup time): data must be stable this long **before** the capturing clock edge.
- $t_h$ (hold time): data must stay stable this long **after** the clock edge.
- Source flop = Di (launches data). Sink flop = Do (captures data).

Data launched at one edge must be captured at the **next** active edge.

**Setup condition** (decides the clock period; uses the slowest path):

$$T > t_{cq} + T_L + t_{su}$$

**Hold condition** (uses the fastest path):

$$t_{cq} + T_L > t_h$$

If hold is violated, the data meant for the next edge gets captured at the same edge (a race condition). Fix: add delay on the fast path.

**Clock period of a whole design**: compute $T_i$ for every register-to-register pair, then

$$T = \max_i (T_i)$$

The slowest register-to-register path (critical path) sets the clock.

![[comparch_images/slide_031.jpg|700]]

---

## 2. Special purpose vs general purpose processor

### 2.1 Special-purpose (dedicated) processor: MinMax example
Problem: find min and max of a set of n numbers.

Algorithm:
1. Min = infinity, Max = -infinity.
2. Scan the i-th number. If Max < A[i], Max = A[i]. If Min > A[i], Min = A[i].
3. Repeat until i reaches n, then stop.

Hardware (MinMax processor):
- Memory holding the numbers, **PC** register to address it (plus adder).
- **Limit** register (counter) loaded with n, decremented each step, raises **stop** when it hits 0.
- **Min Reg** and **Max Reg** with comparators (less, equal, greater).
- A **controller** with outputs (loadPc, load min, load max, load limit, min update, max update, PC update, limit update, memWrite) and inputs (stop, min_lesser_than, max_greater_than).

To measure performance we need time, so we add a **clock**. Clock period = max over all register-to-register paths (PC to MinReg, PC to MaxReg, limit to limit, etc.).

Limitation: it can only run this one algorithm. It has the algorithm's structure baked in.

![[comparch_images/slide_029.jpg|700]]

### 2.2 General-purpose processor: why and how
Goal: one machine that can execute **any** algorithm, so it is **programmable** (Turing model idea).

**Limit of algorithms: the Halting problem.** No algorithm can decide, for every program and input, whether the program halts.
Proof idea (self reference):
- Assume A(P, D) exists and says "Halt" or "Loop" for program P on data D.
- Build B(X): if A(X, X) says "Halt" then loop forever, else halt.
- Run B(B): if A says it halts, B loops; if A says it loops, B halts. Contradiction. So A cannot exist.

**What makes a processor general purpose: the Fetch-and-Execute algorithm** (von Neumann's stored-program idea):
- Program (instructions) is stored in memory like data.
- Repeat forever: **fetch** instruction, **decode** it, **execute** it.
- Needs generalized datapath, generalized functional unit (ALU can do all operations), and a controller.

Questions the slides ask and their answers:
- What is fetched? The instruction (opcode + operands). This is the birth of "software".
- How is an instruction represented? Same as number representation: fixed bit fields (the **instruction format**).
- Where do instructions come from? Memory.

---

## 3. Big picture, history, future

### 3.1 Two important ideas
1. All computers (big or small, fast or slow) can compute exactly the same things, given enough time and memory.
2. Problems are described in human language, but solved by electrons. We must **transform** the problem step by step down to voltages.

### 3.2 Levels of transformation
Problem -> Algorithm -> Program/Language -> Runtime system (OS, VM, memory manager) -> **ISA (architecture)** -> **Micro-architecture** -> **Logic** -> Devices -> Electrons.
This course focuses on ISA, micro-architecture and logic. Note: solving a problem also costs energy and produces heat.

![[comparch_images/slide_092.jpg|600]]

- **ISA (Instruction Set Architecture)**: the set of instructions the hardware offers; the programmer's/compiler's view of the computer. Examples: MIPS (32, 64), RISC-V, 8085, x86, x64.
- **Micro-architecture**: how the ISA is actually built (datapath + control). Many micro-architectures can implement one ISA.
- Compiler: `gcc -S min_max.c` gives assembly `min_max.s`. The basic building block of a program is the **instruction**; order of instructions matters.
- For hardware (single purpose), an algorithm goes through an RTL/HLS design compiler (Xilinx HLS, Synopsys DC). For software, through a compiler (gcc, g++) to instructions for a general-purpose processor.

### 3.3 History and trends
- Evolution: manual -> mechanical (gears, punch cards) -> electro-mechanical (switches, relays) -> electrical (plugboards, vacuum tubes, drum and core memory, transistors).
- 2004 example: Intel Itanium, 64-bit, 1.7 billion transistors, 1.7 GHz, up to 8 instructions per cycle, 26 MB cache. About 100,000 times growth in transistor count and performance in ~30 years.
- **Moore's law**: number of transistors on a chip doubles about every two years (cost per function roughly halves). From about 2005 the scaling continues through **more cores** rather than higher clock speed.
- Future items on slides: quantum computing, carbon nanotube computer, **FPGA** (Field Programmable Gate Array: made of CLBs (Configurable Logic Blocks), each with 4-input LUTs (look-up tables)).

---

## 4. MIPS ISA

MIPS = Microprocessor without Interlocked Pipeline Stages. Commercial example: R2000/R3000.

### 4.1 Key features
- 32-bit processor, 32 registers, register 0 (`$zero`) always holds 0.
- Memory is **byte addressable**; 4 bytes make a **word**; $2^{30}$ words of memory.
- **Big-endian** for instructions and data (most significant byte at the lowest address).
- Separate instruction memory and data memory (in the single-cycle model).
- All instructions are 32 bits long (4 bytes).

### 4.2 Instruction formats
Fields: **op** (opcode), **rs** (first source register), **rt** (second source register, or destination in I-type), **rd** (destination register), **shamt** (shift amount), **funct** (selects the variant of the operation when op = 0).

| Format | 31-26 | 25-21 | 20-16 | 15-11 | 10-6 | 5-0 |
|---|---|---|---|---|---|---|
| R-type | op (6) | rs (5) | rt (5) | rd (5) | shamt (5) | funct (6) |
| I-type | op (6) | rs (5) | rt (5) | address / immediate (16) | | |
| J-type | op (6) | target address (26) | | | | |

![[comparch_images/slide_113.jpg|650]]

Opcodes used in the slides:

| Instruction | Opcode |
|---|---|
| R-type | 000000 |
| LW | 100010 (as per slides) |
| SW | 100011 (as per slides) |
| BEQ | 000100 |
| ADDI | 001000 |
| J | 000010 |

> [!warning]
> Real MIPS uses lw = 100011 and sw = 101011. The slides use 100010 and 100011. Use the slide values in this course.

Instruction meanings:
- `ADD $s1,$s2,$s3`: $s1 = $s2 + $s3
- `LW $s1, off($s2)`: $s1 = Mem[$s2 + off]
- `SW $s1, off($s2)`: Mem[$s2 + off] = $s1
- `BEQ $s1,$s2,off`: if equal, jump by `off` instructions. `BNE`: if not equal.
- `ADDI $s1,$s2,imm`: $s1 = $s2 + imm
- `J addr`: jump.

### 4.3 Addressing modes (5)

| Mode | How the operand/address is found | Example |
|---|---|---|
| Immediate | Operand is inside the instruction | `ADDI $s1,$s2,-5` |
| Register | Operand is in a register | `ADD $s1,$s2,$s3` |
| Base (displacement) | Address = register + sign-extended offset | `LW $s1,5($s2)` |
| PC-relative | Address = PC + 4 + (offset x 4) | `BNE $s1,$s2,5` |
| Pseudodirect | Upper 4 bits of PC joined with 26-bit address x 4 | `J 200` |

![[comparch_images/slide_114.jpg|650]]

### 4.4 Byte and half-word load/store
Memory is bytes, so we need partial loads and stores.

| Instruction | Operation |
|---|---|
| `lb rt, imm(rs)` | RF[rt] = sign-extend( byte at address RF[rs]+signext(imm) ) |
| `lbu rt, imm(rs)` | RF[rt] = {24 zero bits, byte} (zero-extend) |
| `lh rt, imm(rs)` | RF[rt] = sign-extend( half-word ) |
| `lhu rt, imm(rs)` | RF[rt] = {16 zero bits, half-word} |
| `sb rt, imm(rs)` | Mem byte = low 8 bits of RF[rt] |
| `sh rt, imm(rs)` | Mem half-word = low 16 bits of RF[rt] |

Sign extension copies the top bit into the new upper bits (keeps the number's value). Zero extension fills with 0s. The slides leave "datapath and control for these" as an exercise (needs byte-select logic).

### 4.5 Shift instructions (R-type)
Shifts use R-type with op = 0.

| Instruction | Meaning | funct | Notes |
|---|---|---|---|
| `sll rd, rt, shamt` | shift left logical | 0 | fill with 0 on right |
| `srl rd, rt, shamt` | shift right logical | 2 | fill with 0 on left |
| `sra rd, rt, shamt` | shift right arithmetic | 3 | fill with sign bit on left |
| `sllv rd, rt, rs` | variable shift left | 4 | amount in register rs, shamt = 0 |
| `srlv rd, rt, rs` | variable shift right logical | 6 | |
| `srav rd, rt, rs` | variable shift right arithmetic | 7 | |

For constant shifts rs = 0 and the amount sits in shamt. Example: `sll $t0,$s1,4` has rt = 17 ($s1), rd = 8 ($t0), shamt = 4, funct = 0.

![[comparch_images/slide_082.jpg|600]]
![[comparch_images/slide_084.jpg|500]]

### 4.6 Odd instructions: multiply and divide
`mult $t1,$t2` and `div $t1,$t2` have no explicit destination register. They use a separate MUL/DIV unit with two special 32-bit registers **Hi** and **Lo**.
- mult: 64-bit product in Hi:Lo.
- div: quotient in Lo, remainder in Hi.
- Move results with `mflo $t1`, `mfhi $t1`; write them with `mtlo`, `mthi`.

![[comparch_images/slide_131.jpg|600]]

---

## 5. MARS simulator and assembly

MARS is a MIPS simulator (alternative: SPIM). It shows program memory, MIPS registers, data memory and messages.
- A MIPS program in MARS starts at address `0x00400000` (so the PC starts there).
- Useful tools: instruction counter, instruction statistics, **MIPS X-Ray** (animates the datapath), **Branch History Table simulator**.

### 5.1 Directives (instructions to the assembler, not CPU instructions)
`.data` (start data segment), `.text` (start code segment), `.word`, `.half`, `.byte`, `.ascii` (string without null), `.asciiz` (string with null end), `.space n` (reserve n bytes), `.align n`, `.globl` (make label global), `.float`, `.double`, `.eqv`, `.macro/.end_macro`, `.include`.

### 5.2 Common syscalls
Put the service code in `$v0`, arguments in `$a0` etc., then run `syscall`.

| Service | $v0 | Argument / result |
|---|---|---|
| print_int | 1 | $a0 = integer |
| print_float | 2 | $f12 |
| print_double | 3 | $f12 |
| print_string | 4 | $a0 = address of string |
| read_int | 5 | result in $v0 |
| read_float / read_double | 6 / 7 | result in $f0 |
| read_string | 8 | $a0 = buffer address, $a1 = max length |
| sbrk (allocate heap) | 9 | $a0 = bytes, address in $v0 |
| exit | 10 | |
| print_char / read_char | 11 / 12 | |
| file open / read / write / close | 13 / 14 / 15 / 16 | |

### 5.3 Example: min and max of an array in MIPS
Idea (same algorithm as the MinMax processor):
```
.data
array: .word 1, 2, -8, 0, 23, 11, -10
array_size: .word 10         # slide value; array really has 7 elements
minE: .word 999
maxE: .word -999
.text
main:
  la $a0, array              # a0 = address of array
  lw $a1, array_size         # a1 = count
  lw $t2, maxE               # t2 = max
  lw $t3, minE               # t3 = min
loop_array:
  beq $a1, $zero, print_and_exit
  lw  $t0, ($a0)             # current element
  bge $t0, $t3, not_min
  move $t3, $t0              # new min
not_min:
  ble $t0, $t2, not_max
  move $t2, $t0              # new max
not_max:
  addi $a1, $a1, -1          # count--
  addi $a0, $a0, 4           # next word
  j loop_array
```
Then `li $v0,4 / la $a0,label / syscall` prints a label, `li $v0,1 / move $a0,$t2 / syscall` prints a number, `li $v0,10 / syscall` exits.

> [!warning]
> The slide stores size 10 but only 7 numbers, so the loop would read 3 extra words. Use 7 for correct output.

Same algorithm in C: loop over `arr`, `if (arr[i] < minE) minE = arr[i]; if (arr[i] > maxE) maxE = arr[i];`.

---

## 6. Von Neumann model and instruction cycle

### 6.1 Von Neumann (Princeton) model
Five parts:
1. **Memory** (stores instructions and data)
2. **Processing unit** (ALU and registers)
3. **Input**
4. **Output**
5. **Control unit** (contains Instruction Register IR and Program Counter PC)

"Von Neumann architecture" now means **stored-program computer**: program and data live in the **same memory**.
**Harvard architecture**: separate memories for instructions and data.

### 6.2 Instruction cycle (not the same as clock cycle)
Six phases:

| Phase | What happens |
|---|---|
| 1. FETCH | MAR <- PC and PC <- PC+1(word). MDR <- Mem[MAR]. IR <- MDR. |
| 2. DECODE | Decoder examines the opcode to find what to do. |
| 3. EVALUATE ADDRESS | Compute memory address (e.g. sign-extend offset and add). |
| 4. FETCH OPERANDS | Read source operands (e.g. LD reads memory into MDR). |
| 5. EXECUTE | Do the operation (e.g. ALU adds). |
| 6. STORE RESULT | Write result to destination. |

- Each step is done under the control unit; the time for one step is a **machine cycle**.
- After the last phase, the control unit starts the next instruction from FETCH. PC already points to the next sequential instruction, unless something (branch/jump) changes it.
- Not every instruction needs all six phases.
- MAR = memory address register, MDR = memory data register.

![[comparch_images/slide_160.jpg|600]]

---

## 7. Single-cycle datapath

**Datapath** = hardware elements and connections that move and process data. In **single-cycle**, one entire instruction executes in **one clock cycle**.

### 7.1 Fetch-and-execute algorithm in C-like form (what the hardware must do)
Field extraction uses bit masks and shifts:

| Field | Mask bits | Shift |
|---|---|---|
| OPCODE | 31-26 | >> 26 |
| RS | 25-21 | >> 21 |
| RT | 20-16 | >> 16 |
| RD | 15-11 | >> 11 |
| SHIFT | 10-6 | >> 6 |
| OFFSET | 15-0 | none |

```
while (1) {
  switch ((IMM[PC] & OPCODE) >> 26) {
    case R-type: RF[rd] = ALU(RF[rs], RF[rt]); PC = PC + 4;
    case SW:     DMM[ALU(RF[rs], offset)] = RF[rt]; PC = PC + 4;
    case LW:     RF[rt] = DMM[ALU(RF[rs], offset)]; PC = PC + 4;
    case BEQ/BNE: ALU subtracts; if (ZERO) PC = (PC+4) + (offset << 2); else PC = PC + 4;
  }
}
```
IMM = instruction memory, DMM = data memory, RF = register file. The 16-bit offset must be **sign-extended to 32 bits** before the ALU.

### 7.2 Fetch stage
`IMM[PC]; PC = PC + 4`
- PC feeds the instruction memory read address.
- An adder computes PC + 4. **Why 4?** Instructions are 4 bytes and memory is byte addressable, so the next instruction is 4 bytes ahead.

### 7.3 R-type (`ADD $s1,$s2,$s3`)
- rs (25:21) and rt (20:16) go to the register file read ports.
- ALU computes on the two read values. ALUControl comes from the ALU decoder (using funct 5:0 and ALUOp = 10).
- Result is written to rd (15:11). RegWrite = 1.

![[comparch_images/slide_045.jpg|650]]

### 7.4 Load word (`LW $s1, offset($s2)`)
- Address = $s2 + sign-extended offset. The offset is **not** a physical address. It is **relative to a register** (base addressing).
- ALU adds (ALUOp = 00). Data memory is read (MemRead = 1). Value goes to rt (write register is rt). MemtoReg = 1, RegWrite = 1.

![[comparch_images/slide_047.jpg|650]]

### 7.5 Store word (`SW $s1, offset($s2)`)
- Address computed the same way. The value of rt (read data 2) goes to the data memory write data input. MemWrite = 1, RegWrite = 0.

![[comparch_images/slide_049.jpg|650]]

### 7.6 Branch (`BEQ $s1,$s2,offset`; `BNE` is the opposite)
- ALU **subtracts** the two registers (ALUOp = 01). The **Zero** flag is 1 if they are equal.
- Branch target = $PC + 4 + (\text{SignExt(offset)} \ll 2)$.
- **Offset counts instructions**, so we shift left by 2 (multiply by 4) to convert to bytes and keep it aligned to an instruction boundary.
- Branch taken when Branch signal AND Zero (for BNE, the inverse condition) is true.

![[comparch_images/slide_051.jpg|650]]

### 7.7 ADDI (`ADDI $s1,$s2,-12`)
- Same as LW's ALU part, but the ALU result is written straight back to rt (no data memory). ALUSrc = 1, MemtoReg = 0, RegWrite = 1.

![[comparch_images/slide_053.jpg|650]]

### 7.8 Jump (`J addr`)

$$PC = \{PC+4[31:28],\; addr[25:0] \ll 2\}$$

- 26-bit address shifted left 2 gives 28 bits; the top 4 bits come from PC + 4.

![[comparch_images/slide_055.jpg|650]]

### 7.9 Combining all datapaths with multiplexers
When one input can come from more than one source, insert a MUX and control it with a select line:

| MUX / signal | Chooses between |
|---|---|
| RegDst | write register = rt (0) or rd (1) |
| ALUSrc | ALU second input = register data 2 (0) or sign-extended immediate (1) |
| MemtoReg | register write data = ALU result (0) or memory read data (1) |
| Branch AND Zero (PCSrc) | next PC = PC+4 (0) or branch target (1) |
| Jump | next PC = previous choice (0) or jump address (1) |

![[comparch_images/slide_069.jpg|800]]
*(Pink lines show the path a LW instruction takes.)*

### 7.10 Properties of single-cycle
- Instruction memory, register file and data memory are **read combinationally**: when the address changes, the output appears after a propagation delay. Writes happen at the clock edge.
- Control unit is simple: **no next state**, everything happens in one cycle.
- CPI = 1.
- Redundant hardware: two adders (PC+4 and branch) plus separate instruction and data memories.

### 7.11 Resource usage per instruction (slide 68)
How many of the ten units each instruction uses: ADD 6, BNE 8, J 3, SW 7, LW 8, ADDI 7. **LW (and BNE) use the most resources**; LW takes the longest time, so LW decides the clock.

![[comparch_images/slide_068.jpg|650]]

---

## 8. Control for single-cycle

### 8.1 Control signals (9 plus ALUOp)
Jump, RegDst, RegWrite, ALUSrc, Branch, ALUOp (2 bits), MemRead, MemWrite, MemtoReg.

Control unit = **Main decoder** (input: opcode bits 31:26) + **ALU decoder** (inputs: ALUOp and funct 5:0, output: ALUControl).

![[comparch_images/slide_061.jpg|650]]

### 8.2 Main decoder truth table
x = don't care.

| Instr | Jump | RegDst | RegWrite | ALUSrc | Branch | ALUOp1 | ALUOp0 | MemRead | MemWrite | MemtoReg |
|---|---|---|---|---|---|---|---|---|---|---|
| R-type | 0 | 1 | 1 | 0 | 0 | 1 | 0 | 0 | 0 | 0 |
| lw | 0 | 0 | 1 | 1 | 0 | 0 | 0 | 1 | 0 | 1 |
| sw | 0 | x | 0 | 1 | 0 | 0 | 0 | 0 | 1 | x |
| addi | 0 | 0 | 1 | 1 | 0 | 0 | 0 | 0 | 0 | 0 |
| B-type | 0 | x | 0 | 0 | 1 | 0 | 1 | 0 | 0 | x |
| J-type | 1 | x | 0 | x | x | x | x | 0 | 0 | x |

![[comparch_images/slide_062.jpg|650]]

Two ways to implement the table:
- **Hardwired CU**: write each output as a logic expression. Example: ALUSrc = 1 for lw, sw and addi, so $ALUSrc = lw + sw + addi$.
- **Microprogrammed CU**: store the table in a ROM and look it up using the opcode (6 input bits give $2^6$ rows).

### 8.3 ALUOp meaning

| ALUOp | Meaning |
|---|---|
| 00 | add |
| 01 | subtract |
| 10 | look at funct field |
| 11 | not used |

### 8.4 ALU control lines and ALU decoder

| ALUControl | ALU function |
|---|---|
| 0000 | AND |
| 0001 | OR |
| 0010 | add |
| 0110 | subtract |
| 0111 | set on less than (slt) |

| Instruction (opcode) | ALUOp | Operation | funct | ALU action | ALUControl |
|---|---|---|---|---|---|
| LW | 00 | load word | xxxxxx | add | 0010 |
| SW | 00 | store word | xxxxxx | add | 0010 |
| BEQ | 01 | branch equal | xxxxxx | subtract | 0110 |
| R-type | 10 | add | 100000 | add | 0010 |
| R-type | 10 | subtract | 100010 | subtract | 0110 |
| R-type | 10 | AND | 100100 | AND | 0000 |
| R-type | 10 | OR | 100101 | OR | 0001 |
| R-type | 10 | slt | 101010 | set on less than | 0111 |
| ADDI | 00 | immediate | xxxxxx | add | (add, 0010) |
| J | xx | jump | xxxxxx | jump | not needed |

Why two-level decoding: the main decoder only needs the 6-bit opcode and says "add / subtract / look at funct". Only R-type needs the funct field, so the small ALU decoder handles that. This keeps the main table small.

![[comparch_images/slide_066.jpg|650]]

---

## 9. Performance analysis (formulas and worked numbers)

### 9.1 Basic formulas
$$\text{Execution time} = \#\text{instr} \times CPI \times T$$

- **CPI** = clock cycles per instruction. **IPC** = instructions per cycle = $1/CPI$.
- $T$ = clock period; clock frequency $f = 1/T$.
- **Average CPI** = sum over instruction types of (fraction of instructions x CPI of that type).
- **Delay** (single-cycle) = time between applying an input (read an instruction) and being ready for the next input (PC updated with PC+4 or branch address).
- To compare two designs, we need a metric. We use execution time for a program (benchmarks like SPEC, PARSEC, SPLASH-2 are standard programs for this).

### 9.2 Delay table used in all the examples (65 nm CMOS)

| Element | Symbol | Delay (ps) |
|---|---|---|
| Register clock-to-Q | $t_{pcq}$ | 30 |
| Register setup | $t_{setup}$ | 20 |
| Multiplexer | $t_{mux}$ | 25 |
| ALU | $t_{ALU}$ | 200 |
| Memory read | $t_{mem}$ | 250 |
| Register file read | $t_{RFread}$ | 150 |
| Register file write | $t_{RFwrite}$ | 100 |
| Register file setup | $t_{RFsetup}$ | 20 |

### 9.3 Single-cycle clock period (critical path = LW)
Path: PC output -> instruction memory -> register file read -> ALU -> data memory -> mux -> register file setup.

$$T_c = t_{pcq} + 2\,t_{mem} + t_{RFread} + t_{ALU} + t_{mux} + t_{RFsetup}$$
$$T_c = 30 + 2(250) + 150 + 200 + 25 + 20 = 925 \text{ ps}$$

Program of 100 billion instructions:

$$100\times10^{9} \times 1 \times 925\times10^{-12} = 92.5 \text{ s}$$

### 9.4 Multi-cycle clock period and execution time
Clock must cover the slowest single step (memory access):

$$T_c = t_{pcq} + t_{mux} + \max\{t_{ALU} + 2t_{mux},\; t_{mem}\} + t_{setup}$$
$$T_c = 30 + 25 + 250 + 20 = 325 \text{ ps}$$

Program mix: 25% loads, 10% stores, 11% branches, 2% jumps, 52% R-type. Cycles per instruction type: load 5, store 4, R-type 4, branch 3, jump 3.

$$CPI = (0.11 + 0.02)(3) + (0.52 + 0.10)(4) + (0.25)(5) = 4.12$$

$$\text{Time} = 100\times10^{9} \times 4.12 \times 325\times10^{-12} \approx 133.9 \text{ s}$$

> [!note]
> Slide 65 writes Tc = 350 ps, but the calculation (and the 133.9 s result) uses 325 ps. Use 325 ps.

**Conclusion**: multi-cycle (133.9 s) is **slower** than single-cycle (92.5 s) here. Why:
- **Sequencing overhead** ($t_{pcq} + t_{setup}$ = 30 + 20 = 50 ps) is paid in every cycle.
- Steps are **unequal** (memory 250 ps vs others), but every cycle must be as long as the longest step.
- Multi-cycle is still **cheaper** in hardware (shared units) but needs 5 non-architectural registers.

---

## 10. Multi-cycle datapath

### 10.1 Problems of single-cycle that motivate it
- Clock = worst case (LW) for **every** instruction. Not balanced.
- CPI is 1 but cycle is long. Needs extra adders and a second memory.
- Idea: break instruction execution into smaller steps. Simple instructions finish early. This is the **common-case** design principle (balanced datapath).

### 10.2 What changes from single-cycle
1. **One combined instruction and data memory** (a mux **IorD** picks the address: 0 = PC, 1 = ALUOut).
2. **Remove redundant adders**: one ALU is reused for PC+4, branch target and normal arithmetic.
3. Add **non-architectural registers** (not visible to the programmer) to hold values between steps:
   - **IR** (instruction register), **MDR** (memory data register), **A** and **B** (register file outputs), **ALUOut**.
4. Controller (a finite state machine) gives **different control signals in different steps**.
5. **PCWrite** (PC enable): PC should change only in certain steps (not every cycle as in single-cycle).

Key idea: **resource sharing leads to the multi-cycle approach**. Functional units, memory and interconnect are shared between steps.

### 10.3 The multi-cycle algorithm (register transfer form)
```
IR = MM[PC]; PC = ALU(PC, 4);            // fetch
A = RF[rs]; B = RF[rt];                  // decode
R-type: ALUOut = ALU(A, B); RF[rd] = ALUOut;
LW:     ALUOut = A + offset; MDR = MM[ALUOut]; RF[rt] = MDR;
SW:     ALUOut = A + offset; MM[ALUOut] = B;
BEQ:    ALUOut = PC + (offset << 2); ALU(A, B); if (ZERO) PC = ALUOut;
```

### 10.4 Building up the datapath (instruction by instruction)

**Fetch**: `IR = M[PC]; PC = PC + 4`
Signals: IorD = 0, MemRead = 1, IRWrite = 1, ALUSrcA = 0 (PC), ALUSrcB = 01 (constant 4), ALUOp = 00, PCSrc = 00, PCWrite = 1.

![[comparch_images/slide_181.jpg|650]]

**LW** (5 steps): fetch; decode (A = Reg[25:21]); ALUOut = A + SignExt(Imm); MDR = M[ALUOut]; Reg[20:16] = MDR.
Needs **A**, **ALUOut** and **MDR** registers.

![[comparch_images/slide_183.jpg|650]]

**SW** (4 steps): fetch; decode (A and B read); ALUOut = A + SignExt(Imm); M[ALUOut] = B. Needs **B** register.

![[comparch_images/slide_185.jpg|650]]

**R-type** (4 steps): fetch; decode; ALUOut = A op B; Reg[15:11] = ALUOut.

![[comparch_images/slide_187.jpg|650]]

**BEQ** (3 steps): fetch; decode (also computes branch target early: ALUOut = (PC+4) + (SignExt(offset) << 2), useful for branches); ALU subtracts A - B and if Zero = 1 then PC = ALUOut.

![[comparch_images/slide_189.jpg|650]]

**ADDI** (4 steps): fetch; decode; ALUOut = A + SignExt(Imm); Reg[20:16] = ALUOut.

![[comparch_images/slide_191.jpg|650]]

**Jump** (3 steps): fetch; decode; PC = {PC[31:28], LShift(Addr)}.

![[comparch_images/slide_193.jpg|650]]

### 10.5 Combined multi-cycle datapath

![[comparch_images/slide_194.jpg|800]]

Control signals (15 signals, 17 bits):
IorD, Jump, MemWrite, MemRead, IRWrite, RegDst, MemtoReg, RegWrite, ALUSrcA, ALUSrcB[1:0], PCWrite, Branch, PCSrc[1:0], ALUOp[1:0] (plus ALUControl from the ALU decoder).

Meaning of the multi-bit selects:

| Signal | Value | Selects |
|---|---|---|
| IorD | 0 / 1 | memory address = PC / ALUOut |
| ALUSrcA | 0 / 1 | ALU input A = PC / register A |
| ALUSrcB | 00 / 01 / 10 / 11 | B register / constant 4 / SignExt(offset) / SignExt(offset) << 2 |
| PCSrc | 00 / 01 / 10 | ALU result (PC+4) / ALUOut (branch target) / jump address |

---

## 11. Control unit for multi-cycle: FSM, microprogrammed, hardwired

### 11.1 Machine states (FSM)
Each step is a **state** T0 to T10. The controller outputs the control signals for that state and picks the next state.

| State | Step | Operation | Key control signals | Next |
|---|---|---|---|---|
| T0 | Fetch | IR = M[PC]; PC = PC+4 | IorD=0, IRWrite=1, MemRead=1, ALUSrcA=0, ALUSrcB=01, ALUOp=00, PCSrc=00, PCWrite=1 | T1 |
| T1 | Decode | A = Reg[25:21]; B = Reg[20:16]; ALUOut = (PC+4) + (SignExt(off) << 2) | ALUSrcA=0, ALUSrcB=11, ALUOp=00 | depends on opcode |
| T2 | LW/SW/ADDI execute | ALUOut = A + SignExt(off) | ALUSrcA=1, ALUSrcB=10, ALUOp=00 | T3 (LW), T5 (SW), T9 (ADDI) |
| T3 | LW memory | MDR = M[ALUOut] | IorD=1, MemRead=1 | T4 |
| T4 | LW write back | RF[rt] = MDR | RegDst=0, MemtoReg=1, RegWrite=1 | T0 |
| T5 | SW memory | M[ALUOut] = B | IorD=1, MemWrite=1 | T0 |
| T6 | R-type execute | ALUOut = A op B | ALUSrcA=1, ALUSrcB=00, ALUOp (funct decides) | T7 |
| T7 | R-type write back | RF[rd] = ALUOut | RegDst=1, MemtoReg=0, RegWrite=1 | T0 |
| T8 | Branch execute | A - B; if Zero, PC = ALUOut | ALUSrcA=1, ALUSrcB=00, ALUOp=01, Branch=1, PCSrc=01 | T0 |
| T9 | ADDI write back | RF[rt] = ALUOut | RegDst=0, MemtoReg=0, RegWrite=1 | T0 |
| T10 | Jump | PC = {PC[31:28], addr << 2} | Jump=1, PCSrc=10 | T0 |

> [!note]
> The slide lists ALUOp = 00 for R-type T6, but R-type needs the ALU decoder to look at funct (ALUOp = 10 in the single-cycle table).

![[comparch_images/slide_206.jpg|650]]

**Clock cycles per instruction** (path through the FSM):

| Instruction | Cycles | States |
|---|---|---|
| LW | 5 | T0, T1, T2, T3, T4 |
| SW | 4 | T0, T1, T2, T5 |
| R-type | 4 | T0, T1, T6, T7 |
| BEQ | 3 | T0, T1, T8 |
| ADDI | 4 | T0, T1, T2, T9 |
| J | 3 | T0, T1, T10 |

Inputs to the control unit are the same as in single-cycle (opcode, funct), plus the **current state**. ALUOp meanings are the same. There are two ways to generate the signals: **microprogrammed** or **hardwired**.

### 11.2 Microprogrammed control unit
Idea: store the control signals for every state as words in a ROM called the **control memory**. Running an instruction means reading a sequence of these words (microinstructions).

Each microinstruction has:
- **CF (Control Field)**: the 15 control signals (17 bits).
- **NA (Next Address)**: 4 bits (the state count is 13 rows, so 4 bits).
- **M (Mode)**: 0 = use NA as the next address; 1 = use the external address from the **decoding table** (opcode -> start address).

Parts: **CMAR** (control memory address register) holds the current address; a MUX picks next address (NA or external address); **microprogram sequencer** = everything except the control memory.

Decoding table (opcode -> start address): LW 2, SW 5, ADD 7, ADDI 9, J 11, BEQ 12.

How it runs: address 0 (fetch) has NA = 1. Address 1 (decode) has Mode = 1, so the next address comes from the decoding table using the opcode. Then the instruction's microinstructions follow through NA; the last one has NA = 0 to go back to fetch.

![[comparch_images/slide_211.jpg|650]]
![[comparch_images/slide_210.jpg|800]]

The slide asks: can the NextAddress bits be reduced? (Hint: sequential steps could just increment the address, so NA is needed only for jumps.)

### 11.3 Hardwired control unit
Idea: build the controller from **logic gates**. Inputs: decoded opcode and the current state.
- **IDCD** (instruction decoder, 6 to $2^6$): decodes the opcode into one line per instruction.
- **Counter** (3 bits) holds the state number; **SDCD** (state decoder, 3 to $2^3$) turns it into lines T0, T1, ... 
- Counter has **INCR** (go to next state), **CLR** (go back to T0), and **CLK**. It is not loadable; it only counts up or clears.
- The Control Unit (combinational logic) combines instruction lines and state lines to make the control signals.

In this version the states are shared by all instructions, so only a few state numbers exist (T0 fetch, T1 decode, T2 or T3 execute, T3 memory, T4 write back). The instruction decoder tells which instruction we are in. The counter needs **3 bits** because states go up to T4.

![[comparch_images/slide_213.jpg|650]]
![[comparch_images/slide_214.jpg|650]]

Signals are written as sum of products of state and instruction. Examples from the slide:
- $Jump = T2 \cdot J$
- $MemWrite = T3 \cdot SW$
- $INCR = T0 + T1 + T2\cdot LW + T3\cdot LW + T2\cdot SW + \dots$
- $CLR = T4\cdot LW + T3\cdot SW + \dots$

General comparison (general knowledge, not on the slides): hardwired is faster but harder to change; microprogrammed is slower but easier to modify and extend.

### 11.4 Processor with limited interconnect (single bus) example
Slides 70 to 73 ask you to design a processor (LW, SW, ADDI, ADD, BNE) when there is **one read port / shared bus**. Since only one value can move per cycle, instructions need many more states (up to T29). Fetch in that design:

| State | Operation | Signals |
|---|---|---|
| T0 | MAR = PC; A = PC | PCOut=1, MARIn=1, Ain=1 |
| T1 | MDR = Mem[MAR]; B = 4 | mdrMuxSel=0, MDRIn=1, Bin=1, ALUOp=00 |
| T2 | ALUOut = A + B | ALUOutIn=1 |
| T3 | PC = ALUOut | PCIn=1, ALUROut=1 |
| T4 | IR = MDR | MDROut=1, IRIn=1 |

The slides also show a CISC-style processor organization (Hamacher): a single-bus and a three-bus version.

![[comparch_images/slide_231.jpg|600]]

---

## 12. Single-cycle vs multi-cycle

| Point | Single-cycle | Multi-cycle |
|---|---|---|
| Clock period | long (slowest instruction, LW) | short (slowest step, memory) |
| CPI | 1 | average > 1 (4.12 in example) |
| Hardware | separate adders and memories (not shared) | shared ALU and one memory |
| Non-architectural registers | none | IR, MDR, A, B, ALUOut |
| Control unit | simple, no next state | FSM (hardwired or microprogrammed) |
| Time per instruction | same for all | different per instruction type |

$T_{multi} < T_{single}$, but $CPI_{multi} > CPI_{single}$.

Problems of multi-cycle:
- Splitting LW into 5 steps does **not** give a 5 times faster clock (ideal 925/5 = 185 ps, real 325 ps) because steps take unequal time.
- At any time only **one stage is busy and the rest idle**.
- Needs 5 extra non-architectural registers and an additional mux.

Slide question: can we get IPC = 1 and a clock period shorter than $T_{multi}$? Yes: **pipelining**.

Improving the clock by splitting logic (slide 166): put registers in the middle of long combinational logic. Clock period becomes the max of the parts, $T = \max\{(src_1, dst_1), (src_2, dst_2), \dots\}$. Splitting into two equal halves halves T (frequency doubles). So place registers so each part takes nearly equal time. (This alone is not pipelining.)

![[comparch_images/slide_166.jpg|650]]

---

## 13. Pipelining

### 13.1 Objective
Design a processor with
- clock period **less than single-cycle** (similar to multi-cycle), and
- **CPI = 1** (IPC = 1).

### 13.2 Idea (analogy)
A chemical plant: water goes through filter, then mixer, then boiler. While one batch is in the mixer, the next batch is already in the filter. Every unit is busy all the time.

For instructions: split the instruction into stages. While instruction 1 is in stage 2, instruction 2 is in stage 1.

![[comparch_images/slide_244.jpg|600]]

Conditions for pipelining a function:
- Partition it into subfunctions.
- Input of one subfunction comes **entirely** from the output of the previous one.
- No other relation between subfunctions.
- Hardware stage for each subfunction, each taking **about equal time**.

### 13.3 Five-stage MIPS pipeline
1. **IF** Instruction fetch (instruction memory)
2. **ID** Instruction decode and register read (register file)
3. **EX** Execute (ALU)
4. **MEM** Data memory read or write
5. **WB** Write back to register file

Stage registers sit between stages: **IF/ID, ID/EX, EX/MEM, MEM/WB**. They hold the data and (later) the control signals that belong to the instruction in that stage.

**Latency of one instruction is not reduced** (it can get longer), but **throughput is ideally 5 times better**.

Rule for register file and stage registers (slide 274): register file writes on the positive clock edge and stage registers write on the negative edge.

### 13.4 Timing comparison (delays: IM 250, RF read 150, ALU 200, DM 250, RF write 100; mux and register delay ignored)

| Quantity | Single-cycle | Pipelined |
|---|---|---|
| Clock / stage length | whole instruction = 250+150+200+250+100 = 950 ps | slowest stage = 250 ps (memory access) |
| Instruction latency | 950 ps | 5 x 250 = 1250 ps |
| Throughput | 1 instr per 950 ps = 1.05 billion/s | 1 instr per 250 ps = 4 billion/s |

Speedup in throughput = 950 / 250 = 3.8 (ideal would be 5, lost because stages are unequal).

![[comparch_images/slide_249.jpg|700]]

![[comparch_images/slide_251.jpg|700]]
*(Resource utilization: a different instruction occupies each stage in each cycle.)*

![[comparch_images/slide_252.jpg|650]]

### 13.5 Datapath per instruction in the pipeline
For each instruction type, draw its path through the stages and note what has to travel with it in the stage registers (for example, the destination register number must be carried all the way to WB; store data B must be carried to MEM). The combined datapath is the **union** of these, with multiplexers added for shared inputs. The slides show R-type, BEQ, J, LW, SW and LW with R-type in the same pipeline.

![[comparch_images/slide_260.jpg|800]]

### 13.6 Control for the pipeline
- The 9 control signals (Jump, RegDst, RegWrite, ALUSrc, Branch, ALUOp, MemRead, MemWrite, MemtoReg) are used in different stages: ALUSrc, ALUOp, RegDst in **EX**; Branch, MemRead, MemWrite in **MEM**; MemtoReg, RegWrite in **WB**.
- Generate all signals in the **decode** stage (as in single-cycle, same main decoder table).
- **Problem**: while instruction i is in EX, instruction i+1 is in decode and generates its own signals, which could overwrite i's signals. Result: wrong control signals.
- **Solution**: **extend the pipeline registers to carry the control signals** along with the data (a "control pipeline" next to the "data pipeline").

| Pipeline register | Control bits carried |
|---|---|
| ID/EX | 9 bits: RegWrite, MemtoReg, MemWrite, MemRead, Branch, ALUOp[1:0], ALUSrc, RegDst |
| EX/MEM | 5 bits: RegWrite, MemtoReg, MemWrite, MemRead, Branch |
| MEM/WB | 2 bits: RegWrite, MemtoReg |

Each stage uses the bits it needs and passes the rest on. Signal names get a suffix for the stage (RegWriteD, RegWriteE, RegWriteM, RegWriteW). Jump is handled in the decode stage (JumpD).

![[comparch_images/slide_270.jpg|650]]

### 13.7 Designing an ISA for pipelining (why MIPS pipelines easily)
- All instructions have the **same length** (MIPS 4 bytes). x86 varies from 1 to 15 bytes, which makes fetch and decode harder.
- Few addressing modes.
- Memory operands appear **only in loads and stores**.
- Operands are **aligned** in memory.

### 13.8 Comparison of datapaths
- Single-cycle: one combinational block, only one instruction in the datapath at a time.
- Multi-cycle: also one instruction at a time (only one stage busy).
- Pipeline: the combinational logic is cut into stages by registers, so up to 5 instructions are in the datapath at once.

### 13.9 Design trade-offs: interconnect vs functional units vs IPC

| | Few functional units (FUs) | Many FUs |
|---|---|---|
| **Few buses (interconnect)** | Single bus and single FU: multi-cycle, IPC < 1 | Single bus and many FUs: multi-cycle, IPC < 1 |
| **Many buses** | Many buses and single FU: multi-cycle, IPC < 1 | Many buses and many FUs: single-cycle or pipeline, IPC = 1 |

- Pipeline takes **IPC = 1 from single-cycle** and the **shorter clock from multi-cycle**; buses and FUs are shared by more than one instruction at a time.
- Program execution time:

$$\text{Time} = \#\text{instr} \times \frac{1}{IPC} \times T$$

![[comparch_images/slide_273.jpg|650]]

---

## 14. IPC greater than 1: superscalar and VLIW

To get IPC > 1, issue more than one instruction per cycle (**multiple issue**). Two approaches: **Superscalar** and **VLIW**.

- **IPC = 2**: two instructions fetched and issued each cycle. **IPC = 3**: three-issue.
- In-order superscalar: the instructions run in parallel in several copies of the pipeline. This is **spatial parallelism** (more hardware side by side), whereas pipelining is temporal (overlap in time).

![[comparch_images/slide_278.jpg|550]]

### 14.1 Static multiple issue (VLIW: Very Long Instruction Word)
- Example two-issue MIPS: slot 1 = integer ALU or branch operations (ADD, BNE ...), slot 2 = data transfer (LW, SW). Each slot has its own datapath.
- Two instructions are packaged as one long instruction. If a slot cannot be used, the compiler fills it with a **no-op**. So instructions always issue in pairs.
- **The compiler** does the scheduling. In some designs the compiler takes full responsibility for removing all hazards, scheduling the code and inserting no-ops, so the hardware needs no hazard detection or stalls.
- Extra hardware for double issue: another 32 bits fetched from instruction memory, **two more read ports and one more write port** on the register file, and another ALU (or adder for address calculation).

![[comparch_images/slide_282.jpg|650]]

### 14.2 Dynamic multiple issue (superscalar)
The **hardware** decides at run time which instructions to issue together. Techniques named on the slides: **Scoreboard** and **Tomasulo**.

### 14.3 Superscalar vs VLIW

| Point | Superscalar | VLIW |
|---|---|---|
| Scheduling | Dynamic (hardware, run time) | Static (compiler, compile time) |
| Hazard detection | Hardware | Compiler (mostly) |
| Instruction format | Normal instructions | Special long instruction with fixed slots |
| Compatibility | Same code runs on different machines | Code must be recompiled for each different VLIW processor |

---

## 15. ISA and processor design steps

1. **Find the instructions** needed for the algorithm(s).
2. **Microarchitecture**: choose the strategy (shared bus / single-cycle / multi-cycle / in-order pipeline ...). Design the datapath and components for each instruction.
3. **Combine** the datapaths of all instructions (using MUXes).
4. **Clock period** from the critical path (timing analysis). Add setup time, clk-to-Q and so on; meet hold constraints.
5. **Identify the control signals** on the combined datapath.
6. **Design the control unit** (hardware FSM or microprogram) for the chosen strategy.
7. **Test and verify** the processor.

Single-purpose processors (like MinMax) follow the same flow; pipelining can also be applied to them (recordings are on Google Classroom).

---

## 16. Formula sheet and exam quick reference

### 16.1 Formulas

| Item | Formula |
|---|---|
| Setup check | $T > t_{cq} + T_L + t_{su}$ |
| Hold check | $t_{cq} + T_L > t_h$ |
| Clock period | $T = \max_i T_i$ over register pairs |
| Execution time | $\#\text{instr} \times CPI \times T$ |
| IPC | $1/CPI$ |
| Avg CPI | $\sum_i f_i \cdot CPI_i$ |
| Single-cycle T | $t_{pcq} + 2t_{mem} + t_{RFread} + t_{ALU} + t_{mux} + t_{RFsetup}$ = 925 ps |
| Multi-cycle T | $t_{pcq} + t_{mux} + \max\{t_{ALU}+2t_{mux}, t_{mem}\} + t_{setup}$ = 325 ps |
| Branch target | $PC + 4 + (\text{SignExt(offset)} \ll 2)$ |
| Jump target | $\{PC+4[31:28],\; addr[25:0] \ll 2\}$ |
| Pipeline throughput | 1 instruction per slowest-stage time |
| Pipeline latency | stages x slowest-stage time |

### 16.2 Cycle counts (multi-cycle)
LW 5, SW 4, R-type 4, ADDI 4, BEQ 3, J 3.

### 16.3 Numbers to remember
- Single-cycle: Tc = 925 ps, CPI = 1, 92.5 s for 100 billion instructions.
- Multi-cycle: Tc = 325 ps, CPI = 4.12, 133.9 s.
- Pipelined: stage = 250 ps, throughput 4 billion instr/s (vs 1.05 billion for single-cycle), latency 1250 ps (vs 950 ps).

### 16.4 One-line answers
- **Why is the offset in LW not a physical address?** It is relative to a base register.
- **Why shift the branch offset by 2?** Offset counts instructions; each is 4 bytes.
- **Why PC + 4?** Instructions are 4 bytes and memory is byte addressable.
- **Why is single-cycle control simple?** No next state; everything is done in one cycle.
- **Why is multi-cycle slower in the example?** Per-cycle overhead (50 ps) plus unequal steps.
- **Why does pipelining not give exactly 5 times speedup?** Stages are unequal; clock = slowest stage.
- **Why store control signals in pipeline registers?** Otherwise the next instruction's decode overwrites the current instruction's signals.
- **Why is MIPS easy to pipeline?** Fixed instruction length, few addressing modes, memory access only in load/store, aligned operands.
- **Difference: latency vs throughput?** Latency = time for one instruction; throughput = instructions finished per second. Pipelining improves throughput, not latency.

---

## 17. Homework and practice questions from slides

1. Design a single-purpose processor that does only bubble sort.
2. Design a general processor for ADD, SUB, LW, SW, BNE with an instruction memory, a data memory, 32 registers, and R0 always 0.
3. Write a MIPS program that generates 7 Fibonacci numbers, with the first two stored at memory locations `a` and `b`.
4. Datapath and control for `lb`, `lbu`, `lh`, `lhu`, `sb`, `sh`.
5. Cycles and CPI on the multi-cycle MIPS for:
   ```
   addi $s1, $s2, 5
   sub  $t0, $t1, $t2
   lw   $t3, 15($s1)
   sw   $t5, 72($t0)
   or   $t2, $s4, $s5
   ```
   Worked answer using the cycle table: addi 4 + sub 4 + lw 5 + sw 4 + or 4 = **21 cycles**, so CPI = 21 / 5 = **4.2**.
6. Write C++ programs that simulate, at functional level, ADD, LW, SW, BEQ, ADDI and J for single-cycle and multi-cycle datapaths. Also a C++ model of a microprogrammed control unit for MIPS.
7. Design the 32-bit MIPS processor (LW, SW, ADDI, ADD, BNE) with a single read port: fill in the state tables (T0 to T29).
8. Design the pipelined MIPS in Verilog and C++. Convert the MinMax processor into a pipelined MinMax and design it.
9. How does Intel run CISC-type (x86) code on a RISC-style pipeline? (Hint, general knowledge: the hardware translates each x86 instruction into simpler RISC-like micro-operations that then flow through the pipeline.)
10. Performance question pattern: given the delay table, find Tc and execution time for single-cycle, multi-cycle (with an instruction mix) and pipeline. Practice with the numbers in section 9.
