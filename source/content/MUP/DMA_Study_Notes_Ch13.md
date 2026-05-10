## Table of Contents

1. [Motivation and I/O Method Comparison](#1-motivation-and-io-method-comparison)
2. [Basic DMA Operation](#2-basic-dma-operation)
3. [Signal Compatibility: The 8086/8088 Problem](#3-signal-compatibility-the-80868088-problem)
4. [The 8237 DMA Controller - Architecture](#4-the-8237-dma-controller---architecture)
5. [8237 Internal Registers - Deep Dive](#5-8237-internal-registers---deep-dive)
6. [8237 Pin Functions - Complete Reference](#6-8237-pin-functions---complete-reference)
7. [Priority Schemes](#7-priority-schemes)
8. [Transfer Modes](#8-transfer-modes)
9. [Programming the 8237 - Detailed Sequence](#9-programming-the-8237---detailed-sequence)
10. [Address Latching and the Address Bus](#10-address-latching-and-the-address-bus)
11. [The 8237 Connected to the 80x86 System Bus](#11-the-8237-connected-to-the-80x86-system-bus)
12. [Hardware Interface Examples](#12-hardware-interface-examples)
13. [Shared-Bus Operation and Bus Arbitration](#13-shared-bus-operation-and-bus-arbitration)
14. [Key Equations, Numbers, and Fast Facts](#14-key-equations-numbers-and-fast-facts)
15. [Exam Question Bank](#15-exam-question-bank)

---

## 1. Motivation and I/O Method Comparison

### The Core Problem

Transferring large blocks of data between an I/O device and memory using the CPU directly is wasteful. The CPU is fully occupied fetching, decoding, and executing instructions for every single byte moved - none of that bandwidth goes toward useful computation.

### Three I/O Paradigms Compared

| Criterion | Programmed I/O | Interrupt-Driven I/O | DMA |
|-----------|---------------|---------------------|-----|
| CPU involvement | 100% busy polling | Busy only during ISR | 0% busy during transfer |
| Throughput | Low (CPU bottleneck) | Medium | High (memory-speed limited) |
| Latency | None (immediate) | ISR overhead | HOLD acknowledgment delay |
| Best use case | Slow peripherals, simple systems | Moderate data rates | Large block transfers (disk, video, network) |
| Overhead | Continuous polling wastes cycles | Context save/restore per byte | Setup cost amortized over entire block |

**Key exam point:** DMA CPU overhead = 0% *during* the transfer. There is a one-time setup
cost (programming the controller) and a brief HOLD latency, but once the transfer begins the
CPU is fully stalled (buses in high-impedance) and cannot execute instructions.

### Why DMA Exists

The DMA I/O technique provides direct memory access while the microprocessor is
temporarily disabled. This allows data to be transferred between memory and an I/O device
at a rate limited only by:
- The speed of the memory components, OR
- The speed of the DMA controller (whichever is slower)

**Transfer rate formula:**

```
Max transfer rate = 1 / t_memory     (if DMA controller is faster than memory)
Max transfer rate = f_DMA_controller  (if DMA controller is slower than memory)
```

**Example:** 50 ns DRAM, 15 MHz DMA controller.
- Memory limit: 1 / 50 ns = 20 MB/s
- Controller limit: 15 MHz = 15 MB/s
- Actual rate: 15 MB/s (controller is the bottleneck)

### Common DMA Applications

- DRAM refresh (transparent to software)
- Video display refresh (framebuffer to screen)
- Disk read/write (bulk data)
- High-speed memory-to-memory block copy
- Printer and network interfaces

---

## 2. Basic DMA Operation

### The HOLD/HLDA Handshake

Two dedicated CPU pins manage DMA bus ownership:

| Pin | Direction | Function |
|-----|-----------|----------|
| HOLD | Input to CPU | DMA request: "I need the bus" |
| HLDA | Output from CPU | DMA grant: "The bus is yours" |

**Sequence of events:**

```
1. DMA controller asserts HOLD = 1
2. CPU finishes current bus cycle (sampled mid-cycle)
3. CPU tri-states address, data, and control buses (high-impedance)
4. CPU asserts HLDA = 1
5. DMA controller takes control of all buses
6. DMA transfer proceeds at memory speed
7. DMA controller de-asserts HOLD
8. CPU re-asserts bus ownership, resumes execution
```

**Critical timing facts:**
- HOLD is sampled in the **middle** of a clocking cycle (not at instruction boundaries)
- HOLD can therefore interrupt an instruction mid-execution
- Interrupts (INTR, NMI) take effect only at the **end** of an instruction
- Therefore: **HOLD has higher priority than INTR or NMI**
- The only pin with higher priority than HOLD: **RESET**
- Note: HOLD must NOT be active during a RESET or reset behavior is undefined

**High-impedance state:** When the CPU relinquishes the bus, it "disappears" electrically.
The DMA controller then drives address, data, and control lines directly.

### DMA Read vs. DMA Write

These terms are defined from the **memory's perspective**, not the CPU's:

| Operation | Signal Pair | Data Direction |
|-----------|-------------|----------------|
| DMA Read | MRDC + IOWC both active | Memory -> I/O device |
| DMA Write | MWTC + IORC both active | I/O device -> Memory |

Both memory and I/O are controlled **simultaneously** - this is only possible because the
system has separate memory control signals (MRDC/MWTC) and I/O control signals (IORC/IOWC).

**Key point:** During a DMA transfer, the address bus carries the **memory address**, not an
I/O port address. The I/O device is selected not by address decoding but by the **DACK**
(DMA Acknowledge) signal from the 8237.

---

## 3. Signal Compatibility: The 8086/8088 Problem

### The Problem

The 8086/8088 processors do **not** have dedicated MRDC, MWTC, IORC, IOWC pins.
Instead, they output status bits S0, S1, S2 which encode the current bus cycle type.

The 8237 DMA controller requires these four separate control signals to coordinate
simultaneous memory and I/O accesses during a transfer.

### Solution: The 8288 System Bus Controller

The **8288 System Bus Controller** decodes S0, S1, S2 to generate:

| 8288 Output | Function |
|-------------|----------|
| MRDC (MEMR) | Memory Read Command |
| MWTC (MEMW) | Memory Write Command |
| IORC (IOR)  | I/O Read Command |
| IOWC (IOW)  | I/O Write Command |
| ALE         | Address Latch Enable |
| DEN         | Data Enable (bus transceiver direction) |
| DT/R        | Data Transmit/Receive |

**S-bit encoding (8086/8088):**

| S2 | S1 | S0 | Bus Cycle |
|----|----|----|-----------|
| 0  | 0  | 0  | Interrupt Acknowledge |
| 0  | 0  | 1  | I/O Read |
| 0  | 1  | 0  | I/O Write |
| 0  | 1  | 1  | Halt |
| 1  | 0  | 0  | Code Fetch |
| 1  | 0  | 1  | Memory Read |
| 1  | 1  | 0  | Memory Write |
| 1  | 1  | 1  | Passive (no bus cycle) |

### Alternative: Discrete Gate Circuit

If a full 8288 is not used, discrete logic (as shown in Figure 13-2 of the textbook) using
a **74F257 multiplexer** and **74F04 inverters** can generate IORC, IOWC, MRDC, MWTC from:
- W/R (write/read signal from CPU)
- M/IO (memory/IO select from CPU)
- HLDA (to switch between normal CPU control and DMA control)

**Why the 8237 decoder does NOT use the 8086/8088 IO/M signal directly:**
The 8237 contains its own new-generation memory and I/O control signals internally. The
decoder for the 8237's chip-select (CS pin) must use the DMA controller's own MEMR, MEMW,
IOR, IOW outputs, NOT the CPU's IO/M signal.

---

## 4. The 8237 DMA Controller - Architecture

### Overview

The 8237 is effectively a **special-purpose microprocessor** designed for one job:
high-speed data transfer between memory and I/O.

**Key specifications:**

| Parameter | Value |
|-----------|-------|
| Channels | 4 (expandable via cascade) |
| Max transfer rate | 1.6 MB/s |
| Addressable memory per channel | 64 KB (16-bit address) |
| Max bytes per single programming | 65,536 (64K) |
| Data bus width | 8 bits |
| Address bus width | 16 bits (sent in two 8-bit halves) |
| Compatible CPUs | 8086/8088 family |

**Important nuance:** Each channel can address a full 64 KB section, but that section must
lie within a single 64 KB boundary. The upper address bits (A16-A23 or A16-A31) are set
separately in the **DMA Page Register** (an external latch), not in the 8237 itself.

### Block Diagram Key Components

```
+--------------------------------------------------+
|                    8237 Internals                |
|                                                  |
|  Per-channel registers (x4):                    |
|    Current Address Register (CAR)  [16-bit]     |
|    Current Word Count Register (CWCR) [16-bit]  |
|    Base Address Register (BA)     [16-bit]      |
|    Base Word Count Register (BWC) [16-bit]      |
|    Mode Register (MR)             [6-bit]       |
|                                                  |
|  Global registers:                              |
|    Command Register (CR)          [8-bit]       |
|    Status Register (SR)           [8-bit]       |
|    Request Register (RQ)          [4-bit]       |
|    Mask Register (MRSR/MSR)       [4-bit]       |
|    Temporary Register             [8-bit]       |
|                                                  |
|  Internal control:                              |
|    First/Last Flip-Flop (F/L)     [1-bit]       |
|    Priority Encoder + Rotating Logic            |
|    Timing and Control Logic                     |
+--------------------------------------------------+
```

### The Temporary Register (Memory-to-Memory Transfers)

The **Temporary Register** is an 8-bit internal holding register used exclusively during
memory-to-memory DMA transfers. It acts as a middle-man:

```
Step 1: 8237 reads byte from source address (CH0) -> stored in Temporary Register
Step 2: 8237 writes byte from Temporary Register -> destination address (CH1)
```

This is analogous to the CPU's `MOVSB` instruction, but faster. The 8237 requires
only 2.0 us/byte vs. 4.2 us/byte for a repeated MOVSB on the 8088.

**Note:** Most modern chip sets do NOT support memory-to-memory transfers. This feature
is specific to the discrete 8237 in legacy systems.

---

## 5. 8237 Internal Registers - Deep Dive

### 5.1 Current Address Register (CAR)

- 16-bit register, one per channel (4 total)
- Holds the memory address for the next DMA byte transfer
- **Auto-increments or auto-decrements** after each byte (programmable via Mode Register)
- Read back via I/O port after clearing F/L flip-flop

### 5.2 Current Word Count Register (CWCR)

- 16-bit register, one per channel
- Programmed with: **(number of bytes to transfer) - 1**
- Example: To transfer 256 bytes, load 255 (0x00FF)
- **Decrements by 1** after each byte transferred
- When it rolls over from 0x0000 to 0xFFFF, the **Terminal Count (TC)** flag is set
- TC terminates the DMA transfer for most modes

### 5.3 Base Address (BA) and Base Word Count (BWC) Registers

- Used only when **Auto-Initialization** mode is enabled
- These are write-only "shadow" registers
- After TC is reached and the transfer ends, the 8237 reloads CAR from BA and CWCR from BWC
- Allows the same transfer to be repeated without CPU reprogramming
- Useful for continuous I/O devices (e.g., audio streaming)

### 5.4 Command Register (CR)

8-bit write-only register. Bit functions:

| Bit | Value = 0 | Value = 1 |
|-----|-----------|-----------|
| 0 | Memory-to-memory DISABLE | Memory-to-memory ENABLE |
| 1 | CH0 address hold DISABLE (if bit0=0) | CH0 address hold ENABLE |
| 2 | Controller ENABLE | Controller DISABLE |
| 3 | Normal timing (4 clocks/cycle) | Compressed timing (2 clocks/cycle) |
| 4 | Fixed priority | Rotating priority |
| 5 | Late write selection (if bit3=1) | Extended write selection |
| 6 | DREQ sense ACTIVE HIGH | DREQ sense ACTIVE LOW |
| 7 | DACK sense ACTIVE LOW | DACK sense ACTIVE HIGH |

**Critical exam point on bit 1 (CH0 address hold):**
When enabled, channel 0's address register does NOT increment/decrement. This allows
the same source byte to be copied to an entire destination block - useful for memory fill
operations (e.g., clearing video RAM to ASCII space 0x20).

**Compressed timing (bit 3):** Reduces each DMA cycle from 4 clocks to 2 clocks,
doubling theoretical throughput. Only usable with fast memory.

### 5.5 Mode Register (MR)

One 6-bit mode register per channel, selected by bits [1:0]:

| Bits [1:0] | Channel selected |
|------------|-----------------|
| 00 | Channel 0 |
| 01 | Channel 1 |
| 10 | Channel 2 |
| 11 | Channel 3 |

| Bits [3:2] | Transfer type |
|------------|--------------|
| 00 | Verify transfer (generates addresses, no actual R/W) |
| 01 | Write transfer (I/O -> Memory) |
| 10 | Read transfer (Memory -> I/O) |
| 11 | Illegal |

| Bit 4 | Auto-initialization |
|-------|---------------------|
| 0 | Disabled |
| 1 | Enabled (reload from BA/BWC on TC) |

| Bit 5 | Address direction |
|-------|-------------------|
| 0 | Increment after each byte |
| 1 | Decrement after each byte |

| Bits [7:6] | DMA mode |
|------------|----------|
| 00 | Demand mode |
| 01 | Single mode |
| 10 | Block mode |
| 11 | Cascade mode |

### 5.6 The Four DMA Modes Explained

**Demand Mode (00):**
- 8237 transfers bytes continuously as long as DREQ is asserted
- Transfer pauses if DREQ drops (device not ready) and resumes when DREQ re-asserts
- Terminates on: external EOP signal OR DREQ going inactive OR TC
- Best for: devices that can stream data but may occasionally need to pause

**Single Mode (01):**
- Transfers exactly ONE byte per HOLD/HLDA handshake
- After each byte, HOLD is released - CPU gets one bus cycle - then if DREQ still active,
  the 8237 re-requests HOLD
- Highest CPU responsiveness (CPU gets bus between every byte)
- Best for: slow peripherals where CPU needs bus access between bytes

**Block Mode (10):**
- 8237 seizes the bus and transfers ALL bytes (entire CWCR count) without releasing HOLD
- DREQ need not remain asserted through the entire transfer
- CPU is locked out for the duration - potentially a long time for large blocks
- Fastest throughput; worst CPU latency
- Best for: maximum speed disk reads/writes where CPU latency is acceptable

**Cascade Mode (11):**
- Used to daisy-chain multiple 8237 chips for more than 4 channels
- The HRQ/HLDA of the slave 8237 connects to the DREQ/DACK of the master 8237
- The slave's priority is inherited from whichever master channel it connects to

### 5.7 Request Register (BR / Bus Request)

- 4-bit register (one bit per channel)
- Used to initiate a DMA transfer via **software** (no external DREQ needed)
- Critical for memory-to-memory transfers where there is no external device to assert DREQ
- Writing bit[2]=1 sets the request; bit[2]=0 clears it (combined with channel select in bits[1:0])

### 5.8 Mask Register Set/Reset (MRSR)

- Controls individual channel masks
- **RESET sets all channel masks** (disables all channels)
- To enable a channel: write 0 to that channel's mask bit (clear = enabled)
- To disable a channel: write 1 to that channel's mask bit (set = disabled)

### 5.9 Mask Register (MSR)

- Sets or clears ALL four channel masks with a single write
- Bits [3:0] correspond to channels [3:0]
- More efficient than MRSR when enabling/disabling multiple channels simultaneously

### 5.10 Status Register (SR) - Read Only

8-bit read-only register:

| Bits [3:0] | Terminal count flags (CH3:CH0) |
| Bits [7:4] | DMA request pending flags (CH3:CH0) |

- TC bit = 1 means that channel has completed its entire programmed transfer
- Request bit = 1 means DREQ is currently active for that channel
- Reading the status register clears the TC bits

### 5.11 The First/Last Flip-Flop (F/L)

**The fundamental problem:** The 8237 has an 8-bit data bus but 16-bit address and word-count
registers. Loading a 16-bit value requires two consecutive 8-bit writes to the same port address.

**Solution:** The F/L (First/Last) flip-flop acts as a byte pointer:
- F/L = 0: Next write to the register goes to the **Low Byte** (A0-A7 or W0-W7)
- F/L = 1: Next write to the register goes to the **High Byte** (A8-A15 or W8-W15)
- The F/L **automatically toggles** after every read or write to an address/count register
- **Programming order: always Low Byte first, then High Byte**

**CRITICAL:** If the F/L flip-flop is in an unknown state when you start programming, the
high byte ends up in the low byte register and vice versa - your address is completely wrong.

**Therefore: The FIRST step of every 8237 initialization must be to clear the F/L flip-flop**
using the "Clear Byte Pointer Flip-Flop" software command.

---

## 6. 8237 Pin Functions - Complete Reference

### Control Pins

| Pin | Direction | Description |
|-----|-----------|-------------|
| CLK | Input | System clock. Must be <= 5 MHz for standard 8237. In 8086/8088 systems, the clock must be **inverted** for proper operation. |
| CS (active low) | Input | Chip Select - enables the 8237 for programming by the CPU. Connected to decoder output. |
| RESET | Input | Clears command, status, request, and temporary registers. Clears F/L flip-flop. **Sets all mask register bits** (disables all channels). |
| READY | Input | Logic 0 forces 8237 to insert wait states for slow memory or I/O devices. |

### DMA Handshake Pins

| Pin | Direction | Description |
|-----|-----------|-------------|
| HRQ | Output | Hold Request. Connected to CPU HOLD input. Asserted by 8237 to request bus ownership. |
| HLDA | Input | Hold Acknowledge. Connected to CPU HLDA output. Signals 8237 that CPU has released the bus. |

### Channel Request/Acknowledge Pins

| Pin | Direction | Description |
|-----|-----------|-------------|
| DREQ0-DREQ3 | Input | DMA Request from I/O device. Polarity is programmable (active high or low) via Command Register bit 6. |
| DACK0-DACK3 | Output | DMA Acknowledge to I/O device. Polarity programmable via Command Register bit 7. Functions as the **chip select** for the I/O device during DMA transfer (replaces normal I/O address decoding). |

**Exam trap:** During DMA, the address bus carries the memory address, NOT an I/O port address.
The I/O device cannot be selected by address decoding. DACK substitutes for the chip-select function.

### Address and Data Pins

| Pin | Direction | Description |
|-----|-----------|-------------|
| A0-A3 | Bidirectional | During programming: input (select internal register). During DMA: output (lower 4 bits of transfer address, A0-A3). |
| A4-A7 | Output | Upper 4 bits of lower byte of DMA address. Output only. |
| DB0-DB7 | Bidirectional | Data bus. Used during CPU programming and also for **multiplexed address bits A8-A15** during DMA (latched externally). |

### DMA Control Output Pins

| Pin | Direction | Description |
|-----|-----------|-------------|
| AEN | Output | Address Enable. Goes high during DMA. Disables CPU bus drivers (latches A and C) and enables DMA address latches. Also used to disable system buffers connected to the CPU. |
| ADSTB | Output | Address Strobe. Functions like ALE but generated by DMA controller. **Clocks upper address bits A8-A15 (carried on DB0-DB7) into the address latch** (74LS373) during DMA. |
| MEMR (MEMR-bar) | Output | Memory Read. Causes memory to output data during a DMA Read cycle. |
| MEMW (MEMW-bar) | Output | Memory Write. Causes memory to accept data during a DMA Write cycle. |
| IOR (IOR-bar) | Bidirectional | I/O Read. During programming: input (CPU reads from 8237). During DMA: output. |
| IOW (IOW-bar) | Bidirectional | I/O Write. During programming: input (CPU writes to 8237). During DMA: output. |
| EOP (EOP-bar) | Bidirectional | End of Process. As input: externally terminates a DMA transfer early. As output: signals TC reached. Often used to trigger a CPU interrupt at transfer completion. |

### The Critical ADSTB Mechanism (Frequently Examined)

The 8237 has only 16 address output bits (A0-A15), but uses the **data bus pins DB0-DB7**
to multiplex the upper byte of the address (A8-A15) at the beginning of each DMA cycle.
The sequence:

```
1. 8237 places A8-A15 on DB0-DB7 (address bus pins A0-A7 carry A0-A7)
2. 8237 asserts ADSTB (Address Strobe)
3. External 74LS373 latch captures A8-A15 on the falling edge of ADSTB
4. 8237 de-asserts ADSTB; DB0-DB7 now carry actual data
5. A8-A15 remain valid on the latch outputs throughout the DMA cycle
```

Without the ADSTB/latch mechanism, A8-A15 would disappear when the data bus is used
for actual data transfer.

---

## 7. Priority Schemes

### Fixed Priority

The default scheme after RESET.

| Priority | Channel |
|----------|---------|
| 1 (Highest) | Channel 0 |
| 2 | Channel 1 |
| 3 | Channel 2 |
| 4 (Lowest) | Channel 3 |

**Problem:** If Channel 0 has a continuous stream of requests, Channels 1-3 may never
be serviced (priority starvation).

### Rotating Priority

Selected by Command Register bit 4 = 1.

**Rule:** After a channel is serviced, it immediately drops to the lowest priority position.
All other channels shift up by one.

**Example:**
- Initial state: CH0 > CH1 > CH2 > CH3
- CH2 is serviced
- New state: CH3 > CH0 > CH1 > CH2 (CH2 is now lowest)
- CH3 is serviced
- New state: CH0 > CH1 > CH2 > CH3 (restored to original, but via rotation)

**Purpose:** Ensures all channels receive roughly equal service over time.
Prevents any single channel from monopolizing the controller.

**Exam question pattern:** "Which priority scheme prevents starvation?" -> Rotating priority.

---

## 8. Transfer Modes

### How the DREQ/DACK Handshake Works

```
I/O Device            8237                 CPU
    |                   |                   |
    |---DREQ (assert)-->|                   |
    |                   |---HRQ (assert)--->|
    |                   |                   | (finishes current bus cycle)
    |                   |<---HLDA (assert)--|
    |<---DACK (assert)--|                   |
    |                   |                   |
    | <-- DMA byte transferred via buses -->|
    |                   |                   |
    |---DREQ (release)--|                   |
    |<---DACK (release)-|                   |
    |                   |---HRQ (release)-->|
    |                   |<---HLDA (release)-|
```

### Wait States via READY Pin

For slow memory or I/O devices, the 8237's READY input controls timing:
- READY = 1 (or unconnected high): Normal DMA cycle (no wait states)
- READY = 0: 8237 inserts wait states (extends the transfer cycle) until READY returns high

This mirrors the CPU's own READY pin mechanism. In systems with mixed-speed memory,
READY allows the DMA controller to accommodate the slowest device without timing violations.

---

## 9. Programming the 8237 - Detailed Sequence

### Required I/O Port Addresses (Per-Channel)

The 8237 occupies 16 consecutive I/O port addresses (A3-A0 select registers):

In a PC system:
- Channels 0-3: ports 0x0000-0x000F
- Channels 4-7 (second 8237): ports 0x00C0-0x00DF (even addresses only)

### Step-by-Step Programming Order

This is the canonical order required for correct operation:

```
Step 1: MASTER CLEAR
   - Output any value to the Master Clear port
   - Equivalent to asserting RESET
   - Clears: command, status, request, temporary registers, F/L flip-flop
   - Sets: all mask bits (all channels disabled)

Step 2: SET THE MODE REGISTER (for each channel to be used)
   - Select channel, transfer type, auto-init, address direction, DMA mode
   - Write to Mode Register port

Step 3: CLEAR THE F/L FLIP-FLOP
   - Output any value to the Clear Byte Pointer port
   - Ensures the next write to address/count register targets the LOW BYTE

Step 4: PROGRAM THE BASE AND CURRENT ADDRESS (Low Byte then High Byte)
   - OUT port_CH_A, low_byte     ; F/L auto-toggles to 1 after this
   - OUT port_CH_A, high_byte    ; F/L auto-toggles to 0 after this

Step 5: PROGRAM THE BASE AND CURRENT WORD COUNT (Low Byte then High Byte)
   - Value = (number_of_bytes - 1)
   - OUT port_CH_C, low_byte
   - OUT port_CH_C, high_byte

Step 6: PROGRAM THE COMMAND REGISTER (global settings)
   - Enable/disable memory-to-memory, set priority scheme, compressed timing, etc.

Step 7: CLEAR THE MASK BIT (enable the channel)
   - Write to MRSR (Mask Register Set/Reset): channel select + clear bit
   - This "unmasks" the channel, allowing it to respond to DREQ
```

**Shorthand (for memory-to-memory, no external DREQ):**
After steps 1-7, write to the Request Register to initiate a software DMA request.

### Software Commands Reference

These three commands require no data byte pattern - a simple OUT to the correct port triggers them:

| Command | Effect |
|---------|--------|
| Clear Byte Pointer Flip-Flop | Sets F/L = 0 (next access is Low Byte) |
| Master Clear | Same as hardware RESET (clears everything, sets all masks) |
| Clear Mask Register | Clears all four mask bits (enables all four channels simultaneously) |

---

## 10. Address Latching and the Address Bus

### The 16-bit to 64-bit Address Problem

The 8086/8088 can address up to 1 MB (20-bit address) or more. The 8237 internally generates
only a 16-bit address (A0-A15), covering a 64 KB window. To reach any location in memory,
additional upper address bits must be supplied externally.

### Architecture of Address Generation During DMA

```
Address bit range | Source during DMA     | Hardware
------------------|-----------------------|--------------------
A0-A7             | 8237 pins A0-A7       | Direct output
A8-A15            | 8237 DB0-DB7 + ADSTB  | Latched into 74LS373 (Latch D in Fig 13-12)
A16-A23           | DMA Page Register     | External 4/8-bit latch (Latch B)
A24-A31           | High Page Register    | Chip-dependent (Table 13-1)
```

### The Page Register

The DMA Page Register is an external latch (separate chip) that holds the upper address bits
(A16-A23) for the DMA transfer. In a PC:

| Channel | Page Reg Port (A16-A23) | High Page Reg Port (A24-A31) |
|---------|------------------------|------------------------------|
| 0 | 0x0087 | 0x0487 |
| 1 | 0x0083 | 0x0483 |
| 2 | 0x0081 | 0x0481 |
| 3 | 0x0082 | 0x0482 |
| 4 | 0x008F | 0x048F |
| 5 | 0x008B | 0x048B |
| 6 | 0x0089 | 0x0489 |
| 7 | 0x008A | 0x048A |

**Page register constraint:** The 8237 can only transfer within a single 64 KB page boundary.
A DMA transfer **cannot cross a 64 KB boundary**. If your buffer spans two pages, you must
either split the transfer or align the buffer.

### AEN Pin Behavior (Bus Switching)

| State | AEN | Latches A, C | Multiplexer E | Latches D, B |
|-------|-----|--------------|----------------|--------------|
| Normal CPU operation | 0 | ENABLED (drive A0-A7, A16-A19) | ENABLED (provides control) | DISABLED |
| DMA active | 1 | DISABLED (CPU address disconnected) | DISABLED | ENABLED (drive A8-A15, A16-A19 from DMA page reg) |

---

## 11. The 8237 Connected to the 80x86 System Bus

### Complete System Overview (Figure 13-12 Analysis)

In a complete 8088 minimum-mode DMA system, the following components are present:

**Address Latches:**
- **Latch A** (74LS373): Holds CPU address A0-A7 during normal operation (disabled during DMA)
- **Latch B** (74LS373 or 4-bit latch): Holds DMA page address A16-A19 (enabled during DMA)
- **Latch C** (74LS373): Holds CPU address A8-A15 during normal operation (disabled during DMA)
- **Latch D** (74LS373): Captures 8237 ADSTB-latched address A8-A15 (enabled during DMA)

**Multiplexer E** (74LS257):
- During CPU operation (AEN=0): passes CPU control signals
- During DMA (AEN=1): disabled, 8237 takes direct control of control bus

**Decoder F** (74LS138 + NOR gate):
- Decodes the address to generate 8237 CS (chip-select for ports 0x60-0x7F in example)
- Also generates the latch clock for Latch B (page register)

**D Flip-Flop:**
- Synchronizes HOLD to the CPU clock to prevent metastability

### Control Signal Flow During DMA

```
AEN = 0 (CPU in control):
  CPU -> Latch A -> A0-A7 system bus
  CPU -> Latch C -> A8-A15 system bus
  CPU -> Multiplexer E -> MEMR, MEMW, IOR, IOW system bus
  Latch B, Latch D: outputs tri-stated

AEN = 1 (DMA in control):
  8237 -> A0-A7 directly to system bus (via Latch A output enabled by AEN=0 logic)
  8237 (DB0-DB7 + ADSTB) -> Latch D -> A8-A15 system bus
  External Latch B (page reg) -> A16-A19 system bus
  8237 -> MEMR, MEMW, IOR, IOW directly to system bus
  Latch A, Latch C: disabled (AEN=1 forces OE high)
  Multiplexer E: disabled
```

---

## 12. Hardware Interface Examples

### 12.1 Memory-to-Memory Transfer

**Setup:**
- Channel 0: source address (or hold address for fill)
- Channel 1: destination address + byte count
- Command register bit 0 = 1 (enable memory-to-memory)
- Transfer initiated via software request (Bus Request Register)

**Code analysis (Example 13-1 key steps):**

```asm
; 1. Program page register (Latch B) with upper 4 bits of address
MOV AX, ES
MOV AL, AH
SHR AL, 4
OUT LATCHB, AL       ; upper nibble of segment

; 2. Clear F/L flip-flop
OUT CLEARF, AL

; 3. Program CH0 address (source) = ES:SI
MOV AX, ES
SHL AX, 4            ; convert segment to linear (20-bit)
ADD AX, SI           ; add offset
OUT CH0A, AL         ; low byte (F/L = 0 -> low byte, then auto-toggles)
MOV AL, AH
OUT CH0A, AL         ; high byte (F/L = 1 -> high byte)

; 4. Program CH1 address (destination) similarly
; 5. Program count = CX - 1 into CH1C
; 6. Mode: CH0 = block read (0x88), CH1 = block write (0x85)
; 7. Command register = 0x01 (enable memory-to-memory, block transfer)
; 8. Unmask CH0: OUT MASKS, 0x0E (0b00001110 = clear bit 0 = unmask CH0)
; 9. Software request: OUT REQ, 0x04 (set request for CH0)
; 10. Poll status register until bit 0 (CH0 TC) = 1
```

### 12.2 Memory Fill Operation

**Difference from memory-to-memory:**
- Command register bit 1 = 1 (Channel 0 address HOLD)
- Channel 0 source address points to the fill byte (e.g., a single location containing 0x20)
- Channel 0 address does NOT increment
- Channel 1 destination sweeps through the target area

**Application:** Clearing an 80x25 text mode video display (2000 characters).
Each position must be set to 0x20 (ASCII space). With DMA, 2000 bytes are cleared
in approximately 2000 x 2.0 us = 4 ms (vs. ~8.4 ms with repeated MOVSB on an 8088).

### 12.3 DMA-Processed Printer Interface (Figure 13-13)

**Hardware additions to base DMA system:**

```
8237 DREQ3  <-- JK Flip-Flop Q output
                   J = SET by +5V via 1K pullup
                   CLK = printer ACK signal (inverted)
                   K = GND (always 0)
                   CLEAR = DACK3 (from 8237)

8237 DACK3 ---> OR gate --> 74LS373 latch G (enable)
             (combined with IORC)

74LS373 latch D inputs = system data bus
74LS373 latch Q outputs = printer data lines D0-D7

'122 monostable (single-shot) TR16:
   Trigger = latch G enable pulse (IOW during DMA write)
   Output Q = DS (Data Strobe to printer, active low)
   Output Q-bar = DS
```

**Transfer sequence:**

```
1. CPU programs 8237: CH3 address = data buffer, count = N-1, mode = single read
2. CPU enables CH3 (clears mask bit 3)
3. Printer asserts ACK when ready
4. ACK clocks the JK flip-flop -> Q goes high -> asserts DREQ3
5. 8237 asserts HRQ -> CPU asserts HLDA
6. 8237 asserts DACK3 -> clears JK flip-flop -> releases DREQ3
7. 8237 reads one byte from memory and outputs to data bus
8. DACK3 + IORC gates the 74LS373 latch -> data latched for printer
9. Single-shot fires -> DS (Data Strobe) pulse generated for printer
10. HOLD released, CPU resumes
11. Printer processes byte, asserts ACK again -> cycle repeats for next byte
```

**Key architectural insight:** The I/O device (printer latch) is selected by **DACK3 + IORC**,
not by address decoding. The address bus during DMA carries the memory address for the source
buffer, so normal I/O address decoding would select the wrong device.

### 12.4 Double-Buffering with DMA

For continuous printing without stalling:

```
Buffer 1 preparation:
  - Fill Buffer 1 with data
  - Call PRINT (programs 8237 for Buffer 1, enables CH3)
  - DMA printing of Buffer 1 begins immediately

While Buffer 1 is printing:
  - CPU fills Buffer 2 with next data (CPU is free during DMA printing)

Buffer 2 preparation:
  - Call TESTP (poll status until CH3 TC = 1, i.e., Buffer 1 done)
  - Call PRINT for Buffer 2
  - CPU fills Buffer 1 with next data

Repeat until all data printed.
```

This achieves near-continuous printer throughput with minimal CPU overhead.

---

## 13. Shared-Bus Operation and Bus Arbitration

### 13.1 Multiprocessor System Architecture

In systems with multiple CPUs, two bus types are defined:

**Local Bus:**
- Resident to a single microprocessor
- Contains local memory and local I/O
- No special access protocol needed
- Accessed only by its own CPU

**Shared Bus (Remote Bus):**
- Connected to all CPUs in the system
- Contains shared memory and shared I/O
- Only ONE bus master can access it at a time
- Access controlled by a bus arbiter

**In the PC context:**
- What the PC calls its "local bus" IS the shared bus in a multiprocessor view
- The ISA bus operates as a slave to the CPU
- The PCI bus can operate as either slave or master

### 13.2 Bus Master vs. Bus Slave

**Bus Master:** Any device that can seize control of the bus and drive address/data/control.
Examples: CPU, 8237 DMA controller, DMA-capable PCI cards.

**Bus Slave:** A device that responds to bus cycles initiated by a bus master.
Examples: RAM, ROM, most I/O devices.

The 8237 is a **remote bus master** - it seizes the system bus via HOLD/HLDA to perform
transfers. A remote CPU bus master seizes the shared bus via the bus arbiter.

**Key distinction:** An 8237 can only transfer data (fixed function). A remote CPU bus master
can execute arbitrary software while in control of the shared bus.

### 13.3 The 8289 Bus Arbiter

The 8289 resolves priority between multiple CPU bus masters contending for the shared bus.

**Arbitration mechanism:**
- When a CPU needs the shared bus, its 8289 asserts BREQ
- If no other master holds the bus (BUSY not asserted), the 8289 grants access
- If the bus is taken, the 8289 holds the CPU's READY pin LOW (inserts wait states)
- The requesting CPU and its software simply stall until READY goes high
- No special software instructions are required - arbitration is pure hardware

**8289 Operating Modes:**

| Mode | IOB | RESB | Description |
|------|-----|------|-------------|
| Single bus | 1 | 0 | No local bus; CPU accesses only shared bus |
| Resident bus | 1 | 1 | CPU accesses both local and shared bus |
| I/O bus | 0 | 0 | Local bus treated as I/O only; memory on shared bus |
| I/O bus + resident | 0 | 1 | Both local I/O and shared memory/IO |

**Key 8289 pins:**

| Pin | Function |
|-----|----------|
| BPRN | Bus Priority iNput: allows 8289 to claim bus on next BCLK falling edge |
| BPRO | Bus Priority Output: daisy-chain to next 8289's BPRN |
| BREQ | Bus REQuest: output requesting the shared bus |
| BUSY | Indicates bus ownership (output when owning; input to detect others) |
| CBRQ | Common Bus Request: active low while bus is requested or held |
| BCLK | Bus clock (synchronizes all arbiters) |
| LOCK | Prevents bus release during multi-bus-cycle atomic operations |
| CRQLCK | Common Request Lock: prevents surrender to any other 8289 |
| AEN | Address Enable output to bus drivers |
| ANYRQST | Strapping option for priority scheme |
| S0, S1, S2 | Status inputs from CPU (same signals as 8288 input) |
| SYSB/RESB | System bus / Resident bus select |

**Multi-CPU example (3 x 8088 system):**
- CPU A: Single-bus mode - controls shared memory and CRT terminal
- CPU B: Resident-bus mode - handles local telephone interface, reports blocks to shared mem
- CPU C: Resident-bus mode - print spooler (captures shared mem data, prints locally)
- All three operate simultaneously; shared bus accessed only for inter-CPU data transfer

---

## 14. Key Equations, Numbers, and Fast Facts

### Numbers to Memorize

| Fact | Value |
|------|-------|
| 8237 max transfer rate | 1.6 MB/s |
| Modern DMA rates (today's DRAM) | 33-150 MB/s |
| PCI Express (serial) | Exceeds DMA rates |
| SATA serial ATA | 300 Mbps |
| PCI Express (peak) | ~20 Gbps |
| 8237 channels | 4 (per chip) |
| 8237 max bytes per channel per programming | 65,536 (64K) |
| 8237 addressable memory per channel | 64 KB window (page register extends this) |
| 8237 max clock frequency | 5 MHz (standard) |
| 8237 DMA cycle clocks (normal) | 4 clocks |
| 8237 DMA cycle clocks (compressed) | 2 clocks |
| CWCR value for N-byte transfer | N - 1 |
| 8088 MOVSB time per byte | ~4.2 us |
| 8237 memory-to-memory time per byte | ~2.0 us |
| DMA page register for CH0 in PC | 0x0087 |
| DMA page register for CH2 in PC | 0x0081 |
| 8237 register file I/O address range | 16 ports (A3-A0) |

### Transfer Rate Calculation Method

```
Given: Memory access time = t_mem (ns), DMA controller clock = f_DMA (MHz)

Memory rate = 1 / t_mem  (in GB/s if t_mem in ns)
Controller rate = f_DMA (in MB/s for byte transfers)

Actual rate = min(Memory rate, Controller rate)
```