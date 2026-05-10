# Chapter 12: Interrupts - Intel Microprocessors
## Exhaustive Exam-Ready Study Notes

---

## Table of Contents

1. [Purpose and Concept of Interrupts](#1-purpose-and-concept-of-interrupts)
2. [Interrupt Vector Table (IVT)](#2-interrupt-vector-table-ivt)
3. [Dedicated Interrupt Types (TYPE 0 - TYPE 18)](#3-dedicated-interrupt-types-type-0---type-18)
4. [Software Interrupt Instructions](#4-software-interrupt-instructions)
5. [Real Mode Interrupt Operation](#5-real-mode-interrupt-operation)
6. [Protected Mode Interrupt Operation](#6-protected-mode-interrupt-operation)
7. [Interrupt Flag Bits: IF and TF](#7-interrupt-flag-bits-if-and-tf)
8. [Hardware Interrupts: NMI and INTR](#8-hardware-interrupts-nmi-and-intr)
9. [INTR and INTA Handshake: Two-Pulse Mechanism](#9-intr-and-inta-handshake-two-pulse-mechanism)
10. [Expanding the Interrupt Structure](#10-expanding-the-interrupt-structure)
11. [8259A Programmable Interrupt Controller](#11-8259a-programmable-interrupt-controller)
12. [8259A Internal Architecture](#12-8259a-internal-architecture)
13. [8259A Pin Descriptions](#13-8259a-pin-descriptions)
14. [8259A Triggering Modes](#14-8259a-triggering-modes)
15. [SP/EN Pin: Buffered vs Non-Buffered Mode](#15-spen-pin-buffered-vs-non-buffered-mode)
16. [Cascade Signals: CAS0-CAS2](#16-cascade-signals-cas0-cas2)
17. [Initialization Command Words (ICW): Bit-Level Detail](#17-initialization-command-words-icw-bit-level-detail)
18. [Operation Command Words (OCW): Bit-Level Detail](#18-operation-command-words-ocw-bit-level-detail)
19. [8259A Status Registers: IRR, ISR, IMR](#19-8259a-status-registers-irr-isr-imr)
20. [8259A Programming Example: 16550 UART](#20-8259a-programming-example-16550-uart)
21. [Cascading Multiple 8259As](#21-cascading-multiple-8259as)
22. [Real-Time Clock Applications](#22-real-time-clock-applications)
23. [Interrupt-Processed Keyboard](#23-interrupt-processed-keyboard)
24. [Storing an Interrupt Vector: Hooking](#24-storing-an-interrupt-vector-hooking)
25. [Quick-Reference Summary Tables](#25-quick-reference-summary-tables)

---

## 1. Purpose and Concept of Interrupts

### Problem with Polling

- In polling (e.g., the 82C55 keyboard example from Chapter 11), the CPU continuously checks the IBF (Input Buffer Full) bit of the peripheral to detect data availability.
- If a typist types 1 character per second, the CPU wastes an entire second between keystrokes doing nothing useful.
- This is an extreme waste of CPU time for slow peripheral devices.

### What Interrupts Solve

- Interrupt processing allows the CPU to execute other software while waiting for a slow peripheral.
- When the peripheral is ready (e.g., a key is pressed), it generates a hardware signal that interrupts the CPU.
- The CPU saves its current state, runs a short Interrupt Service Procedure (ISP), then resumes where it left off.
- Example: A typist can type a document while the CPU simultaneously prints a report - both driven by interrupts.

### Time Line Concept (Figure 12-1)

- The main program runs continuously.
- Keyboard interrupt fires -> ISP executes briefly -> returns to main program.
- Printer interrupt fires -> ISP executes briefly -> returns to main program.
- Both ISPs take very little time to execute compared to the main program's run time.

### Key Definition

> An interrupt is a hardware-initiated procedure that interrupts whatever program is currently executing.

---

## 2. Interrupt Vector Table (IVT)

### Location in Memory

- The IVT occupies the first 1024 bytes of memory: addresses 000000H to 0003FFH.
- It contains exactly 256 four-byte interrupt vectors.
- This layout is fixed in real mode for all Intel family members.

### Structure of a Single Interrupt Vector

Each 4-byte vector contains the full far address of the ISP:

```
Byte 0 (lowest address): Offset (low byte)
Byte 1:                  Offset (high byte)
Byte 2:                  Segment (low byte)
Byte 3 (highest):        Segment (high byte)
```

- The first two bytes = offset address of the ISP.
- The last two bytes = segment address of the ISP.

### Finding a Vector's Address

Formula: **Vector address = type number x 4**

Examples:
- INT 5 -> 5 x 4 = 20 = 14H. Vector occupies addresses 0014H to 0017H.
- INT 40H -> 40H x 4 = 100H. Vector occupies addresses 0100H to 0103H.
- INT 80H -> 80H x 4 = 200H. Vector occupies addresses 0200H to 0203H.

### Reserved vs User Vectors

- Types 0 to 31 (00H to 1FH): Reserved by Intel for internal use and future expansion across the entire Intel family.
- Types 32 to 255 (20H to FFH): Available as user interrupt vectors (224 vectors total).

### Compatibility Notes

- The first 5 vectors (TYPE 0 to TYPE 4) are identical across all Intel family members from the 8086 to the Pentium.
- Additional vectors (TYPE 5 onward) for the 80286 are upward-compatible to the 80386/486/Pentium-Core2 but are NOT downward-compatible to the 8086/8088.

---

## 3. Dedicated Interrupt Types (TYPE 0 - TYPE 18)

### TYPE 0 - Divide Error
- Triggered when: A division result overflows or a program attempts to divide by zero.
- Return address points to the offending instruction (allows retry).

### TYPE 1 - Single-Step (Trap)
- Triggered when: TF (trap flag) = 1, occurs after every instruction executes.
- Upon acceptance: TF is automatically cleared so the ISP itself runs at full speed.
- Used for: Instruction-by-instruction debugging (single-step tracing).
- Return address points to the offending instruction.

### TYPE 2 - Non-Maskable Interrupt (NMI)
- Triggered when: A logic 1 is applied to the NMI hardware input pin.
- Cannot be disabled (non-maskable) - the IF flag has no effect on NMI.
- Used for: Parity errors, power failures, and other critical system faults.

### TYPE 3 - 1-Byte Breakpoint (INT 3)
- Triggered by: The special 1-byte INT 3 instruction.
- Used for: Inserting breakpoints into programs during debugging. Its 1-byte size makes it easy to insert anywhere.

### TYPE 4 - Overflow (INTO)
- Triggered by: The INTO instruction when OF (overflow flag) = 1.
- If OF = 0: INTO does nothing; execution continues normally.

### TYPE 5 - BOUND
- Triggered by: The BOUND instruction when a register value is outside a memory-defined range.
- The BOUND instruction checks: lower_bound <= register <= upper_bound.
- If within bounds: No interrupt.
- If out of bounds: TYPE 5 interrupt fires.
- Return address points to the offending instruction.

### TYPE 6 - Invalid (Undefined) Opcode
- Triggered when: An undefined opcode is encountered in the instruction stream.
- Return address points to the offending instruction.

### TYPE 7 - Coprocessor Not Available
- Triggered when: An ESC or WAIT instruction executes, but the coprocessor is not present (as indicated by the MSW/CR0 coprocessor control bits).
- Return address points to the offending instruction.

### TYPE 8 - Double Fault
- Triggered when: Two separate interrupt conditions occur during the same instruction.
- Return address points to the offending instruction.
- Also pushes an error code (value 0) onto the stack.

### TYPE 9 - Coprocessor Segment Overrun
- Triggered when: An ESC instruction's memory operand extends beyond offset FFFFH in real mode.

### TYPE 10 - Invalid Task State Segment
- Protected mode only.
- Triggered when: The TSS (Task State Segment) is invalid because the segment limit field is not 002BH or higher.
- Typically caused by an uninitialized TSS.
- Pushes an error code identifying the selector.

### TYPE 11 - Segment Not Present
- Protected mode only.
- Triggered when: The P bit (present bit) in a segment descriptor = 0, indicating the segment is not in memory.
- Pushes an error code identifying the selector.

### TYPE 12 - Stack Segment Overrun
- Protected mode only.
- Triggered when: The stack segment is not present (P = 0) OR the stack segment limit is exceeded.
- Pushes an error code identifying the selector.

### TYPE 13 - General Protection Fault
- Protected mode only (80286 through Core2).
- These appear in Windows as "General Protection Faults."
- Triggered by any of the following protection violations:
  - (a) Descriptor table limit exceeded
  - (b) Privilege rules violated
  - (c) Invalid descriptor segment type loaded into a segment register
  - (d) Write to a read-protected code segment
  - (e) Read from an execute-only code segment
  - (f) Write to a read-only data segment
  - (g) Segment limit exceeded
  - (h) CPL = IOPL when executing privileged instructions: CTS, HLT, LGDT, LIDT, LLDT, LMSW, LTR
  - (i) CPL > IOPL when executing: CLI, IN, INS, LOCK, OUT, OUTS, STI
- Pushes an error code identifying the selector (0 if no selector involved).

### TYPE 14 - Page Fault
- 80386, 80486, and Pentium-Core2 only.
- Triggered when: Any page fault during memory or code access in paged mode.

### TYPE 16 - Coprocessor Error
- 80386, 80486, and Pentium-Core2 only.
- Triggered when: A coprocessor error (ERROR pin = 0) occurs for ESCape or WAIT instructions.

### TYPE 17 - Alignment Check
- 80486 and Pentium-Core2 only.
- Triggered when: Word or doubleword data are addressed at an odd memory location (misaligned access).

### TYPE 18 - Machine Check
- Pentium-Core2 only.
- Triggered when: A machine check condition activates the system memory management mode interrupt.

### Critical Exam Note: Return Address Behavior

These types push a return address that points BACK to the offending instruction (not the next instruction):
- TYPE 0, 5, 6, 7, 8, 10, 11, 12, and 13.
- This allows the ISP to potentially correct the error and retry.

All other interrupts push a return address pointing to the NEXT instruction after where the interrupt occurred.

---

## 4. Software Interrupt Instructions

### Overview

Five software interrupt instructions:

| Instruction | Type | Notes |
|-------------|------|-------|
| INT n       | Software | 2-byte instruction; calls ISP at vector n |
| INT 3       | Software | 1-byte breakpoint instruction |
| INTO        | Conditional | Calls TYPE 4 vector if OF = 1 |
| BOUND       | Conditional | Calls TYPE 5 vector if out of bounds |
| IRET / IRETD / IRETQ | Return | Returns from any interrupt |

### INT n Instruction

- Stored as 2 bytes: opcode byte + type number byte.
- Calls the ISP whose address is in vector n.
- Vector address = n x 4.
- Example: INT 80H calls the ISP at vector address 200H (80H x 4 = 200H), stored at locations 0200H-0203H.

### INT 3 Instruction

- Special 1-byte encoding (unlike all other INT instructions).
- Uses TYPE 3 vector.
- Specifically designed for breakpoint insertion: easy to splice into any location in code.

### INTO Instruction

- Checks OF (overflow flag).
- If OF = 1: Calls the ISP at TYPE 4 vector.
- If OF = 0: No operation; next instruction executes normally.

### BOUND Instruction

- Syntax: BOUND reg, mem
- Example: BOUND AX, DATA
  - Checks: DATA/DATA+1 (lower bound) <= AX <= DATA+2/DATA+3 (upper bound).
  - If AX < lower bound OR AX > upper bound: TYPE 5 interrupt.
  - If within bounds: No interrupt.

### IRET / IRETD / IRETQ

- IRET: Used in real mode for all Intel family members.
- IRETD: Used in 80386-Core2 protected mode (pops 32-bit EFLAGS and 32-bit EIP).
- IRETQ: Used in Pentium 4 64-bit mode (pops EFLAGS into RFLAGS; 64-bit return address into RIP).

Stack cleanup by IRET (real mode): Removes 6 bytes total:
- 2 bytes for IP
- 2 bytes for CS
- 2 bytes for FLAGS

IRET is like a far RET but additionally pops the FLAGS register from the stack. This is what automatically re-enables IF and TF to their pre-interrupt state.

---

## 5. Real Mode Interrupt Operation

### Priority Order of Interrupt Checking

When the CPU finishes executing a current instruction, it checks for interrupts in this exact order:

1. Instruction executions (divide errors, invalid opcodes, etc.)
2. Single-step (TYPE 1, if TF = 1)
3. NMI (TYPE 2)
4. Coprocessor segment overrun (TYPE 9)
5. INTR (maskable hardware interrupt, if IF = 1)
6. INT instructions (software interrupts)

### Interrupt Acceptance Sequence (5 Steps)

When one or more interrupt conditions are detected, the CPU performs these steps in order:

1. Push FLAGS register onto stack.
2. Clear both IF and TF. (Disables the INTR pin and single-step feature for the duration of the ISP.)
3. Push CS register onto stack.
4. Push IP register onto stack.
5. Fetch the interrupt vector (4 bytes) and load IP (offset) and CS (segment) from it. Execution jumps to the ISP.

### Post-Interrupt Return (IRET)

- IRET pops IP, CS, and FLAGS from the stack (in reverse order of pushing).
- FLAGS restoration automatically re-enables IF (if it was set before the interrupt) and restores TF.
- Net effect: The pre-interrupt state is completely restored on IRET.

### Error Code on Stack

- Protected mode interrupts TYPE 8, 10, 11, 12, and 13 additionally push an error code after the return address.
- The error code identifies the selector that caused the fault.
- If no selector is involved, error code = 0.

---

## 6. Protected Mode Interrupt Operation

### Interrupt Descriptor Table (IDT)

- Replaces the real-mode IVT in protected mode.
- Contains 256 interrupt descriptors (not 4-byte vectors).
- Each descriptor is 8 bytes long.
- Total size: 256 x 8 = 2048 bytes (2K).
- Located at any memory address (not fixed at 000000H).
- Base address stored in IDTR (Interrupt Descriptor Table Register).

### Interrupt Descriptor Contents (8 bytes, Figure 12-3)

```
Bytes 7-6: Offset (A31-A16) - high 16 bits of 32-bit offset
Byte 5:    P | DPL | 0 1 1 1 0 | 0 0 H
Bytes 3-2: Segment selector
Bytes 1-0: Offset (A15-A0) - low 16 bits of 32-bit offset
```

Fields:
- P bit: Present bit (1 = descriptor is valid/present).
- DPL: Descriptor Privilege Level (controls who can call this interrupt).
- Segment selector: Identifies the code segment containing the ISP.
- 32-bit offset: Full offset address of the ISP within that segment.

### Converting Real Mode to Protected Mode

- Copy ISP addresses from real-mode IVT.
- Convert to 32-bit offsets for the IDT descriptors.
- A single selector in the GDT can identify the first 1MB of memory as the interrupt segment, allowing reuse of real-mode ISPs.

### Operational Equivalence

- Interrupt type assignments are identical between real mode and protected mode.
- Return from both modes uses IRET (real mode) or IRETD (protected mode 80386-Core2).
- In 64-bit mode (Pentium 4/Core2): IRETQ must be used. This is why separate 64-bit drivers and operating systems exist.

---

## 7. Interrupt Flag Bits: IF and TF

### IF (Interrupt Flag) - Bit 9 of FLAGS

| IF Value | Effect |
|----------|--------|
| IF = 1   | INTR pin is enabled; maskable hardware interrupts are accepted |
| IF = 0   | INTR pin is disabled; maskable hardware interrupts are ignored |

- Set by STI instruction.
- Cleared by CLI instruction.
- Automatically cleared when any interrupt is accepted (to prevent nested interrupts by default).
- Automatically restored by IRET.
- NMI is NEVER affected by IF.

### TF (Trap Flag) - Bit 8 of FLAGS

| TF Value | Effect |
|----------|--------|
| TF = 1   | TYPE 1 (single-step) interrupt fires after each instruction |
| TF = 0   | Normal execution; no single-stepping |

- No dedicated STT or CLT instruction exists.
- Must be set/cleared by manipulating the FLAGS image on the stack from within an ISP.
- Automatically cleared when the TYPE 1 interrupt is accepted (so the ISP itself runs at full speed).
- Automatically restored by IRET (which restores the pre-interrupt FLAGS).

### TRON Procedure: Enabling the Trap Flag (Example 12-1)

```asm
TRON PROC FAR USES AX BP
    MOV BP, SP          ; point BP at stack top
    MOV AX, [BP+8]      ; retrieve FLAGS from stack (above saved AX, BP, CS, IP)
    OR  AH, 1           ; set bit 8 (TF) in AH (AH = high byte of FLAGS)
    MOV [BP+8], AX      ; write modified FLAGS back to stack
    IRET                ; IRET restores FLAGS with TF=1 -> tracing begins
TRON ENDP
```

### TROFF Procedure: Disabling the Trap Flag (Example 12-2)

```asm
TROFF PROC FAR USES AX BP
    MOV BP, SP          ; point BP at stack top
    MOV AX, [BP+8]      ; retrieve FLAGS from stack
    AND AH, 0FEH        ; clear bit 8 (TF) in AH (AND with 11111110b)
    MOV [BP+8], AX      ; write modified FLAGS back
    IRET                ; IRET restores FLAGS with TF=0 -> tracing stops
TROFF ENDP
```

### Stack Layout Inside an ISP Using USES AX BP

When inside the ISP after `MOV BP, SP`:
```
[BP+0]  = saved BP (by USES)
[BP+2]  = saved AX (by USES)
[BP+4]  = IP (pushed by interrupt)
[BP+6]  = CS (pushed by interrupt)
[BP+8]  = FLAGS (pushed by interrupt) <- target for TF manipulation
```

### TRACE Procedure: Single-Step Register Logging (Example 12-3)

- Responds to TYPE 1 (trap) interrupt.
- Called after each instruction executes between INT 40H (TRON) and INT 41H (TROFF).
- Saves all 8 general-purpose 32-bit registers (EAX through EDI) into an array REGS (8 x DD = 32 bytes).

```asm
REGS    DD  8 DUP(?)    ; 32 bytes to hold 8 registers

TRACE   PROC FAR USES EBX
    MOV EBX, OFFSET REGS
    MOV [EBX],    EAX   ; save EAX
    POP EAX             ; retrieve actual EBX from stack (USES pushed it)
    PUSH EAX
    MOV [EBX+4],  EAX   ; save EBX (retrieved)
    MOV [EBX+8],  ECX
    MOV [EBX+12], EDX
    MOV [EBX+16], ESP
    MOV [EBX+20], EBP
    MOV [EBX+24], ESI
    MOV [EBX+28], EDI
    IRET
TRACE   ENDP
```

---

## 8. Hardware Interrupts: NMI and INTR

### Two Hardware Interrupt Pins

| Pin | Type | Maskable? | Triggered by |
|-----|------|-----------|-------------|
| NMI | Non-maskable | No | Positive edge (0-to-1) on NMI pin |
| INTR | Maskable | Yes (via IF) | Logic 1 level held on INTR pin |

There is also the INTA (active-low) output pin used to acknowledge INTR.

### NMI - Non-Maskable Interrupt

- Always generates TYPE 2 interrupt (internally decoded; no vector number needed from bus).
- Edge-triggered: Fires on the 0-to-1 transition of the NMI pin.
- After the positive edge, the NMI pin must remain at logic 1 until recognized.
- Before the positive edge can be recognized, NMI must have been at logic 0 for at least two clock periods.

### NMI Use Cases

1. Memory parity errors.
2. Power failure detection.
3. Other critical system faults.

### Power Failure Detection Circuit (Figure 12-6)

- An optical isolator isolates from the 120V AC line.
- Output is shaped by a 74ALS14 Schmitt-trigger inverter, producing a 60 Hz pulse train.
- This 60 Hz train drives the TRIGGER input of a 74LS122 retriggerable monostable multivibrator.
- R and C are chosen so the 74LS122 output pulse width = 33 ms (approximately 2 AC periods).
- While AC power is present: 74LS122 is continuously retriggered -> Q stays high, Q-bar stays low.
- When AC fails: No more trigger pulses -> Q goes low, Q-bar goes high -> NMI fires.
- ISP response: Saves all internal registers to battery-backed RAM or EEPROM.
- Assumption: System power supply filter capacitors provide at least 75 ms of energy after AC loss.

### Battery-Backed Memory Circuit (Figure 12-7)

- Diodes switch memory supply from DC power supply (+5.7V) to battery when DC fails.
- Silicon diodes are used (elevated voltage accounts for diode drop).
- Resistor trickle-charges the NiCAD, lithium, or gel-cell battery.
- Most SRAMs retain data down to Vcc = 1.5V, so battery doesn't need to supply full +5V.
- WR pin is pulled to Vcc during power outage to prevent spurious writes.

### INTR - Maskable Interrupt Request

- Level-sensitive: Must be held at logic 1 until recognized by the CPU.
- Gated by IF: Only accepted when IF = 1.
- INTR is set by an external event.
- INTR is cleared inside the ISP (usually by reading/acknowledging the peripheral).
- Automatically disabled when accepted; re-enabled by IRET.

### Typical INTR Vector Range

- Recommended range: TYPE 20H to TYPE FFH.
- Intel reserves TYPE 00H to TYPE 1FH.

---

## 9. INTR and INTA Handshake: Two-Pulse Mechanism

### Sequence of Events

1. External device asserts INTR (logic 1).
2. CPU completes the current instruction and detects INTR (if IF = 1).
3. CPU begins interrupt acceptance cycle.

### Two-Pulse INTA Handshake (Figure 12-8)

**Pulse 1 (first INTA pulse):**
- CPU pulses INTA low.
- LOCK signal is asserted to prevent bus release during the cycle.
- This first pulse notifies the external hardware (8259A or discrete logic) that the CPU has accepted the interrupt.
- Data bus content during this pulse is ignored.

**Pulse 2 (second INTA pulse):**
- CPU pulses INTA low a second time.
- The external hardware places the 8-bit interrupt vector type number onto data bus lines D7-D0.
- CPU reads this byte and multiplies by 4 internally to get the vector table address.

### Simplest INTR Implementation: Pull-Up Resistors (Figure 12-9)

- D0-D7 are pulled high (logic 1) by resistors to Vcc.
- INTA is not connected.
- CPU always reads FFH as the vector number.
- Vector type FFH -> address 3FCH-3FFH.
- This is the cheapest possible INTR implementation.

### Using a Three-State Buffer (Figure 12-10)

- A 74ALS244 octal buffer drives D0-D7 with the desired vector number.
- INTA pin enables the buffer on the second INTA pulse.
- DIP switches allow easy reconfiguration of the vector number.
- Provides any desired vector (e.g., 80H is shown).

### Making INTR Edge-Triggered (Figure 12-11)

- INTR is normally level-sensitive.
- A D-type flip-flop (74ALS74) converts it to edge-triggered:
  - Edge-triggered interrupt request goes to CLK input of flip-flop.
  - Q output drives INTR on the CPU.
  - INTA (through 74ALS08 AND gate) drives the CLR input of the flip-flop, clearing it when the CPU acknowledges.
  - RESET clears the flip-flop at power-on to prevent spurious interrupts.

### Bus Buffering with EN Pin

- In large systems, data bus buffers (e.g., 8286 transceivers) isolate the CPU data bus from the system bus.
- The SP/EN pin on the 8259A functions as an output in buffered mode.
- During the second INTA pulse, the 8259A drives EN low to enable the bus transceivers, allowing the vector byte to propagate from the 8259A to the CPU's data bus.

---

## 10. Expanding the Interrupt Structure

### Method 1: 74ALS244 with NAND Gate (Figure 12-13)

- Allows 7 additional interrupt request lines (IR0 through IR6) beyond the single INTR input.
- Hardware addition: An 8-input NAND gate whose inputs are IR0-IR6 plus a pull-up.
- If any IR input goes low (active-low): NAND output goes high -> INTR asserted.
- During INTA: The 74ALS244 places a unique vector byte based on which IR inputs are active.

**Vector Assignment (Table 12-1) - single active inputs:**

| Active Input | Vector |
|-------------|--------|
| IR0 only active | FEH |
| IR1 only active | FDH |
| IR2 only active | FBH |
| IR3 only active | F7H |
| IR4 only active | EFH |
| IR5 only active | DFH |
| IR6 only active | BFH |

**Multiple simultaneous inputs:** Generate a different combined vector.
- Example: IR0 and IR1 both active -> vector FCH.
- Priority is resolved at vector FCH by pointing it to the highest-priority ISP.
- Consumes the entire top half of the vector table (128 vectors) to cover all 2^7 combinations.

### Method 2: Daisy-Chained Interrupt

- Multiple peripherals (e.g., 82C55 devices) all connect their INTR outputs together via OR logic (74ALS32) to a single INTR input on the CPU (Figure 12-14).
- Any peripheral's INTR going high causes the CPU's INTR to go high.
- Only one interrupt vector is used (e.g., FFH via pull-up resistors).
- Priority determination is done entirely in software by polling.

**Advantages over the 74ALS244 method:**
- Only one interrupt vector needed.
- Simpler hardware.

**Disadvantage:**
- Additional software overhead to poll each peripheral and determine the source.

**Daisy-Chain ISP - Software Polling (Example 12-7):**

```asm
C1      EQU 504H    ; first 82C55 control register address
C2      EQU 604H    ; second 82C55 control register address
MASK1   EQU 1       ; bit mask for INTRB (bit 0)
MASK2   EQU 8       ; bit mask for INTRA (bit 3)

POLL    PROC FAR USES EAX EDX
    MOV DX, C1
    IN  AL, DX
    TEST AL, MASK1      ; test INTRB of first 82C55
    .IF !ZERO?
        ; LEVEL 1 ISP here
    .ENDIF
    TEST AL, MASK2      ; test INTRA of first 82C55
    .IF !ZERO?
        ; LEVEL 2 ISP here
    .ENDIF
    MOV DX, C2
    IN  AL, DX          ; read second 82C55 status
    TEST AL, MASK1      ; test INTRB of second 82C55
    .IF !ZERO?
        ; LEVEL 3 ISP here
    .ENDIF
    ; LEVEL 4 ISP here (assumed always fires if we reach here)
POLL    ENDP
```

---

## 11. 8259A Programmable Interrupt Controller

### Purpose

- Adds 8 vectored, priority-encoded interrupt inputs to the CPU.
- Expandable to 64 interrupt inputs using 1 master + 8 slave 8259As (no additional hardware needed).
- Still present (as a pair) in modern Intel chipsets.

### Single 8259A Capability

- Manages 8 interrupt request lines (IR0 through IR7).
- Each line gets its own unique vector number.
- Handles priority, masking, and EOI commands automatically.

### Expanded Cascade Capability

- 1 master + up to 8 slaves.
- Master handles 8 inputs; each slave also handles 8 inputs.
- Total: 1 master x 8 IR inputs, each IR potentially connected to a slave with 8 more inputs.
- Maximum = 8 slaves x 8 inputs = 64 total interrupt inputs.

---

## 12. 8259A Internal Architecture

### Functional Blocks

**1. Data Bus Buffer**
- 8-bit bidirectional buffer that interfaces the 8259A to the system data bus (D0-D7).
- During the second INTA pulse, this block drives the interrupt vector byte onto the bus.

**2. Read/Write Logic**
- Manages communication over the data bus.
- Controlled by A0, RD (active low), and WR (active low) signals.
- A0 = 0: Selects OCW registers for operation commands.
- A0 = 1: Selects ICW/OCW1 registers for initialization and masking.

**3. Control Logic**
- The central coordinator of all internal operations.
- Interfaces to the CPU via INT (output to CPU's INTR) and INTA (input from CPU's INTA).
- Manages cascade coordination via CAS0-CAS2.

**4. Interrupt Request Register (IRR)**
- 8-bit register that latches which IR inputs (IR0-IR7) are currently requesting service.

**5. In-Service Register (ISR)**
- 8-bit register that tracks which interrupt level is currently being serviced.
- A bit is set when the interrupt is acknowledged and cleared by EOI.

**6. Interrupt Mask Register (IMR)**
- 8-bit register loaded by OCW1.
- A '1' in a bit position masks (disables) the corresponding IR input.

**7. Priority Resolver**
- Examines IRR and IMR to determine the highest-priority unmasked pending interrupt.
- Feeds result to Control Logic to decide whether to assert INT.

**8. Cascade Buffer/Comparator**
- For master: CAS0-CAS2 are outputs that encode which slave should respond during INTA.
- For slave: CAS0-CAS2 are inputs that the slave compares against its own ID (from ICW3).

---

## 13. 8259A Pin Descriptions

| Pin | Direction | Description |
|-----|-----------|-------------|
| D0-D7 | Bidirectional | Data bus. Connected directly to system data bus. Carries ICW/OCW data and interrupt vector byte. |
| IR0-IR7 | Input | Interrupt Request inputs. Each line can be connected to a peripheral device or a slave 8259A. |
| WR (active low) | Input | Write strobe. Connected to IOWC (I/O Write Command) on the CPU bus. |
| RD (active low) | Input | Read strobe. Connected to IORC (I/O Read Command) on the CPU bus. |
| INT | Output | Interrupt output. Connects to INTR pin on the CPU (master) or to an IR pin on the master (slave). |
| INTA (active low) | Input | Interrupt Acknowledge. Connects to CPU's INTA output. In cascade, only the master's INTA is connected; slaves receive cascade codes. |
| A0 | Input | Address input. Selects between two internal address registers. A0=0 for OCW2/OCW3; A0=1 for ICW2/ICW3/ICW4/OCW1. |
| CS (active low) | Input | Chip Select. Must be decoded and driven low to enable the 8259A for programming and reading. |
| SP/EN | Bidirectional | Dual-function. See Section 15 for details. |
| CAS0-CAS2 | Bidirectional | Cascade lines. Outputs from master, inputs to slaves. Encode which slave responds during cascade INTA cycle. |

### Physical Connection Requirements

- CS must be decoded from the address bus (using a PLD or decoder).
- WR must have an I/O bank write pulse (connected to IOWC).
- The 8259A typically requires wait states (e.g., 4 wait states for a 16 MHz 80386SX).

---

## 14. 8259A Triggering Modes

### Edge-Triggered Mode (LTIM = 0 in ICW1)

- An interrupt is recognized on a LOW-to-HIGH transition on an IR pin.
- After the rising edge is detected, the IR input can return low without affecting the pending interrupt.
- More common in practice.

### Level-Triggered Mode (LTIM = 1 in ICW1)

- An interrupt is recognized by a sustained HIGH level on an IR pin.
- The IR input must remain high until the first INTA pulse is received.
- If the IR input goes low before the first INTA pulse, the interrupt is lost.
- Used in systems where the interrupt source holds the line high until acknowledged.

---

## 15. SP/EN Pin: Buffered vs Non-Buffered Mode

### Non-Buffered Mode (BUF = 0 in ICW4)

- SP/EN acts as a STATIC INPUT.
- SP/EN = 1: This 8259A is a MASTER.
- SP/EN = 0: This 8259A is a SLAVE.
- In single 8259A systems: Pull SP/EN high to designate it as master.

### Buffered Mode (BUF = 1 in ICW4)

- SP/EN acts as an ACTIVE OUTPUT.
- During the interrupt acknowledge cycle, the 8259A drives SP/EN (EN) low to enable external data bus transceivers (e.g., 74ALS245 bidirectional buffers).
- This ensures the vector byte driven by the 8259A propagates through the bus buffers to the CPU.
- M/S bit in ICW4 then determines master/slave role.

### When to Use Buffered Mode

- Large systems with many devices on the data bus requiring bus buffers for electrical isolation.
- In practice, most small-to-medium systems do not use data bus buffers and use non-buffered mode.

---

## 16. Cascade Signals: CAS0-CAS2

### Purpose

- Enable master-slave 8259A configurations without additional hardware.
- The master uses CAS0-CAS2 as OUTPUTS to tell slaves which one should provide the vector.
- Each slave uses CAS0-CAS2 as INPUTS and compares them to its own ID.

### Master Behavior During Cascade INTA

1. First INTA pulse: Master sends EOI internally and drives CAS0-CAS2 with the 3-bit code identifying the slave connected to the active IR pin.
2. Second INTA pulse: Only the slave whose ID matches the CAS code places its vector byte on the data bus.

### Cascade Code Encoding

The 3-bit CAS code corresponds to the master IR pin number to which the slave is connected:

| Slave Connected to Master IR Pin | CAS2 | CAS1 | CAS0 |
|----------------------------------|------|------|------|
| IR0 | 0 | 0 | 0 |
| IR1 | 0 | 0 | 1 |
| IR2 | 0 | 1 | 0 |
| IR3 | 0 | 1 | 1 |
| IR4 | 1 | 0 | 0 |
| IR5 | 1 | 0 | 1 |
| IR6 | 1 | 1 | 0 |
| IR7 | 1 | 1 | 1 |

### ICW3 Relationship to CAS Lines

- The master's ICW3 bit pattern directly corresponds to which IR pins have slaves attached.
- The slave's ICW3 contains its own 3-bit ID matching its position on the master.
- Example (Figure 12-17, slave on IR2 of master):
  - Master ICW3 = 04H = 00000100b (bit 2 set = slave on IR2).
  - Slave ICW3 = 02H = 00000010b (slave ID = 2, matching IR2).

---

## 17. Initialization Command Words (ICW): Bit-Level Detail

### ICW Programming Rules

- ICW1, ICW2, and ICW4 must ALWAYS be programmed on power-up.
- ICW3 must be programmed ONLY when cascade mode is indicated by ICW1 (SNGL = 0).
- ICWs are written sequentially: ICW1 -> ICW2 -> ICW3 (if needed) -> ICW4.
- Writing ICW1 resets the 8259A and begins the initialization sequence.
- ICW1 is written with A0 = 0.
- ICW2, ICW3, and ICW4 are written with A0 = 1.

---

### ICW1 (A0 = 0)

```
Bit: 7    6    5    4    3     2    1    0
     A7   A6   A5   1    LTIM  ADI  SNGL IC4
```

| Bit | Name | Function |
|-----|------|----------|
| 7-5 | A7-A5 | Don't care for 8086-Pentium 4 (used only with 8085 mode) |
| 4 | Always 1 | Distinguishes ICW1 from OCW2/OCW3 (which have 0 here) |
| 3 | LTIM | 0 = Edge-Triggered mode; 1 = Level-Triggered mode |
| 2 | ADI | Don't care for 8086-Pentium 4 (call address interval, 8085 only) |
| 1 | SNGL | 0 = Cascade mode (program ICW3); 1 = Single 8259A (no ICW3) |
| 0 | IC4 | 0 = ICW4 not needed; 1 = ICW4 needed (always 1 for 8086-Pentium 4) |

**Exam notes:**
- For 8086-Pentium 4 systems: IC4 must ALWAYS be 1.
- Bit 4 is always 1 in ICW1 - this is the distinguishing bit that tells the 8259A "this is ICW1."

---

### ICW2 (A0 = 1)

```
Bit: 7    6    5    4    3    2    1    0
     T7   T6   T5   T4   T3   0    0    0
     (8086/8088 mode: T7-T3 = high 5 bits of vector; low 3 bits provided by 8259A)
```

| Bits | Name | Function |
|------|------|----------|
| 7-3 | T7-T3 | High-order 5 bits of the interrupt vector type number |
| 2-0 | (auto) | Set by 8259A to the IR level (IR0=000, IR1=001, ..., IR7=111) |

**How ICW2 works:**
- Programmer writes only the high 5 bits (defining the base vector).
- The 8259A automatically appends the 3-bit IR level during INTA.
- Example: Program ICW2 = 08H = 00001000b -> T7-T3 = 00001.
  - IR0 fires: vector = 00001 000 = 08H.
  - IR1 fires: vector = 00001 001 = 09H.
  - IR7 fires: vector = 00001 111 = 0FH.
  - This 8259A uses vectors 08H through 0FH.
- Example: ICW2 = 70H = 01110000b -> vectors 70H through 77H.
- Example: ICW2 = 80H = 10000000b -> vectors 80H through 87H.

---

### ICW3 - Master Device (A0 = 1)

```
Bit: 7    6    5    4    3    2    1    0
     S7   S6   S5   S4   S3   S2   S1   S0
```

| Bit | Name | Function |
|-----|------|----------|
| 7-0 | S7-S0 | Each bit corresponds to an IR pin. 1 = slave attached to that IR pin; 0 = no slave |

**Example:** Slave on IR2 only: ICW3 = 00000100b = 04H.
**Example:** Slaves on IR0 and IR1: ICW3 = 00000011b = 03H.

---

### ICW3 - Slave Device (A0 = 1)

```
Bit: 7    6    5    4    3    2     1     0
     0    0    0    0    0    ID2   ID1   ID0
```

| Bits | Name | Function |
|------|------|----------|
| 7-3 | Fixed 0 | Always 0 in slave ICW3 |
| 2-0 | ID2-ID0 | 3-bit Slave ID. Must match the master IR pin number to which this slave is connected |

**Example:** Slave connected to master's IR2: Slave ICW3 = 00000010b = 02H.
**Example:** Slave connected to master's IR1: Slave ICW3 = 00000001b = 01H.

The slave ID must equal the corresponding bit position in the master's ICW3 bitmask.

---

### ICW4 (A0 = 1)

```
Bit: 7    6    5    4     3    2    1    0
     0    0    0    SFNM  BUF  M/S  AEOI uPM
```

| Bit | Name | Function |
|-----|------|----------|
| 7-5 | Fixed 0 | Always 0 |
| 4 | SFNM | 0 = Not Special Fully Nested Mode; 1 = Special Fully Nested Mode |
| 3 | BUF | 0 = Non-buffered mode; 1 = Buffered mode |
| 2 | M/S | Used only when BUF=1. 0 = Slave; 1 = Master |
| 1 | AEOI | 0 = Normal EOI (manual); 1 = Automatic EOI |
| 0 | uPM | 0 = MCS-80/85 mode; 1 = 8086/8088/80x86 mode |

**Critical rules:**
- uPM (bit 0) must ALWAYS = 1 for 8086 through Pentium 4 systems.
- AEOI = 1: Preferred mode. The 8259A automatically resets the ISR bit after the second INTA pulse, eliminating the need for a manual EOI command at the end of the ISP.
- SFNM = 1: Allows the master to accept a higher-priority interrupt from a different slave while servicing an interrupt from another slave. Normally (SFNM=0), only one interrupt is processed at a time per master.

---

## 18. Operation Command Words (OCW): Bit-Level Detail

### Timing Rule

- OCWs can be written at any time after initialization.
- OCW2 and OCW3 are written with A0 = 0.
- OCW1 is written with A0 = 1.

---

### OCW1 - Interrupt Mask Register (A0 = 1)

```
Bit: 7    6    5    4    3    2    1    0
     M7   M6   M5   M4   M3   M2   M1   M0
```

| Bit | Function |
|-----|----------|
| M7-M0 | Mask bits. 1 = mask (disable) that IR input; 0 = enable that IR input |

**Important:** OCW1 must be programmed after the ICWs during initialization because the IMR state is unknown at power-up.

**Reading OCW1:** Reading from A0=1 returns the current IMR contents.

**Example:** OCW1 = 0FEH = 11111110b -> enables only IR0; all others masked.
**Example:** OCW1 = 00H = 00000000b -> all IR inputs enabled.

---

### OCW2 - EOI and Priority Rotation (A0 = 0)

```
Bit: 7    6    5    4    3    2    1    0
     R    SL   EOI  0    0    L2   L1   L0
```

| Bit | Name | Function |
|-----|------|----------|
| 7 | R | Rotation enable. 1 = rotate priorities after EOI |
| 6 | SL | Specific Level. 1 = L2-L0 specify the IR level |
| 5 | EOI | End of Interrupt command |
| 4-3 | Fixed 0 | Always 0 (distinguishes OCW2 from ICW1 and OCW3) |
| 2-0 | L2-L0 | Specifies the IR level (0-7) when SL=1 |

**Command types defined by R, SL, EOI combination:**

| R | SL | EOI | Command |
|---|----|-----|---------|
| 0 | 0 | 1 | Non-specific EOI: 8259A finds and resets the highest ISR bit automatically |
| 0 | 1 | 1 | Specific EOI: Resets the ISR bit for the level specified by L2-L0 |
| 1 | 0 | 1 | Rotate on Non-specific EOI: EOI + rotates priority so just-serviced level becomes lowest |
| 1 | 0 | 0 | Rotate on Automatic EOI (Set): Sets AEOI with rotation |
| 0 | 0 | 0 | Rotate on Automatic EOI (Clear): Clears AEOI with rotation |
| 1 | 1 | 1 | Rotate on Specific EOI: Specific EOI + priority rotation |
| 1 | 1 | 0 | Set Priority: Sets L2-L0 level as the lowest priority (without EOI) |
| 0 | 1 | 0 | No Operation |

**Non-specific EOI explained:**
- Sends command 00100000b = 20H to OCW2 port.
- 8259A automatically determines which ISR bit to clear (the highest priority one currently set).
- Most common EOI used.

**Rotate on Non-specific EOI explained:**
- After clearing the ISR bit, the just-serviced level becomes the new lowest priority.
- IR5 was serviced -> IR5 becomes lowest priority; IR6 becomes highest.
- Ensures round-robin fairness among equal-priority devices.

---

### OCW3 - Register Read and Poll (A0 = 0)

```
Bit: 7    6    5     4    3    2    1    0
     0    ESMM SMM   0    1    P    RR   RIS
```

| Bit | Name | Function |
|-----|------|----------|
| 7 | Fixed 0 | Always 0 |
| 6 | ESMM | Enable Special Mask Mode. 1 = use SMM bit; 0 = ignore SMM bit |
| 5 | SMM | Special Mask Mode. 1 = set special mask mode; 0 = reset special mask mode |
| 4 | Fixed 0 | Always 0 |
| 3 | Fixed 1 | Always 1 (distinguishes OCW3 from OCW2) |
| 2 | P | Poll Mode. 1 = next RD pulse reads poll word; 0 = no poll |
| 1 | RR | Register Read. 1 = read register selected by RIS on next RD |
| 0 | RIS | Register In Service. 0 = read IRR on next RD; 1 = read ISR on next RD |

**Reading IRR:** Write OCW3 = 00001010b = 0AH (A0=0), then read from A0=0 -> returns IRR.
**Reading ISR:** Write OCW3 = 00001011b = 0BH (A0=0), then read from A0=0 -> returns ISR.
**Reading IMR:** Read directly from A0=1 (OCW1 read) -> returns IMR.

**Poll Mode:**
- Write OCW3 with P=1 (bit 2 set).
- On next read operation, the 8259A returns the poll word.
- Poll word format:
  - Bit 7 = 1: An interrupt is pending.
  - Bit 7 = 0: No interrupt pending.
  - Bits 2-0: IR level of the highest-priority active interrupt.
- Allows software polling of the 8259A instead of hardware interrupt lines.

---

## 19. 8259A Status Registers: IRR, ISR, IMR

| Register | Full Name | Size | Content | Read Via |
|----------|-----------|------|---------|---------|
| IRR | Interrupt Request Register | 8 bits | Which IR inputs are currently requesting service (have active signals) | OCW3 (RR=1, RIS=0), then read A0=0 |
| ISR | In-Service Register | 8 bits | Which interrupt level is currently being serviced (between INTA and EOI) | OCW3 (RR=1, RIS=1), then read A0=0 |
| IMR | Interrupt Mask Register | 8 bits | Which IR inputs are masked off (1=masked) | Read A0=1 directly |

### ISR Behavior (Figure 12-20)

Before IR4 acceptance:
- ISR shows previously in-service bits.
- Priority indicated by bit positions.

After IR4 acceptance:
- ISR bit 4 is set.
- Priority reorganized: ISR shows IR4 in service.
- Lower-priority interrupts cannot preempt.

### All Three Registers Share the Same Bit Configuration

Each bit n (0-7) in any status register corresponds to IR level n.

---

## 20. 8259A Programming Example: 16550 UART

### System Configuration (Figure 12-21)

- CPU: 8088 microprocessor.
- UART: 16550 programmable communications controller.
  - I/O port addresses: 40H to 47H.
- 8259A PIC:
  - I/O port addresses: 48H (A0=0, PIC1) and 49H (A0=1, PIC2).
- 16550 INTR -> 8259A IR0.
- 8259A INT -> CPU INTR.

### Initialization Software (Example 12-8)

```asm
PIC1    EQU 48H     ; 8259A port, A0=0
PIC2    EQU 49H     ; 8259A port, A0=1
ICW1    EQU 1BH     ; 00011011b: LTIM=0(edge), SNGL=1(single), IC4=1
ICW2    EQU 80H     ; Vector base = 80H -> IR0 uses 80H, IR7 uses 87H
ICW4    EQU 3       ; 00000011b: uPM=1(8086 mode), AEOI=1(auto EOI)
OCW1    EQU 0FEH    ; 11111110b: Enable IR0 only; mask IR1-IR7

INIT    PROC NEAR
    ; --- Configure 16550 UART ---
    MOV AL, 10001010B   ; Set DLAB=1 to access baud rate divisor
    OUT LINE, AL
    MOV AL, 120         ; Baud divisor LSB for 9600 baud
    OUT LSB, AL
    MOV AL, 0           ; Baud divisor MSB = 0
    OUT MSB, AL
    MOV AL, 00001010B   ; 7 data bits, odd parity, 1 stop bit
    OUT LINE, AL
    MOV AL, 00000111B   ; Enable TX FIFO and RX FIFO
    OUT FIFO, AL
    ; --- Configure 8259A ---
    MOV AL, ICW1        ; ICW1 to PIC1 (A0=0)
    OUT PIC1, AL
    MOV AL, ICW2        ; ICW2 to PIC2 (A0=1)
    OUT PIC2, AL
    MOV AL, ICW4        ; ICW4 to PIC2 (A0=1)
    OUT PIC2, AL
    MOV AL, OCW1        ; OCW1 to PIC2 (A0=1): enable IR0 only
    OUT PIC2, AL
    STI                 ; Enable CPU INTR (set IF=1)
    ; --- Enable 16550 interrupts ---
    MOV AL, 5           ; Enable RX and error interrupts in 16550
    OUT ITR, AL
    RET
INIT    ENDP
```

**ICW1 = 1BH = 00011011b breakdown:**
- Bit 4 = 1 (always 1 for ICW1).
- LTIM (bit 3) = 1 -> Level-triggered mode.
- ADI (bit 2) = 0 -> don't care.
- SNGL (bit 1) = 1 -> Single 8259A, no ICW3 needed.
- IC4 (bit 0) = 1 -> ICW4 required.

**ICW4 = 03H = 00000011b breakdown:**
- SFNM (bit 4) = 0.
- BUF (bit 3) = 0 -> Non-buffered.
- M/S (bit 2) = 0 -> Don't care (BUF=0).
- AEOI (bit 1) = 1 -> Automatic EOI.
- uPM (bit 0) = 1 -> 8086 mode.

### 16550 Interrupt Identification Register (Figure 12-23)

```
Bit: 7    6    5    4    3    2    1    0
     0    0    0    0    ID2  ID1  ID0  PN
```

| Bit | Name | Function |
|-----|------|----------|
| 0 | PN (Pending) | 0 = interrupt pending; 1 = no interrupt pending |
| 3-1 | ID2-ID0 | Interrupt identification bits (see Table 12-2) |

**Interrupt Control Bits (Table 12-2):**

| Bit3 | Bit2 | Bit1 | Bit0 | Priority | Type | Reset By |
|------|------|------|------|----------|------|----------|
| 0 | 0 | 0 | 1 | - | No interrupt | - |
| 0 | 1 | 1 | 0 | 1 | Receiver error (parity, framing, overrun, break) | Read the line status register |
| 0 | 1 | 0 | 0 | 2 | Receiver data available | Read the data register |
| 1 | 1 | 0 | 0 | 2 | Character timeout (nothing removed from RX FIFO for >= 4 char times) | Read the data register |
| 0 | 0 | 1 | 0 | 3 | Transmitter empty | Write to transmitter |
| 0 | 0 | 0 | 0 | 4 | Modem status | Read modem status register |

### 16550 Interrupt Service Dispatcher (Example 12-9)

```asm
INT80   PROC FAR USES AX BX DI SI
    IN  AL, 42H         ; read interrupt ID register
    .IF AL == 6         ; AL=6 -> receiver error
        ; handle error
    .ELSEIF AL == 2     ; AL=2 -> transmitter empty
        JMP TRAN        ; Example 12-13
    .ELSEIF AL == 4     ; AL=4 -> receiver data available
        JMP RECV        ; Example 12-11
    .ENDIF
    IRET
INT80   ENDP
```

### 16550 Receiver ISP: RECV (Example 12-11)

- Called when 16550 receives a character.
- Reads character from I/O port 40H (UART data register).
- Stores character into a 16K-byte circular memory FIFO (addressed by IIN/IOUT pointers).
- If FIFO is full: Disables receiver interrupt in the 16550 (to prevent data loss).
- Sends non-specific EOI (20H) to 8259A at port 49H after data handling.

```asm
RECV:
    MOV BX, IOUT        ; output pointer
    MOV DI, IIN         ; input pointer
    MOV SI, DI
    INC SI
    .IF SI == OFFSET FIFO+16*1024
        MOV SI, OFFSET FIFO
    .ENDIF
    .IF SI == BX        ; if FIFO full
        IN  AL, 41H     ; disable receiver interrupt
        AND AL, 0FAH
        OUT 41H, AL
    .ENDIF
    IN  AL, 40H         ; read character from 16550
    STOSB               ; store at ES:[DI]
    MOV IIN, SI
    MOV AL, 20H         ; EOI command to 8259A
    OUT 49H, AL
    IRET
```

### 16550 Transmitter ISP: TRAN (Example 12-13)

- Called when 16550 transmitter is empty and ready for more data.
- Reads from output FIFO (OIN/OOUT pointers); if empty, disables transmitter interrupt.
- If data available: Sends one byte to 16550 at port 40H.
- Sends EOI (20H) to 8259A at port 49H.

### 16550 Modem Control/Status Registers (Figure 12-24)

**Modem Control Register (bits 0-4):**
- Bit 0: DTR pin (0 = logic 1 on DTR; 1 = logic 0 on DTR)
- Bit 1: RTS pin (0 = logic 1 on RTS; 1 = logic 0 on RTS)
- Bit 2: OUT1 pin
- Bit 3: OUT2 pin
- Bit 4: Loopback (1 = internal loopback test enabled)

**Modem Status Register (bits 0-7):**
- Bit 0: CTS has changed
- Bit 1: DSR has changed
- Bit 2: Trailing edge of RI
- Bit 3: DCD has changed
- Bit 4: CTS pin state
- Bit 5: DSR pin state
- Bit 6: RI pin state
- Bit 7: DCD pin state

**Modem Handshake Sequence for Data Transfer:**
1. Assert DTR (logic 0 on DTR pin).
2. Wait for DSR to go low (modem ready).
3. Assert RTS.
4. Wait for CTS to go low (modem clear to send).
5. Check DCD (modem has detected carrier).
6. Begin data communication.

---

## 21. Cascading Multiple 8259As

### Two-8259A ATX-Style PC Configuration (Figure 12-17)

- Master (U1): I/O ports 0300H (A0=0) and 0302H (A0=1).
  - Vectors: 08H through 0FH.
  - IR2 connected to slave's INT output.
- Slave (U2): I/O ports 0304H (A0=0) and 0306H (A0=1).
  - Vectors: 70H through 77H.
  - Slave's INT -> Master's IR2.

### Historical Context

- XT/PC-style computers: Single 8259A at vectors 08H-0FH.
- ATX-style computers: Master at 08H-0FH, slave cascaded via vector 0AH (IR2), slave at 70H-77H.

### Cascade ICW3 Programming Example

System: Master with slave on IR2.

**Master ICW3:** 04H = 00000100b (bit 2 set = slave on IR2)
**Slave ICW3:** 02H = 00000010b (slave ID = 2)

System: Two slaves on IR0 and IR1.

**Master ICW3:** 03H = 00000011b (bits 0 and 1 set)
**Slave on IR0 ICW3:** 01H (ID = 0)
**Slave on IR1 ICW3:** 02H (ID = 1)

### Data Bus Buffers in Cascade Systems

- 74ALS245 bidirectional bus transceivers are included in cascade diagrams to illustrate SP/EN buffered mode.
- In practice, these buffers are rarely needed unless the system has an unusually large number of devices on the data bus.
- SP/EN drives the buffer enable (G) signal during the INTA cycle.

---

## 22. Real-Time Clock Applications

### Using the 60 Hz AC Power Line as RTC Source (Figure 12-26)

- The 120V AC power line (60 Hz in North America) provides a frequency-accurate source.
- Although frequency varies slightly, it is accurate over long periods (mandated by FTC).
- Circuit: AC line -> 33K resistor + 1K resistor + 0.1uF capacitor -> 74LS14 Schmitt trigger -> NMI pin.
- Output: 60 Hz TTL square wave applied to NMI.
- Grounding: Power line neutral (white, wide pin) must connect to system ground.

### Four-Byte BCD Time Counter (Example 12-14)

Memory layout:
```
TIME DB ?   ; 1/60 second counter (modulus 60H BCD)
     DB ?   ; second counter      (modulus 60H BCD)
     DB ?   ; minute counter      (modulus 60H BCD)
     DB ?   ; hour counter        (modulus 24H BCD)

LOOK DB 60H, 60H, 60H, 24H   ; modulus for each counter
```

ISP (called 60 times/second via NMI):
```asm
TIMEP   PROC FAR USES AX BX DS
    MOV AX, SEGMENT     ; load segment containing TIME
    MOV DS, AX
    MOV BX, 0           ; start at first byte
    .REPEAT
        MOV AL, DS:TIME[BX]
        ADD AL, 1       ; increment
        DAA             ; BCD adjust
        .IF AL == BYTE PTR CS:LOOK[BX]
            MOV AL, 0   ; reset this counter
        .ENDIF
        MOV DS:TIME[BX], AL
        INC BX
    .UNTIL AL != 0 || BX == 4  ; stop when no carry or all 4 done
    IRET
TIMEP   ENDP
```

### Single 32-Bit Counter Method (Example 12-15)

- Stores time as a single 32-bit count of 1/60-second ticks.
- Total ticks in a day: 60 x 60 x 60 x 24 = 5,184,000.
- Count of 0 = 12:00:00:00 AM.
- Count of 5,183,999 = 11:59:59:59 PM.

```asm
TIME    DD ?    ; modulus 5,184,000 counter

TIMEP   PROC FAR USES EAX
    MOV AX, SEGMENT
    MOV DS, AX
    INC DS:TIME
    .IF DS:TIME == 5184000
        MOV DWORD PTR DS:TIME, 0
    .ENDIF
    IRET
TIMEP   ENDP
```

Advantage: ISP is extremely short - minimal interrupt overhead.

### Converting Count to H:M:S (Example 12-16)

Returns: BL = hours (0-23), BH = minutes (0-59), AL = seconds (0-59).

```asm
GETT    PROC NEAR ECX EDX
    MOV ECX, 216000     ; 60 sec/min x 60 min/hr x 60 ticks/sec = 216,000
    MOV EAX, TIME
    SUB EDX, EDX
    DIV ECX             ; EAX = hours, EDX = remainder
    MOV BL, AL
    MOV EAX, EDX
    MOV ECX, 3600       ; 60 ticks/sec x 60 sec/min = 3600
    DIV ECX             ; EAX = minutes, EDX = remainder
    MOV BH, AL
    SUB EAX, EDX
    MOV ECX, 60
    DIV ECX             ; EAX = seconds
    RET
GETT    ENDP
```

### Time-Delay Using RTC (Example 12-17)

Delays for EAX seconds (accuracy: 1/60 second):

```asm
SEC     PROC NEAR USES EAX EDX
    MOV EDX, 60
    MUL EDX             ; convert seconds to 1/60s ticks
    ADD EAX, TIME       ; compute target count
    .IF EAX >= 5184000
        SUB EAX, 5184000    ; wrap around midnight
    .ENDIF
    .REPEAT
    .UNTIL EAX == TIME  ; busy-wait until RTC reaches target
    RET
SEC     ENDP
```

---

## 23. Interrupt-Processed Keyboard

### Concept

- A periodic interrupt (every 10ms or 16.7ms from a timer/RTC) calls the keyboard ISP.
- Each ISP call: Scans the keypad for pressed keys; performs debouncing.
- Valid key: Stored in a circular queue (FIFO) for reading by the main program later.
- Main program reads from the queue independently (non-interrupt-driven).

### Hardware (Figure 12-27)

- 82C55 PIA:
  - Port A: Input (reads row data from keyboard columns).
  - Port B: Output (drives column scan lines).
  - Initialization: Port B = 00H.
- Keyboard: Telephone-style 12-key pad (1-9, *, 0, #).

### Keyboard ISP (Example 12-18)

Data structures:
```asm
DBCNT   DB  0           ; de-bounce counter (incremented each ISP while key held)
DBF     DB  0           ; de-bounce flag (1 = key already stored in queue)
PNTR    DW  QUEUE       ; input pointer to queue
OPNTR   DW  QUEUE       ; output pointer to queue
QUEUE   DB  16 DUP(?)   ; 16-byte circular queue
```

ISP logic flow:
1. Read port A. OR with 0F0H. If result != FFH: A key is down.
2. If key down: Increment DBCNT.
3. If DBCNT >= 3 (key held for > 20ms = de-bounce complete) AND DBF = 0 (not yet stored):
   - Set DBF = 1 (mark key as stored).
   - Scan columns via port B to find exact key (rotate scan byte through BL).
   - Calculate key code from row + column position.
   - Store key code in queue via PNTR.
   - Increment and wrap PNTR (modulo 16).
4. If no key down: Decrement DBCNT. If negative: Reset DBCNT=0 and DBF=0.

### Queue Read Procedure (Example 12-19)

- Called from main program (not interrupt-driven).
- Returns carry = 1 if queue empty; carry = 0 and AL = key number if valid.
- Translates raw scan code to actual key number using XLAT with lookup table LOOK.

```asm
LOOK    DB  1, 4, 7, 10     ; row 0: keys 1, 4, 7, *
        DB  2, 5, 8, 0      ; row 1: keys 2, 5, 8, 0
        DB  3, 6, 9, 11     ; row 2: keys 3, 6, 9, #

KEY     PROC NEAR USES BX
    MOV BX, OPNTR
    .IF BX == PNTR      ; if output pointer = input pointer -> empty
        STC             ; set carry: queue empty
    .ELSE
        MOV AL, [BX]    ; get raw key code from queue
        INC BX
        .IF BX == OFFSET QUEUE+16
            MOV BX, OFFSET QUEUE    ; wrap pointer
        .ENDIF
        MOV OPNTR, BX
        MOV BX, LOOK
        XLAT            ; translate raw code to key number
        CLC             ; clear carry: valid key returned in AL
    .ENDIF
    RET
KEY     ENDP
```

### Caller Pattern (Example 12-20)

```asm
.REPEAT
    CALL KEY
.UNTIL !CARRY?          ; loop until a valid key is available
```

### Important Notes on Queue Design

- Raw codes (before XLAT): Key at column 1-row1 = 00H, column 1-row2 = 01H, etc.
- No queue overflow protection in this example. Overflow handling could be added.
- A 16-byte queue is sufficient because it is practically impossible to type faster than the ISP empties it.
- The keyboard scanning and debouncing are self-contained in the ISP.

---

## 24. Storing an Interrupt Vector: Hooking

### Concept

- Installing a new ISP into the IVT is called "hooking" an interrupt vector.
- To hook INT 40H: Write the ISP's segment:offset into the vector table at address 0100H-0103H (40H x 4).

### Hooking Procedure (Example 12-4)

```asm
.MODEL TINY
.CODE
.STARTUP
    JMP START

OLD     DD  ?           ; save old vector here

NEW40   PROC FAR        ; MUST be declared FAR
    ; ISP body here
    IRET                ; MUST end with IRET (not RET)
NEW40   ENDP

START:
    MOV AX, 0          ; point DS to segment 0000H (IVT location)
    MOV DS, AX
    MOV AX, DS:[100H]  ; save old INT 40H offset (low word)
    MOV WORD PTR CS:OLD, AX
    MOV AX, DS:[102H]  ; save old INT 40H segment (high word)
    MOV WORD PTR CS:OLD+2, AX
    MOV DS:[100H], OFFSET NEW40 ; write new offset
    MOV DS:[102H], CS           ; write new segment
    MOV DX, OFFSET START
    SHR DX, 4          ; convert to paragraphs
    INC DX
    MOV AX, 3100H      ; DOS: terminate and stay resident (TSR)
    INT 21H
END
```

### Key Rules for ISPs

1. All ISPs MUST be declared FAR (the CPU pushes CS during an interrupt).
2. All ISPs MUST end with IRET (not RET), because IRET also pops FLAGS.
3. All registers used by the ISP MUST be saved and restored (use USES or explicit PUSH/POP).
4. Always save the old vector before installing a new one (allows clean uninstall).

### DOS Function for TSR

- INT 21H with AX = 3100H: Makes the program terminate-and-stay-resident.
- DX = program length in paragraphs (16-byte blocks).
- Keeps the ISP in memory permanently until reboot.

---

## 25. Quick-Reference Summary Tables

### Interrupt Vector Calculation

| INT type n | Vector Address | Range |
|------------|---------------|-------|
| n | n x 4 | (n x 4) to (n x 4 + 3) |
| 0 | 0000H | 0000H-0003H |
| 5 | 0014H | 0014H-0017H |
| 40H | 0100H | 0100H-0103H |
| 80H | 0200H | 0200H-0203H |
| FFH | 03FCH | 03FCH-03FFH |

### Hardware Interrupt Pin Comparison

| Feature | NMI | INTR |
|---------|-----|------|
| Type number | Always TYPE 2 | Determined externally (via data bus) |
| Maskable? | No | Yes (via IF / STI / CLI) |
| Triggering | Edge (0-to-1 transition) | Level (sustained logic 1) |
| Acknowledged by | None needed | INTA pulse(s) |
| Use cases | Power failure, parity error | All peripheral devices |

### ICW Summary

| ICW | A0 | Key Bits | Purpose |
|-----|----|----------|---------|
| ICW1 | 0 | IC4, SNGL, LTIM, bit4=1 | Basic operation; starts initialization |
| ICW2 | 1 | T7-T3 (high 5 bits of vector base) | Sets base interrupt vector number |
| ICW3 (master) | 1 | S7-S0 (bitmask of IR pins with slaves) | Identifies slave positions |
| ICW3 (slave) | 1 | ID2-ID0 (3-bit slave ID) | Sets slave identity |
| ICW4 | 1 | uPM, AEOI, BUF, M/S, SFNM | 8086 mode, EOI mode, buffering |

### OCW Summary

| OCW | A0 | Key Bits | Purpose |
|-----|----|----------|---------|
| OCW1 | 1 | M7-M0 | Mask/unmask individual IR lines |
| OCW2 | 0 | R, SL, EOI, L2-L0 | EOI commands and priority rotation |
| OCW3 | 0 | P, RR, RIS, ESMM, SMM | Read IRR/ISR, poll mode, special mask |

### Interrupt Return Instructions

| Instruction | Mode | What it Pops |
|-------------|------|-------------|
| IRET | Real mode (all CPUs) | IP, CS, FLAGS (6 bytes) |
| IRETD | Protected mode (80386-Core2) | EIP, CS, EFLAGS (10 bytes) |
| IRETQ | 64-bit mode (Pentium 4/Core2) | RIP (64-bit), CS, RFLAGS |

### 8259A Address Decoding Summary

| Register | A0 | RD | WR | Access |
|----------|----|----|----|--------|
| Write ICW1 | 0 | 1 | 0 | Write |
| Write ICW2/3/4, OCW1 | 1 | 1 | 0 | Write |
| Write OCW2, OCW3 | 0 | 1 | 0 | Write |
| Read IMR (OCW1) | 1 | 0 | 1 | Read |
| Read IRR or ISR | 0 | 0 | 1 | Read (after OCW3 setup) |

### EOI Command Quick Reference

| Hex Value | Command | Notes |
|-----------|---------|-------|
| 20H | Non-specific EOI | Most common; 8259A auto-finds ISR bit to clear |
| 60H-67H | Specific EOI | Bits 2-0 select level (60H=IR0, 67H=IR7) |
| A0H | Rotate on Non-specific EOI | EOI + rotate priority |
