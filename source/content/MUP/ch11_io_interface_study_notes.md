# Chapter 11: Basic I/O Interface - Exam-Ready Study Notes

> **Coverage:** Sections 11-1, 11-2, 11-3, 11-4, and 11-6 | Lectures 10, 11, 12, 13, 15
> **Textbook:** *The Intel Microprocessors* - Barry B. Brey

---

## Table of Contents

1. [Section 11-1: Introduction to I/O Interface](#section-11-1)
2. [Section 11-2: I/O Port Address Decoding](#section-11-2)
3. [Section 11-3: The 82C55 Programmable Peripheral Interface (PPI)](#section-11-3)
4. [Section 11-4: The 8254 Programmable Interval Timer (PIT)](#section-11-4)
5. [Section 11-6: ADC and DAC Converters](#section-11-6)
6. [Quick-Reference Summary Tables](#quick-reference)

---

## Section 11-1: Introduction to I/O Interface {#section-11-1}

### 1.1 The I/O Address Space

The 8086/8088 and its successors maintain **two separate address spaces**:

| Space | Size | Access Method |
|-------|------|---------------|
| Memory | 1 MB (8086) up to 4 GB (32-bit) | MOV and all memory instructions |
| Isolated I/O | 64 KB (0000H-FFFFH) | IN, OUT, INS, OUTS only |

The I/O address that appears on the address bus is called a **port number** (or simply port). The hardware decodes it the same way it decodes a memory address, but uses separate control signals.

**Key control signals that distinguish I/O from memory:**

- `M/IO` (or `IO/M` on 8088): LOW = I/O cycle, HIGH = memory cycle.
- `RD` / `WR`: Read and Write strobes, active LOW.
- `BHE`: Bus High Enable, selects the upper byte of the 16-bit data bus.
- `ALE`: Address Latch Enable, used to demultiplex the address/data bus.

From these, two composite signals are derived externally:

- **IORC** (I/O Read Command): asserted when an IN instruction executes.
- **IOWC** (I/O Write Command): asserted when an OUT instruction executes.

```
IORC = NOT( IO/M=1 AND RD=0 )    [active LOW]
IOWC = NOT( IO/M=1 AND WR=0 )    [active LOW]
```

---

### 1.2 The I/O Instructions

All I/O data transfer instructions operate between the **accumulator** (AL, AX, or EAX) and an I/O port, or between **memory** and an I/O port (string forms).

#### Fixed Port Instructions (8-bit port address, p8)

```asm
IN  AL, p8       ; Read byte from port p8 into AL
IN  AX, p8       ; Read word from ports p8 and p8+1 into AX
IN  EAX, p8      ; Read doubleword into EAX

OUT p8, AL       ; Write byte from AL to port p8
OUT p8, AX       ; Write word
OUT p8, EAX      ; Write doubleword
```

- `p8` is an **8-bit immediate** encoded directly into the instruction opcode.
- The port address appears on `A7-A0`; bits `A15-A8` are driven to `00000000b`.
- Addresses the range **00H to FFH** only (256 ports).
- Stored in ROM with the instruction; called a **fixed address**.

#### Variable Port Instructions (16-bit port address via DX)

```asm
IN  AL, DX       ; Port address is in DX (0000H-FFFFH)
IN  AX, DX
IN  EAX, DX

OUT DX, AL
OUT DX, AX
OUT DX, EAX
```

- Port address is in `DX`, so the full **64K port space** (0000H-FFFFH) is accessible.
- Called a **variable address** because it can change at runtime.
- The first 256 ports (00H-FFH) are accessible by BOTH fixed and variable forms.
- Ports above FFH are **only** accessible via the DX (variable) form.

#### String I/O Instructions (not available on 8086/8088)

```asm
INSB    ; Input byte from port [DX] to memory ES:[DI], then DI +/- 1
INSW    ; Input word, DI +/- 2
INSD    ; Input doubleword, DI +/- 4

OUTSB   ; Output byte from DS:[SI] to port [DX], then SI +/- 1
OUTSW   ; Output word, SI +/- 2
OUTSD   ; Output doubleword, SI +/- 4
```

- Can be combined with the **REP prefix** for block transfers.
- Direction determined by the **Direction Flag (DF)**: DF=0 -> increment (CLD), DF=1 -> decrement (STD).
- Transfer is between **memory and an I/O port**, NOT through the accumulator.
- **No 64-bit I/O instructions exist** even in 64-bit mode, because most I/O remains 8-bit.

**Critical exam point:** I/O ports are inherently 8 bits wide. When you access a 16-bit port, you are actually accessing **two consecutive 8-bit ports**. The lower-address port holds the LSB and the higher-address port holds the MSB.

---

### 1.3 Isolated I/O vs. Memory-Mapped I/O

These are the two methods for placing I/O devices into a processor system.

| Characteristic               | Isolated I/O                | Memory-Mapped I/O                       |
| ---------------------------- | --------------------------- | --------------------------------------- |
| Also called                  | I/O-mapped I/O, direct I/O  | -                                       |
| Address space                | Separate 64K I/O space      | Shares the memory address space         |
| Instructions used            | IN, OUT, INS, OUTS          | Any memory instruction (MOV, ADD, etc.) |
| Control signals              | IORC, IOWC required         | IORC, IOWC NOT used                     |
| Memory available to software | Full memory space preserved | Reduced; I/O occupies memory addresses  |
| Used in PC?                  | YES (primary method)        | NO (not used in PC)                     |
| Instruction set richness     | Limited to IN/OUT family    | Full instruction set available          |

**Isolated I/O detail:** The 64K I/O map is entirely separate from the 1 MB (or 4 GB) memory map. Adding more memory does NOT consume I/O ports. This is the dominant method in Intel-based systems.

**Memory-Mapped I/O detail:** The I/O device occupies a real memory address. Any memory-reference instruction can access it. This is simpler from a software standpoint (rich instruction set), but wastes memory address space.

**Personal Computer I/O Map (important addresses to know):**

| Port Range | Device |
|------------|--------|
| 0000H-000FH | DMA Controller |
| 0020H-0023H | Interrupt Controller (8259) |
| 0040H-0043H | Timer (8253/8254) |
| 0060H-0063H | 8255 PPI (keyboard, speaker) |
| 02F8H-02FFH | COM 2 (16550 UART) |
| 0378H-037BH | LPT 1 (parallel printer, 82C55) |
| 03F8H-03FFH | COM 1 (16550 UART) |
| 0400H-FFFFH | Available for user/PCI applications |

---

### 1.4 Basic Input Interface: The Three-State Buffer

The fundamental hardware primitive for reading data from an external source is the **three-state (tri-state) buffer**.

**Why it is needed:** Multiple devices share the data bus. Without three-state control, an unselected device would force its data onto the bus and corrupt any ongoing transfer (bus contention).

**Typical part:** 74ALS244 (octal three-state buffer, two independent 4-bit groups controlled by `1G` and `2G` enable pins, both active LOW).

**Operation:**
- When `SEL` (device select, decoded from the port address) = 0: buffer outputs are **enabled**; external data drives the data bus.
- When `SEL` = 1: buffer outputs go to **high impedance (Z)**; the device is electrically disconnected from the bus.

**Connection diagram concept:**

```
External Source                      Data Bus
(switches, sensor)   ------>  [74ALS244 buffer]  ------>  D7-D0
                                      ^
                                    SEL (active LOW, from address decoder)
```

**Assembly to read the port:**

```asm
IN AL, port_address    ; SEL goes low, buffer drives bus, CPU latches AL
```

---

### 1.5 Basic Output Interface: The Data Latch

The fundamental hardware primitive for writing data to an external device is the **data latch**.

**Why it is needed:** The data bus is only valid for a fraction of a microsecond during an OUT instruction. External devices (LEDs, motors) need data held continuously. The latch **captures and holds** the bus data.

**Typical part:** 74ALS374 (octal D flip-flop, positive-edge triggered, clocked by the rising edge of the CLK input; active-LOW output enable `OC`).

**Operation:**
- During an OUT instruction, the CPU places the data on the bus and asserts IOWC.
- The decoded `SEL` signal clocks the 74ALS374, latching D7-D0 into the flip-flops.
- The Q outputs hold the data until the next OUT instruction.

**Connection diagram concept:**

```
Data Bus D7-D0  ------>  [74ALS374 latch]  ------>  LEDs or other device
                               ^
                             CLK (= SEL, from address decoder + IOWC)
```

**Assembly to write to the port:**

```asm
MOV AL, data_byte
OUT port_address, AL   ; SEL pulses, latch captures AL, holds it
```

---

### 1.6 Handshaking

**Problem:** The microprocessor can produce data orders of magnitude faster than most peripherals can consume it (e.g., a parallel printer at 300 CPS vs. a CPU at hundreds of MHz).

**Solution:** Handshaking - a synchronization protocol between the CPU and the peripheral.

#### Polling (Software Handshaking)

The CPU **continuously reads a status register** and checks a flag bit before transferring data.

```asm
PRINT PROC NEAR
    .REPEAT
        IN  AL, BUSY_PORT       ; Read status port
        TEST AL, BUSY_BIT       ; Check if printer is busy
    .UNTIL ZERO?                ; Loop until NOT busy (bit = 0)
    MOV AL, BL                  ; Data to send is in BL
    OUT PRINTER_PORT, AL        ; Send the character
    RET
PRINT ENDP
```

**Advantage:** Simple to implement.
**Disadvantage:** CPU is **completely occupied** waiting (busy-wait); no other task can run.

**Signals on a typical parallel printer interface (Centronics):**
- `D7-D0`: 8-bit parallel data.
- `STB` (Strobe, active LOW): CPU pulses this to clock data into the printer.
- `BUSY`: Printer asserts HIGH while processing; CPU must wait.
- `ACK` (Acknowledge): Printer asserts LOW to signal ready for more data.

#### Interrupts (Hardware Handshaking)

The peripheral **interrupts the CPU** only when it is ready; the CPU can execute other code in the meantime.

**Advantage:** CPU is free to do other work.
**Disadvantage:** More complex to implement (requires an ISR and interrupt controller).

---

## Section 11-2: I/O Port Address Decoding {#section-11-2}

### 2.1 Decoding Overview

Port address decoding identifies a specific port from all possible port addresses and generates a low-active chip-select or strobe signal.

**Key difference from memory decoding:** Fewer address lines. For isolated I/O we decode only `A15-A0` (16 bits), and often just `A7-A0` (8 bits) in embedded systems. Memory decoding uses `A31-A0`, `A23-A0`, or `A19-A0`.

**Signals that must be combined with the decoded address:**
- For a read operation: `IORC` (low when an IN executes) must qualify the read strobe.
- For a write operation: `IOWC` (low when an OUT executes) must qualify the write strobe.
- Bank select: `BHE` (high bank) and `A0`/`BLE` (low bank) for 16-bit systems to route data to the correct byte lane.

---

### 2.2 Decoding 8-Bit Port Addresses

Used in embedded systems or when fewer than 256 ports are needed. Only `A7-A0` are decoded; `A15-A8` are ignored.

#### Using the 74ALS138 3-to-8 Line Decoder

The 74ALS138 is a standard MSI decoder that takes a 3-bit binary code (A, B, C inputs) and asserts one of eight active-LOW outputs (Y0-Y7).

**Decoding ports F0H-F7H:**

- Connect `A2, A1, A0` of the system to the `A, B, C` inputs of the 74ALS138.
- Connect `A7, A6, A5, A4` to a 74LS10 NAND gate (or similar) to qualify the upper nibble `11110xxx`.
- The NAND gate output connects to one of the active-LOW enable inputs (`G2A` or `G2B`).
- Connect `A3` to the remaining active-LOW enable so that `A3=0` is required.
- `G1` (active HIGH enable) is tied to VCC.

When `A7=1, A6=1, A5=1, A4=1, A3=0` and the IORC or IOWC is asserted, the 74ALS138 selects one of F0H-F7H based on A2, A1, A0.

#### Using a PLD (GAL22V10) - VHDL Example

PLDs allow all decoding in a **single chip**, reducing parts count and propagation delay.

```vhdl
-- VHDL: Decode ports F0H through F7H (8-bit decode, A7-A0 only)
library ieee;
use ieee.std_logic_1164.all;

entity DECODER_F0H_F7H is
    port (
        A7, A6, A5, A4, A3, A2, A1, A0 : in  STD_LOGIC;
        D0, D1, D2, D3, D4, D5, D6, D7 : out STD_LOGIC
    );
end;

architecture V1 of DECODER_F0H_F7H is
begin
    -- D0 = active LOW when address = F0H (1111 0000)
    D0 <= not( A7 and A6 and A5 and A4 and not A3 and not A2 and not A1 and not A0 );
    -- D1 = F1H (1111 0001)
    D1 <= not( A7 and A6 and A5 and A4 and not A3 and not A2 and not A1 and     A0 );
    -- D2 = F2H (1111 0010)
    D2 <= not( A7 and A6 and A5 and A4 and not A3 and not A2 and     A1 and not A0 );
    -- D3 = F3H (1111 0011)
    D3 <= not( A7 and A6 and A5 and A4 and not A3 and not A2 and     A1 and     A0 );
    -- D4 = F4H (1111 0100)
    D4 <= not( A7 and A6 and A5 and A4 and not A3 and     A2 and not A1 and not A0 );
    -- D5 = F5H (1111 0101)
    D5 <= not( A7 and A6 and A5 and A4 and not A3 and     A2 and not A1 and     A0 );
    -- D6 = F6H (1111 0110)
    D6 <= not( A7 and A6 and A5 and A4 and not A3 and     A2 and     A1 and not A0 );
    -- D7 = F7H (1111 0111)
    D7 <= not( A7 and A6 and A5 and A4 and not A3 and     A2 and     A1 and     A0 );
end V1;
```

**How to read these equations:** Each output is the complement of an AND of all address bits. If any one bit does not match, the AND is 0, and the NOT makes the output 1 (inactive). Only the exact matching address produces a 0 output (active).

---

### 2.3 Decoding 16-Bit Port Addresses

Used in PC systems; `A15-A0` are all decoded. The PLD may not have enough input pins for all 16 bits, so an external NAND gate handles the upper bits.

**Example: Decode EFF8H-EFFFH**

EFF8H binary: `1110 1111 1111 1000`
- A15=1, A14=1, A13=1, A12=0 (note: NOT A12)
- A11=1, A10=1, A9=1, A8=1, A7=1, A6=1, A5=1, A4=1, A3=1
- A2, A1, A0 select which of the 8 ports (EFF8H through EFFFH)

```vhdl
-- VHDL: Decode 16-bit ports EFF8H through EFFFH
-- Z is the output of the external NAND gate decoding A15, A14, A13, A11
-- (Z is LOW when A15=1, A14=1, A13=1, A11=1, i.e., the NAND goes LOW)
entity DECODER_EFF8 is
    port (
        Z, A12, A10, A9, A8, A7, A6, A5, A4, A3, A2, A1, A0 : in STD_LOGIC;
        D0, D1, D2, D3, D4, D5, D6, D7 : out STD_LOGIC
    );
end;

architecture V1 of DECODER_EFF8 is
begin
    -- D0 = EFF8H: Z=0 (A15,14,13,11=1), A12=0, A10-A3 all 1, A2=0, A1=0, A0=0
    D0 <= not( not Z and not A12 and A10 and A9 and A8 and A7 and A6 and A5
               and A4 and A3 and not A2 and not A1 and not A0 );
    D1 <= not( not Z and not A12 and A10 and A9 and A8 and A7 and A6 and A5
               and A4 and A3 and not A2 and not A1 and     A0 );
    -- ... D2 through D7 follow the same pattern with A2,A1,A0 counting up
end V1;
```

---

### 2.4 8-Bit and 16-Bit Wide I/O Port Banks

A 16-bit microprocessor (e.g., 8086, 80386SX) has two 8-bit **I/O banks**:

| Bank | Data Lines | Selected by |
|------|------------|-------------|
| Low bank (even ports) | D7-D0 | `BLE` / `A0` = 0 |
| High bank (odd ports) | D15-D8 | `BHE` = 0 |

**For 8-bit I/O writes:** The write strobe must be qualified with `BHE` or `A0` to avoid writing to the wrong bank. The VHDL for two 8-bit output ports at 40H and 41H:

```vhdl
-- Port 40H is in the LOW bank (A0=0, BHE=1 not needed)
-- Port 41H is in the HIGH bank (BHE=0, A0=1)
D0 <= BHE or IOWC or A7 or not A6 or A5 or A4 or A3 or A2 or A1 or     A0;
D1 <= BHE or IOWC or A7 or not A6 or A5 or A4 or A3 or A2 or A1 or not A0;
-- BHE and IOWC are active LOW; note they are used in OR form
-- The OR gate passes a 1 (inactive) if any signal is wrong, 0 (active) only for exact match
```

**For 16-bit I/O reads/writes:** `BHE` and `A0` are not involved because both banks are accessed simultaneously.

---

## Section 11-3: The 82C55 Programmable Peripheral Interface (PPI) {#section-11-3}

### 3.1 Overview and Purpose

The 82C55 is a **programmable parallel I/O chip** providing 24 I/O pins that can be configured as inputs or outputs in various modes. It serves as the interface between the CPU and TTL-compatible peripherals (keyboards, printers, LED displays, etc.).

**Key specifications:**
- 24 I/O pins arranged in three 8-bit ports (A, B, C).
- Three modes of operation: 0 (basic), 1 (strobed), 2 (bidirectional).
- Compatible with any TTL device.
- CMOS version (82C55) requires wait states above 8 MHz.
- Sink current: minimum 2.5 mA, maximum 4.0 mA per output pin.

---

### 3.2 Pin-Out and Internal Organization

**Data bus:** D7-D0 (connect to microprocessor data bus).
**Control:**
- `CS` (Chip Select, active LOW): enables the 82C55.
- `RD` (Read, active LOW): allows CPU to read from a port.
- `WR` (Write, active LOW): allows CPU to write to a port or the command register.
- `RESET`: forces all ports to input mode (Mode 0 input). Safe power-on state.

**Address selection:** `A1, A0` select which internal register is accessed:

| A1 | A0 | Selected Register |
|----|----|------------------|
| 0  | 0  | Port A (PA7-PA0) |
| 0  | 1  | Port B (PB7-PB0) |
| 1  | 0  | Port C (PC7-PC0) |
| 1  | 1  | Command register |

In the PC, the 82C55 is decoded at:
- **60H-63H** for keyboard/speaker/timer control.
- **378H-37BH** for the parallel printer port (LPT1).

---

### 3.3 Group Architecture

The 24 I/O pins are divided into two groups, each controlled by one half of the command word:

| Group | Ports | Port C pins | Modes supported |
|-------|-------|-------------|-----------------|
| Group A | Port A (PA7-PA0) | Upper (PC7-PC4) | 0, 1, 2 |
| Group B | Port B (PB7-PB0) | Lower (PC3-PC0) | 0, 1 |

**Port C** plays a dual role:
- In Mode 0: 8 independent general-purpose I/O bits.
- In Modes 1 and 2: specific bits become dedicated handshaking signals (STB, IBF, OBF, ACK, INTR, INTE).

---

### 3.4 Command Byte A (Mode Definition Control Word)

Written to the Command Register (A1=1, A0=1). Bit 7 MUST be 1.

```
Bit 7: 1 (identifies this as Command Byte A, not BSR)
Bit 6,5: Mode select for Group A
           00 = Mode 0
           01 = Mode 1
           1X = Mode 2
Bit 4: Port A direction
           1 = Input
           0 = Output
Bit 3: Port C upper (PC7-PC4) direction
           1 = Input
           0 = Output
Bit 2: Mode select for Group B
           0 = Mode 0
           1 = Mode 1
Bit 1: Port B direction
           1 = Input
           0 = Output
Bit 0: Port C lower (PC3-PC0) direction
           1 = Input
           0 = Output
```

**Example: Both ports A and B as output, all Mode 0:**

```
Bit:  7  6  5  4  3  2  1  0
      1  0  0  0  0  0  0  0  = 80H
```

```asm
MOV AL, 80H
MOV DX, COMMAND_PORT    ; e.g., 703H or 063H
OUT DX, AL
```

**Example: Port A output, Port B input, Mode 0:**

```
Bit:  7  6  5  4  3  2  1  0
      1  0  0  0  0  0  1  0  = 82H
```

---

### 3.5 Command Byte B (Bit Set/Reset - BSR Mode)

Written to the Command Register when Bit 7 = 0. **Only operates on Port C bits**.

```
Bit 7: 0 (identifies this as BSR command)
Bit 6,5,4: Don't care (X)
Bit 3,2,1: Bit select (selects which bit of Port C to set or reset)
           000 = PC0
           001 = PC1
           010 = PC2
           011 = PC3
           100 = PC4
           101 = PC5
           110 = PC6
           111 = PC7
Bit 0: Set/Reset
           1 = Set (force to 1)
           0 = Reset (force to 0)
```

**Important properties:**
- The BSR command is **glitch-free**: only the selected bit changes. All other Port C pins remain undisturbed.
- Useful in control systems to toggle a single control line without a read-modify-write sequence.
- Can only be used when the 82C55 is in Mode 1 or Mode 2.

**Example: Set bit PC3 of Port C:**

```
Command byte B: 0 X X X 011 1 = 00000111 = 07H
```

```asm
MOV AL, 07H     ; BSR: bit 3, set
OUT CMD_PORT, AL
```

**Example: Clear bit PC5:**

```
Command byte B: 0 X X X 101 0 = 00001010 = 0AH
```

---

### 3.6 Mode 0 Operation (Basic I/O)

**Function:** Simple latched output or buffered input. No handshaking signals are generated.

**Characteristics:**
- Each port (A, B, C upper, C lower) is independently configured as input or output.
- **Output:** Port latch holds the data written by an OUT instruction.
- **Input:** Three-state buffers gate the external data onto the bus when the CPU reads the port.
- No hardware handshaking; software must manage synchronization (polling).
- All 24 pins can be outputs, all inputs, or any mix of the four groups.

**Example application - 8 seven-segment LED displays:**

```asm
; Program 82C55 for Mode 0: Port A = output (segment data), Port B = output (digit select)
MOV AL, 10000000B   ; 80H: Mode 0, PA=out, PC_upper=out, PB=out, PC_lower=out
MOV DX, 703H
OUT DX, AL
```

---

### 3.7 Mode 1 Strobed Input Operation

**Function:** Port A or Port B (or both) acts as a latched input with hardware handshaking. Port C bits are reassigned as handshaking lines.

#### Signal Definitions (Mode 1 Strobed Input)

| Signal | Type | Description |
|--------|------|-------------|
| `STB` (Strobe) | Input | External device asserts LOW to clock data into the port latch. Data is captured on the 0-to-1 (rising) transition of STB. |
| `IBF` (Input Buffer Full) | Output | Goes HIGH when STB is asserted (data latched). Cleared by the CPU executing an IN instruction to read the port. Tells the external device that the 82C55 is holding data. |
| `INTR` (Interrupt Request) | Output | Goes HIGH when STB returns HIGH AND INTE is enabled. Requests a CPU interrupt to signal that data is ready. Cleared by the IN instruction. |
| `INTE` (Interrupt Enable) | Internal | Internal flip-flop. Not a physical pin. Set/cleared via BSR command on PC4 (Port A) or PC2 (Port B). |
| `PC6, PC7` (Port A) | I/O | General-purpose I/O pins (not used for handshaking in strobed input mode). |

**Port C pin assignments for Mode 1 strobed input:**

| Bit | Port A use | Port B use |
|-----|-----------|-----------|
| PC0 | - | INTR_B |
| PC1 | - | IBF_B |
| PC2 | - | STB_B |
| PC3 | INTR_A | - |
| PC4 | STB_A | I/O |
| PC5 | IBF_A | I/O |
| PC6 | I/O | - |
| PC7 | I/O | - |

**Timing sequence (Mode 1 strobed input):**

```
External device places data on port pins
    -> Asserts STB (LOW)
    -> IBF goes HIGH (data latched, buffer full)
    -> STB returns HIGH
    -> INTR goes HIGH (if INTE enabled, interrupt CPU)
CPU executes IN instruction to read port
    -> IBF goes LOW (buffer empty)
    -> INTR goes LOW (interrupt cleared)
```

**Polling example (keyboard with Mode 1 input on Port A):**

```asm
BIT5        EQU 20H         ; IBF_A is bit 5 of Port C
PORTC_ADDR  EQU 22H         ; Port C address
PORTA_ADDR  EQU 20H         ; Port A address

READ PROC NEAR
    .REPEAT
        IN  AL, PORTC_ADDR  ; Read Port C
        TEST AL, BIT5        ; Test IBF_A (bit 5)
    .UNTIL !ZERO?            ; Loop until IBF = 1 (data ready)
    IN  AL, PORTA_ADDR       ; Read the ASCII key code
    RET
READ ENDP
```

---

### 3.8 Mode 1 Strobed Output Operation

**Function:** Port A or Port B acts as a handshaked output. Port C bits again become control signals.

#### Signal Definitions (Mode 1 Strobed Output)

| Signal | Type | Description |
|--------|------|-------------|
| `OBF` (Output Buffer Full) | Output | Goes LOW when the CPU writes data to the port (OUT instruction). Tells the external device that new data is available. |
| `ACK` (Acknowledge) | Input | External device asserts LOW to acknowledge receipt of data. This causes OBF to return HIGH (buffer empty). |
| `INTR` (Interrupt Request) | Output | Goes HIGH after ACK returns HIGH (peripheral has taken the data) AND INTE is enabled. Signals CPU that it can send more data. |
| `INTE` | Internal | Set/cleared via BSR on PC6 (Port A) or PC2 (Port B). |
| `PC4, PC5` | I/O | General-purpose bits when Port A is strobed output. |

**Timing sequence (Mode 1 strobed output):**

```
CPU executes OUT instruction to write data to port
    -> OBF goes LOW (output buffer now full with new data)
External device sees OBF LOW, takes the data
    -> Asserts ACK (LOW)
    -> OBF returns HIGH (buffer empty)
    -> ACK returns HIGH
    -> INTR goes HIGH (if INTE enabled, interrupt CPU for more data)
```

**Polling example (parallel printer with strobed output on Port B):**

```asm
BIT1        EQU 02H         ; OBF_B is bit 1 of Port C
PORTC_ADDR  EQU 63H
PORTB_ADDR  EQU 61H
CMD         EQU 63H

PRINT PROC NEAR
    .REPEAT
        IN  AL, PORTC_ADDR  ; Read Port C
        TEST AL, BIT1       ; Test OBF_B
    .UNTIL !ZERO?            ; Wait until OBF = 1 (buffer empty, printer ready)
    MOV AL, AH               ; AH has the ASCII char to print
    OUT PORTB_ADDR, AL       ; Send character to Port B (OBF goes LOW)
    MOV AL, 8                ; BSR command: set PC4 (DS strobe) = 0 then 1
    OUT CMD, AL
    MOV AL, 9
    OUT CMD, AL
    RET
PRINT ENDP
```

---

### 3.9 Mode 2 Bidirectional Operation (Port A Only)

**Function:** Port A becomes a **bidirectional bus** - the same 8 pins can both transmit and receive data. Mode 2 is available **only for Group A (Port A)**.

**Use cases:** Computer-to-computer communication, IEEE-488 GPIB bus.

**Signal definitions for Mode 2:**

| Signal | Type | Description |
|--------|------|-------------|
| `OBF` | Output | LOW = output buffer contains data for the bus. |
| `ACK` | Input | LOW = external device enables the output buffers; HIGH = output buffers at high impedance. |
| `STB` | Input | Clocks external data into the Port A input latch. |
| `IBF` | Output | HIGH = input latch contains valid data. |
| `INTR` | Output | Interrupt request, activated by both input and output conditions. |
| `INTE1` | Internal | Controlled by PC6; enables INTR for output direction. |
| `INTE2` | Internal | Controlled by PC4; enables INTR for input direction. |
| `PC0, PC1, PC2` | I/O | General-purpose bits. |

**Port C pin assignments in Mode 2:**

| PC Bit | Function |
|--------|----------|
| PC3 | INTR_A |
| PC4 | STB_A (input strobe) |
| PC5 | IBF_A |
| PC6 | ACK_A |
| PC7 | OBF_A |
| PC0-PC2 | General I/O |

**Transmit procedure (Mode 2):**

```asm
; OBF is bit 7 of Port C; BIT7 = 80H
PORTC EQU 62H
PORTA EQU 60H

TRANS PROC NEAR
    .REPEAT
        IN  AL, PORTC       ; Read Port C
        TEST AL, 80H        ; Test OBF (bit 7)
    .UNTIL !ZERO?            ; Wait until OBF = 1 (output buffer empty)
    MOV AL, AH               ; AH has the data to transmit
    OUT PORTA, AL            ; Write data (OBF goes LOW)
    RET
TRANS ENDP
```

**Receive procedure (Mode 2):**

```asm
; IBF is bit 5 of Port C; BIT5 = 20H
READ PROC NEAR
    .REPEAT
        IN  AL, PORTC       ; Read Port C
        TEST AL, 20H        ; Test IBF (bit 5)
    .UNTIL !ZERO?            ; Wait until IBF = 1 (data strobed in)
    IN  AL, PORTA            ; Read the received data (IBF clears)
    RET
READ ENDP
```

---

### 3.10 Mode Summary Table

| Mode | Port A | Port B | Port C usage |
|------|--------|--------|-------------|
| 0 | Basic IN or OUT | Basic IN or OUT | All general I/O |
| 1 | Strobed IN or OUT | Strobed IN or OUT | Handshaking signals |
| 2 | Bidirectional | Not used in Mode 2 | Handshaking signals |

**After RESET:** All ports initialize to Mode 0 Input - safest state.

---

## Section 11-4: The 8254 Programmable Interval Timer (PIT) {#section-11-4}

### 4.1 Overview and Purpose

The 8254 is a **programmable counter/timer chip** containing three independent 16-bit counters. It generates waveforms, measures time intervals, counts events, and controls real-time processes.

**PC usage (decoded at 40H-43H):**
- **Counter 0:** Generates an 18.2 Hz interrupt (IRQ0) for the system clock tick. Input clock = 1.1925 MHz (4.77 MHz / 4).
- **Counter 1:** 15 us period for DRAM refresh via DMA.
- **Counter 2:** Speaker tone generation.

**Key specs:**
- Maximum input clock: 10 MHz.
- Each counter: 16-bit, counts in binary or BCD.
- Minimum count: 1 (except modes 2 and 3 where minimum is 2).
- Count of 0 = 65,536 (binary) or 10,000 (BCD).

---

### 4.2 Pin-Out and Pin Definitions

**Data bus:** D7-D0.

**Control signals:**
- `CS` (Chip Select, active LOW): enables the 8254.
- `RD` (Read, active LOW): reads counter data; connects to IORC.
- `WR` (Write, active LOW): writes control word or count; connects to IOWC.
- `A1, A0`: Register select.

| A1 | A0 | Register Selected |
|----|----|------------------|
| 0  | 0  | Counter 0 |
| 0  | 1  | Counter 1 |
| 1  | 0  | Counter 2 |
| 1  | 1  | Control Word Register |

**Per-counter pins (three sets, one per counter):**
- `CLKn`: Clock input. Each counter has its own independent clock.
- `GATEn`: Gate input. Controls whether the counter counts (function depends on mode).
- `OUTn`: Output. The waveform produced by the counter appears here.

---

### 4.3 Control Word Format

Written to the Control Word Register (A1=1, A0=1) to configure a specific counter.

```
Bit 7,6: SC1, SC0 - Select Counter
          00 = Counter 0
          01 = Counter 1
          10 = Counter 2
          11 = Read-Back Command

Bit 5,4: RW1, RW0 - Read/Write Mode
          00 = Counter Latch Command (freeze count for reading)
          01 = Read/Write LSB only
          10 = Read/Write MSB only
          11 = Read/Write LSB first, then MSB

Bit 3,2,1: M2, M1, M0 - Mode Select
          000 = Mode 0 (Interrupt on Terminal Count)
          001 = Mode 1 (Hardware Retriggerable One-Shot)
          010 = Mode 2 (Rate Generator)
          011 = Mode 3 (Square Wave Generator)
          100 = Mode 4 (Software Triggered Strobe)
          101 = Mode 5 (Hardware Triggered Strobe)

Bit 0: BCD
          0 = Binary counting (16-bit, 0-65535)
          1 = BCD counting (4 decade, 0-9999)
```

**Programming sequence:**

1. Write the Control Word to the control register (A1=1, A0=1).
2. Write the initial count to the counter register (LSB first if RW=11).
   - Writing LSB stops the counter.
   - Writing MSB loads the new count and **restarts** counting.

```asm
; Example: Program Counter 0, Mode 3 (square wave), binary, read/write both bytes
; Control word: SC=00, RW=11, Mode=011, BCD=0 -> 00110110B = 36H
MOV DX, 706H        ; Control register (base + 6 if 8254 at 700H, 702H, 704H, 706H)
MOV AL, 00110110B   ; 36H
OUT DX, AL

; Write count of 80 to Counter 0
MOV DX, 700H        ; Counter 0 address
MOV AL, 80          ; LSB of count (stops counter)
OUT DX, AL
MOV AL, 0           ; MSB of count (starts counter)
OUT DX, AL
```

---

### 4.4 Six Modes of Operation

#### Mode 0: Interrupt on Terminal Count

- **Use:** Event counter; generates a pulse after N events.
- **OUT on write:** Goes LOW immediately when the control word is written.
- **Counting:** Starts counting on the next CLK edge after the count is loaded.
- **OUT when done:** Goes HIGH after N CLK pulses (terminal count).
- **GATE:** Must be HIGH for counting; if GATE goes LOW mid-count, the counter **pauses**; it resumes when GATE returns HIGH.
- **Retriggerable?** No. Writing a new count mid-count restarts from the new value.

```
CLK:  |_|_|_|_|_|_|_|_|   (count = 5)
OUT:  __|_______________|  Stays LOW for N clocks after count loaded, then HIGH
```

#### Mode 1: Hardware Retriggerable One-Shot

- **Use:** Generates a pulse of precise duration triggered by external hardware.
- **OUT:** Normally HIGH. Goes LOW for N CLK periods after the GATE rising edge (trigger).
- **GATE:** Rising edge triggers (re-triggers) the one-shot.
- **Retriggerable:** YES. A new GATE rising edge during the pulse reloads the count and extends the pulse.

```
GATE: _|____|___________   (pulse triggers and retriggers)
OUT:  __|____________|___  Goes LOW for N clocks after each trigger
```

#### Mode 2: Rate Generator (Divide-by-N Counter)

- **Use:** Generates a periodic pulse train; used for interrupt generators, clock dividers.
- **OUT:** Normally HIGH. Goes LOW for exactly **1 CLK period** every N CLK periods.
- **GATE:** Must be HIGH. If GATE goes LOW, counting stops and OUT goes HIGH; resumes on GATE HIGH.
- **Automatic reload:** Counter reloads and continues indefinitely without reprogramming.

```
CLK:  |_|_|_|_|_|_|_|_|_|_|_|   (count = 5)
OUT:  ___|___________|____|      One LOW pulse per N clocks
```

#### Mode 3: Square Wave Generator

- **Use:** Generates a continuous square wave; most common mode.
- **OUT for even count N:** HIGH for N/2 clocks, LOW for N/2 clocks. Exactly 50% duty cycle.
- **OUT for odd count N:** HIGH for (N+1)/2 clocks, LOW for (N-1)/2 clocks.
- **GATE:** Must be HIGH; LOW stops output and forces OUT HIGH.
- **Automatic reload:** Runs continuously.

```
CLK:  |_|_|_|_|_|_|_|_|_|_|_|_|   (count = 6)
OUT:  ___|___|___|___|___|___       50% duty cycle (3 high, 3 low)
```

**Frequency calculation:**
```
f_out = f_clk / N
```
**Example:** To generate 100 kHz from an 8 MHz clock: N = 8,000,000 / 100,000 = 80.

#### Mode 4: Software Triggered Strobe

- **Use:** Generates a single LOW pulse after software writes the count.
- **OUT:** Normally HIGH. Goes LOW for exactly **1 CLK period** after N CLK periods from when the count is written.
- **GATE:** Must be HIGH for counting. This mode is **software** triggered (count write is the trigger).
- **Retriggerable?** No (use Mode 5 for hardware-triggered version).
- Does NOT repeat automatically.

```
CLK:  |_|_|_|_|_|_|_|_|_|   (count = 8)
OUT:  _______________|_|___  Single 1-clock LOW pulse after N clocks
```

#### Mode 5: Hardware Triggered Strobe

- **Use:** Same as Mode 4 but triggered by a GATE rising edge instead of software.
- **OUT:** Normally HIGH. Goes LOW for 1 CLK period after N clocks from the GATE trigger.
- **GATE:** Rising edge is the trigger.
- **Retriggerable:** YES. A new GATE rising edge re-triggers (reloads count).

---

### 4.5 Mode Comparison Table

| Mode | Trigger | OUT normally | Action at terminal count | GATE function | Repeats? |
|------|---------|-------------|--------------------------|---------------|----------|
| 0 | Software (count write) | LOW | Goes HIGH | HIGH=count, LOW=pause | No |
| 1 | Hardware (GATE rising edge) | HIGH | Goes HIGH | Rising edge = trigger | No (unless retriggered) |
| 2 | Auto (continuous) | HIGH | Low pulse 1 CLK wide | HIGH=run, LOW=stop | YES |
| 3 | Auto (continuous) | HIGH | Toggle (square wave) | HIGH=run, LOW=stop+HIGH | YES |
| 4 | Software (count write) | HIGH | Low pulse 1 CLK wide | HIGH=enable, LOW=stop | No |
| 5 | Hardware (GATE rising edge) | HIGH | Low pulse 1 CLK wide | Rising edge = trigger | No (unless retriggered) |

---

### 4.6 Reading a Counter (Stable Reading)

**Problem with simple reads:** The counter is a 16-bit value that decrements continuously. Reading the LSB and MSB separately risks getting inconsistent data if the counter rolls over between the two byte reads.

#### Method 1: Counter Latch Command

Freezes the current count in an output latch. The latch holds the value until it is read; the counter continues counting in the background.

**Control word for counter latch (RW = 00):**

```
Counter Latch: SC1 SC0 0 0 X X X X
               (Counter select, then 0 0 in RW field, mode and BCD don't matter)
```

Example - latch Counter 0:
```asm
; Latch Counter 0: SC=00, RW=00, rest = don't care
MOV AL, 00000000B   ; 00H
OUT CONTROL_PORT, AL

; Read the latched value (LSB first, then MSB, per original programming)
IN  AL, COUNTER0    ; LSB
MOV BL, AL
IN  AL, COUNTER0    ; MSB
MOV BH, AL
; BX now holds the stable 16-bit count
```

#### Method 2: Read-Back Command (8254 only, not 8253)

Allows latching the count AND the status register of one or more counters simultaneously. Especially useful when reading multiple counters for a consistent snapshot.

**Read-Back Control Word format:**

```
Bit 7,6: 1,1 (identifies as read-back command; SC=11 in control word)
Bit 5: CNT_bar - 0 = latch the count of selected counters
Bit 4: ST_bar  - 0 = latch the status of selected counters
Bit 3: CNT2    - 1 = select Counter 2
Bit 2: CNT1    - 1 = select Counter 1
Bit 1: CNT0    - 1 = select Counter 0
Bit 0: always 0
```

After the read-back command, reading the counter address gives the **status register** first, then the latched count.

**Status Register format (returned by Read-Back):**

```
Bit 7: OUT    - Current state of the OUT pin
Bit 6: NULL   - 1 = count has not yet been loaded into counter (null count)
Bit 5,4: RW1,RW0 - Read/write mode as programmed
Bit 3,2,1: M2,M1,M0 - Mode as programmed
Bit 0: BCD   - 0=binary, 1=BCD
```

---

### 4.7 Programming Examples

**Example: Generate 1 ms period using a 1.5 MHz clock (Mode 2):**

```
Count = f_clk / f_desired = 1,500,000 / 1,000 = 1500

Control word for Counter 0, Mode 2, binary, LSB+MSB:
SC=00, RW=11, Mode=010, BCD=0 -> 00110100B = 34H
```

```asm
MOV AL, 34H
OUT CTRL, AL        ; Send control word to 8254

MOV AX, 1500
OUT CNT0, AL        ; Write LSB (1500 & 0FFH = 0DCH) - stops count
MOV AL, AH
OUT CNT0, AL        ; Write MSB - starts count
```

**Example: Motor speed controller using two counters (from textbook):**

Both counters generate period = 30,720 CLK cycles (8 MHz / 30,720 = ~260 Hz). The relative phase between them (set by starting Counter 1 after Counter 0 at a calculated count offset) determines motor direction and speed. AH = 128 = stopped; AH < 128 = reverse; AH > 128 = forward.

---

## Section 11-6: Analog-to-Digital and Digital-to-Analog Converters {#section-11-6}

### 6.1 Why Converters Are Needed

The physical world is analog (continuous voltages representing temperature, pressure, speech, position). The microprocessor is digital (discrete binary values). Converters bridge this gap:

- **DAC (Digital-to-Analog Converter):** Takes an N-bit binary number -> produces an analog voltage.
- **ADC (Analog-to-Digital Converter):** Samples an analog voltage -> produces an N-bit binary number.

---

### 6.2 The DAC0830 Digital-to-Analog Converter

**Manufacturer:** National Semiconductor.
**Resolution:** 8 bits -> 256 output levels.
**Conversion time:** Approximately 1.0 us.

#### Internal Architecture

The DAC0830 contains **two registers in series** followed by the R-2R ladder converter:

```
Data Bus -> [Latch 1 (Input Register)] -> [Latch 2 (DAC Register)] -> [R-2R Ladder] -> Iout1, Iout2
```

**Latch 1 (holding register):** Transparent latch. Data passes through when G = 1 (gate open). Data is latched when G = 0. Controlled by: `ILE`, `CS`, `WR1`.

**Latch 2 (DAC register):** Transparent latch feeding the R-2R ladder directly. Controlled by: `XFER`, `WR2`.

**Latch control logic:**
- Latch 1 G = ILE AND (NOT CS) AND (NOT WR1) - all three must be right to open latch 1.
- Latch 2 G = (NOT XFER) AND (NOT WR2) - XFER and WR2 must both be LOW.

**Simplified interface (bypass Latch 1 - most common):**

To use only Latch 2 for direct output:
- Tie `ILE` = 1 (HIGH, always).
- Tie `CS` = 0 (LOW, always selected) OR use it as the decoded port select.
- This makes Latch 1 always transparent; only Latch 2 holds the output value.

#### The R-2R Ladder Network

The R-2R ladder is the core analog circuit. It converts a binary input to a current:

```
                  2R   2R   2R   2R  (... 8 resistors total)
VCC -|---R---|---R---|---R---|---R---|--- GND
     |       |       |       |
     2R      2R      2R      2R
     |       |       |       |
    D7      D6      D5      D0  (bit-switched current sources)
     |                         |
     +---------- Iout1 --------+
```

- Each bit's switch connects its node either to the output (logic 1) or to ground (logic 0).
- The current at Iout1 is proportional to the binary value: `Iout1 = (digital_input / 256) x (Vref / R)`.

**Output voltage calculation:**

With an external op-amp (inverting configuration, feedback resistor = Rfb, which is conveniently brought out as a pin on the DAC0830):

```
Vout = -Vref x (digital_input / 255)
```

Note: Vout polarity is opposite to Vref.

Example: Vref = -5V, input = 10010010b = 146 decimal:
```
Vout = -(-5) x (146 / 255) = +5 x 0.573 = +2.86 V
```

**Tip:** Set Vref = -5.1 V to make each LSB exactly +0.02 V for clean calculations.

#### External Op-Amp Interface

The Iout1 and Iout2 pins drive a 741 or equivalent op-amp configured as a **current-to-voltage converter**:

```
         Rfb (from pin 9 of DAC0830)
         |
Iout1 ---|----+-----> Vout
         |    |
         |-op-|
         |amp |
Iout2 ---+    |
              |
             GND
```

#### Interfacing to the Microprocessor

```asm
; Write a byte to the DAC at port 20H
MOV AL, [data_byte]   ; 8-bit digital value
OUT 20H, AL           ; Latch 2 captures this; R-2R produces analog output
```

The PLD decoder generates the write strobe for CS/WR1 when address 20H is decoded and IOWC is asserted.

---

### 6.3 The ADC0804 Analog-to-Digital Converter

**Manufacturer:** National Semiconductor (ADC080X family).
**Resolution:** 8 bits -> 256 quantization levels.
**Conversion time:** Up to 100 us (depends on clock frequency).
**Technique:** Successive Approximation Register (SAR).

#### Successive Approximation (SAR) Algorithm

The SAR is the core logic. It finds the digital equivalent by **binary search**:

1. Set the MSB (bit 7) to 1, all others 0. Compare the resulting analog output with the input.
   - If DAC output > analog input: bit 7 = 0.
   - If DAC output <= analog input: bit 7 = 1 (keep it).
2. Repeat for bits 6, 5, ..., 0.
3. After 8 comparisons, the 8-bit result is the digital code.

This is an N-step process for an N-bit converter (always exactly 8 clock cycles for 8 bits).

#### Pin Definitions

| Pin | Function |
|-----|----------|
| `VIN(+)` | Non-inverting analog input |
| `VIN(-)` | Inverting analog input (differential; tie to GND for 0-5V range) |
| `VREF/2` | Reference voltage / 2. If unconnected, uses VCC/2 = 2.5V, giving 0-5V range. Connect to set a different full-scale range. |
| `CLK IN` | External clock input |
| `CLK R` | Clock resistor pin (for internal RC oscillator) |
| `CS` | Chip Select, active LOW |
| `RD` | Read, active LOW. Also holds INTR HIGH during a read. |
| `WR` | Write, active LOW. Pulsing WR with CS LOW **starts a conversion**. |
| `INTR` | Interrupt, active LOW. Goes LOW when conversion is **complete** (end of conversion). |
| `DB7-DB0` | 8-bit digital output (three-state, enabled by RD LOW). |

#### Clock Generation

The ADC0804 requires a clock between **100 kHz and 1460 kHz**. Use 1460 kHz for fastest conversion.

**Option 1: External clock** - Apply clock signal directly to CLK IN.

**Option 2: Internal RC oscillator** - Connect an R and C between CLK R (pin 19) and CLK IN (pin 4):

```
f_clk = 1 / (1.1 x R x C)
```

For f = 1460 kHz: use R = 10 kOhm, C = 62 pF (approximately).

Standard design uses R = 10 kOhm, C = 0.001 uF:
```
f = 1 / (1.1 x 10000 x 0.000000001) = 1 / 0.000000011 = ~90.9 kHz
```
Note: adjust C to achieve the desired clock frequency.

#### Differential Analog Inputs

The ADC0804 accepts a **differential input** (VIN(+) minus VIN(-)):

- **Single-ended 0 to +5V input:** Connect VIN(+) to your signal, VIN(-) to GND.
- **Offset input (does not start at 0V):** Apply the offset voltage to VIN(-). The ADC will measure the difference VIN(+) - VIN(-). Example: VIN(-) = +1V means the ADC measures 0 when VIN(+) = 1V and full scale when VIN(+) = 5V.

#### Conversion Timing Sequence

This is the **most important exam topic** for the ADC0804:

```
Step 1: Start conversion
        Assert CS LOW and pulse WR LOW then HIGH
        (Both CS and WR must be LOW simultaneously)

Step 2: Conversion in progress
        INTR is HIGH (or goes HIGH after brief setup)
        Conversion takes 8/f_clk seconds (8 SAR steps)
        At 1460 kHz -> ~5.5 us per step -> ~44 us total

Step 3: End of conversion
        INTR goes LOW to signal that the digital result is ready

Step 4: Read the result
        Assert CS LOW and RD LOW
        Digital output DB7-DB0 is placed on the data bus
        INTR returns HIGH (cleared by the read)
```

```
WR:   __|____|_________________________________
CS:   __|__________________________________|___
INTR: _____________________|________________|__  (goes LOW = done)
RD:   ________________________________________|__|_
      Start                                Read
```

#### Interfacing to the Microprocessor

```asm
; ADC0804 at port 40H (data), port 42H has INTR on bit 7

ADC PROC NEAR
    OUT 40H, AL         ; Pulse WR (CS already LOW from decoding): starts conversion
    .REPEAT
        IN  AL, 42H     ; Read INTR status port
        TEST AL, 80H    ; Check bit 7 (INTR, active LOW -> bit is LOW when done)
    .UNTIL ZERO?        ; Loop until INTR = 0 (conversion complete)
    IN  AL, 40H         ; Read the digital result (also clears INTR)
    RET
ADC ENDP
```

**Alternative without polling:** Connect INTR to an interrupt input (e.g., INT0 or IR1 of 8259). When conversion completes, INTR causes an interrupt and the ISR reads the result.

**Alternative with fixed delay:** If timing is known and CLK frequency is set, a time delay of at least 100 us can replace the INTR polling loop:

```asm
ADC_FAST PROC NEAR
    OUT 40H, AL         ; Start conversion
    CALL DELAY_100US    ; Wait at least one conversion cycle
    IN  AL, 40H         ; Read result (guaranteed done by now)
    RET
ADC_FAST ENDP
```

---

### 6.4 Combined ADC-DAC Application: Speech Record and Playback

This is the textbook application showing both converters working together:

**Hardware:**
- Microphone -> amplifier -> ADC0804 (at ports 700H/702H).
- DAC0830 (at port 704H) -> op-amp -> speaker + Darlington driver (Q1).

**Software concept:**

```asm
; Record 2048 samples at 2048 samples/second -> 1 second of speech
; Each sample = 1 byte, stored in array WORDS

READS PROC NEAR USES ECX DX
    MOV ECX, 2048           ; 2048 samples
    MOV DX, 700H            ; ADC data port
    .REPEAT
        OUT DX, AL          ; Start conversion (WR pulse)
        ADD DX, 2           ; Switch to status/INTR port (702H)
        .REPEAT
            IN  AL, DX      ; Poll INTR
            TEST AL, 80H
        .UNTIL ZERO?        ; Wait for conversion complete
        SUB DX, 2           ; Back to data port (700H)
        IN  AL, DX          ; Read digital sample
        MOV WORDS[ECX-1], AL ; Store in memory array
        CALL DELAY           ; Wait for next sample interval (1/2048 sec)
    .UNTILCXZ
    RET
READS ENDP

; Playback: send stored samples to DAC at same 2048 samples/second rate
PLAYS PROC NEAR USES DX ECX
    MOV ECX, 2048
    MOV DX, 704H            ; DAC port
    .REPEAT
        MOV AL, WORDS[ECX-1]
        OUT DX, AL           ; Send sample to DAC -> analog output
        CALL DELAY           ; Same time delay as recording
    .UNTILCXZ
    RET
PLAYS ENDP
```

**Sample rate justification:** 2048 samples/second provides acceptable speech quality. The delay loop ensures a constant inter-sample interval (1/2048 sec = ~488 us).

---

## Quick-Reference Summary Tables {quick-reference}

### I/O Instruction Summary

| Instruction | Width | Port Address | Registers |
|-------------|-------|-------------|-----------|
| IN AL, p8 | 8-bit | 8-bit immediate (00H-FFH) | AL |
| IN AX, p8 | 16-bit | 8-bit immediate | AX |
| IN AL, DX | 8-bit | 16-bit in DX (0000H-FFFFH) | AL |
| IN AX, DX | 16-bit | 16-bit in DX | AX |
| INSB | 8-bit | DX -> memory ES:[DI] | DI +/- 1 |
| OUT p8, AL | 8-bit | 8-bit immediate | AL |
| OUT DX, AL | 8-bit | 16-bit in DX | AL |
| OUTSB | 8-bit | memory DS:[SI] -> DX | SI +/- 1 |

### 82C55 Signal Summary

| Signal | Mode | Direction | Function |
|--------|------|-----------|----------|
| STB | 1 (Input) | External -> PPI | Strobe: clocks data into input latch |
| IBF | 1 (Input) | PPI -> External | Input Buffer Full: data is latched |
| INTR | 1 & 2 | PPI -> CPU | Interrupt Request |
| INTE | 1 & 2 | Internal | Interrupt Enable (set via BSR on Port C) |
| OBF | 1 (Output), 2 | PPI -> External | Output Buffer Full: data ready for peripheral |
| ACK | 1 (Output), 2 | External -> PPI | Acknowledge: peripheral has taken data |

### 8254 Mode Quick Reference

| Mode | Name | Trigger | OUT behavior | GATE role | Repeating? |
|------|------|---------|-------------|-----------|-----------|
| 0 | Interrupt on TC | Software | LOW after CW, HIGH at TC | Enable/disable | No |
| 1 | HW One-Shot | GATE rising edge | LOW for N CLKs | Trigger/retrigger | No |
| 2 | Rate Generator | Auto | HIGH, 1-CLK LOW pulse per N | Enable/disable | YES |
| 3 | Square Wave | Auto | N/2 HIGH, N/2 LOW | Enable/disable | YES |
| 4 | SW Strobe | Software | HIGH, 1-CLK LOW pulse at TC | Enable/disable | No |
| 5 | HW Strobe | GATE rising edge | HIGH, 1-CLK LOW pulse at TC | Trigger/retrigger | No |

### ADC0804 Conversion Timing Summary

| Step | Signal | Action |
|------|--------|--------|
| 1 | WR LOW (with CS LOW) | Starts conversion; internal SAR begins |
| 2 | WR HIGH | Conversion in progress |
| 3 | INTR goes LOW | Conversion complete; data ready on DB7-DB0 |
| 4 | RD LOW (with CS LOW) | Reads 8-bit result; INTR clears (goes HIGH) |

### DAC0830 Output Voltage Formula

```
Resolution (step voltage) = -Vref / 255

Vout = -Vref x (digital_input / 255)
     = +|Vref| x (digital_input / 255)  [since Vref is typically negative]

Full scale (FFH = 255): Vout = +|Vref|
Mid scale (80H = 128):  Vout = +|Vref| x 128/255 ~= Vref/2
Zero (00H = 0):         Vout = 0V
```

---

## Common Exam Questions and Worked Answers

**Q1. What is the difference between fixed and variable port addressing?**

Fixed port addressing uses an 8-bit immediate operand encoded in the instruction (e.g., `IN AL, 0F0H`). It can address only ports 00H-FFH. Variable port addressing places the 16-bit port number in DX (e.g., `IN AL, DX`), allowing access to any of the 65,536 ports (0000H-FFFFH).

**Q2. Why must a latch be used for output but not necessarily for input?**

During an OUT instruction, data is on the bus for less than 1 microsecond. Without a latch, an LED or motor sees the data only briefly and cannot respond. A latch captures and holds the value until the next write. For input, the three-state buffer simply enables the external data onto the bus when the IN instruction requests it; no holding is needed because the CPU latches the data internally.

**Q3. Write the 82C55 command byte for: Port A = Mode 1 Input, Port B = Mode 0 Output, PC upper = Input, PC lower = Output.**

```
Bit 7: 1 (Command Byte A)
Bit 6,5: 01 (Group A = Mode 1)
Bit 4: 1 (Port A = Input)
Bit 3: 1 (Port C upper = Input)
Bit 2: 0 (Group B = Mode 0)
Bit 1: 0 (Port B = Output)
Bit 0: 0 (Port C lower = Output)

Command byte = 1 01 1 1 0 0 0 = 1011 1000 = B8H
```

**Q4. An 8254 has an 8 MHz input clock. What count must be loaded to generate a 5 kHz square wave on Mode 3?**

```
Count = f_clk / f_out = 8,000,000 / 5,000 = 1600

Control word: Mode 3, binary, LSB+MSB, for Counter 0:
00 11 011 0 = 36H

OUT CTRL, 36H   ; Control word
OUT CNT0, 00H   ; LSB of 1600 = 0x640 -> 40H
OUT CNT0, 06H   ; MSB of 1600 -> 06H
```

Wait - 1600 decimal = 0640H. LSB = 40H, MSB = 06H:

```asm
MOV AL, 36H
OUT CTRL, AL
MOV AL, 40H     ; LSB of 1600 = 0640H
OUT CNT0, AL
MOV AL, 06H     ; MSB
OUT CNT0, AL
```

**Q5. An ADC0804 has a reference of Vref/2 = 2.0V (so full scale = 4.0V). What digital output results from a 2.5V input?**

```
Full scale voltage = 2 x Vref/2 = 4.0V
LSB size = 4.0V / 256 = 15.625 mV
Digital output = Vin / LSB = 2.5V / 0.015625 = 160 = A0H
```

**Q6. Why is the Counter Latch Command necessary for reading a 16-bit counter?**

The counter decrements on every CLK cycle. Reading the LSB and MSB as two separate IN instructions risks the counter crossing a byte boundary between the reads (e.g., you read LSB = 00H and the counter rolls to XXXXFFH before you read the MSB, giving a wildly wrong 16-bit value). The Counter Latch Command freezes both bytes simultaneously in an internal latch, which can then be read safely as two consecutive bytes with no ambiguity.

---

*End of Chapter 11 Exam-Ready Study Notes*
*Covers: Sections 11-1, 11-2, 11-3, 11-4, 11-6 | Lectures 10, 11, 12, 13, 15*
