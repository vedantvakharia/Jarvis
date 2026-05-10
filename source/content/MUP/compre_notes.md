# CS F241 Microprocessors & Interfacing — Compre Notes

Notes are organised by topic. Source: lecture PDFs in `./lectures/` (Lectures 1–22). Image-only slides are extracted via context and labels; flagged where parsing fails.

---

# T1. Signal Types, Noise Margin, Fanout, Currents [L1]

### Analog vs Digital
- **Analog signal**: continuous-time signal where every voltage level carries unique meaning.
- **Digital signal**: continuous signal whose voltage levels are mapped to two ranges meaning logic 0 or logic 1.
- A digital signal therefore has *bands of voltages* that mean 0 and 1; intermediate values are forbidden.

### Noise Margin
- **Definition**: the amount of noise a logic gate can tolerate at its input without changing the output level.
- **Importance**:
  1. *Compatibility* of circuit elements / gates from different families/vendors.
  2. *Stability* of circuit performance against electrical noise.
- A device's output may produce 3 V to mean logic 1, while the next device's input might require 5 V to be recognised as logic 1 → incompatible → noise margin is negative.

### Voltage levels (one-gate-feeding-another model)
| Symbol | Meaning |
|--------|---------|
| V_OH   | Output High voltage |
| V_OL   | Output Low voltage |
| V_IH   | Input High threshold (min) |
| V_IL   | Input Low threshold (max) |
| NM_H   | High Noise Margin = V_OH − V_IH |
| NM_L   | Low  Noise Margin = V_IL − V_OL |

For a clean interface: **V_OH ≥ V_IH** and **V_OL ≤ V_IL** of the next stage.

### Fanout
- **Fanout** = number of gate inputs (loads) one output drives.
- Increasing fanout increases delay proportionally; if fanout is too high the circuit may stop working due to current limitations.

### Driving Currents
| Symbol | Meaning |
|--------|---------|
| I_OH   | Maximum current the output can SOURCE when driving '1' |
| I_OL   | Maximum current the output can SINK when driving '0' |
| I_IH   | Current required at the input to recognise '1' |
| I_IL   | Current required at the input to recognise '0' |

**Drive capability rules:**
- For voltage compatibility: V_OH(Dev_A) > V_IH(Dev_B) AND V_OL(Dev_A) < V_IL(Dev_B).
- For current capability:
  - Driving '1': fanout = ⌊|I_OH(A) / I_IH(B)|⌋
  - Driving '0': fanout = ⌊|I_OL(A) / I_IL(B)|⌋
  - **Drive capability = min(both)**.

#### Example (slide L1 p.13 — image content)
Device A: I_OH = -4, I_IH(B) = -1 ⇒ fanout for '1' = 4. I_OL(A) = 10, I_IL(B) = 2 ⇒ fanout for '0' = 5.
**Drive capability = min(4, 5) = 4**.

If I_OH or I_OL is too low, **place intermediate buffers** to split the loads.

[IMAGE FLAG — L1 p.6, p.7: Noise margin Vcc/Vss bars and logic-gate voltage levels diagram. Standard CMOS levels (V_OH≈Vcc, V_IH≈0.7Vcc; V_OL≈0, V_IL≈0.3Vcc).]
[IMAGE FLAG — L1 p.15: Input/Output Current levels table for 74LS family — manual review needed.]

---

# T2. 8086 vs 8088 Device Specifications [L1, L2]

| Item | 8086 | 8088 |
|------|------|------|
| Package | DIP (Dual In-Line) | DIP |
| Internal data width | 16-bit | 16-bit |
| External data bus | 16-bit (D0–D15) | 8-bit (D0–D7) |
| Address bus | 20-bit (A0–A19) | 20-bit |
| Memory addressable | 1 MB | 1 MB |
| Supply | 5 V; max 360 mA | 5 V; max 340 mA |
| CMOS variant | 80C86: 10 mA, –40 to 225 °F | 80C88: same |

**Why two variants?** 8088 reuses 8-bit-bus peripherals (cost reduction). It needs an *additional* clock cycle whenever 16-bit data is fetched — so it is slower per word access.

**Instruction Queue (BIU)** prefetches instructions while EU executes — pipelining masks fetch latency, increasing throughput on sequential code.

---

# T3. 8086/8088 Pin-out — Common pins [L1, L2]

| Pin(s) | Direction | Description |
|--------|-----------|-------------|
| AD0–AD15 | Bidirectional, 3-state | Multiplexed Address/Data low. 8088 has AD0–AD7 + A8–A15. During T1 = address (A); during T2–T4 = data (D). |
| A16/S3, A17/S4, A18/S5, A19/S6 | Output, 3-state | High address multiplexed with status. |
| BHE/S7 | Output, active LOW | Bus High Enable: enables D8–D15 onto data bus (high bank). S7 is logic 1 always. |
| MN/MX | Input | High = minimum mode (single-CPU). Low = maximum mode (multi-CPU/co-processor). |
| RD | Output, active LOW | Read strobe (memory or I/O). |
| INTR | Input, level | Maskable interrupt request (IF gates it). |
| TEST | Input | Tested by `WAIT` instruction. WAIT spins until TEST = 0. Used to synchronise 8086 to external device (e.g., 8087 coprocessor). |
| READY | Input | Inserts wait states. Low → CPU enters wait state, idle. |
| RESET | Input, active HIGH | Held high ≥4 clocks resets CPU. Execution restarts at FFFF0H, IF cleared. |
| NMI | Input, edge | Non-Maskable Interrupt; rising edge triggers Type-2 vector. |
| CLK | Input | 33% duty cycle clock from 8284A. |
| Vcc / GND | Power | +5 V / 0 V. |

### Status bits S3–S7 (multiplexed on A16–A19, BHE)
| S4 S3 | Segment in use |
|-------|----------------|
| 0 0   | ES (Extra) |
| 0 1   | SS (Stack) |
| 1 0   | CS (Code) or none/None |
| 1 1   | DS (Data) |

- **S5** mirrors the IF (interrupt enable) flag.
- **S6** is permanently 0.
- **S7** is permanently 1 (or unspecified per Intel data sheets — used for BHE during T1).

S4–S3 can be decoded externally as A20/A21 to address **four 1 MB memory banks** (one per segment register) — a trick to extend the addressable space.

---

# T4. Bus Multiplexing & Demultiplexing [L2, L4]

### Why Intel multiplexed Address and Data
- **Reduce pin count** to fit chip in a 40-pin DIP.
- **Time-multiplexing**: address sent on AD lines during T1; data sent during T2–T4.
- **Demultiplexing** required externally using a latch (74LS373) clocked by ALE.
- **Performance impact**: one extra memory cycle is required to send the address before data — bus cycle stretches to 4 T-states.

### Demultiplexed buses
A computer system has **three buses** plus the CPU:
- **Address bus**: 20 bits on 8086.
- **Data bus**: 16 bits on 8086, 8 bits on 8088.
- **Control bus**: RD/WR/M-IO/INTA/etc.

```
   AD0..AD15 ─┬─[74LS373 Latch]─→ A0..A15  (address, latched at ALE↓)
              └────────────────→  D0..D15 (data, after ALE = 0)
   ALE ────── pulses high in T1 to capture address
```

---

# T5. Minimum-Mode Pins (MN/MX = 1) [L2, L3]

In minimum mode, **pin 33 (MN/MX) tied to Vcc**. The 8086 itself drives the bus-control signals (no 8288 controller).

| Pin | I/O | Description / why |
|-----|-----|-------------------|
| **DT/R'** | Output | Data Transmit/Receive. Controls direction of 74LS245 transceiver. 1 = transmit (CPU → bus); 0 = receive. |
| **DEN'** | Output, active LOW | Data Enable. Activates the data bus transceiver during data phase. Held high in T1 to keep transceiver tri-stated while the address is on the bus. |
| **ALE** | Output, active HIGH | Address Latch Enable. Pulse during T1 captures A0–A19 into 74LS373. |
| **M/IO'** | Output | Distinguishes memory (high) vs I/O (low) operation. For `IN`/`OUT` instructions, low. |
| **WR'** | Output, active LOW | Write strobe to memory or I/O. |
| **INTA'** | Output, active LOW | Interrupt Acknowledge. CPU acknowledges INTR. Two pulses: 1st freezes 8259, 2nd reads vector. |
| **HOLD** | Input | Bus master (e.g., 8237 DMA) requests bus. |
| **HLDA** | Output | Hold Acknowledge — high after CPU finishes current cycle and tristates buses. |

**HOLD/HLDA flow**: external master raises HOLD (1) → 8086 finishes current bus cycle → tristates A/D/control → asserts HLDA (1). When HOLD goes low, CPU resumes at next clock and HLDA goes low. **HOLD has higher priority than INTR and NMI** (but lower than RESET).

---

# T6. Maximum-Mode Pins (MN/MX = 0) [L3]

In max mode, the 8086 outputs encoded status bits and the **8288 bus controller** generates the actual control signals. Used in multiprocessor and coprocessor (8087) systems.

| Pin | I/O | Description |
|-----|-----|-------------|
| **S0', S1', S2'** | Output, active LOW | Status pins. Decoded by 8288 to MRDC, MWTC, IORC, IOWC, INTA, etc. |
| **QS0, QS1** | Output | Queue Status. External device tracks 8086 prefetch queue state. |
| **RQ/GT0', RQ/GT1'** | Bidirectional | Bus request/grant from local masters. Bidirectional: master pulses for request, 8086 pulses back for grant. RQ/GT0 has higher priority. |
| **LOCK'** | Output, active LOW | Asserted while a `LOCK`-prefixed instruction executes. Prevents other masters from grabbing the bus. Example: `LOCK MOV CX, [4000H]`. |

### S2' S1' S0' decoding (by 8288)
| S2 S1 S0 | Bus cycle |
|----------|-----------|
| 0 0 0    | Interrupt Acknowledge |
| 0 0 1    | Read I/O port |
| 0 1 0    | Write I/O port |
| 0 1 1    | Halt |
| 1 0 0    | Code (instruction) fetch |
| 1 0 1    | Read memory |
| 1 1 0    | Write memory |
| 1 1 1    | Passive (no bus activity) |

### QS1 QS0 decoding
| QS1 QS0 | Queue activity |
|---------|----------------|
| 0 0 | No operation |
| 0 1 | First byte of opcode from queue |
| 1 0 | Queue empty (flushed by branch) |
| 1 1 | Subsequent byte from queue |

---

# T7. 8284A Clock Generator [L3]

Provides the **CLK signal** to 8086. The 8086 cannot operate from raw crystal — needs 33% duty-cycle clock.

### Functions
1. **Clock generation** (XTAL or external EFI input).
2. **RESET synchronization** (negative-edge FF synchronises POR to clock).
3. **READY synchronization** (avoids metastability when slow memory inserts wait states).
4. **PCLK**: peripheral clock output = ⅙ × XTAL/EFI frequency.

### Internal path
```
 X1, X2 ── XTAL OSC ──→ inverting buffer (OSC out)
                   └──→ 2:1 MUX ── ÷3 counter ── CLK (to 8086)
   F/C selects XTAL or EFI         │             ÷2 ── PCLK
                                   ├── READY FF
                                   └── RESET FF
```
Crystal at e.g. 15 MHz → divide-by-3 → 5 MHz CLK to 8086. Divide-by-2 again → 2.5 MHz PCLK for peripherals.

### Important pins
| Pin | Description |
|-----|-------------|
| **AEN1, AEN2** | Address Enable. Provide bus-ready RDY1, RDY2. Wait states are generated through these. |
| **ASYNC'** | Selects 1- or 2-stage synchronisation. For *slow asynchronous* devices use 2-stage to avoid metastability. |
| **PCLK** | Peripheral clock = (1/6) × crystal/EFI. |
| **RES'** | Active-low input for power-on reset. |
| **CSYNC** | Clock sync pin for multi-processor systems with EFI. *Ground for crystal mode.* |
| **OSC** | Oscillator output at crystal freq, used as EFI to other 8284As. |

### RESET timing
- Negative-edge-triggered FF applies RESET to 8086 on falling edge.
- 8086 samples RESET on rising edge.
- **Reset must reach logic 1 within 4 clocks of power-up** and hold high for ≥ 50 µs.

---

# T8. RESET Operation, RC Reset Circuit [L4]

- 8086 resets if RESET is held HIGH for ≥4 clock periods.
- After reset:
  - Execution begins at **FFFF0H** (CS=FFFFH, IP=0000H).
  - **IF flag is cleared** (interrupts masked).
  - DS, SS, ES, IP, queue cleared.

### RC reset circuit
A capacitor charges through a resistor at power-on; until V_C exceeds the 8284A RES' threshold the chip stays in reset. Push-button to GND can re-trigger reset.

```
+5V ── R ──┬── RES' (8284A)
           │
           C
           │
          GND
```
[IMAGE FLAG — L4 p.2: standard RC reset schematic; values typically R≈10k, C≈10µF]

---

# T9. Bus Demultiplexing — 74LS373 [L4]

### 74LS373 (Octal Latch)
- **Transparent latch**: when LE = 1, Q follows D; when LE = 0, Q is held.
- 8086 ALE is connected to **LE** (Latch Enable).
- **OE'** tied to GND so outputs are always enabled.
- During T1, ALE = 1: latch is transparent, 8086 outputs A0–A19; on falling edge of ALE the address is captured.
- For 20-bit address bus, three 74LS373s are typically used (one for AD0–AD7, one for AD8–AD15, one for A16–A19/BHE).

```
AD0..AD7 ──D──[373]──Q── A0..A7 (latched)
AD8..AD15──D──[373]──Q── A8..A15
A16/S3..A19/S6, BHE/S7 ──D──[373]──Q── A16..A19, BHE
ALE ─────────── LE on all three latches
```

---

# T10. Bus Buffering — 74LS245 [L4]

### 74LS245 (Octal Bus Transceiver)
- Bidirectional 8-bit transceiver: A↔B.
- **DIR** controls direction (1: A→B; 0: B→A).
- **OE'** tristates outputs when high.

8086 connections:
- **OE'** ← DEN' (so transceiver is active only during data phase).
- **DIR** ← DT/R' (1: CPU writing/transmitting, 0: CPU reading/receiving).

For 8086 (16-bit data), use **two** 74LS245s: one for D0–D7, one for D8–D15.

---

# T11. Decoders — 74LS138 (3-to-8) [L4, L7]

### 74LS138 pin function
| Pin | Function |
|-----|----------|
| A, B, C | Address inputs (LSB to MSB) |
| G1 | Active-high enable |
| G2A', G2B' | Active-low enables |
| Y0'–Y7' | Decoded outputs (active-low) |

For an output to go low: **G1 = 1, G2A' = 0, G2B' = 0**, and ABC = corresponding code.

#### Each output enables one 8K block (when paired with 2764 EPROM, 8 K × 8).

---

# T12. Bus Cycle / Machine Cycle, T-states [L4]

**BUS cycle (Machine cycle)**: time used for one access of memory, peripheral, or interrupt. Sequence: address on bus → R/W signal → data transfer.

**Each bus cycle = 4 system clock periods** (T1, T2, T3, T4) **+ optional Tw wait states**.

| T-state | Activity |
|---------|----------|
| T1 | Address output on AD/A bus, ALE high, BHE valid. M/IO, DT/R, S3-S7 set. |
| T2 | Address removed; ALE goes low at start. Status info on AD16-19. RD/WR asserted. DEN active for data path. Write data emitted; for read, AD floats. |
| T3 | Memory/peripheral places/accepts data; READY sampled at T3 end. |
| Tw | Inserted between T2 and T3 if READY = low. |
| T4 | Data sampled (read) or last bit of data written; RD/WR/DEN deasserted. |

---

# T13. Memory Read/Write Bus Cycle Timing Diagrams [L4, L5]

```
  Memory READ cycle (4 T-states, no wait):

         |  T1  |  T2  |  T3  |  T4  |
  CLK    ¯¯|__|¯¯|__|¯¯|__|¯¯|__|¯¯|__
  ALE    ___|‾‾‾|__________________
  M/IO'  ¯¯¯|‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾|___   (M/IO=1 for memory)
  AD     <Addr-A0..15><---DataIn--><z>
  A16-19 <Addr-A16..19/Status        >
  RD'    ‾‾‾‾‾‾‾‾|___________|‾‾‾‾   (low T2..T4)
  DT/R'  ___________________________     (low for receive)
  DEN'   ‾‾‾‾‾|__________|‾‾‾‾‾‾‾‾    (active T2..T4)
  READY                 sampled here ↑


  Memory WRITE cycle:

         |  T1  |  T2  |  T3  |  T4  |
  ALE    ___|‾‾‾|__________________
  AD     <Addr 0..15><----Data Out---->
  WR'    ‾‾‾‾‾‾‾|________________|‾‾   (low T2..T4)
  DT/R'  ‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾    (high for transmit)
  DEN'   ‾‾‾‾‾|________________|‾‾    (active T2..T4)
```

[IMAGE FLAG — L4/L5 pp.16-19 contain detailed Intel timing diagrams with T_CLAV, T_CLRL etc parameters. Use Topic T14 for the parameter list.]

---

# T14. Memory Access Time, Wait States [L5, L6]

### Definitions of timing parameters (Intel terminology)
| Symbol | Meaning |
|--------|---------|
| T_CLAV | Clock-to-Address-Valid: delay after T1 rising edge before address is valid. **110 ns @ 5 MHz** (data sheet). |
| T_CLRL | Clock-to-Read-Line: delay after clock edge before RD' goes low. |
| T_DVCL | Data-Valid-to-Clock setup: data must be valid this long before clock edge sampling at T3. **30 ns**. |

### Memory access time formula (no wait state)
For 8086 at 5 MHz: T = 200 ns; one bus cycle = 4 T = 800 ns. Three clocking states (T1 to T3) span 600 ns between address appearance and data sampling.
```
Memory Access Time = 3T − T_CLAV − T_DVCL
                   = 600 − 110 − 30  =  460 ns @ 5 MHz
```

### With wait states
A **wait state Tw** = one extra clock period inserted between T2 and T3.
- 1 Tw at 5 MHz → adds 200 ns → memory access time becomes 460 + 200 = **660 ns**.
- General: Access_time = (3 + n_wait) × T − T_CLAV − T_DVCL.

#### Practice problem 1 (L6 p.8)
*"An 8086 operates at 8MHz (8086-2). If one wait state (Tw) is inserted, what is the total time allowed for memory access?"*

Solution: T = 1/8 MHz = 125 ns. Bus cycle = 4T + 1Tw = 5 × 125 = 625 ns. Access window = (3+1)×125 − T_CLAV(8MHz) − T_DVCL ≈ 500 − T_CLAV − T_DVCL. *(For 8086-2 at 8MHz, T_CLAV ≈ 60 ns, T_DVCL ≈ 20 ns ⇒ ≈ 420 ns access time.)*

If we ignore setup details: time allowed ≈ (3 + n_wait) × T = 4 × 125 = **500 ns**.

#### Practice problem 2 (L6 p.8)
*"Processor at 8 MHz, memory access time = 300 ns, address setup 120 ns, data setup 20 ns, latch buffer delay 10 ns. Time taken to read 16-bit data at memory location 2010H?"*

Two byte reads needed (2010H is even-aligned 16-bit on 8086 → single read; if odd-aligned, two reads). Each read = 4T + Tw if needed.
- Available window per cycle (no wait) at 8 MHz = 3×125 − 120 − 20 − 10 = **225 ns**, but memory needs 300 ns → 1 Tw needed.
- With 1 Tw: window = 4×125 − 120 − 20 − 10 = 350 ns ≥ 300 ✓.
- Cycle = 5 × 125 = 625 ns. Single 16-bit aligned read = **625 ns**. If misaligned, 2 × 625 = 1250 ns.

#### Generic rule
Wait states needed n_w = ⌈(t_access_required − t_window_no_wait) / T⌉.

#### Recent PYQ (24-25 Q1)
"8086 at 10 MHz. Memory access time 3 clock cycles (300 ns). Required memory time 0.5 µs. How many wait states?"
- T = 100 ns. (4T = 400 ns) bus cycle without wait. Required = 500 ns ⇒ 500 − 300 = 200 ns deficit ⇒ **2 wait states** (each 100 ns) inserted between T2 and T3. Direction signal: **DT/R'** controls 74LS245 direction.

---

# T15. Memory Types [L5, L6]

| Type | Volatile? | Programmability |
|------|-----------|-----------------|
| **ROM** | No | Factory mask programmed |
| **PROM** | No | Field-programmable once |
| **EPROM** | No | UV-erasable (~20 min UV) and reprogrammable |
| **EEPROM/Flash** | No | Electrically erasable. Slow writes vs RAM. Other names: EAROM, NOVRAM. |
| **SRAM** | Yes | Read/Write. Fast, but more transistors per cell. |
| **DRAM** | Yes | Read/Write. Cheap/dense; needs periodic refresh. |

**Volatile** = loses data when powered off. ROM family is non-volatile; RAM family is volatile.

---

# T16. Memory Chips — sizing & pins [L5, L6]

- Number of address pins **n** ↔ number of locations **N**: `N = 2^n` ⇒ n = log₂N.
  - 1 K location = 10 pins; 256 M location = 28 pins.
- Data pins ↔ word width: 1K×8 chip has 8 data pins.
- **CS' / CE' / S'**: chip select / chip enable; usually multiple are AND-ed (all must be low).
- For **ROM**: control pins are **OE'** (output enable, gates tristate buffers) — only.
- For **RAM**: **WE'** (write enable) and **OE'** (output enable). It must NEVER be the case that both are low simultaneously (would attempt simultaneous read+write).

### Common chips appearing in problems
| Chip | Type | Size | Address pins |
|------|------|------|--------------|
| 2716 | EPROM | 2 K × 8 | 11 |
| 2732 | EPROM | 4 K × 8 | 12 |
| 2764 | EPROM | 8 K × 8 | 13 |
| 6116 | SRAM | 2 K × 8 | 11 |
| 6264 | SRAM | 8 K × 8 | 13 |
| 62256 | SRAM | 32 K × 8 | 15 |

---

# T17. Address Decoding [L6, L7]

Decoding strategies (from cheapest to most flexible):
1. **Logic gates** (NAND/AND of unused MSBs).
2. **Decoder ICs** (74LS138, 74LS139).
3. **Programmable logic** (PLA, PAL/GAL, FPGA).

### Decoding principle
If memory has N total locations needing n = log₂N pins, but the chip provides only P locations (p = log₂P pins), then:
- p LSB address lines wire directly to chip's address pins.
- Remaining (n − p) MSB lines feed the **chip-select decoder**.

### Example (L6 p.23)
"Modify NAND gate decoder to select address range DF800H–DFFFFH":
- DF800H = 1101 1111 1**000 0000 0000**
- DFFFFH = 1101 1111 1**111 1111 1111**
- Lower 11 bits vary → A0–A10 to chip; upper 9 bits A11–A19 = 1101 1111 1 must all be high → **NAND gate** with all 9 inputs (high lines: A11..A19; low lines through inverters: none here since all high) feeds CS'. Actually, since DF800H has A11=1 and DFFFFH also A11=1, then A11..A19 = 1 1011 1111 → invert A14, A12 to NAND. Wait let's recompute:

DF800H = 0xDF800 = 1101 1111 1000 0000 0000
A19A18A17A16 A15A14A13A12 A11A10..A0
= 1101 1111 1000 0000 0000 (binary, 20 bits)
- A19=1 A18=1 A17=0 A16=1 | A15=1 A14=1 A13=1 A12=1 | A11=1, A10..A0 = 0 to all-1

DFFFFH = 1101 1111 1111 1111 1111. So A0..A10 vary 0..7FF; A11..A19 = 1 1011 1111 (= 0x1BF; 9 bits).
NAND output low when (A19·A18·A17'·A16·A15·A14·A13·A12·A11) = 1 i.e. A17=0 and the rest=1. So invert A17 then AND with A19..A11 (excluding A17), feeding NAND-not arrangement.

### Using 74LS138 decoder
"Design a 1K RAM from FFC00H using a 74LS138":
- 1 K → 10 address lines (A0–A9). Chip needs A0–A9.
- A10–A19 ⇒ 10 bits decode. FFC00H = 1111 1111 1100 0000 0000.
  - A19..A10 = 1111 1111 11 (10 ones). Tie A10 directly into a comparator and use A11..A13 → ABC inputs of 138; G1 = high MSB; G2A,G2B = low MSBs.

---

# T18. Memory Interfacing 8088 (8-bit) [L7]

8088 has an 8-bit data bus → **single bank** of memory. Each address corresponds to one byte. Decoding is straightforward: A0..An−1 to chip; remaining MSB to decoder.

### Example (L7): Interface 8 KB to 8088 using 2 KB chips
- 8 KB / 2 KB = 4 chips, each needing 11 address pins.
- A0–A10 → chip; A11–A12 → ABC of 74LS138 (decoder selects 1 of 4); higher A13–A19 → enable inputs.
- Memory map: RAM1 00000H–007FFH, RAM2 00800H–00FFFH, RAM3 01000H–017FFH, RAM4 01800H–01FFFH.

### Example (L7): 4 K × 2716 ROM at 00000H + 8 K × 6116 SRAM at 08000H
- 2716 = 2 K, so 2 ROMs (4 K total).
- 6116 = 2 K, so 4 RAMs (8 K total).
- Decoder used to select 6 chips. ROM CS' active when A12 = 0 (start = 0); RAM CS' active when A15 = 1 (start = 0x8000).

---

# T19. Memory Interfacing 8086 — 16-bit Banks [L8, L9]

The 8086 has **TWO memory banks**: an even (low) bank on D0–D7 and an odd (high) bank on D8–D15.

```
                    D15..D8         D7..D0
                  +---------+      +---------+
   Addresses      | Odd Bank |    | Even Bank |
   00001 -------> |          |    |           | <-- 00000
   00003 -------> |  D8-D15  |    | D0-D7     | <-- 00002
                  | (BHE')   |    | (A0=0)    |
                  +---------+      +---------+
```

### Bank-select rules
| BHE' | A0 | Operation |
|------|----|-----------|
| 0 | 0 | Word transfer (both banks selected, even-aligned word) |
| 0 | 1 | Byte from upper (odd) bank |
| 1 | 0 | Byte from lower (even) bank |
| 1 | 1 | None (forbidden) |

### Aligned vs misaligned word access
- **Aligned word** (A0 = 0): single bus cycle, BHE'=0, A0=0.
- **Misaligned word** (A0 = 1): the LSB is in the odd bank at addr X, MSB is in the even bank at addr X+1 → two bus cycles. **8086 takes 2 cycles for misaligned 16-bit accesses.**

### Bank selection: separate decoder vs separate write strobes
**Two equivalent approaches** to handle byte writes correctly:
1. *Two CS lines*: each bank has its own CS' driven from the decoder using BHE' for high bank, A0' for low bank. Disadvantage: needs duplicated decoders.
2. *Separate Write Strobes* (preferred): single CS to both banks; OR-gate combines:
   - **LWR = WR' OR A0**  (write low bank when WR' low and A0 = 0)
   - **HWR = WR' OR BHE** (write high bank when WR' low and BHE' = 0)
   - On 80286/80386SX, use **MWTC** instead of WR'.

### Why no separate read strobes?
On a 16-bit read, both banks present data; CPU only reads the byte(s) it expects and ignores the unused half. No conflict on the bus, so single shared RD' is fine. Only when an I/O device misbehaves (e.g., reads from wrong bank) you'd need separate read strobes.

[IMAGE FLAG — L9 p.3: separate-write-strobe schematic with two OR gates feeding LWR and HWR.]

---

# T20. Separate Bank Write Strobes [L9]

```
        WR' ──┬── (OR with A0)  ──── LWR  → WE' of even bank
              └── (OR with BHE)──── HWR  → WE' of odd bank
```
- LWR low when WR' low AND A0 = 0  → low bank write.
- HWR low when WR' low AND BHE' = 0 → high bank write.
- **Effect**: by combining bank selection with write enable, each chip's WE' goes low only when its byte is meant to be written.

---

# T21. 16-bit Memory Decoding (80286/80386SX) [L9]

### Example: decode 64 KB 16-bit-wide at 060000H–06FFFFH
- 80286 has 24-bit address (A0–A23). For 16-bit-wide bus, A0 is implicit (used to select bank, not memory cell).
- 64 KB → 16 address bits internally. Two 32 K-byte 62256 chips.
- Connect A1–A15 (8086 view) to chip A0–A14.
- A16–A23 plus comparators → CS' via PLD (e.g., GAL22V10) when address = 06XXXXH.
- Use **separate write strobes** as before.

### Why GAL22V10?
PLD: more inputs (~22) and registered/combinational outputs needed; cheaper than building NAND trees.

---

# T22. Memory Interfacing — larger memory examples [L9]

### Interface 1 MB SRAM to 8086 with 256 KB chips
- 1 MB / 256 KB = 4 chips. Banking: each pair (even+odd half) covers 256 K word locations.
- Use 2 chips per bank → 4 chips total (2 even + 2 odd) = 256 K × 2 banks × 2 = 1024 K bytes.
- A0..A17 → chip address (2^18 = 256 K). A18, A19 → decoder selecting the chip pairs. BHE'/A0 → bank selection.

### Interface 16 KB starting at 00000H using 2K chips ×4 + 4K chips ×2
- 4 × 2 K = 8 K + 2 × 4 K = 8 K  → 16 KB total.
- For first 8 KB use 4×6116 (2 K each, 11 address lines per chip).
- For next 8 KB use 2×4 K chips (12 address lines).
- A12, A13, A14 → decoder; A11/A12 → bank within decoder block.

[IMAGE FLAG — L9 pp.7-12: full schematic of 1 MB 8086 interface — manual review.]

---

# T23. 8086 I/O Instructions [L9]

| Instruction | Form | Effect |
|-------------|------|--------|
| `IN AL, p8`  | Direct/fixed | 8-bit data from port `p8` (0–FFH) → AL |
| `IN AX, p8`  | Direct       | 16-bit data from ports `p8, p8+1` → AX |
| `IN AL, DX`  | Indirect/variable | 8-bit data from port [DX] (0–FFFFH) → AL |
| `IN AX, DX`  | Indirect     | 16-bit data from ports [DX, DX+1] → AX |
| `OUT p8, AL` | Direct       | AL → port p8 |
| `OUT DX, AX` | Indirect     | AX → ports [DX, DX+1] |
| `INS`        | String       | Load from port DX into ES:DI; auto-increment DI |
| `OUTS`       | String       | DS:SI to port DX; auto-increment SI |

### Address routing
- 8-bit (fixed) port number appears on **A7–A0**, A8–A15 = 0.
- 16-bit (variable, DX) port number appears on **A15–A0**.
- First 256 ports (00H–FFH) reachable by both forms; 0100H–FFFFH only by variable form.
- In a PC, all 16 lines are decoded; system uses 0000H–03FFH.
- Data flows through accumulator (AL or AX). For 16-bit ports the lower 8 bits go to even port, upper 8 to next (odd) port.

---

# T24. Direct vs Indirect vs String I/O [L9]

| Mode | Address source | Range |
|------|----------------|-------|
| Direct (Fixed) | Immediate p8 byte after opcode | 00H–FFH |
| Indirect (Variable) | DX register | 0000H–FFFFH |
| String | DX (port) and DS:SI / ES:DI (memory) | DX = port, memory auto-increment by direction flag |

```
   IN  AL, 27H        ; direct, AL ← port 27H
   MOV DX, 0300H
   OUT DX, AX         ; indirect, port 0300H, 0301H ← AX
   INS                ; ES:DI ← port DX, DI++
```

---

# T25. I/O Port Concept [L9]

- An **I/O port** = register inside an I/O interface chip.
- Port widths: 8, 16, or 32 bits.
- Address space: 0000H–FFFFH (16-bit).
- Accessed only by `IN` / `OUT` (or `INS` / `OUTS`).
- 16-bit access = two consecutive 8-bit ports (port X and port X+1).

---

# T26. I/O-Mapped vs Memory-Mapped I/O [L9]

| Aspect | Memory-Mapped I/O | I/O-Mapped (Isolated) I/O |
|--------|-------------------|---------------------------|
| Address space | Shares main memory address space (20-bit on 8086) | Separate 64 KB I/O space |
| Instructions used | Any memory-reference instruction (MOV, ADD, etc.) | Only `IN`, `OUT`, `INS`, `OUTS` |
| Control signals | M/IO' = 1 | M/IO' = 0 |
| Decode complexity | Full 20 bits (or however many) | Only 8 (fixed) or 16 (variable) |
| Address advantage | Reduces program memory available | Memory space fully usable |
| Disadvantage | Loses memory locations to I/O | Limited 64 K I/O size; needs special instructions |

### Why memory-mapped is sometimes preferred
- Allows arithmetic/logic instructions to operate directly on I/O ports.
- Decoder reuse if memory map already large.

### Why isolated is sometimes preferred
- Conserves memory address space for code/data.
- Smaller decoder for I/O.

---

# T27. Input / Output Device Interfacing — Buffer/Latch [L9]

### Input devices → use a Buffer (74LS244 / 74LS245)
- Reason: an input device must be **isolated** from the global data bus. Without isolation, every device drives the bus continuously → bus contention.
- Tristate **buffers** drive the bus only when their OE' is asserted by the decoder.

### Output devices → use a Latch (74LS373 / 74LS374)
- Reason: data on the data bus is valid only for 50–1000 ns during the bus cycle. After the cycle the data disappears. The output device needs the value held → latch captures and stores it.
- Memory has internal latches; raw I/O devices typically don't.

```
   Input  : Switch ─→ 74LS244 buffer ─→ D-bus  (OE' from address decoder + RD')
   Output : D-bus  ─→ 74LS373 latch  ─→ LED   (CLK from decoder + WR')
```

---

# T28. Handshaking, Polling, Interrupts [L10]

### Why handshaking?
I/O devices are slow → CPU needs synchronisation.

### Two paradigms:
1. **Polling**: CPU initiated. Device sets a status bit; CPU periodically reads & checks. Simple but wastes CPU cycles when device isn't ready.
2. **Interrupts**: Device initiated. Setting status bit triggers interrupt; CPU calls ISR. Efficient but more complex hardware.

### Strobed handshake (Mode 1 of 8255 uses these signals)
| Signal | Direction | Meaning |
|--------|-----------|---------|
| STB' (strobe) | from device → 8255 | Data valid; latch it |
| IBF (input buffer full) | 8255 → device | I'm holding the byte; don't send another |
| INTR | 8255 → CPU | I have data ready |
| OBF' | 8255 → device | Output byte is now valid |
| ACK' | device → 8255 | I've taken the byte |

---

# T29. I/O Address Decoding [L10]

Same principles as memory decoding except *fewer address lines* are decoded (since I/O space is smaller).

| Address form | Lines decoded |
|--------------|---------------|
| Fixed (8-bit port) | A7–A0 |
| Variable (16-bit port) | A15–A0 |

The signals **IORC' (or IOR') and IOWC' (IOW')** are used (M/IO' = 0 distinguishes I/O cycles).

### 8-bit port decoding
- A0–A7 carry port number; A8–A15 ignored.
- Embedded systems often use this form. With 8-bit-only decode you cannot have ports above FFH.

### 16-bit port decoding (used in PCs)
- All A15–A0 decoded.
- Common pattern: NAND gate decodes a band like EFF8H–EFFFH; output feeds Z-input of PLD which produces specific port strobes.

```
      A15..A4 ─[NAND]─→ Z input of PLD
      A3..A0  ────────→ PLD inputs
                       PLD generates strobes for EFF8H..EFFFH
```

---

# T30. 8 vs 16-bit Wide I/O Ports, write strobes for I/O [L10]

- 16-bit microprocessor has **two 8-bit I/O banks**: even (A0=0) at D0–D7, odd (A0=1) at D8–D15.
- Two 8-bit ports = one 16-bit port (32 K word ports possible if all 16 lines decoded).
- Need **separate write strobes** for byte writes to ensure only the correct bank gets WE.
- Generally **no need for separate read strobes**: CPU only consumes the byte(s) it requested. Exception: if I/O device returns garbage from a wrong bank, separate reads help.

---

# T31. 8255 PPI — Pin-out and Internal Structure [L11]

### What it is
**82C55A Programmable Peripheral Interface**: low-cost CMOS PPI providing **24 programmable I/O lines** in three 8-bit ports (A, B, C) — directly interfaces to 8086 data bus.

### Port grouping
- **Group A**: Port A (PA7–PA0) + upper Port C (PC7–PC4).
- **Group B**: Port B (PB7–PB0) + lower Port C (PC3–PC0).

### Pin Description
| Pin | Function |
|-----|----------|
| PA7–PA0 | Port A I/O (latched output or buffered input). |
| PB7–PB0 | Port B I/O (latched output or buffered input). |
| PC7–PC4 | Upper Port C; can be I/O or handshake lines for Mode 1/2 of port A. |
| PC3–PC0 | Lower Port C; can be I/O or handshake lines for Mode 1 of port B. |
| D0–D7 | Bidirectional data bus to 8086. |
| RD' | Read enable. CPU low → 8255 puts data on D bus. |
| WR' | Write enable. CPU low → 8255 latches data from D. |
| CS' | Chip select. RD/WR ignored unless CS' = 0. |
| A1, A0 | Selects internal register: |
| RESET | Active high. Clears CWR; **all ports default to INPUT** after reset. |
| Vcc / GND | +5 V / 0 V. |

### A1 A0 register selection
| A1 A0 | Register |
|-------|----------|
| 0 0   | Port A   |
| 0 1   | Port B   |
| 1 0   | Port C   |
| 1 1   | Control Word Register (CWR) |

### Connecting 8255 to 8086
- 8086's A0 = 0 only on even bytes. Since 8255 is byte-wide, place it on the lower (or upper) bank.
- For lower-bank connection: 8255 A0 ← 8086 A1; 8255 A1 ← 8086 A2.
- For upper-bank connection: 8255 connects to D8–D15, BHE' is part of CS decoding.

```
  8086 A2 ── 8255 A1
  8086 A1 ── 8255 A0
  8086 A0 ── (decoded with BHE for bank select; for low bank A0 = 0)
```

This means 4 consecutive port addresses (Port A, Port B, Port C, CWR) are at **even** I/O addresses spaced by 2.

### Internal blocks
- 8-bit internal data bus → bidirectional buffer.
- Read/Write Control Logic decodes RD', WR', CS', A1, A0, RESET.
- Group A control + Group B control (program ports).
- Three port logic blocks (A, B, C).

---

# T32. 8255 Control Word Format [L11]

The CWR (Control Word Register) is at A1A0 = 11. Two distinct command-byte formats exist:

### Command byte A (when bit D7 = 1) — I/O-mode programming
```
   D7  D6 D5  D4  D3  D2  D1  D0
   1  | M1 M0 | A | Cu| MB| B | Cl
       Group A    Group B
   D7 = 1 → I/O-mode command
   D6 D5 = mode for Group A: 00 = Mode 0, 01 = Mode 1, 1x = Mode 2
   D4 = Port A direction: 1 = input, 0 = output
   D3 = Port C upper (PC7–PC4): 1 = input, 0 = output
   D2 = Group B mode: 0 = Mode 0, 1 = Mode 1
   D1 = Port B direction: 1 = input, 0 = output
   D0 = Port C lower (PC3–PC0): 1 = input, 0 = output
```

### Command byte B (when bit D7 = 0) — BSR (Bit Set/Reset) for Port C only
```
   D7  D6 D5 D4  D3 D2 D1   D0
   0   X X X | bit# (3-bit) | S/R
   D7 = 0 → BSR command
   D6 D5 D4 = don't care
   D3..D1 = bit number (000=PC0, 111=PC7)
   D0 = 1 set, 0 reset
```

### Decode example (PYQ 24-25 Q2)
"Control word 98H written to 8255." → 1001 1000:
- D7=1 → command byte A.
- D6 D5 = 00 → Group A Mode 0.
- D4=1 → Port A is **input**.
- D3=1 → Upper Port C is **input**.
- D2=0 → Group B Mode 0.
- D1=0 → Port B is **output**.
- D0=0 → Lower Port C is **output**.

### BSR for the same scenario
- Set PC0 → 0000 0001 = **01H**.
- Reset PC4 → 0000 1000 = **08H** (bit#=100 (4); S/R=0 → reset). ✓

---

# T33. 8255 Modes of Operation [L11, L12]

### Two top-level modes
- **I/O mode**: ports work as programmable I/O.
- **BSR mode** (Port C only): set/reset individual PC bits.

### Three I/O sub-modes
- **Mode 0**: Simple I/O. No handshake. Ports A, B, C upper, C lower can be input or output independently. Inputs are buffered; outputs are latched.
- **Mode 1**: Strobed I/O. Group A (Port A + 3 PC lines) and Group B (Port B + 3 PC lines) each can be configured as strobed input or strobed output with handshake on PC bits.
- **Mode 2**: Bidirectional bus on Port A only. Port B can still be Mode 0 or 1.

### Mode 0 example
Configure Port A as latched output:
```
   MOV AL, 80H       ; 1000 0000 = command A, Mode 0, all ports output
   MOV DX, 703H      ; CWR address
   OUT DX, AL
```
Note: from L11 the example uses 80H. The original slide says `1000000` which is 80H (8 bits = 1000 0000); the slide truncated leading zero.

---

# T34. 8255 Mode 1 — Strobed I/O [L11, L12]

In Mode 1 each group has handshake signals on three Port-C lines.

### Group A — Strobed Input (Port A as input)
| PC line | Function |
|---------|----------|
| PC4 | STB_A' (strobe input from device) |
| PC5 | IBF_A   (input buffer full output) |
| PC3 | INTR_A  (interrupt request to CPU) |
| PC6, PC7 | available as I/O |

Sequence (strobed input):
1. Peripheral places data on PA0–PA7.
2. Peripheral pulses STB_A' low.
3. 8255 latches data, sets IBF_A = 1.
4. After STB returns high and INTE_A = 1 → INTR_A = 1.
5. CPU reads Port A (RD') → data passed; INTR_A cleared by ↑ of RD; IBF_A cleared by ↑ of RD.

### Group A — Strobed Output (Port A as output)
| PC line | Function |
|---------|----------|
| PC7 | OBF_A' (output buffer full) |
| PC6 | ACK_A' (acknowledge from device) |
| PC3 | INTR_A |

Sequence (strobed output):
1. CPU writes Port A (WR'). 8255 latches, sets OBF_A' = 0 (data ready).
2. Device reads, then pulses ACK_A' low.
3. ACK clears OBF_A' = 1; INTR_A asserted (if INTE_A = 1) telling CPU to send next byte.

### Group B
| PC line | Strobed Input | Strobed Output |
|---------|---------------|----------------|
| PC2 | STB_B' | ACK_B' |
| PC1 | IBF_B  | OBF_B' |
| PC0 | INTR_B | INTR_B |

### Interrupt Enable bits (INTE)
- Set/reset via BSR on the PCx line that carries the relevant ACK or STB.
- INTE_A = PC4 (input)/PC6 (output).
- INTE_B = PC2.

### Strobed-output Printer Interface (L12)
- Port B → printer data.
- DS (data strobe) → strobe data into printer.
- ACK input → printer acknowledges receipt.
- If the printer supplies no DS, PC4 (in mode-0 of upper C) is used by software to generate DS.

---

# T35. 8255 Mode 2 — Bidirectional Bus (Port A only) [L12]

Port A becomes bidirectional. Five PC lines reserved:
| PC line | Function |
|---------|----------|
| PC7 | OBF_A' |
| PC6 | ACK_A' |
| PC5 | IBF_A |
| PC4 | STB_A' |
| PC3 | INTR_A |

PC0–PC2 still available as I/O (or for Group B strobing if Mode 1).

Used for two-CPU dialogues, GPIB, modem, etc.

---

# T36. 8254 PIT — Introduction & Applications [L12]

### What it is
**8254 Programmable Interval Timer**. Higher-speed version of 8253. Contains **3 independent 16-bit programmable counters** (Counter 0, 1, 2). Max input 10 MHz.

### Applications (L12)
- Real-time clock
- Event counter
- Digital one-shot
- Programmable rate generator
- Square-wave generator
- Complex waveform generator
- Complex motor controller
- DRAM refresh

### In a PC
Decoded at I/O ports **40H–43H** (Counter 0, 1, 2, Control Word respectively).

### Each counter has
- **CLK** input — basic operating frequency.
- **GATE** input — controls operation in some modes.
- **OUT** output — waveform produced by the counter.

### Counter internal
- **CE** — Counting Element: 16-bit pre-settable synchronous **down counter**.
- **OL_M / OL_L** — Output Latches (MSB / LSB) follow CE except when latched.
- **CR_M / CR_L** — Count Registers (MSB/LSB) hold the new count until loaded into CE.
- **Status Register** holds a snapshot of control word + OUT pin state when latched.

---

# T37. 8254 Pinout & Address selection [L12]

| Pin | Function |
|-----|----------|
| D0–D7 | Bidirectional data bus |
| CLK0, CLK1, CLK2 | Clock inputs (per counter) |
| GATE0, GATE1, GATE2 | Gate inputs |
| OUT0, OUT1, OUT2 | Counter outputs |
| RD', WR' | I/O strobes |
| CS' | Chip select |
| A1, A0 | Counter / CW select |

### A1 A0 register select
| A1 A0 | Selects |
|-------|---------|
| 0 0 | Counter 0 |
| 0 1 | Counter 1 |
| 1 0 | Counter 2 |
| 1 1 | Control Word Register |

---

# T38. 8254 Programming — Control Word [L12]

### CW format
```
  D7  D6  | D5  D4  | D3  D2  D1 | D0
  SC1 SC0 | RW1 RW0 | M2 M1 M0   | BCD
```

| Field | Values | Meaning |
|-------|--------|---------|
| SC1 SC0 | 00 = Counter 0; 01 = Counter 1; 10 = Counter 2; 11 = Read-back command |
| RW1 RW0 | 00 = Counter latch; 01 = R/W LSB only; 10 = R/W MSB only; 11 = R/W LSB then MSB |
| M2 M1 M0 | 000 Mode 0; 001 Mode 1; X10 Mode 2; X11 Mode 3; 100 Mode 4; 101 Mode 5 |
| BCD | 0 = binary count; 1 = BCD count |

### Programming sequence per counter
1. Write CW to control register (port 43H or address `1 1`).
2. Write LSB of count to that counter's port. (Counting stops if 2-byte mode.)
3. Write MSB → counting begins on next CLK.

If a counter is programmed as "LSB then MSB", **order is critical**: first LSB stops counting, then MSB starts new count.

### Programming both counters in any order
Program CW0, CW1; then load LSB0, LSB1; then MSB0, MSB1 — or interleaved (one counter fully then another). Either works.

#### Example (L12 p.21): Counter-1 Mode 0, binary, N = 3A98H
```
   MOV AL, 70H        ; SC=01, RW=11 (LSB then MSB), M=000, BCD=0 = 0111 0000
   OUT 43H, AL
   MOV AL, 98H
   OUT 41H, AL        ; LSB
   MOV AL, 3AH
   OUT 41H, AL        ; MSB → start count
```

---

# T39. 8254 Counter Reading [L12, L13]

### Approach 1 — Counter Latch Command
- Each counter has an **internal output latch**. Normally OL follows CE.
- A *latch command* (CW with RW=00, SC selecting counter, others don't-care) freezes OL until read.
- Read counter port 1 or 2 times depending on RW.

#### Example: Latch & read counter 0
```
   MOV DX, C_REG       ; Control Word port (43H)
   MOV AL, 00000000B   ; SC=00, RW=00 → counter latch for CTR0
   OUT DX, AL
   MOV DX, CNTR0       ; Counter 0 data port (40H)
   IN  AL, DX          ; reads latched count
```

### Approach 2 — Read-back Command
Used when contents of multiple counters are needed simultaneously.

CW format (Read-back):
```
  D7  D6  D5    D4   D3 D2 D1   D0
  1   1   COUNT' STATUS' C2 C1 C0  0
```
- D7D6 = 11 (read-back).
- D5 = 0 → latch counter values for counters whose Cn = 1.
- D4 = 0 → latch status for those counters.
- D3..D1 → which counters (set Cn = 1; D1 corresponds to counter 0... here D3=C2, D2=C1, D1=C0).
- Either or both COUNT/STATUS may be selected.

A counter is automatically unlatched when read. Other counters remain latched until each is read.

If multiple read-back to same counter without intervening reads: only the **first** is honoured.

### Status byte format
```
  D7   D6     D5..D0
  OUT  NULL   programmed-mode-bits (RW1 RW0 M2 M1 M0 BCD)
```
- D7 = current state of OUT pin.
- D6 (NULL COUNT) = 1 means the new count has NOT yet been transferred from CR to CE — the latched value is stale.
- D5–D0 = mode/RW/BCD as last written.

### Reading both count and status together
Set both COUNT' = 0 and STATUS' = 0. After read-back command:
1. First read of that counter returns **status byte**.
2. Next 1 or 2 reads return **count** (depending on RW).
3. Subsequent reads return live (unlatched) count.

#### Example (L13 p.11): count + status latched for counter 0
```
   MOV DX, C_REG
   MOV AL, 11000010B   ; D7D6=11, COUNT'=0, STATUS'=1, C0=1, D1=1
   OUT DX, AL          ; latches status only for CTR0 (note: comment says count latched but bits show STATUS=0 in actual lecture; here matching lecture comment)
   MOV DX, CNTR0
   IN  AL, DX          ; status
   MOV AH, AL
   IN  AL, DX          ; LSB of count
   MOV BL, AL
   IN  AL, DX          ; MSB of count
   MOV BH, AL
```

---

# T40. 8254 Mode 0 — Interrupt on Terminal Count [L13]

**Use**: event counting, single-shot interrupt after N counts.

### Behaviour
- After CW is written, OUT goes LOW (and stays low).
- Initial count is loaded on the *next CLK pulse* — this CLK does **not decrement**.
- Counter decrements thereafter on each CLK. After **N + 1 CLK pulses** OUT goes HIGH.
- OUT stays HIGH until a new count or new Mode-0 CW is written.
- **GATE = 1** enables counting; **GATE = 0** disables (freezes the count). GATE has no effect on OUT.

### Two-byte count handling
1. Writing first byte (LSB) disables counting. OUT goes low immediately (no clock needed).
2. Writing second byte (MSB) → new count loaded on next CLK. OUT high after N + 1 CLK.

### Special: GATE = 0 during initial count load
- Initial count loaded on next CLK regardless of GATE.
- When GATE rises, OUT goes high N CLK pulses later (no extra clock to load).

### Waveform (initial count = 4)
```
  CLK   ┐_┌─┐_┌─┐_┌─┐_┌─┐_┌─┐_┌─┐_┌
  CW    ──┐_______________________
  WR    _┐_┌_____________________
  Count  4  4  3  2  1  0  FFFF FFFE
  OUT   ___________________┌──────
                           ↑ N=4 + 1 CLK after init
```

---

# T41. 8254 Mode 1 — Hardware Retriggerable One-Shot [L13]

**Use**: produce a programmable-width pulse on hardware trigger.

### Behaviour
- OUT is initially HIGH.
- A **trigger** = rising edge of GATE.
- After CW + count written → counter is "armed".
- On trigger: counter is loaded on next CLK; OUT goes LOW for **N CLK cycles**, then back HIGH.
- **Retriggerable**: another GATE rising edge re-loads the counter and OUT stays low for full N CLK from new trigger.
- GATE has **no direct effect on OUT** other than being the trigger.
- New count written during pulse: doesn't affect current pulse unless retriggered, in which case new count is used.

### Waveform (count = 3)
```
  CLK   ┐_┌─┐_┌─┐_┌─┐_┌─┐_┌
  GATE  ___┌──────────────
  OUT   ‾‾‾‾‾‾‾‾└─────────┌‾‾‾   (low for 3 CLK after trigger)
```

---

# T42. 8254 Mode 2 — Rate Generator [L13]

**Use**: divide-by-N counter, periodic interrupt (real-time clock tick), DRAM refresh.

### Behaviour
- OUT initially HIGH.
- When count decrements to **1**, OUT goes LOW for **one CLK pulse**.
- OUT goes HIGH again; counter reloads to N; cycle repeats.
- Period = N CLK cycles.
- **GATE = 1** enables; **GATE = 0** disables. If GATE goes low during low-phase, OUT is forced HIGH immediately.
- Trigger (rising GATE) reloads count on next CLK ⇒ allows hardware sync.
- Writing a new count while running: doesn't affect current period; loaded at end of current cycle (unless triggered earlier).
- **Count of 1 is illegal in Mode 2.**

### Waveform (N = 4)
```
  Count  4 3 2 1 4 3 2 1
  OUT   ‾‾‾‾‾‾└┘‾‾‾‾└┘‾‾   (low for one CLK every 4 CLKs)
```

---

# T43. 8254 Mode 3 — Square Wave [L13]

**Use**: baud-rate generation, clock divider with 50% duty cycle.

### Behaviour
- Like Mode 2 but **OUT is high for half the count, low for the other half**.
- For **even N**: 50/50, period = N CLK.
- For **odd N**: OUT HIGH for (N+1)/2 counts, LOW for (N-1)/2 counts (asymmetric by 1 CLK).
- GATE = 1 enables. GATE = 0 immediately forces OUT HIGH.
- Re-trigger reloads count on next CLK.

### Internal mechanics (even N)
Initial count loaded on first CLK; decrements by **2** on each subsequent CLK; when expires, OUT toggles, count reloads.

### Internal mechanics (odd N)
Initial count − 1 (even) loaded on first CLK; decrements by 2; when expires (one CLK after), OUT goes LOW and reloads N − 1; decrements by 2; expires; OUT goes HIGH; reloads N − 1; ...

### Waveform (N = 6, even)
```
    Period = 6 CLK
  CLK   ┐_┌─┐_┌─┐_┌─┐_┌─┐_┌─┐_┌
  OUT   ┌───┐___┌───┐___┌───┐___
        |3 high|3 low|...
```

---

# T44. 8254 Mode 4 — Software Triggered Strobe [L13]

**Use**: software-initiated single strobe pulse.

### Behaviour
- OUT initially HIGH.
- After CW + initial count: counter loads on next CLK; this CLK does not decrement.
- After **N + 1 CLK** pulses, OUT goes LOW for **one CLK pulse**, then HIGH again.
- Triggered by writing the count (software action).
- GATE = 1 enables; GATE = 0 disables. GATE has no effect on OUT.
- Writing a new count during run: re-triggers (new strobe N+1 CLK after MSB write).
- For 2-byte: writing LSB has no effect; writing MSB triggers the new sequence.

### Waveform (N = 3)
```
  CLK    ┐_┌─┐_┌─┐_┌─┐_┌─┐_┌
  WRcount ___┐____________
  OUT    ‾‾‾‾‾‾‾‾‾‾‾‾└─┌‾‾   (low for 1 CLK after N+1 CLK)
```

---

# T45. 8254 Mode 5 — Hardware Triggered Strobe (Retriggerable) [L13]

**Use**: hardware-triggered programmable-delay strobe.

### Behaviour
- OUT initially HIGH.
- Trigger = rising edge of GATE.
- After trigger, count loaded on next CLK (this CLK doesn't decrement).
- After **N + 1 CLK** pulses, OUT goes LOW for one CLK, then HIGH.
- **Retriggerable**: any new rising GATE edge restarts the delay.
- GATE has no effect on OUT other than triggering.

### Difference from Mode 4
| Trigger source | Mode 4 | Mode 5 |
|----------------|--------|--------|
| Writing count  | yes    | no     |
| Rising GATE    | no     | yes    |

### Waveform (N = 4)
```
  CLK   ┐_┌─┐_┌─┐_┌─┐_┌─┐_┌─┐_┌
  GATE  ___┌──────────────
  OUT   ‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾└┘‾‾   (low for 1 CLK at N+1 after rising GATE)
```

---

# T46. 8254 GATE summary [L14]

| Mode | LOW (or going low) | Rising edge (trigger) | HIGH |
|------|---------------------|------------------------|------|
| 0 | Disable counting | – | Enable counting |
| 1 | – | Initiates counting | – |
| 2 | Disable; force OUT high | Reload counter | Enable counting |
| 3 | Disable; force OUT high | Reload counter | Enable counting |
| 4 | Disable counting | – | Enable counting |
| 5 | – | Initiates counting | – |

---

# T47. 8254 Programming Examples [L15]

### Example 1 (L15)
*8086 = 6 MHz, 8254 = 1.5 MHz.* Counter 0 at 0040H, control reg at 46H.

#### (a) Generate 1 ms square wave on OUT0 → Mode 3
- T_clk = 1/1.5 MHz = 0.66 µs.
- N = 1 ms / 0.66 µs ≈ 1500 = 0x05DC.
- Wait — slide rounds to N = 1500 = 0x05DC; uses LSB-only? Actually the slide writes N=15 which is wrong; let me recompute properly:
  - N = 1500 → CW for counter-0, mode-3, RW=11 (both bytes), binary: SC=00, RW=11, M=011, BCD=0 → **00 11 011 0 = 36H**.
  - The slide says 37H = 0011 0111 which is BCD count. Either can be used; 37H = BCD mode with count 1500 (BCD digits) = 1500 BCD ⇒ same numerical value but BCD form.

**ALP (binary count corrected version)**:
```
   START: MOV AL, 36H        ; CW: CTR0, RW LSB+MSB, mode 3, binary
          OUT 46H, AL
          MOV AL, 0DCH       ; LSB of 0x05DC
          OUT 40H, AL
          MOV AL, 05H        ; MSB
          OUT 40H, AL
```
(Lecture-slide used BCD count form; result waveform identical.)

#### (b) Interrupt processor every 10 ms → Mode 0, Counter 1 at 42H, OUT1 → INTR via 8259.
- T_clk = 0.66 µs.
- N = 10 ms / 0.66 µs = 15000 = 0x3A98.
- CW: SC=01, RW=11, M=000, binary → **01 11 000 0 = 70H**.

```
   START: MOV AL, 70H
          OUT 46H, AL
          MOV AL, 98H        ; LSB
          OUT 42H, AL
          MOV AL, 3AH        ; MSB
          OUT 42H, AL
```

### Practice problem
*"Generate 100 KHz square wave at OUT0 with 8 MHz clock."*
- N = 8 MHz / 100 kHz = 80 = 0x50. CW for CTR0, mode 3, RW=11, binary = **0011 0110 = 36H**.
```
  MOV AL, 36H
  OUT 43H, AL
  MOV AL, 50H
  OUT 40H, AL
  MOV AL, 00H
  OUT 40H, AL
```

### PYQ 24-25 Q4
*"Counter 2 port = 84H, control = 86H. 1.2 ms strobe on OUT on GATE trigger; clk = 1 MHz."*
- Mode = **Mode 1** (HW retriggerable one-shot).
- N = 1.2 ms × 1 MHz = 1200 = 0x4B0.
- CW: SC=10 (CTR2), RW=11, M=001, binary → **10 11 001 0 = B2H**.
```
  MOV DX, 86H
  MOV AL, B2H
  OUT DX, AL
  MOV DX, 84H
  MOV AL, B0H        ; LSB of 4B0
  OUT DX, AL
  MOV AL, 04H        ; MSB
  OUT DX, AL
```

### PYQ 23-24 Q7 — generate two outputs in parallel
*"100 kHz square at OUT0 (Mode 3) and 200 kHz continuous pulse at OUT1 (Mode 2). 8 MHz on CLK0/CLK1. A0 of 8254 ← A0 of 8086, A1 ← A1; A15 of 8086 to CS' through inverter."*

- Address: A15 = 1 selects 8254; with A0/A1 as is → ports 8000H = CTR0, 8001H = CTR1, 8002H = CTR2, 8003H = CW.
- N for 100 kHz square = 8 MHz / 100 kHz = 80 = 0x50, mode 3.
- N for 200 kHz pulse = 8 MHz / 200 kHz = 40 = 0x28, mode 2.

```
   ; CTR0: CW = 36H
   MOV DX, 8003H
   MOV AL, 36H
   OUT DX, AL
   ; CTR1: CW = 74H (SC=01, RW=11, M=010, BCD=0 = 0111 0100 = 74H)
   MOV AL, 74H
   OUT DX, AL
   ; Counts: question says "count is stored in LSB only". So RW=01.
   ; Re-derive with RW=01: CTR0 → 0001 0110 = 16H; CTR1 → 0101 0100 = 54H
   MOV AL, 16H
   OUT DX, AL
   MOV AL, 54H
   OUT DX, AL
   MOV DX, 8000H
   MOV AL, 50H        ; CTR0 LSB only
   OUT DX, AL
   MOV DX, 8001H
   MOV AL, 28H        ; CTR1 LSB only
   OUT DX, AL
```

---

# T48. DAC0830 — Digital-to-Analog Converter [L15]

### Specs
- 8-bit DAC; converts 8-bit binary to analog voltage.
- 256 voltage levels; each step = V_REF / 255 (for 8-bit). With V_REF = 5 V, step = +0.0196 V (when reference inverted in formula context, use −V_REF/255).
- Conversion time ≈ 1.0 µs (medium speed).
- Two **transparent latches** in series: input latch + DAC register latch. R-2R ladder produces I_OUT1, I_OUT2 (current outputs); external op-amp converts to voltage.

### Output formula
For 8-bit input D and reference voltage V_REF:
```
   V_OUT = -(D / 256) × V_REF      (offset binary, often)
or  V_OUT = (D / 255) × V_REF      (normalised)
```
Slide example: V_REF = -5 V → step = +0.0196 V; D = 1001 0010₂ = 0x92 = 146 → V_OUT = 146 × 0.0196 = +2.862 V.

### Pins
| Pin | Function |
|-----|----------|
| DI0–DI7 | 8-bit digital input |
| ILE     | Input Latch Enable (active high). Tie 1 to keep input latch transparent. |
| CS', WR1' | Latch input data on WR1 ↑ when CS' = 0. |
| WR2', XFER' | Transfer to DAC register on WR2 ↑ when XFER' = 0. |
| Iout1, Iout2 | Complementary current outputs to op-amp. |
| V_REF | Reference voltage. |
| Rfb | Internal feedback resistor for op-amp. |

### Single-buffered vs double-buffered
- Disable input latch (ILE = 1, CS' = 0 always) → only DAC register latches. Software writes one byte → output updates immediately.
- Use both latches for synchronous update of multiple DACs.

### Interfacing 0830 to 8086 (typical)
- ILE tied high.
- CS' from address decoder.
- WR1' from CPU IOWC' (or WR' for memory-mapped).
- WR2', XFER' tied low (single-buffer mode).

[IMAGE FLAG — L15 pp.11-12: voltage conversion characteristic and 0830 schematic — manual review.]

---

# T49. ADC — Successive Approximation [L15]

### Why successive approximation?
- Faster than ramp/integrating converters for given resolution.
- Conversion time fixed at **n clock cycles for n-bit ADC**.

### Algorithm
1. Set MSB of approximation register; output to DAC; compare DAC output with analog input.
2. If DAC output ≤ input, keep MSB = 1; else clear it.
3. Move to next bit; repeat.
4. After n iterations, register holds the digital value.

### Components
- DAC (R-2R or capacitive),
- Comparator,
- SAR (Successive Approximation Register),
- Control logic + sample/hold front-end.

[IMAGE FLAG — L15 pp.13-15: SAR ADC block diagram and waveform.]

---

# T50. Interrupts — Concept and Types [L16]

### Why interrupts
- Useful for I/O devices that operate at low data rates.
- Alternative to polling.
- Allow CPU to execute other software while peripherals are busy.

### x86 interrupt categories
| Category | Source | Examples |
|----------|--------|----------|
| Hardware | external pins (NMI, INTR) | 8259 IR0–IR7 routed to INTR |
| Software | `INT n` instruction | `INT 21H` DOS, `INT 33H` mouse |
| Exceptions | Internal CPU faults | divide-by-0 (Type 0), single-step (Type 1), breakpoint (`INT 3`, Type 3), overflow (`INTO`, Type 4), bound exceeded (`BOUND`, Type 5) |

### NMI — Non-Maskable Interrupt
- Used for major faults: parity errors, power failures.
- **Edge-triggered** (rising edge 0→1).
- Must remain HIGH until accepted by CPU.
- Before the 0→1 edge, NMI must have been at 0 for ≥2 clock cycles.
- Cannot be masked by IF.
- Vector = **Type 02h** (offset/segment at 0x0008–0x000B).

### INTR
- Maskable; gated by IF flag.
- **Level-triggered**, active HIGH.
- Acknowledged by CPU's INTA' pulses (two of them).

### INTA pulses
1. First INTA': tells PIC to freeze priority resolver.
2. Second INTA': PIC drives 8-bit vector number on D0–D7; CPU latches and uses as n in INT n.

### INTO
- `INTO` instruction checks **overflow flag (OF)**.
- If OF = 1 → INT 4 ISR called.
- Otherwise, no operation.

### BOUND
- `BOUND AX, mem` checks signed value of AX against [mem, mem+1] (lower) and [mem+2, mem+3] (upper).
- If AX < lower or AX > upper → INT 5.

---

# T51. Interrupt Vector Table (IVT) [L16]

### Layout (real mode)
- Located at 000000H–0003FFH (1024 bytes).
- 256 vectors × 4 bytes each.
- Each vector: 2 bytes IP (offset), 2 bytes CS (segment) — IP first (lower address), CS later.

### Vector address calculation
For interrupt type *n*:
- Address of IP = n × 4
- Address of CS = n × 4 + 2

#### PYQ 24-25 Q3 (vector table starting at 0x0000, 2-byte vector each)
*"Microcontroller IVT at 0x0000, 2-byte vector. Address of ISR for interrupt 7?"*
- 2 bytes per vector → ISR start address = 7 × 2 = 14 = **0x000E**.

### Reservation
- Type 00–04: **dedicated** to specific Intel functions.
  - 0: Divide error
  - 1: Single-step (TF)
  - 2: NMI
  - 3: Breakpoint (`INT 3`)
  - 4: Overflow (`INTO`)
- Type 05–31 (1FH): reserved by Intel for future use.
- Type 32–255: **user-defined** (hardware via INTR, or software `INT n`).

Example: DOS `INT 21H` is interrupt type 33 (decimal) → vector at 21H × 4 = 84H.

---

# T52. INT n, INT 3, BOUND [L16]

### INT n
- Calls ISR at vector n × 4.
- 2-byte instruction (opcode CD + n).

### INT 3
- 1-byte instruction (opcode CC). Used as **breakpoint**: a debugger replaces a target instruction's first byte with CC, then executes; the CPU traps to INT 3.
- Vector at 0x000C–0x000F.

### BOUND
- `BOUND reg16, mem32` (or 32-bit variants).
- Compares the register against memory-stored bounds; raises INT 5 if out-of-range.

### IRET
- Removes 6 bytes from stack: 2 IP, 2 CS, 2 FLAGS (in that order — top of stack popped first).
- For 80386+ in protected mode: IRETD (32-bit) and IRETQ (64-bit) variants.

---

# T53. 8086 Interrupt Processing Sequence [L16]

When CPU acknowledges an interrupt (INTR after INTA's, NMI on edge, or `INT n`):

1. Decrement SP by 2; **push FLAGS** on stack.
2. **Clear IF** in flag register (disables further INTR).
3. **Clear TF** in flag register (disables single-step during ISR).
4. Decrement SP by 2; **push CS**.
5. Decrement SP by 2; **push IP**.
6. Load new CS:IP from IVT[type × 4].
7. Begin execution of ISR.

ISR ends with **IRET**:
- Pop IP, pop CS, pop FLAGS (restoring IF and TF).

### After IRET — SP recovery example (PYQ 21-22 Q3 type)
The processor restores SP to the value it had **before** the interrupt + any user-pushed bytes.

---

# T54. 8259A PIC — Block Diagram [L16]

**Programmable Interrupt Controller**: turns up to 8 IR inputs into one INT output to the CPU. Cascade up to **8 slaves to 1 master = 64 interrupts**.

### Internal blocks
| Block | Function |
|-------|----------|
| **IRR** (Interrupt Request Reg) | Latches incoming IR0–IR7 requests. |
| **ISR** (In-Service Reg) | Set when corresponding interrupt is being serviced; cleared on EOI. |
| **IMR** (Interrupt Mask Reg) | A 1 in bit i masks IRi. |
| **Priority Resolver** | Selects highest-priority unmasked IRR bit; sets ISR; drives INT to CPU. |
| **Control Logic** | Issues INT, accepts INTA pulses. |
| **Cascade Buffer/Comparator** | CAS0–CAS2 bus. Master drives slave-ID; slave compares. |
| **Read/Write Logic** | Decodes A0, RD', WR'. |
| **Data Bus Buffer** | 3-state buffer to/from CPU data bus. |

### Why two separate IRR/ISR?
IRR holds *pending* requests; ISR holds *currently-running* requests so the priority resolver can permit nested higher-priority interrupts.

---

# T55. 8259A Pin Description [L16]

| Pin | Description |
|-----|-------------|
| **CAS0–CAS2** | Cascade lines. Outputs from master (drives slave ID); inputs on slaves. |
| **SP'/EN'** | Dual-purpose: in buffered mode = buffer enable; in non-buffered mode = master/slave designator (1 = master, 0 = slave). |
| **CS'** | Chip select. RD/WR ignored unless low. INTA function independent of CS'. |
| **WR'** | Write enable from CPU. |
| **RD'** | Read enable; releases status onto data bus. |
| **D0–D7** | Bidirectional data bus. Carries control words, status, and interrupt vector during INTA cycle. |
| **INT** | High when valid interrupt request pending; goes to CPU INTR. |
| **IR0–IR7** | Interrupt request inputs. Edge or level mode (set in ICW1). |
| **INTA'** | Strobe-in input from CPU. With CS', WR', RD' selects ICW/OCW/data-read operations. |
| **A0** | Selects ICW1/OCW2/OCW3 (A0=0) or ICW2/3/4/OCW1 (A0=1). |
| **Vcc, GND** | +5V / ground. |

### Address mapping in 8086 system
8259 connected to lower bank: 8086 A0 unused (we put 8259 on even bytes); 8086 A1 → 8259 A0. Two consecutive even ports.

For 8259 at port 80H: A0=0 → port **80H** (ICW1/OCW2/OCW3); A0=1 → port **82H** (ICW2/3/4/OCW1) using 8086 A1 = 1.

---

# T56. 8259 Interrupt Sequence in 8086 system [L16]

1. One or more IR lines go HIGH → corresponding IRR bits set.
2. 8259 evaluates IRR vs IMR vs ISR; if appropriate, asserts INT to CPU.
3. CPU acknowledges with **INTA pulse #1** (no data on bus, IRR latch frozen, highest-priority ISR bit set, IRR bit reset).
4. CPU sends **INTA pulse #2**. 8259 drives 8-bit vector (set via ICW2 + IRn) onto D0–D7. CPU reads.
5. CPU pushes FLAGS, CS, IP; clears IF, TF; jumps to ISR.
6. In **AEOI**: ISR bit cleared automatically at end of INTA #2. Otherwise, ISR bit stays set until ISR sends EOI command.

```
                INTA1               INTA2
   CPU INTA' ──┐_┌─────────────────┐_┌────────
   8259 D bus  ────────────────────[Vector]───
   8259 ISR    [bit n set]                    [cleared on EOI]
```

---

# T57. 8259 Operating Modes [L17, L18]

### 1. Fully Nested Mode (FNM)
- **Default mode**.
- IR0 = highest priority, IR7 = lowest.
- When ISR bit set, **all equal-or-lower priority** are masked.
- Higher-priority IR can preempt the current ISR (only if IF = 1 in CPU).
- Suitable for single-8259 systems.

### 2. Special Fully Nested Mode (SFNM)
- Used by **master** in cascaded systems.
- Same priority structure as FNM (IR0 highest).
- Master will *also* serve a higher-priority IR from a slave whose other IR is currently being serviced (in plain FNM, all slaves' IRs would be blocked). Lets the master nested-serve interrupts from one slave.

### 3. Rotating Priority Modes
**a) Automatic Rotation**: After IRn is serviced, IRn becomes lowest priority; others rotate. Useful when sources are equally important.
- Example: IR4 just serviced → IR4 lowest, IR5 highest, IR6 second, ... IR3 second-lowest.

**b) Specific Rotation**: Programmer specifies which IR is to be lowest priority via OCW2 (mode 110xx + L0–L2).
- Example: program IR6 as lowest → IR7 becomes highest.

### 4. Special Mask Mode (SMM)
- Enables **all levels** (lower or higher) **except** the bit currently set in ISR.
- Used inside an ISR that wants to allow lower-priority IRs to preempt itself temporarily.

### 5. Poll Mode
- 8259's INT pin is unused.
- CPU sends a **poll command** via OCW3.
- 8259 responds with a *poll word* on D0–D7 indicating highest pending IR.
- Advantages: CPU not interrupted; common ISR for many IRs; can extend interrupts beyond 64.
- Disadvantages: long polling interval delays service; short interval wastes CPU.

---

# T58. End Of Interrupt (EOI) [L17, L18]

When CPU acknowledges interrupt → ISR bit set. EOI clears that bit so lower-priority interrupts can again be served.

| EOI Mode | Description |
|----------|-------------|
| **Normal Non-Specific EOI** | Programmer issues OCW2 with EOI bit. 8259 resets the **highest-priority ISR bit**. Suitable when priority structure is fixed. |
| **Specific EOI** | OCW2 specifies *which* IR bit to reset (L0–L2). Needed when SMM or rotating priority is in effect. |
| **Automatic EOI (AEOI)** | Set in ICW4. 8259 resets ISR bit at end of **second INTA pulse**. Useful for short ISRs but loses preemption ordering — sources could re-interrupt before ISR finishes. |
| **Rotate on Non-Specific EOI** | Same as non-specific EOI, plus rotate priorities after reset. |
| **Rotate on AEOI** | AEOI + rotate. |
| **Rotate on Specific EOI** | Specific EOI + rotate. |

---

# T59. ICW1 / ICW2 / ICW3 / ICW4 [L18]

Initialization Command Words. Must write ICW1 first; sequence determined by ICW1 contents.

### ICW1 (A0 = 0, D4 = 1)
```
   D7 D6 D5  D4  D3  D2  D1   D0
   A7 A6 A5  1   LTIM ADI SNGL IC4
```
| Bit | Meaning |
|-----|---------|
| A7–A5 | Vector base bits — 8086 ignores these. (For 8085 only.) |
| LTIM | 1 = Level-triggered IR; 0 = Edge-triggered. |
| ADI  | Call address interval (1 = 4, 0 = 8) — 8085 only. |
| SNGL | 1 = single 8259; 0 = cascaded. |
| IC4  | 1 = ICW4 will be issued; 0 = no ICW4. |

### ICW2 (A0 = 1) — Vector base for IR0–IR7
```
   D7  D6  D5  D4  D3  | D2 D1 D0
   T7  T6  T5  T4  T3  | --- (filled by 8259 with IR# 0–7)
```
- For 8086: T7–T3 set the upper 5 bits of vector. Lower 3 bits = IR# (000–111).
- e.g., to map IR0 → vector 40H: T7..T3 = **01000** ⇒ ICW2 = 0100 0000 = **40H**. IRn vector = 40H + n.

### ICW3 (A0 = 1) — only when SNGL = 0 (cascade)
- **For master**: 8 bits, bit i = 1 if a slave is on IRi.
- **For slave**: D2 D1 D0 = slave ID (0–7) — must match the IR line of master to which slave is connected.

### ICW4 (A0 = 1) — issued only if IC4 = 1
```
   D7 D6 D5 D4   D3   D2  D1  D0
   0  0  0  SFNM BUF M/S AEOI µPM
```
| Bit | Meaning |
|-----|---------|
| µPM | 1 = 8086/8088 mode; 0 = 8085 mode. |
| AEOI | 1 = automatic EOI; 0 = normal EOI. |
| BUF + M/S | 00 = non-buffered; 10 = buffered slave; 11 = buffered master; 01 reserved. |
| SFNM | 1 = special fully nested; 0 = fully nested. |

### Worked example (L18 p.14)
*"Single 8259, edge-triggered, AEOI, buffered, IR0 vector = 40H, mask IR3-IR6, port 80H."*
- Single, ICW4 needed → ICW1 = 0001 0111 = **17H** (LTIM=0 edge, SNGL=1, IC4=1).
- ICW2 = 40H.
- No ICW3 (single).
- ICW4: µPM=1, AEOI=1, BUF=1 (buffered), M/S=1 (master = "buffered master" = 11), SFNM=0 → 0000 1111 = **0FH**.
- OCW1 (mask IR3-IR6) = 0111 1000 = **78H**.

```
   START: MOV AL, 17H ; ICW1
          OUT 80H, AL
          MOV AL, 40H ; ICW2
          OUT 82H, AL
          MOV AL, 0FH ; ICW4
          OUT 82H, AL
          MOV AL, 78H ; OCW1: mask IR3-IR6
          OUT 82H, AL
```

---

# T60. OCW1 / OCW2 / OCW3 [L18]

### OCW1 (A0 = 1) — Interrupt Mask Register
- M0–M7: 1 = mask the corresponding IR; 0 = unmask.

### OCW2 (A0 = 0; D4 = 0, D3 = 0) — EOI / Rotation
```
  D7  D6  D5  D4 D3 D2 D1 D0
  R   SL  EOI 0  0  L2 L1 L0
```
| R SL EOI | Function |
|----------|----------|
| 0 0 1 | Non-specific EOI |
| 0 1 1 | Specific EOI (use L bits) |
| 1 0 1 | Rotate on Non-Spec EOI |
| 1 0 0 | Set rotate mode (auto rotate during AEOI) |
| 0 0 0 | Clear rotate mode |
| 1 1 1 | Rotate on Specific EOI (use L bits) |
| 1 1 0 | Set Priority command (program lowest IR via L bits) |

### OCW3 (A0 = 0; D4 = 0, D3 = 1) — Read/Poll/SMM
```
  D7  D6   D5   D4 D3 D2  D1  D0
  -   ESMM SMM  0  1  P   RR  RIS
```
| Bit | Meaning |
|-----|---------|
| ESMM, SMM | 11 = enter SMM; 10 = exit SMM; 0X = no change. |
| P | 1 = poll command. |
| RR, RIS | 10 = read IRR on next RD; 11 = read ISR on next RD. |

---

# T61. 8259 Cascade Mode programming [L18]

Cascading: master plus N slaves. Slave INT pins are wired to master IR lines. CAS0–CAS2 form a 3-bit broadcast bus (master drives, slaves listen).

### During interrupt acknowledge cycle
1. Master receives INTA pulse 1 → master drives slave-ID for the highest-priority slave on CAS0–CAS2.
2. Slaves compare CAS to their ID (set in ICW3). The matching slave gets selected.
3. INTA pulse 2: the selected slave drives the vector on D bus.

### Programming master vs slave
- ICW1 same except SNGL = 0.
- ICW3: differs.
  - Master: bit *i* = 1 for each IR with a slave attached.
  - Slave: 3-bit slave ID = master's IR line number to which slave is attached.

### Example (L18 p.26): cascaded with 2 slaves on master IR2 and IR3
"Master at 80H, vector IR0 = 40H, edge-triggered, AEOI, SFNM. Keyboard on IR4 (master). Slave2 on IR2 (master): port 84H, vector IR0 = 50H, IR0 printer + IR1 card reader, level-triggered, normal EOI. Slave3 on IR3 (master): port 90H, vector IR6 = 76H, IR0/IR2/IR7 used, edge-triggered, AEOI."

#### Master (port 80H):
- ICW1 = 0001 0101 = **15H** (edge, cascade, IC4 needed)
- ICW2 = 40H
- ICW3 = 0000 1100 = **0CH** (slaves on IR2 and IR3)
- ICW4 = 0001 1111 = **1FH** (SFNM=1, BUF M/S=11 buffered master, AEOI=1, µPM=1)
- OCW1 mask: enable only IR2, IR3, IR4; mask IR0,1,5,6,7 → 1110 0011 = **E3H**.

```
   MOV AL, 15H
   OUT 80H, AL
   MOV AL, 40H
   OUT 82H, AL
   MOV AL, 0CH
   OUT 82H, AL
   MOV AL, 1FH
   OUT 82H, AL
   MOV AL, E3H
   OUT 82H, AL
```

#### Slave2 (port 84H) — connected to master IR2:
- ICW1 = 0001 1101 = **1DH** (level-triggered LTIM=1, cascade, IC4)
- ICW2 = 50H
- ICW3 = 02H (slave ID = 2)
- ICW4 = 0000 1001 = **09H** (non-buffered slave, normal EOI, µPM=1)
- OCW1: enable IR0 (printer) + IR1 (card reader) → mask 1111 1100 = **FCH**.

```
   MOV AL, 1DH
   OUT 84H, AL
   MOV AL, 50H
   OUT 86H, AL
   MOV AL, 02H
   OUT 86H, AL
   MOV AL, 09H
   OUT 86H, AL
   MOV AL, FCH
   OUT 86H, AL
```

#### Slave3 (port 90H) — connected to master IR3:
- ICW1 = 0001 0101 = **15H** (edge)
- ICW2 = vector IR6 = 76H ⇒ T7..T3 = (76H − 6) = 70H. So ICW2 = **70H**.
- ICW3 = 03H (slave ID = 3)
- ICW4 = 0000 1011 = **0BH** (non-buffered slave, AEOI, µPM=1)
- OCW1: enable IR0, IR2, IR7 → mask 0111 1010 = **7AH**. *(slide says 78H → check: 0111 1000 enables IR0 and IR2; missing IR7 enable.)* Re-verifying: enable IR0, IR2, IR7 means **mask** IR1, IR3, IR4, IR5, IR6 → 0111 1010 = **7AH**. The slide value 78H = 0111 1000 enables IR0, IR1, IR2, IR7. Use 7AH for the stated requirement.

### PYQ 24-25 Q5 — Master/Slave example  
- Master port 50H, slave on master IR2 (port 90H), 8086/88 mode, edge-triggered, normal EOI, no special modes, master vector IR0 = 70H, slave printer IR3 vector 80H, slave IR6 = card reader.
- Master:  ICW1 = 11H (cascade, IC4, edge); ICW2 = 70H; ICW3 = 04H (slave on IR2 = 0000 0100); ICW4 = 01H (8086 mode, normal EOI, non-buffered); OCW1 = mask all except IR2 = FBH (1111 1011).
- Slave: ICW1 = 11H; ICW2 = 80H; ICW3 = 02H (slave ID 2); ICW4 = 01H; OCW1 = enable IR3 + IR6, mask others = 1011 0111 = **B7H**.

---

# T62. DMA Concept and Basic Operation [L19]

### Why DMA
Without DMA, transferring data byte-by-byte involves CPU executing `MOV` + `OUT` for each byte → CPU is bottleneck. DMA controller transfers bytes between memory and I/O **directly**, freeing the CPU for other work.

### Benefits
- CPU initiates transfer once → DMA handles full block.
- Overall throughput up because DMA can run in parallel with CPU (when buses are not contested).
- Used for: disk drives, audio cards, network cards, GPUs.

### Sequence
1. I/O device sends DREQ (DMA request) to DMA controller.
2. DMA controller raises **HOLD = 1** to 8086.
3. 8086 finishes current bus cycle.
4. 8086 asserts **HLDA = 1** and tristates A/D/control buses.
5. DMA controller takes ownership of all three buses.
6. DMA generates address; asserts MEMR/IOW (or MEMW/IOR) simultaneously to transfer one byte (or word).
7. After the block (or single byte, depending on mode) DMA releases HOLD = 0.
8. 8086 sees HOLD = 0, deasserts HLDA = 0, resumes execution.

### Priority of HOLD
- **HOLD has higher priority than INTR and NMI** (a pending DMA must finish before interrupt is serviced).
- Only **RESET** has higher priority than HOLD.

### DMA read vs DMA write
| Operation | Direction | Control signals asserted |
|-----------|-----------|---------------------------|
| **DMA Read** | Memory → I/O device | MEMR' (MRDC') and IOW' (IOWC') simultaneously. |
| **DMA Write** | I/O device → Memory | MEMW' (MWTC') and IOR' (IORC') simultaneously. |

### 8086/8088 caveat
8086/8088 does not generate MRDC/MWTC/IORC/IOWC directly — these are produced by the **8288 bus controller** (max mode) or by extra logic in min mode. So a DMA-equipped 8088 system needs a system controller circuit.

### How fast?
- Speed limited by min(memory speed, DMA controller speed).
- 50 ns memory: up to 1/50 ns = 20 MB/s theoretical.
- 8237-5 max ≈ 1.6 MB/s; 8237 might slow the system if its rate < memory rate.

### PYQ 21-22 Q6 — DMA in MAX mode (no HOLD/HLDA)
In max mode, 8086 has no HOLD/HLDA pins. Instead, **RQ/GT0** and **RQ/GT1** bidirectional pins serve the role: external master pulses RQ to request, 8086 pulses back to grant. Same effective protocol with 1-pin handshake.

---

# T63. 8237 DMA Controller Pinout [L19, L20]

### Specs
- 4-channel DMA controller (Channels 0–3).
- 8086/8088 compatible.
- Each channel: 16-bit address + 16-bit count → up to **64 KB** per channel per programming.
- Max rate: 1.6 MB/s.

### Pins
| Pin | Function |
|-----|----------|
| **D0–D7** | Bidirectional data bus (CPU programming and address bytes during DMA). |
| **A0–A3** | Bidirectional. Inputs from CPU (register select); outputs during DMA (low-address bits). |
| **A4–A7** | Outputs (during DMA). Provide upper byte of internal 16-bit address. |
| **DREQ0–DREQ3** | DMA Requests from peripherals. |
| **DACK0–DACK3** | DMA Acknowledges to peripherals. |
| **HRQ** | Hold Request to CPU (connects to HOLD). |
| **HLDA** | Hold Acknowledge from CPU (input). |
| **CS'** | Chip select (CPU programming). |
| **RD', WR'** | Read/write strobes (during programming and address output). |
| **MEMR', MEMW'** | Memory read/write outputs (during DMA). |
| **IOR', IOW'** | I/O read/write outputs (during DMA). |
| **AEN** | Address Enable. High during DMA → disables CPU's latches and enables 8237's. |
| **ADSTB** | Address Strobe. High pulse latches A8–A15 (sent on D0–D7) into external Latch D. |
| **EOP'** | End-of-Process. Bidirectional. Goes low at terminal count, can be driven externally to abort. |
| **READY** | From slow memory; inserts wait states into DMA. |
| **CLK, RESET, Vcc, GND** | Standard. |

### Address generation by 8237
- 8237 outputs **A0–A7** directly.
- For A8–A15, 8237 puts those bits on D0–D7 with ADSTB pulse → external Latch D captures and presents on system A8–A15.
- For A16–A19 (8086 has 20-bit address), system uses **DMA Page Register** (Latch B in slides) — programmed separately by CPU, holds upper 4 bits during DMA.

[IMAGE FLAG — L19/L20 pinout pages: standard 8237 pinout — manual review needed.]

---

# T64. 8237 Internal Registers [L19, L20]

### Per-channel registers (one set per channel 0..3)
| Register | Width | Purpose |
|----------|-------|---------|
| **Base Address** | 16 | Original address (used for auto-init reload). |
| **Current Address** | 16 | Active address; increments/decrements as transfer proceeds. |
| **Base Count** | 16 | Original count. |
| **Current Count** | 16 | Active count; decrements per transfer. Terminal Count when it underflows from 0 to FFFF. |
| **Mode Register** | 8 | Per-channel mode (see below). |

### System-wide registers
| Register | Purpose |
|----------|---------|
| **Command Register** | Global controls (memory-to-memory enable, channel-0 hold, controller enable, priority mode, timing, DREQ/DACK polarity). |
| **Mask Register Set/Reset (MRSR)** | Sets or clears mask of one channel at a time. |
| **Mask Register (MR)** | Sets/clears all masks at once. |
| **Status Register** | Per-channel TC (terminal count) bits + per-channel REQUEST bits. |
| **Bus Request Register** | Software-initiated DMA request (per channel). |
| **Temporary Register** | Used during memory-to-memory: holds intermediate byte. |

### Mode Register (one per channel)
```
   D7 D6 | D5  | D4   | D3 D2 | D1 D0
  M1 M0  | A/D | TC?  | OP    | CS
  Mode    Addr   Auto   T/W/R   Channel
```
| Bits | Meaning |
|------|---------|
| **D1 D0** | Channel 00,01,10,11 = Ch0..Ch3. (Used to select which mode register is being written.) |
| **D3 D2 (Operation)** | 00 = verify; 01 = write transfer (I/O→Mem); 10 = read transfer (Mem→I/O); 11 = illegal. |
| **D4 (Auto-init)** | 1 = auto-init enabled (after TC, base regs reload current regs). |
| **D5 (Address inc/dec)** | 0 = increment; 1 = decrement. |
| **D7 D6 (Mode)** | 00 = Demand; 01 = Single; 10 = Block; 11 = Cascade. |

### Transfer modes
- **Demand mode**: continues as long as DREQ is high; pauses if DREQ drops, resumes when high again. Transfer ends on TC or external EOP'.
- **Single mode**: HOLD released after each byte. If DREQ stays high, 8237 re-requests bus → byte-at-a-time interleaving with CPU.
- **Block mode**: once DREQ asserted, full block (count) transferred without releasing bus. DREQ need not stay active.
- **Cascade mode**: this 8237 is a slave of another 8237. DREQ/DACK become handshake to upper-level 8237.

### Command Register
```
  D7  D6   D5    D4   D3   D2   D1   D0
  DACK_PSEL DREQ_PSEL EXT_W ROT_PR  C_TIM CTRL  CH0_AddrHold M2M_Enable
```
| Bit | Meaning |
|-----|---------|
| D0 | Memory-to-memory enable (1 = enable Ch0 → Ch1 mem-to-mem) |
| D1 | Channel-0 address hold enable (for memory-fill) |
| D2 | DMA controller disable (1 = disable) |
| D3 | Compressed timing |
| D4 | Rotating priority (1 = rotate; 0 = fixed: Ch0 highest) |
| D5 | Extended write select |
| D6 | DREQ active level (0 = active high, 1 = active low) |
| D7 | DACK active level |

### Status Register (read-only)
```
  D7..D4  | D3..D0
  Ch3..Ch0 REQ |  Ch3..Ch0 TC
```
- Lower nibble: TC (terminal-count) reached for channel x → bit set; cleared when status read.
- Upper nibble: DREQ active for channel x.

### Bus Request Register
- Sets internal DREQ for a channel via software. Useful for memory-to-memory (no external trigger).

### Mask Register Set/Reset (MRSR)
```
  D7..D3   | D2 | D1 D0
  X        | S/R| CH-select
```
- Single-channel mask set/clear.

### Mask Register (write all)
- 4-bit value sets mask for all 4 channels in one write.

---

# T65. 8237 Software Commands [L20]

Software-only commands triggered by writing specific I/O addresses (not via Command Register):

| Command | Effect |
|---------|--------|
| **Master Clear** | Software RESET. Clears Command, Status, Request, Temporary, internal F/L FF; sets all mask bits (disables all channels). |
| **Clear Mask Register** | Clears all 4 masks → enables all 4 channels. |
| **Clear F/L (First/Last) Flip-Flop** | Resets the byte-pointer FF used for sequential LSB/MSB writes to address/count. F/L = 0 selects LSB; flips after each write. |

Other software-controlled actions:
- Enable/disable controller via Command Register.
- Set per-channel mode via Mode Register.
- Mask/unmask a single channel via MRSR.
- Initiate DMA via Bus Request Register.
- Read Status Register.

---

# T66. 8237 Programming Address & Count [L20]

### Sequence (per channel)
1. **Clear F/L FF** (so next write goes to LSB).
2. **Disable** the channel (set its mask).
3. Write **LSB of address** to channel-x address port; F/L flips.
4. Write **MSB of address** to channel-x address port; F/L flips back.
5. Repeat clear-F/L if you want LSB next.
6. Write **LSB of count**; **MSB of count**.

### Important: count = (bytes_to_transfer − 1)
Because TC happens after underflow from 0 to FFFFH (one transfer beyond 0).

### 20-bit address split (for 8086)
- Lower 16 bits → 8237 channel address register.
- Upper 4 bits (A16–A19) → external **DMA Page Register** (Latch B).
- This is why memory-to-memory transfers within the same 64 KB page are easy; crossing 64 KB boundary needs reprogramming.

---

# T67. 8237 — Interfacing to 8086 (Latches A–E, AEN logic) [L20]

When AEN = 0 (CPU normal operation):
- **Latch A** active → provides A19–A16 to system.
- **Latch C** active → provides A7–A0.
- **Multiplexer E** routes control signals from CPU.

When AEN = 1 (DMA cycle):
- **Latch A disabled, Latch B active** → Latch B holds the DMA Page (A19–A16).
- **Latch C disabled, Latch D active** → Latch D holds A15–A8 (loaded by ADSTB pulse).
- **8237 directly drives A7–A0**.
- **Multiplexer E switches** to take control signals (MEMR/MEMW/IOR/IOW) from 8237 instead of CPU.

```
                  AEN=0 (CPU)              AEN=1 (DMA)
   A19..A16  ←── Latch A (CPU)        ←── Latch B (DMA page reg)
   A15..A8   ←── (CPU directly)       ←── Latch D (loaded by ADSTB)
   A7..A0    ←── Latch C (CPU)        ←── 8237 directly
   MEMR/MEMW
   IOR/IOW   ←── MUX from CPU         ←── MUX from 8237
```

[IMAGE FLAG — L20 pp.25-27: schematic of 8237 + 5 latches + multiplexer for 8088 system.]

---

# T68. 8237 Programming Sequence (general) [L20, L21]

### General steps to set up DMA
1. Master Clear (or Clear F/L FF).
2. Mask off the channel.
3. Program **DMA Page** (Latch B) with upper 4 bits of address.
4. Program channel **address** (LSB then MSB).
5. Program channel **count** (LSB then MSB) — count = bytes − 1.
6. Program **Mode Register** for the channel.
7. Program **Command Register** (e.g., enable mem-to-mem; rotate vs fixed priority; etc.).
8. Unmask the channel (Mask Register Set/Reset).
9. (For software-initiated transfers) write to Bus Request Register.
10. Poll Status Register for TC, or wait for completion event.

---

# T69. Memory-to-Memory Transfer [L21]

### Special hardware feature
- 8237 can copy from memory to memory by chaining **Channel 0 (source)** and **Channel 1 (destination)**.
- Enabled in Command Register bit 0 (M2M).
- A *temporary register* inside 8237 holds the byte while the source-read and dest-write happen on consecutive cycles.

### Setup procedure (L21 example: copy 10000H–13FFFH to 14000H–17FFFH = 16 KB)
1. Latch B (page reg) = 1H (upper nibble).
2. Clear F/L FF.
3. Channel 0 = source; Channel 1 = destination (mode regs).
4. Program addresses: Ch0 starting = 0000H (within 1XXXXH page; full = 10000H), Ch1 = 4000H (full = 14000H).
5. Count = bytes − 1 = 16 K − 1 = 3FFFH (programmed in Ch1 only — channel 1 governs the count for mem-to-mem).
6. Mode Register Ch0: **Block, Increment, Read transfer**: 1000 1000 = **88H** (Mode=10 Block, A/D=0 inc, AutoInit=0, OP=10 read, CH=00 → 88H).
7. Mode Register Ch1: **Block, Increment, Write transfer**: 1000 0101 = **85H** (OP=01 write, CH=01 → 85H).
8. Command Register: enable M2M (D0=1) → 0000 0001 = **01H** (default fixed priority, controller enabled, etc.).
9. Mask Register: enable Ch0 (clear bit 0) → 0000 1110 = **0EH**.
10. Bus Request Register: software-trigger Ch0 → 04H (D2=1 sets the request for channel 0).
11. Poll Status Register: AL & 1 → bit 0 = 1 means TC for channel 0.

### PYQ 24-25 Q8 — 8237 mem-to-mem
*"Source 21000H–210FFH, Destination 20000H–200FFH (256 bytes). Channel 0 → Channel 1, fixed priority, mem-to-mem, block, no auto-init. Latch B for A19–A16."*
- Latch B = 02H (since 21000H and 20000H share upper 4 bits = 2; assumption made because both regions are within page 02H).
- Source = 1000H; Destination = 0000H; Count = 255 = 00FFH.
- Mode Ch0 = 88H; Ch1 = 85H.
- Command = 01H (fixed priority + M2M).
- Mask = 0EH (enable Ch0).
- Bus Request = 04H.

```
  LATCHB EQU 10H ; assumed
  CLEARF EQU 7CH
  CH0A   EQU 70H
  CH1A   EQU 72H
  CH1C   EQU 73H
  MODE   EQU 76H
  CMMD   EQU 78H
  MASK   EQU 7FH
  REQ    EQU 79H
  STATUS EQU 7BH

  MOV AL, 02H
  OUT LATCHB, AL
  OUT CLEARF, AL
  MOV AX, 1000H        ; source low 16
  OUT CH0A, AL
  MOV AL, AH
  OUT CH0A, AL
  MOV AX, 0000H        ; dest low 16
  OUT CH1A, AL
  MOV AL, AH
  OUT CH1A, AL
  MOV AX, 00FFH        ; count - 1
  OUT CH1C, AL
  MOV AL, AH
  OUT CH1C, AL
  MOV AL, 88H          ; CH0 mode
  OUT MODE, AL
  MOV AL, 85H          ; CH1 mode
  OUT MODE, AL
  MOV AL, 01H          ; command (M2M, fixed)
  OUT CMMD, AL
  MOV AL, 0EH          ; enable CH0
  OUT MASK, AL
  MOV AL, 04H          ; bus request CH0
  OUT REQ, AL
WAIT: IN AL, STATUS
  TEST AL, 1
  JZ WAIT
  HLT
```

---

# T70. Memory Fill using 8237 [L21]

### Concept
Channel 0 source register is **address-held** (does not increment) → reads same byte over and over. Channel 1 destination register increments → fills the destination block with the constant.

### Setup
- Initialise the constant byte at **ES:DI** in memory (CPU writes it once).
- Source = ES:DI (held).
- Destination = ES:DI + 1 (increments).
- Count = N − 1.
- Command Register: **bit 1 = 1** (Channel 0 address hold enable).

### Code skeleton (L21 p.27)
```
  LATCHB EQU 10H
  CLEARF EQU 7CH
  CH0A   EQU 70H
  CH1A   EQU 72H
  CH1C   EQU 73H
  MODE   EQU 7BH
  CMMD   EQU 78H
  MASKS  EQU 7FH
  REQ    EQU 79H
  STATUS EQU 78H

  CLEAR PROC NEAR USES AX
    MOV AX, ES               ; latch B = upper 4 bits of segment
    MOV AL, AH
    SHR AL, 4
    OUT LATCHB, AL
    OUT CLEARF, AL           ; clear F/L
    MOV AL, ZERO             ; first byte = 0 (the fill value)
    MOV ES:[DI], AL

    MOV AX, ES               ; source = segment*16+SI
    SHL AX, 4
    ADD AX, SI
    OUT CH0A, AL
    MOV AL, AH
    OUT CH0A, AL

    MOV AX, ES               ; dest = segment*16+DI
    SHL AX, 4
    ADD AX, DI
    OUT CH1A, AL
    MOV AL, AH
    OUT CH1A, AL

    MOV AX, CX               ; count - 1
    DEC AX
    OUT CH1C, AL
    MOV AL, AH
    OUT CH1C, AL

    MOV AL, 88H              ; CH0 mode (block, inc, read, ch0)
    OUT MODE, AL
    MOV AL, 85H              ; CH1 mode (block, inc, write, ch1)
    OUT MODE, AL

    MOV AL, 03H              ; command: M2M + ch0 hold
    OUT CMMD, AL
    MOV AL, 0EH              ; enable CH0
    OUT MASKS, AL
    MOV AL, 04H              ; bus request CH0
    OUT REQ, AL
.REPEAT
    IN AL, STATUS
.UNTIL AL & 1
    RET
  CLEAR ENDP
```

---

# T71. DMA-Processed Printer Interface [L21]

### Hardware
- Latch (74LS373) captures byte from data bus during DMA → printer data inputs.
- A WR pulse during DMA (IOW') drives the latch's CLK and also generates **DS** (data strobe) via a one-shot ('122).
- Printer's **ACK** signal returns each time printer is ready → gated to set a JK flip-flop whose Q drives DREQ3.
- DACK3 from 8237 clears the FF → ACK line lowered until next cycle.

### Sequence
```
   Printer ready → ACK asserts → FF set → Q=1 → DREQ3
   DMA: HRQ → CPU → HLDA → 8237 takes bus → DACK3 issued
   DACK3 + IORC' → OR-gate output enables Latch '373: data D0–D7 → printer
   Same pulse triggers '122 one-shot → DS pulse to printer
   FF cleared by DACK3 → DREQ3 deasserts
   Printer processes byte; when ready, ACK pulses again → next cycle
```

### Procedure code (L21)
```
  PRINT PROC NEAR USES AX CX BX
    MOV EAX, 0
    MOV AX, DS               ; load 16-bit segment
    SHR EAX, 4               ; EAX = (DS) >> 4 ... unusual
    PUSH AX
    SHR EAX, 16
    OUT LATCHB, AL           ; upper 4 bits → Latch B
    POP AX                   ; address LSB+MSB
    OUT CH3A, AL             ; channel 3 LSB
    MOV AL, AH
    OUT CH3A, AL             ; channel 3 MSB
    MOV AX, CX               ; count - 1
    DEC AX
    OUT CH3C, AL
    MOV AL, AH
    OUT CH3C, AL
    MOV AL, 0BH              ; CH3 mode = 0000 1011 (single, inc, read, ch3)
    OUT MODE, AL
    MOV AL, 00H              ; command = no special
    OUT CMMD, AL
    MOV AL, 7                ; enable CH3 only (mask = 0111)
    OUT MASKS, AL
    RET
  PRINT ENDP

  TESTP PROC NEAR USES AX
.REPEAT
    IN AL, STATUS
.UNTIL AL & 8                ; bit 3 = TC for ch3
    RET
  TESTP ENDP
```

---

# T72. 80286 vs 8086 Differences [L22]

| Item | 8086 | 80286 |
|------|------|-------|
| Year | 1978 | 1982 |
| Address bus | 20 bits (1 MB) | 24 bits (16 MB physical) |
| Virtual memory | None | 1 GB virtual per task |
| Bus | Multiplexed AD | **Non-multiplexed** address + data → faster |
| Pipelining | Instruction queue (BIU) | BIU + Address Unit + Instruction Unit + Execution Unit (4-stage) |
| Address calc | Segment×16 + Offset | Selector → Descriptor → Base + Offset (in protected mode) |
| Modes | Real only | Real + **Protected (PVAM)** |
| Privilege | None | 4 privilege levels (0–3) |
| Multipliers | Slower | Faster (~½ clocks) |
| Performance | 0.33 MIPS @ 5 MHz | 1.2 MIPS @ 6 MHz |
| MMU | None | On-chip MMU |
| Coprocessor | 8087 | 80287 |

### Family in lectures
- 8086 (real, 16-bit data, 20-bit addr).
- 80286 (real + protected, 16-bit data, 24-bit addr).
- 80386 (32-bit data, 32-bit addr, paging).
- 80486 (integrated FPU + cache).

---

# T73. 80286 Architecture [L22]

### Four functional units
1. **Bus Unit (BU)** — fetches data and instructions; manages the prefetched instruction queue.
2. **Instruction Unit (IU)** — decodes prefetched instructions; pushes decoded ops into the *decoded instruction queue*.
3. **Execution Unit (EU)** — ALU, shifters, register file; executes decoded instructions.
4. **Address Unit (AU)** — calculates physical addresses (segmentation, descriptor lookup in protected mode).

### Flow
1. AU computes physical address.
2. BU fetches via data bus → enqueues into prefetch queue.
3. IU decodes → decoded queue.
4. EU executes; writes results via data bus to register bank.

### Registers (same as 8086)
- 8 GP regs (AX, BX, CX, DX, SI, DI, BP, SP) - 16 bits each.
- 4 segment regs (CS, DS, SS, ES).
- IP, FLAGS.
- New: **MSW (Machine Status Word)** controls protected-mode entry.

[IMAGE FLAG — L22 pp.7-13: 80286 internal block diagram showing the four units and queues.]

---

# T74. 80286 Real vs Protected Mode [L22]

### Real Address Mode
- Behaves like a faster 8086.
- Same segment×16 + offset addressing; 1 MB addressable.
- No memory protection.

### Protected Virtual-Address Mode (PVAM)
- Supports multitasking with virtual memory.
- 16 MB physical, **1 GB virtual** per task.
- Memory segments described by **descriptors** in **GDT/LDT**.
- 4 privilege levels (0 = OS kernel, 3 = user app).
- Programs cannot trespass into other segments without proper rights.

### Switching modes
- LMSW or MOV CR0 (PE bit) enters protected mode. Cannot easily return to real mode on plain 286 (can on 386+).

---

# T75. 80286 Protected Mode — Privileges & Segment Handling [L22]

### Privilege levels
- 4 levels: 0 (most privileged) to 3 (least).
- Code/data/stack each given a privilege level (DPL = descriptor privilege level).
- Currently-running task has CPL (current privilege level).

### Rules
- Lower-privilege code cannot access higher-privilege segments directly.
- Kernel data is at level 0 → user-app at level 3 cannot read/write it.

### How segments differ from 8086
| 8086 | 80286 PVAM |
|------|------------|
| Segment regs hold base address (×16) | Segment regs hold **selector** |
| Physical = Seg × 16 + Offset | Selector → look up Descriptor → Base + Offset |
| 4 segs: CS, DS, SS, ES | Same 4, plus virtual addressing via descriptors |

---

# T76. Selectors, Descriptors, GDT/LDT [L22]

### Selector (16 bits)
```
  Bit 15..3   Bit 2     Bit 1..0
  Index (13)  TI        RPL
```
- **Index** points to descriptor entry (×8 to get byte offset in table).
- **TI = 0**: GDT; **TI = 1**: LDT.
- **RPL** = Requested Privilege Level.

### Descriptor (8 bytes for 80286)
```
  Byte 0..1: Segment Limit (16 bits, max 64 KB on 286)
  Byte 2..4: Base Address bits 0..23 (24 bits)
  Byte 5  : Access Rights byte
  Byte 6..7: Reserved (must be 0 on 286)
```

### Access Rights Byte
```
  D7  D6 D5 D4  D3 D2 D1 D0
  P   DPL S    Type bits
  P   = Present (1 = segment in memory)
  DPL = Descriptor Privilege Level (0..3)
  S   = 1 = code/data, 0 = system
  Type bits: code/data, exec, R/W, expand-up/down, accessed
```

### GDT — Global Descriptor Table
- One per system. Holds descriptors **shared by all tasks**.
- Pointed to by **GDTR** register (linear base + 16-bit limit).

### LDT — Local Descriptor Table
- One per task. Holds private descriptors of that task.
- LDTR register holds a selector that itself points into GDT.

### Address translation
1. Segment register holds selector.
2. CPU uses selector's TI to choose GDT/LDT, then index to fetch descriptor.
3. Validate present bit, privilege.
4. Compute linear address = descriptor.base + offset.

### PYQ 21-22 Q5 — TSS descriptor exception
*Why does descriptor `[09H, 1FH, 00H, 00H, 00H, E9H, 10H, F0H]` cause an exception even with no privilege violation?*
- Decode access rights = E9H = 1110 1001:
  - P=1, DPL=11 (3), S=0 (system), Type=1001 = available 286 TSS.
- Limit = 1FH 09H ⇒ low 8 bits 09H, high 8 bits 1FH ⇒ 1F09H = 7945 bytes.
- A **286 TSS is fixed at 44 bytes**; so a TSS smaller than 44 (here it's actually 7945, which is fine) — wait. Let me re-read: 80286 TSS minimum size is 0x002C = 44 bytes. A limit of 0x1F09 → 7945 bytes — too large or too small? Actually for 286 TSS the size has a specific minimum (0x2B = 43); some sources say 0x2D - 0 = 44. So if the limit is wrong (smaller than required), task switch fails.

The slide-stated answer is typically: **limit too small** for valid TSS contents. The descriptor's limit must be ≥ 0x2B (44 - 1) for 286, ≥ 0x67 (104 - 1) for 386. Here limit 1F09 is 7945, ≥ minimum, but check if **base address is misaligned or P bit anomaly**. The actual issue per Intel: descriptor's first 2 bytes are limit, so limit = 0x1F09 (correct). Bytes 2..4 = base 0..23 = 00 00 00 (base = 0). Byte 5 = E9H. Byte 6 = 10H (must be 0 on 286!). Byte 7 = F0H (must be 0 on 286!). **The reserved bytes 6,7 are non-zero — Intel reserves these for 386 use; 286 raises GP-fault if non-zero.**

---

# T77. Virtual Memory in 80286 [L22]

### Definition
A virtual memory machine maps a **larger logical space** (1 GB on 286) to a **smaller physical space** (16 MB).

### Mechanism on 286
- **Segmentation only**, no paging on 286.
- A segment can be marked **not present** (P=0); accessing it raises a fault → OS swaps in from disk and resets P=1.
- 16-bit selector × 64 KB segments = 4 GB virtual? Slide states 1 GB. Reason: only certain selector indices are usable; 286 uses 14-bit visible index + restrictions → ~1 GB virtual per task.

### Limitations vs 386
- No paging.
- Maximum segment size 64 KB.

### One-line summary (slide L22 p.23)
> "Virtual memory in 80286 is implemented using segmentation, where logical addresses are translated via descriptor tables (GDT/LDT) to physical addresses, providing protection and relocation but lacking paging support."

---

# 16550 UART [L18 / module 8]
*(Lecture PDFs do not include 16550 dedicated slides; coverage in syllabus comes from videos and from PYQ-driven content. The 16550 is referenced repeatedly in PYQs (Compre B 21-22, 24-25). Below is a syllabus-level summary derived from PYQ context.)*

### Purpose
Universal Asynchronous Receiver/Transmitter (full-duplex). Handles serial RS-232-style communication. 16550 has **16-byte FIFO** for receive and transmit (16450 has none).

### Pin Description (selected)
| Pin | Function |
|-----|----------|
| D0–D7 | CPU data bus |
| RD', WR' | I/O strobes |
| CS0, CS1, CS2 | Chip selects (often combined) |
| A0, A1, A2 | Register select (8 internal registers) |
| ADS' | Address strobe |
| MR | Master Reset |
| TXD | Transmit data (serial out) |
| RXD | Receive data (serial in) |
| DTR', DSR' | Data Terminal/Set Ready |
| RTS', CTS' | Request/Clear To Send |
| RI', DCD' | Ring Indicator, Data Carrier Detect |
| INTR | Interrupt request to CPU/8259 |
| OUT1, OUT2 | General-purpose outputs |
| BAUDOUT' | Baud-rate generator output |
| RCLK | Receive clock input |
| XIN, XOUT | Crystal / external clock pins |

### Internal register set (selected by A2 A1 A0; DLAB bit in LCR toggles two bank views)
| Reg | Addr offset (DLAB=0) | Function |
|-----|----------------------|----------|
| RBR | 0 | Receive Buffer (read) |
| THR | 0 | Transmit Holding (write) |
| IER | 1 | Interrupt Enable |
| IIR | 2 | Interrupt ID (read) |
| FCR | 2 | FIFO Control (write) |
| LCR | 3 | Line Control |
| MCR | 4 | Modem Control |
| LSR | 5 | Line Status |
| MSR | 6 | Modem Status |
| SCR | 7 | Scratch |

| Reg | Addr offset (DLAB=1) | Function |
|-----|----------------------|----------|
| DLL | 0 | Divisor Latch LSB |
| DLM | 1 | Divisor Latch MSB |

### Baud rate
```
  Baud = (Crystal frequency) / (16 × Divisor)
  Divisor = Crystal / (16 × Baud)
```
For an 18.432 MHz crystal and 9600 baud:
- Divisor = 18.432e6 / (16 × 9600) = 120 = 0x78.
- DLL = 78H, DLM = 00H.

For 19200 baud: Divisor = 60 = 0x3C.

### Line Control Register (LCR)
```
  D7    D6   D5  D4 D3   D2  D1 D0
  DLAB  BC   SP  EPS PEN STB  word len bits
```
| Bit | Meaning |
|-----|---------|
| D1 D0 | Word length: 00=5, 01=6, 10=7, 11=8 |
| D2 | Stop bits: 0 = 1; 1 = 1.5 (5-bit) or 2 (6/7/8-bit) |
| D3 | PEN — Parity Enable |
| D4 | EPS — Even Parity Select (0 = odd, 1 = even) |
| D5 | SP — Stick Parity |
| D6 | BC — Break Control |
| D7 | DLAB — Divisor Latch Access |

### Initialisation example: 8 bits, 1 stop, odd parity, 9600 baud
- LCR (DLAB=1): 1000 1011 = **8BH** (DLAB=1, no break, no stick, parity odd → EPS=0, PEN=1, STB=0, word len=11).
- DLL = 78H, DLM = 00H.
- LCR (DLAB=0): 0000 1011 = **0BH**.
- FCR: 1100 0111 = **C7H** — enable FIFO (D0=1), reset RX (D1=1), reset TX (D2=1), trigger 14 bytes (D7 D6 = 11) for receive interrupt, others 0.
- IER: 0000 0001 = **01H** — enable received-data-available interrupt.
- MCR: 0000 1011 = **0BH** — DTR=1, RTS=1, OUT2=1 (gate INTR to system).

```
  ; BASE = base port of 16550
  MOV AL, 80H
  OUT BASE+3, AL       ; LCR DLAB=1
  MOV AL, 78H          ; divisor LSB for 9600 baud
  OUT BASE, AL
  MOV AL, 00H
  OUT BASE+1, AL
  MOV AL, 0BH          ; LCR DLAB=0, 8 odd parity 1 stop
  OUT BASE+3, AL
  MOV AL, 0C7H         ; FCR enable FIFO trigger 14
  OUT BASE+2, AL
  MOV AL, 01H
  OUT BASE+1, AL       ; IER receive-int enable
  MOV AL, 0BH
  OUT BASE+4, AL       ; MCR
```

### Send / Receive
- **Transmit**: write byte to THR (offset 0). Hardware sends serially; LSR bit 5 (THRE) shows transmit holding empty.
- **Receive**: poll LSR bit 0 (DR) or wait for interrupt. Read RBR (offset 0) to fetch byte.

---

# Secondary Storage / Disk Organisation [Module 8 syllabus]
*Not covered in extant lecture PDFs. Syllabus-level note for completeness:* covers magnetic disk geometry (tracks, sectors, cylinders), seek/latency, RAID, etc. Lecture-PDF content not present.

[LOW PYQ FREQUENCY]

---

# Buses (Module 9: ISA, PCI, USB, LPT, COM)
*Not covered in extant lecture PDFs.*  Lecture PDFs in `./lectures/` end with Lecture 22 (DMA + 80286). Module 9 is taught from videos.

[LOW PYQ FREQUENCY in given papers — except 8289 bus arbiter referenced in PYQ 24-25 Q7b.]

---

# Intel 8289 Bus Arbiter [PYQ-derived]

### Role
Used in **multi-master** 8086 systems (max mode) — arbitrates which CPU gets the **shared system bus** when multiple bus masters compete.

### Master/Slave behaviour
- **Master mode**: CPU's 8289 owns the local bus and competes for system bus.
- **Slave mode**: external master (DMA controller) drives bus locally.

### Arbitration scheme
- **BREQ'**: Bus Request to bus arbiter network.
- **BPRO'/BPRN'**: Bus Priority Out / In (daisy-chained priority).
- **BUSY'**: shared open-collector signal asserted by current owner. Others see BUSY = 0 and wait.
- **CBRQ'**: Common Bus Request — any device requesting can pull this; current owner sees it and can decide to release after current cycle.
- **AEN**: Address Enable to system bus drivers; only the active arbiter drives buses.

### Conflict resolution
- Daisy-chain priority: top of chain has highest priority.
- BPRN' from upper arbiter must be low for this 8289 to grant its CPU.
- LOCK' from CPU (LOCK-prefixed instructions) makes 8289 hold the bus.

---

# T-Flag (TF) Trap Flag — Single-step [PYQ 23-24 Q4]

### Two procedures: set TF, clear TF (modify FLAGS image on stack)

```
  ; SET_TF: turns on single-step
  SET_TF PROC FAR
       PUSH BP
       MOV  BP, SP
       OR   WORD PTR [BP+6], 100H   ; FLAGS at SS:[BP+6] (after BP push)
       POP  BP
       RET
  SET_TF ENDP

  ; CLR_TF: turns off single-step
  CLR_TF PROC FAR
       PUSH BP
       MOV  BP, SP
       AND  WORD PTR [BP+6], 0FEFFH ; clear bit 8 (TF)
       POP  BP
       RET
  CLR_TF ENDP
```
TF is bit 8 of FLAGS. After PUSH BP, the FLAGS pushed by FAR-call are at [BP+6] (CS at +4, IP at +2 wait this isn't right either)... For a FAR procedure called with `CALL FAR ptr`, stack on entry: top = IP, then CS. After PUSH BP, top = BP, IP, CS, then if interrupt-saved FLAGS are present they'd be deeper. But these procedures are called directly (CALL FAR) — they don't have FLAGS on stack unless we PUSHF first. The standard trick:

```
  SET_TF PROC FAR
       PUSHF
       PUSH BP
       MOV  BP, SP
       OR   WORD PTR [BP+2], 100H    ; modify pushed FLAGS image
       POP  BP
       POPF                          ; restore FLAGS with TF set
       RET
  SET_TF ENDP
```

After POPF, TF is set in CPU FLAGS → CPU enters single-step → next instruction triggers INT 1.

Then user installs an INT 1 ISR that clears TF in stacked FLAGS (or just calls CLR_TF inside ISR before IRET) to stop tracing.

---

# Cache memory access time [PYQ 21-22 Q7]
"Main memory access 75 ns; L1 hit 90% @ 10 ns; L2 hit 85% @ 20 ns. Average memory access time?"

```
  AMAT = h1·t1 + (1-h1)·[h2·(t1+t2) + (1-h2)·(t1+t2+tm)]
       = 0.9·10 + 0.1·[0.85·(10+20) + 0.15·(10+20+75)]
       = 9 + 0.1·[0.85·30 + 0.15·105]
       = 9 + 0.1·[25.5 + 15.75]
       = 9 + 0.1·41.25
       = 9 + 4.125 = 13.125 ns
```
The PYQ marks **1.825** as the answer — almost certainly wrong; treat the AMAT as 13.125 ns under the formula above (look-aside cache). Alternative interpretation: AMAT shown as 1.825 corresponds to misuse of percentages with units of cache-vs-memory ratio; the standard formula gives 13.125 ns.

---

# RISC architecture instruction count [PYQ 21-22 Q1]
"RISC, instruction format: opcode + dest reg + src reg, 16 registers, 16-bit instruction. Max ALU ops?"

- Each register field needs 4 bits (log₂16). Two register fields → 8 bits. Opcode field = 16 − 8 = 8 bits → 2⁸ = **256** distinct ALU operations.

---

# Instruction encoding for `MOV EAX, ES:[EAX]` and `MOV [BP+2], CH` [PYQ 21-22 Q2]

### `MOV EAX, ES:[EAX]` in 16-bit mode (80486)
- Operand-size override prefix `66H` (use 32-bit operand).
- Address-size override prefix `67H` (use 32-bit address).
- ES segment override: `26H`.
- Opcode `8B` (MOV r32, r/m32).
- ModR/M = 00 (mod=00 disp=0) 000 (reg=EAX) 000 (r/m=EAX → in 32-bit mode mod=00 r/m=000 means [EAX]).
- Combined: `66 67 26 8B 00`. (Slide answer: 6766 26 8B 00.) Addressing mode = **register indirect** with segment override.

### `MOV [BP+2], CH`
- 16-bit, no prefix.
- Opcode `88` (MOV r/m8, r8).
- ModR/M: mod=01 (8-bit displacement), reg=101 (CH), r/m=110 ([BP] with disp). Final = 0110 1110 = 6EH.
- Disp8 = 02H.
- Bytes: `88 6E 02`. Addressing mode = **register relative** (BP + disp).

---

# Stack interaction with INT 3 [PYQ 21-22 Q3]
*Long worked example. Key takeaways:*
- `PUSH AX/SI/CX` decrement SP by 2 each.
- `INT 3` pushes FLAGS, CS, IP — SP drops by 6 more.
- Inside ISR `PUSH BX` drops by 2.
- `ADD AX, 1010H` modifies AX and flags.
- `POP SI; POP BX; POP CX` pops three words back.
- `IRET` pops IP, CS, FLAGS — SP returns to value just before INT 3.
- After IRET, the three user-pushed words (AX, SI, CX) remain on the stack until further pops; SP = 0000H − 2×3 = FFFAH.

| Reg | Final value (from given starting state) |
|-----|---|
| AX  | 0A0AH + 1010H = 1A1AH (actually AX kept changes from ADD) |
| BX  | 1234H (popped from stack — was CX original) |
| CX  | 5050H (popped from stack — was SI original) |
| SI  | 1A1AH (popped from stack — was AX after add) |
| Flags | restored from IRET |
| SP  | FFFAH |

---

# Interface 8255 with 8086 [PYQ 23-24 Q3]
*"Port A address 0870H. Configure A=I/P, B=O/P, C=O/P. ALP to read switches on Port A and display count of '1's on Port B as binary on 8 LEDs; lower Port C shows count of OFF switches (0–8 binary)."*

### Address layout
- Port A = 0870H → A1 A0 of 8255 must be 00 → 8086 A1 A2 = 0 0 → 8086 A1 = 0 (so address even-aligned), 8086 A2 = 0. So 8255 lives in lower bank with chip-select decoder firing for 0870H (A0=0).
- Port B = 0872H, Port C = 0874H, CWR = 0876H.

### Control word (PA in, PB out, Cu out, Cl out, all Mode 0)
- D7=1, D6 D5=00, D4=1 (A in), D3=0, D2=0, D1=0, D0=0 → 1001 0000 = **90H**.

### ALP
```
  PORTA EQU 0870H
  PORTB EQU 0872H
  PORTC EQU 0874H
  CWR   EQU 0876H

      MOV DX, CWR
      MOV AL, 90H
      OUT DX, AL          ; configure 8255

  AGAIN:
      MOV DX, PORTA
      IN  AL, DX          ; AL = switch states (1 = on)
      MOV BL, AL          ; save copy
      ; count 1s in AL → CL
      MOV CL, 0
      MOV CH, 8           ; loop 8 bits
  CNT1:
      SHR AL, 1
      JNC SKIP1
      INC CL
  SKIP1:
      DEC CH
      JNZ CNT1

      MOV DX, PORTB
      MOV AL, BL          ; restore original to display on LEDs
      OUT DX, AL          ; show input pattern on Port B

      ; count of OFF (0s) = 8 - CL
      MOV AL, 8
      SUB AL, CL
      AND AL, 0FH         ; lower nibble only
      MOV DX, PORTC
      OUT DX, AL          ; lower port C bits show 0..8

      JMP AGAIN
```

---

# Memory-Map Design Worked Example [PYQ 23-24 Q9]
"Two 32K×8 ROM + four 32K×8 RAM with 8086. Derive map and chip-select logic."

### Sizes
- 2 × 32 K × 8 = 64 KB ROM (one even bank, one odd bank, 32 K addresses).
- 4 × 32 K × 8 = 128 KB RAM (two even chips, two odd chips → 64 K addresses each pair = 128 K total or 4 × 32 K×8 in a 16-bit-wide system gives 64 K word addresses i.e. 128 KB).

### Map (incremental)
- ROM spans 32 K word addresses → 16 bits A1–A15 internal → covers FE000H–FFFFFH typically (128 KB? wait 32K word = 64 KB byte at the boundary).

Actually:
- 32K × 16 = 64 KB. So one ROM pair (32K × 8 even + 32K × 8 odd) = 64 KB.
- One RAM pair (32K × 8 even + 32K × 8 odd) = 64 KB. Two pairs = 128 KB.

Mapping (at FFFF0H reset vector, ROM at top):
- ROM: F0000H – FFFFFH (64 KB).
- RAM: 80000H – 9FFFFH (128 KB).

### Decoder
- A19..A16 → 74LS138 inputs ABC=A16,A17,A18; G1=A19; G2A=G2B=GND.
- ROM enabled when A19..A16 = 1111 → output Y7' low.
- RAMs at A19..A16 = 1000 → Y0' low. Two pairs occupy A17 = 0,1 within the same Y.

This is a worked sketch; many valid maps exist depending on the **incremental** address starts assumed. Always state the map first.

---

# Differences memory-mapped vs isolated I/O [PYQ 23-24 Q11]
See **T26**.

Two key differences:
1. Address space (shared vs separate).
2. Instructions used (MOV-class vs IN/OUT-only) and control signals (M/IO').

---

# Read bus cycle of 8086 — concise answer [PYQ 23-24 Q10]
- 4 T-states (T1–T4), with optional Tw between T2/T3.
- T1: ALE high, address (A0..A19, BHE) on AD bus, M/IO determined.
- T2: ALE drops; AD becomes data lines (high impedance for read), RD' goes low, DT/R'=0, DEN'=0.
- T3: memory drives data on AD bus; READY sampled at end of T3.
- T4: data sampled by CPU on falling edge of T4; RD' goes high.

```
       T1     T2     T3     T4
   ┌─┐___┌─┐___┌─┐___┌─┐___┌─┐
   ALE   ┌─┐_______________
   AD   <Addr>--<Hi-Z>---<Data>--
   RD'  ‾‾‾‾‾└___________┌‾‾‾‾‾‾
   DEN' ‾‾‾‾‾└___________┌‾‾‾‾‾‾
   DT/R'  __________________________ (low)
   READY                  ↑sampled
```

---

# Differences in port configuration: 8255 Modes [PYQ 23-24 Q6]

| Aspect | Mode 0 | Mode 1 | Mode 2 |
|--------|--------|--------|--------|
| Direction | Independent in/out per port | Strobed in or out (per group) | Bidirectional |
| Handshake | None | 3 PC lines per group | 5 PC lines (port A only) |
| Latching | Outputs latched, inputs buffered | Both latched | Both latched |
| Available ports | A, B, Cu, Cl all freely configurable | Group A and B; PC bits used for handshake | Port A only; B can be Mode 0/1; Cu used by A handshake |

---

# Compre 21-22 Q1 (Room Automation) — Major synthesis problem
*This is a 100-mark integration problem. Outline answer:*

1. **Memory mapping**: 64 KB RAM split in two 32 KB halves: 18000H–25FFFH (overflow boundary?) actually slide: starts at 1 80 00 (= 18000H) → 27FFFH for 64 KB? But uses 64 KB total RAM split into two 32K halves: 18000H–1FFFFH and E0000H–E7FFFH. ROM: 96 KB. Half at 00000H → 17FFFH (96 KB? 192 K?). Re-read: 256 KB total mem, 64 K RAM, 192 K ROM. Half ROM (96 K) starts at 00000H → 17FFFH. Other half ends at FFFFFH so spans (FFFFFH − 96 K + 1) = E8000H–FFFFFH.

Build with 8 K ROM × 24 = 192 K (use 24 chips) — but slide gives 8 K ROM × 2; actually only 2 ROM chips of 8 K available — that's 16 K, not 192 K. Reading again: original Compre B 21-22 problem is 256 KB system with 64 KB RAM and 192 KB ROM, but available chips are only 8 K (2 ROM, 8 K each = 16 K total) which is insufficient — so the problem statement must indeed use larger chip counts (8 K chips with 24 chips for ROM, 8 chips for RAM). The lecture problem in Compre 20-21 lists 6 × 32 K ROM + 8 × 32 K RAM (very different).

For this kind of problem the algorithm is:

**Steps (general)**:
1. Decide map per spec.
2. Determine number of chips per region using even+odd banking (16-bit data bus → chips come in pairs).
3. Decide which address bits go to chip A0..An−1 (chip's internal addressing), which to A1..An (because A0 is bank-select).
4. Use 74LS138 + AND/OR gates for chip select logic.
5. Apply BHE+A0 for bank selection per word/byte access.
6. Generate LWR/HWR strobes from MWTC + A0 / + BHE'.

Detailed solution for each Compre B 21-22 sub-question is in the file `Compre Part B Solutions - Akhil Bansal 21-22.pdf` (image/scanned, not parseable here).

---

# RESUME MARKER: completed all topic notes for L1–L22 + relevant PYQ-derived sections. Next: PYQ frequency analysis, topic summaries, exam-focus solved problems.


---

# TOPIC SUMMARIES (Phase 2 — formulae, rules, common mistakes)

## TS1. 8086 Hardware Reference

### Master Pin Reference Table (Min Mode)
| Pin | I/O | Active | Function |
|-----|-----|--------|----------|
| AD0–AD15 | I/O | – | Multiplexed address/data |
| A16/S3..A19/S6 | O | – | Address (mux with status) |
| BHE'/S7 | O | LOW | Upper-bank enable |
| ALE | O | HIGH | Address latch enable (T1) |
| RD' | O | LOW | Read strobe |
| WR' | O | LOW | Write strobe |
| M/IO' | O | – | High = mem; low = I/O |
| DT/R' | O | – | High = transmit (CPU→bus); low = receive |
| DEN' | O | LOW | Data enable for transceiver |
| INTR | I | HIGH | Maskable interrupt (level) |
| NMI | I | RISING EDGE | Non-maskable interrupt |
| INTA' | O | LOW | Interrupt acknowledge |
| HOLD | I | HIGH | Bus request from external master |
| HLDA | O | HIGH | Bus grant to external master |
| READY | I | LOW=wait | READY=0 inserts wait state |
| TEST | I | LOW=resume | WAIT instruction polls TEST |
| RESET | I | HIGH | Restart at FFFF0H, IF=0 |
| CLK | I | – | 33% duty 5/8/10 MHz from 8284 |
| MN/MX | I | HIGH=min | Mode selector |

### Master Pin Reference (Max Mode additions)
| Pin | I/O | Function |
|-----|-----|----------|
| S0', S1', S2' | O | Status to 8288 |
| QS0, QS1 | O | Queue status |
| RQ/GT0', RQ/GT1' | I/O | Bus request/grant (replaces HOLD/HLDA) |
| LOCK' | O | Bus lock (LOCK prefix) |

### Common Mistakes
- Confusing **MN/MX = HIGH = min mode** (single CPU). Many students invert this.
- Writing M/IO' = 1 for I/O — it's reversed: M/IO' = **1 for memory, 0 for I/O**.
- Treating BHE' as bidirectional. It's **output only**.
- Forgetting that NMI is **edge** triggered; INTR is **level** triggered.
- For HOLD priority: **HOLD > NMI > INTR**, with **RESET** higher than HOLD.

## TS2. Memory Access Time & Wait States

### Formulae
For 8086 at clock period T:
- Bus cycle (no wait) = 4T
- Memory window (no wait) = 3T − T_CLAV − T_DVCL
- Bus cycle with n wait states = (4 + n)T
- Memory window with n wait = (3 + n)T − T_CLAV − T_DVCL
- Wait states needed: n = ⌈(t_required − window_no_wait) / T⌉

### Reset key facts
- Reset must be HIGH for ≥4 clock cycles.
- Initial CS = FFFFH, IP = 0000H ⇒ start address = **FFFF0H**.
- IF cleared, queue flushed.

### Common Mistakes
- Using all 4 T-states in the access window — only 3T (T1 to T3) appears between address-out and data-sample.
- Forgetting to subtract **address valid delay** and **data setup**.
- Confusing wait states inserted in CPU-side READY signal vs memory side.

## TS3. Memory Interfacing

### Bank Selection Rule (8086 16-bit data bus)
```
  BHE'   A0   Operation
  0      0    Word (both banks, must be even-aligned)
  0      1    Byte from upper (odd) bank
  1      0    Byte from lower (even) bank
  1      1    None
```

### Address-line Mapping for 8086
For an 8086 system, **A0 selects the bank**, not the chip; chips' internal A0 connects to **8086 A1**, etc.
For an 8088 system, single bank, chips' A0 connects to 8086 A0.

### Number of chips needed
| Total memory | Chip size | # of chips |
|--------------|-----------|------------|
| N bytes | M × 8 (single bank, e.g. 8088) | N / M |
| N bytes | M × 8 (16-bit bus, 8086) | 2 × (N / 2M) — pairs (one even, one odd) |

### Common Mistakes
- Forgetting separate write strobes for byte writes on 8086.
- Connecting 8086 A0 directly to chip A0 in a banked design.
- Not generating both LWR and HWR for separate-strobe scheme.

## TS4. I/O Interfacing & 8255

### 8255 Control Word — quick mnemonic for command-byte A
- Bit 7 = 1 → I/O mode command
- Bit 6/5 = group A mode (00=0, 01=1, 1x=2)
- Bit 4 = port A (1=in)
- Bit 3 = upper port C (1=in)
- Bit 2 = group B mode (0=0, 1=1)
- Bit 1 = port B (1=in)
- Bit 0 = lower port C (1=in)

### 8255 BSR (command byte B)
- Bit 7 = 0
- Bits 3–1 = bit number (0–7)
- Bit 0 = 1 set, 0 reset

### Mode 1 handshake-line assignments
| Group | PC bits used | Meaning (input/output) |
|-------|-------------|------------------------|
| A in  | PC4 STB, PC5 IBF, PC3 INTR | strobed input |
| A out | PC7 OBF', PC6 ACK', PC3 INTR | strobed output |
| B in  | PC2 STB, PC1 IBF, PC0 INTR | strobed input |
| B out | PC2 ACK', PC1 OBF', PC0 INTR | strobed output |

### Common Mistakes
- Using BSR command byte (D7=0) but trying to set port modes — BSR only affects port C bits.
- Wrong port mapping when 8255 is on 8086: remember A0/A1 of 8255 connect to A1/A2 of 8086 (lower bank).

## TS5. 8254 PIT

### Mode summary table

| Mode | Trigger to start | Output low when | Output high when | Auto-reload? | Common use |
|------|------------------|------------------|------------------|--------------|------------|
| 0 | CW + count write (and GATE = 1) | After CW until count=0 | After count reaches 0; until reprogramming | No | Event count, single interrupt |
| 1 | Rising GATE | After trigger for N CLK | After N CLK | No (hardware retriggerable) | One-shot |
| 2 | Count write (or rising GATE) | One CLK when count=1 | All other times | Yes | Real-time clock, divide-by-N |
| 3 | Count write (or rising GATE) | Lower half (or N/2 — 1) of count | Upper half | Yes | Square wave / baud rate |
| 4 | Count write (and GATE = 1) | One CLK after N+1 CLK | All other | No | Software strobe |
| 5 | Rising GATE | One CLK after N+1 CLK from trigger | All other | No (hardware retriggerable) | Hardware strobe |

### Formulas
- Period (Mode 2/3) = N × T_CLK.
- Count for desired output frequency F_out: **N = F_CLK / F_out**.
- Mode 3 odd N: HIGH for (N+1)/2 CLK, LOW for (N−1)/2 CLK.
- Mode 0/4: OUT goes low/high after **N + 1** CLK pulses (one CLK is "loading").
- Mode 1/5: OUT low for **N** CLK after trigger.

### Control word quick computation
- SC1 SC0: which counter (00, 01, 10) or 11 = read-back.
- RW1 RW0: 11 = LSB-then-MSB (most common); 01 = LSB only; 10 = MSB only; 00 = latch.
- M2 M1 M0: mode bits.
- BCD: 0 binary, 1 BCD.

### Common Mistakes
- Forgetting **count = 1 illegal in Mode 2**.
- Programming MSB before LSB when RW=11.
- Computing N for square wave from F_CLK without realising mode-3 is symmetric → N = F_CLK/F_OUT; **no further /2**.
- Using GATE for Mode 0/4 disable but expecting it to also reset OUT — it doesn't.

## TS6. Interrupts & 8259

### Interrupt vector address: vector_base = type × 4

### Sequence on accepting INTR
1. Push FLAGS
2. Clear IF
3. Clear TF
4. Push CS
5. Push IP
6. Load new CS:IP from IVT[type × 4]

### IRET pops in reverse: IP, CS, FLAGS.

### 8259 ICW1 quick computation
- D0 IC4 (need ICW4? = 1 in 8086 system always, since µPM bit lives in ICW4)
- D1 SNGL (single = 1, cascade = 0)
- D2 ADI (don't care for 8086)
- D3 LTIM (level-trig = 1, edge = 0)
- D4 = 1 always (identifies ICW1)
- D5–D7 = vector bits (8085 only; ignored for 8086).

### 8259 ICW2 for 8086
- T7..T3 = upper 5 bits of vector base.
- IRn vector = base + n.
- E.g., to map IR0 to type 40H ⇒ ICW2 = 40H. IR3 → 43H.

### ICW3
- Master: bit i set for each slave on IRi.
- Slave: 3-bit ID = master's IR line.

### ICW4
- D0 µPM: 1 = 8086 mode (always 1 for 8086).
- D1 AEOI: 1 = automatic EOI.
- D2 D3 BUF M/S: 00 non-buf, 10 slave-buf, 11 master-buf.
- D4 SFNM: 1 = special fully nested.

### OCW1: mask register (1 = mask, 0 = enable)
### OCW2: EOI / rotation (R, SL, EOI bits + L0–L2)
### OCW3: poll / read IRR-ISR / SMM

### Common Mistakes
- Putting ICW2 vector value as the **whole vector + IR number** instead of just the base.
- Forgetting that 8086 **needs ICW4** (µPM = 1).
- Wrong slave ID in ICW3 — must equal **master IR line number**.
- Using AEOI when the design needs nested priorities — AEOI breaks priority resolution after the second INTA.

## TS7. DMA & 8237

### Programming sequence (memorize)
1. **Master Clear** OR clear F/L.
2. Mask channel.
3. Program upper address bits (Latch B / Page Register).
4. Program **address LSB → MSB**.
5. Program **count LSB → MSB** (count = bytes − 1).
6. Program **mode register**.
7. Program **command register** if needed (e.g., M2M enable, hold).
8. **Unmask** channel.
9. (Software) write Bus Request Register.
10. Poll **Status Register** for TC.

### 8237 Mode register layout
```
  D7D6   D5    D4         D3D2     D1D0
  Mode  Inc/Dec AutoInit  Op       Channel
  00=Demand 0=inc        00=verify 00=ch0
  01=Single 1=dec        01=write  01=ch1
  10=Block                10=read   10=ch2
  11=Cascade              11=ill    11=ch3
```

### Operation codes (clarify direction)
- **Read transfer (10)**: memory → I/O. (DMA reads from memory.)
- **Write transfer (01)**: I/O → memory. (DMA writes to memory.)

### Memory-to-memory specifics
- Channel 0 = source (with read transfer).
- Channel 1 = destination (with write transfer).
- Set Command Register bit 0 = 1 (M2M).
- Bus Request Register triggers transfer.
- Status bit 0 (TC for ch0) = 1 when done.

### Memory-fill specifics
- Source address held (Command bit 1 = 1).
- Source = ES:DI; destination = ES:DI + 1.
- ES:DI must be initialized with the fill byte first.

### Common Mistakes
- Forgetting **count = bytes − 1**.
- Programming address in wrong order (must be LSB before MSB; clear F/L first).
- Using channel 1 as source in M2M (must be channel 0).
- Confusing read/write direction codes in mode register.

## TS8. 80286 Protected Mode

### Selector format
Bit 15..3 Index | Bit 2 TI (0=GDT, 1=LDT) | Bit 1..0 RPL.

### Descriptor (80286, 8 bytes)
```
  Byte 0..1: Limit (16 bits, max 64 KB)
  Byte 2..4: Base (24 bits)
  Byte 5: Access Rights
  Byte 6..7: Reserved (must be 0 on 286 → non-zero causes #GP)
```

### Access Rights byte
- D7 P
- D6..5 DPL
- D4 S (1 = code/data, 0 = system)
- D3..0 Type

### Address calculation
linear = descriptor.base + offset.

### Privilege rules
- CPL ≤ DPL needed to access a data segment (numerically lower CPL = higher privilege).
- Code segment selection through call gates etc.

### Common Mistakes
- Setting reserved bytes 6,7 of 286 descriptor to non-zero ⇒ exception.
- Confusing CPL ≤ DPL: a lower CPL number means HIGHER privilege.
- Treating selector index as byte offset (it's an entry number; byte offset = index × 8).


---

# PHASE 3 — PYQ ANALYSIS

## PYQ Index (papers parsed)
| File | Year | Type | Notes |
|------|------|------|-------|
| Compre Part A 21-22.pdf | 2021-22 | Closed-book | 7 questions |
| Compre part B 21-22.pdf | 2021-22 | Open-book | 1 mega-question (a..f) — system synthesis |
| Compre Part B Solutions Akhil Bansal 21-22.pdf | 2021-22 | Solution PDF | image only — not parsed |
| Mup Compre 20-21.pdf | 2020-21 | Take-home | system synthesis (Railway Gate) |
| MuP Compre 23-24.pdf | 2023-24 | Closed-book | 11 questions |
| MuP Compre Solutions 23-24.pdf | 2023-24 | Solution PDF | parsed |
| MuP_Compre_24-25.pdf | 2024-25 | Partially open-book | 8 questions |

## Question-by-question tagging

### Compre Part A 21-22
| Q | Topic | Marks | Type |
|---|-------|-------|------|
| 1 | RISC instr count | 2 | numerical |
| 2 | 80486 instruction encoding (machine code, addressing mode) | 6 | numerical/descriptive |
| 3 | INT 3 stack trace | 9 | numerical/descriptive |
| 4 | Highest priority input vs HOLD | 1 | recall (RESET) |
| 5 | 80386 TSS descriptor exception | 3 | descriptive (protected mode) |
| 6 | DMA in MAX mode (no HOLD/HLDA) | 2 | descriptive |
| 7 | Cache average access time | 3 | numerical |

### Compre Part B 21-22 (system synthesis)
| Sub | Topic | Marks |
|-----|-------|-------|
| (a) | Memory mapping + interfacing for 256 KB system | 30 |
| (b) | I/O mapping + 74LS138 decoding | 10 |
| (c) | 8255 to relays (lights/AC) | 5 |
| (d) | 8254 RTC (30-second tick) ALP | 10 |
| (e) | 8259 init for door sensors (edge, vector 98) | 10 |
| (f) | 16550 init for thermal camera (38400 baud, 8 bits, 1 stop, odd parity) | – |

### MuP Compre 23-24
| Q | Topic | Marks | Type |
|---|-------|-------|------|
| 1 | Instruction error analysis | 5 | descriptive |
| 2 | 8086 vs 8088, prefetch queue, far MOV with DS implicit | 4 | descriptive |
| 3 | 8255 interface — switches & LEDs | 10 | numerical+ALP |
| 4 | TF flag set/clear (single-step) | 5 | ALP |
| 5 | 8259 cascaded init for keyboard | 15 | descriptive+ALP |
| 6 | 8255 modes 0/1/2 differences | 3 | descriptive |
| 7 | 8254 dual output ALP (100 kHz square + 200 kHz pulse) | 8 | numerical+ALP |
| 8 | 8254 mode 4 vs mode 5 | 4 | descriptive (waveform) |
| 9 | 32K×8 ROM/RAM interface design | 10 | numerical |
| 10 | 8086 read bus cycle waveform | 3 | timing |
| 11 | Memory-mapped vs isolated I/O differences | 2 | recall |

### MuP_Compre_24-25
| Q | Topic | Marks | Type |
|---|-------|-------|------|
| 1 | DT/R + wait-state count | 7 | numerical |
| 2 | 8255 control word decode + BSR | 8 | numerical |
| 3 | NMI vs INTR + IVT addr + INT 3 use | 10 | descriptive |
| 4 | 8254 mode 1 1.2-ms strobe ALP | 8 | numerical+ALP |
| 5 | 8259 master/slave config (printer, card reader) | 10 | descriptive+ALP |
| 6 | 16-KB chips at 0xC0000-0xC7FFF (banking) | 7 | numerical |
| 7a | 8254 Mode 4 vs Mode 5 | 5 | descriptive |
| 7b | 8289 bus arbiter | 5 | descriptive |
| 7c | 8237 working + modes | 5 | descriptive |
| 8 | 8237 mem-to-mem 256 bytes ALP | 10 | numerical+ALP |

## FREQUENCY TABLE

| Topic | Times Asked | Typical Marks | Question Types |
|-------|-------------|---------------|-----------------|
| **Memory interfacing & address decoding** | 4+ (in every paper) | 7-30 | numerical+diagram |
| **8255 PPI** | 5 (every paper) | 4-10 | numerical+ALP |
| **8254 PIT (modes & ALP)** | 5 (every paper) | 4-10 | numerical+ALP |
| **8259 PIC (ICW/OCW init, cascade)** | 4 | 10-15 | numerical+ALP |
| **8237 DMA (programming)** | 3 | 5-10 | descriptive+ALP |
| **Memory-mapped vs isolated I/O** | 2 | 2-3 | recall |
| **Wait states / memory access time** | 2 | 5-7 | numerical |
| **8086 read/write bus cycle waveforms** | 2 | 3-5 | timing diagram |
| **NMI vs INTR / interrupt fundamentals** | 2 | 4-10 | descriptive |
| **Protected mode (descriptor, GDT/LDT)** | 2 | 3-15 | descriptive |
| **Bank selection (BHE, A0)** | 3 | 5-7 | numerical |
| **16550 UART init** | 2 (open-book) | 16 | ALP |
| **Instruction encoding / addressing modes** | 2 | 5-6 | numerical |
| **Cache hit-rate AMAT** | 1 | 3 | numerical |
| **TF flag / single-step** | 1 | 5 | ALP |
| **8086 vs 8088 + queue** | 2 | 3-4 | descriptive |
| **DMA in MAX mode** | 1 | 2 | descriptive |
| **8289 bus arbiter** | 1 | 5 | descriptive |
| **Disk organisation, ISA/PCI/USB** | 0 | – | (not in PYQs available) |

## HIGH PRIORITY — EXAM FOCUS

These topics dominate PYQs. Each deserves drilling.

---

### EXAM FOCUS 1 — MEMORY INTERFACING (8086, 16-bit banks)

**Solved Problem M1.** *Two 16K×8 chips at 0xC0000-0xC7FFF. Show banking.*

Solution:
- 16 K → 14 internal address pins → A1..A14 of 8086 maps to chip A0..A13 (because A0 selects bank).
- Chip 1 (D0–D7, even bank): C0000H, C0002H, ..., C7FFEH  → 16K addresses (only even).
- Chip 2 (D8–D15, odd bank): C0001H, C0003H, ..., C7FFFH → 16K odd addresses.
- Decoding: A19..A15 = 1 1 0 0 0 = 18H? No: 0xC0000 = 1100 0000 0000 0000 0000. So A19=1, A18=1, A17=0, A16=0, A15=0. NAND of A19, A18, A15', A16', A17' produces low when address is in C0000-C7FFF (since A0..A14 vary). A0 of 8086 ⇒ even bank if 0; BHE' ⇒ odd bank if 0. CS' for chip-1 = decoder OR A0. CS' for chip-2 = decoder OR BHE'.

```
                                      Chip 1 (Even, 16K×8)
                                      A0..A13  ← 8086 A1..A14
   8086 ──A19,A18,A15─[NAND]─CS_dec   D0..D7   ← 8086 D0..D7
       └─ A14..A1 ──→  chip A13..A0   CS'      ← (CS_dec OR A0)

                                      Chip 2 (Odd, 16K×8)
                                      A0..A13  ← 8086 A1..A14
                                      D0..D7   ← 8086 D8..D15
                                      CS'      ← (CS_dec OR BHE')
```

**Solved Problem M2.** *Interface 8086 with two 32K×8 ROMs and four 32K×8 RAMs (PYQ 23-24 Q9).*

ROM total = 64 KB (even+odd 32 K each). RAM total = 4 × 32 K = 128 KB (two pairs).

Map (one valid choice — using top of memory for ROM since reset vector is FFFF0H):
- ROM:  F0000H – FFFFFH (64 KB, even+odd pair)
- RAM:  80000H – 9FFFFH (64 KB pair 1)
- RAM:  A0000H – BFFFFH (64 KB pair 2)

A19, A18, A17, A16 → 74LS138 inputs (with G1 enabling on appropriate range):
- ROM CS': active when A19A18A17A16 = 1111.
- RAM-pair-1 CS': 1000.
- RAM-pair-2 CS': 1010.

Each chip's CS' = decoder output OR (A0 for even / BHE' for odd).

**Solved Problem M3.** *Design 8K RAM at 1E000H + 8K ROM at FA000H interface for 8088.*

8088 single bank → no banking.
- 8 K → 13 chip addr pins (A0..A12).
- A13..A19 ⇒ 7 bits to decode: 1E000H = 0001 1110 0000 0000 0000, A13..A19 = 0001111 = 0F. FA000H = 1111 1010 0000 0000 0000, A13..A19 = 1111101 = 7D.
- Use a 74LS138 with ABC = A13 A14 A15 and G1 = A16, G2A = A17', G2B = A18'·A19' or appropriate. (Several decoders may be needed; or use NAND directly.)

**Solved Problem M4.** *Modify NAND decoder for DF800H–DFFFFH.*

A11..A19 must be 1 1011 1111 (binary) = 0x1BF.
- A11..A19 (9 bits): A11=1, A12=1, A13=1, A14=1, A15=1, A16=1, A17=0, A18=1, A19=1.
- NAND of these signals (with A17 inverted): output goes low when address in range. Connect this NAND output to chip's CS'.

```
   A11 ─┐
   A12 ─┤
   A13 ─┤
   A14 ─┤
   A15 ─┤NAND  ─── CS'
   A16 ─┤
   A17'─┤    (A17 through inverter)
   A18 ─┤
   A19 ─┘
```

**Solved Problem M5.** *Decode 64 KB at 060000H–06FFFFH for 80286 with two 62256 (32K×8). Use separate write strobes.*

- A1..A15 of 80286 → A0..A14 of chips (because A0 = bank).
- A16..A23 of 80286: address must be 0x06; so A16=A17=A19=A20=A21=A22=A23=0, A18=1. Decoder enables when A23..A16 = 0000 0110 = 06H.
- LWR = MWTC' + (A0 OR), HWR = MWTC' + (BHE' OR).
- Both chips' CS' tied to decoder output. WE': low chip → LWR; high chip → HWR.

**Solved Problem M6 (PYQ 23-24 Q11 — short answer)** *Differences memory-mapped vs isolated I/O.*

Two distinct differences (sufficient for 2 marks):
1. Memory-mapped uses the **same address space** as memory; isolated has a **separate 64 KB I/O space** distinguished by M/IO'.
2. Memory-mapped uses **any memory-reference instruction** (MOV, ADD, …); isolated requires **IN/OUT/INS/OUTS** only.

---

### EXAM FOCUS 2 — 8255 PPI

**Solved Problem P1.** *(PYQ 23-24 Q3)* See main notes — switches → port A, port B → LEDs, port C lower → 8-count display.

**Solved Problem P2.** *Decode 8255 control word B6H. State configuration.*

B6H = 1011 0110.
- D7=1 → I/O mode.
- D6 D5 = 01 → Group A Mode 1.
- D4 = 1 → Port A input.
- D3 = 0 → Upper Port C output.
- D2 = 1 → Group B Mode 1.
- D1 = 1 → Port B input.
- D0 = 0 → Lower Port C output.

So: A is **strobed input**; B is **strobed input**; PC4-PC5 (used for A handshake), PC0-PC2 (used for B handshake), PC3 and PC6/PC7 set as I/O per remaining bits.

**Solved Problem P3.** *Write BSR commands to set PC2 and reset PC7.*
- Set PC2: BSR with bit#=010 (2), S/R=1 → 0000 0101 = **05H**.
- Reset PC7: BSR with bit#=111 (7), S/R=0 → 0000 1110 = **0EH**.

**Solved Problem P4.** *(Hard, exam-style)* *8255 at base 80H. Configure A=output, B=input (strobed), PC upper=output, PC lower=input. Then set PC6=1 and acknowledge a port-B input by reading.*

CW: A out, B in, Cu out, Cl in, A mode 0, B mode 1.
- D7=1, D6 D5=00, D4=0, D3=0, D2=1, D1=1, D0=1 → 1000 0111 = **87H**.
BSR PC6 set: 0000 1101 = **0DH**.

```
  CWR EQU 86H
  PORTA EQU 80H
  PORTB EQU 82H
  PORTC EQU 84H

      MOV AL, 87H       ; configure
      OUT CWR, AL
      MOV AL, 0DH       ; set PC6
      OUT CWR, AL
  WAIT_INT:
      IN  AL, PORTC
      TEST AL, 1        ; PC0 = INTR_B
      JZ  WAIT_INT
      IN  AL, PORTB     ; read; clears INTR_B and IBF_B
```

**Solved Problem P5.** *(Tough, plausible new)* *Configure 8255 for stepper-motor control: PA0–PA3 drive 4 stepper coils. Sequence: 1010, 0110, 0101, 1001 in CW; reverse for CCW. Step every 50 ms (use 8254 to time).*

- 8255 CW: A out, B unused, C unused → for simplicity 80H (all outputs).
- Place stepper sequence in DS:[step_table].
- 8254 set up Mode 2 (rate generator) at 1.5 MHz, count = 75000 = 124,999 → wait 50 ms.
- ALP: each timer tick advance index, OUT pattern.

**Solved Problem P6.** *(Tough)* *Diagram and write the timing for 8255 Mode 1 strobed output handshake.*

```
  CPU writes Port A → WR' pulse → 8255 latches data
  OBF_A' goes LOW  ─┐
                    │ device sees data ready
  Device reads data  │
  Device pulses ACK_A' LOW
  ACK_A' LOW edge clears OBF_A' (goes HIGH)
  OBF_A' HIGH triggers INTR_A (if INTE_A=1)
  CPU sees INTR_A → ISR → write next byte → cycle repeats
```

---

### EXAM FOCUS 3 — 8254 PIT

**Solved Problem T1.** *(PYQ 24-25 Q4)* — 1.2 ms strobe on Counter 2, ports 84/86, 1 MHz CLK. Solved in main notes (T47).

**Solved Problem T2.** *(PYQ 23-24 Q7)* — 100 kHz square + 200 kHz pulse. Solved in main notes (T47).

**Solved Problem T3.** *Generate 50% PWM at 10 kHz on OUT0 with CLK0 = 8 MHz; 60% PWM on OUT1 same clock.*

For exact duty cycle other than 50% the 8254 cannot do it directly with a single counter. Use two counters in series:
- CTR0 in Mode 2 generates the period (= 10 kHz, count 800 = 0x320).
- CTR1 in Mode 1 (one-shot) triggered by OUT0 of CTR0, produces a pulse of 60% width (count 480).
- Connect OUT0 → CLK1 only as trigger? Mode 1 triggered by GATE rising edge → connect OUT0 → GATE1 (with edge processing). With CLK1 = 8 MHz, duration of one-shot N1 = duty × period = 0.6 × 800 = 480 cycles.

```
  ; CTR0: rate generator (Mode 2), N=800=0x320
  MOV AL, 34H                  ; SC=00, RW=11, M=010, BCD=0
  OUT 43H, AL
  MOV AL, 20H                  ; LSB
  OUT 40H, AL
  MOV AL, 03H                  ; MSB
  OUT 40H, AL
  ; CTR1: one-shot (Mode 1), N=480=0x1E0
  MOV AL, 72H                  ; SC=01, RW=11, M=001
  OUT 43H, AL
  MOV AL, 0E0H
  OUT 41H, AL
  MOV AL, 01H
  OUT 41H, AL
```
*OUT0 must connect to GATE1.*

**Solved Problem T4.** *(Plausible new)* *Design a 1-second interrupt using 8254 with 1.193 MHz clock.*
- Cascade two counters: CTR0 generates 100 Hz from 1.193 MHz (N0 = 11930), CTR1 counts 100 OUT0 pulses (Mode 0, N1 = 100).
- CTR0 mode 2; CTR1 mode 0 with CLK1 = OUT0.
- OUT1 → 8259 IR via CPU INTR.

```
  ; CTR0 mode 2, N=11930=0x2E9A
  MOV AL, 34H ; CTR0, RW=11, M=010
  OUT 43H, AL
  MOV AL, 9AH
  OUT 40H, AL
  MOV AL, 2EH
  OUT 40H, AL
  ; CTR1 mode 0, N=100=0x64
  MOV AL, 70H ; CTR1, RW=11, M=000
  OUT 43H, AL
  MOV AL, 64H
  OUT 41H, AL
  MOV AL, 00H
  OUT 41H, AL
  ; OUT1 wired to 8259 IRn
```

**Solved Problem T5.** *Read latched count of CTR0 atomically.*
```
  MOV AL, 00H            ; counter latch command for CTR0
  OUT 43H, AL
  IN  AL, 40H            ; read LSB
  MOV BL, AL
  IN  AL, 40H            ; read MSB
  MOV BH, AL             ; BX = full count
```

---

### EXAM FOCUS 4 — 8259 PIC

**Solved Problem I1.** *(PYQ 24-25 Q5)* Master at 50H, slave at 90H on master IR2, vector base 70H/80H, edge, normal EOI. Solved in main notes (T61).

**Solved Problem I2.** *(PYQ 23-24 Q5)* Initialize a single 8259 at FE10H base address, edge-triggered, vector type 40 corresponds to IR0, no AEOI, non-buffered, not fully nested, IR1 and IR3 unmasked.*

- ICW1 = 0001 0011 = **13H** (edge, single, IC4 needed).
- ICW2 = 40H.
- ICW3 = not issued (single).
- ICW4 = 0000 0001 = **01H** (8086 mode, normal EOI, non-buffered, not SFNM).
- OCW1 = 1111 0101 = **F5H** (mask all except IR1 and IR3).

Address mapping: 8259 A0 ← 8086 A1 (lower bank). FE10H = ICW1/OCW2/OCW3 (A0=0). FE12H = ICW2/3/4/OCW1 (A0=1).

```
  MOV AL, 13H
  MOV DX, FE10H
  OUT DX, AL
  MOV AL, 40H
  MOV DX, FE12H
  OUT DX, AL
  MOV AL, 01H
  OUT DX, AL                     ; ICW4
  MOV AL, F5H
  OUT DX, AL                     ; OCW1
```

**Solved Problem I3.** *(Plausible)* Polling-mode 8259 — read poll word.
```
  MOV AL, 0CH        ; OCW3: poll = 1, ESMM=00, =0000 1100
  OUT 80H, AL
  IN  AL, 80H        ; poll word: D7=interrupt active, D2..D0 = highest pending IR
```

**Solved Problem I4.** *(Plausible)* *Two 8259s cascaded, master gets timer (IR0), keyboard (IR1), and slave on IR2. Slave IR0 = COM1, IR1 = COM2. Vectors: IR0 master = 08H, IR0 slave = 70H. Edge, AEOI, buffered.*
- Master ICW1 = 11H; ICW2 = 08H; ICW3 = 04H; ICW4 = 1FH (BUF=1, M/S=1 master, AEOI=1).
- Slave ICW1 = 11H; ICW2 = 70H; ICW3 = 02H; ICW4 = 0BH (slave-buffered: M/S=0, BUF=1, AEOI=1).

---

### EXAM FOCUS 5 — DMA & 8237

**Solved Problem D1.** *(PYQ 24-25 Q8)* Mem-to-mem 256 bytes from 21000H to 20000H. Solved in main notes (T69).

**Solved Problem D2.** *Configure 8237 for memory-fill of 4 KB at ES:DI with byte 0xAA.* (See T70 for code skeleton; substitute MOV AL, 0AAH; MOV ES:[DI], AL.)

**Solved Problem D3.** *(Tough)* *DMA from disk at I/O port 0F8H to memory 30000H, 1024 bytes, channel 2.*

- Latch B (page) = 03H (upper 4 bits of 30000H).
- Channel 2 starting address = 0000H.
- Count = 1024 − 1 = 03FFH.
- Mode register Ch2: Mode=10 (block), Inc, NoAutoInit, OP=01 (write — I/O→memory), Channel=10. → 1000 0110 = **86H**.
- Command Register: nothing special → 00H.
- Mask: enable Ch2 → 1111 1011 = FBH? actually 8237 has 4 channels; mask 0000 = all enabled, mask 1011 = enable Ch2 (clear bit 2). Use Mask Register Set/Reset: write 02H to clear mask of Ch2.

```
  OUT LATCHB_PORT, 03H
  OUT CLEARF_PORT, 0       ; clear F/L
  MOV AL, 00H              ; addr LSB
  OUT CH2A, AL
  MOV AL, 00H
  OUT CH2A, AL             ; addr MSB
  MOV AL, FFH
  OUT CH2C, AL             ; count LSB
  MOV AL, 03H
  OUT CH2C, AL             ; count MSB
  MOV AL, 86H
  OUT MODE, AL
  MOV AL, 02H              ; mask reg set/reset: clear ch2 mask
  OUT MRSR, AL
  ; external DREQ from disk now triggers DMA
```

**Solved Problem D4.** *(Plausible)* Verify (read with no write) 512 bytes at 50000H — channel 1, block, increment, AutoInit=1.
- Mode Ch1 = 1001 0001 = **91H** (Mode=10 block, Inc=0, AutoInit=1, OP=00 verify, Ch=01).

---

### EXAM FOCUS 6 — Wait States & Bus Cycle Timing

**Solved Problem W1.** *(PYQ 24-25 Q1)* 10 MHz 8086, 0.5 µs requirement, 300 ns memory. Need 2 wait states. Direction signal: DT/R'.

**Solved Problem W2.** *6 MHz 8086, memory access 350 ns. How many waits needed? Compute window with various waits.*
- T = 1/6 MHz = 166.67 ns. 
- No-wait window = 3 × 166.67 − T_CLAV − T_DVCL ≈ 500 − 110 − 30 = 360 ns ≥ 350 ns → **0 wait states**. ✓

**Solved Problem W3.** *Draw 8086 read cycle waveform.* — see T13.

---

### EXAM FOCUS 7 — Interrupts (concept, IVT)

**Solved Problem N1.** *(PYQ 24-25 Q3)* NMI vs INTR. Solved in main notes (T50).

**Solved Problem N2.** *(plausible)* What address does the 8086 fetch the type-21H ISR address from?
- Vector address = 21H × 4 = 84H. So IP at 0084H–0085H, CS at 0086H–0087H.

**Solved Problem N3.** *Trace stack & registers after `INT 5` is executed in 8086.* (see general algorithm T53). Three pushes (FLAGS, CS, IP); IF, TF cleared; CS:IP loaded from [00014H..00017H]; ISR runs; IRET pops in reverse.

---

### EXAM FOCUS 8 — Protected Mode

**Solved Problem PM1.** *(PYQ 21-22 Q5)* TSS descriptor exception. Reserved bytes 6,7 of 286 descriptor must be 0. Slide gives F0H and 10H — non-zero. Causes #GP fault.

**Solved Problem PM2.** *Compute physical address from selector 0028H, offset 12340H, given GDT base 00100000H. (Assume 386 with 32-bit offset, paging disabled.)*
- Selector index = 0028H >> 3 = 5; TI = 0 (GDT); RPL = 0.
- Descriptor at GDT + 5 × 8 = 00100000H + 28H = 00100028H.
- Read base from descriptor (assume base = 00200000H). Physical = 00200000H + 00012340H = 00212340H.

**Solved Problem PM3.** *Distinguish GDT, LDT, IDT.*
- GDT: global, system-wide, holds segment descriptors shared across tasks. Pointed to by GDTR.
- LDT: local to each task; private descriptors. LDTR holds selector pointing into GDT.
- IDT: Interrupt Descriptor Table; replaces real-mode IVT in protected mode. Holds gate descriptors (interrupt/trap/task gates) for each vector.

---

### EXAM FOCUS 9 — 16550 UART

**Solved Problem U1.** *(PYQ Compre B 21-22 (f))* Initialize 16550 with 18.432 MHz crystal, 38400 baud, 8 bits, 1 stop, odd parity, FIFO threshold 14, IR mapped to 8259 IR2.

- Divisor = 18.432 MHz / (16 × 38400) = 30 = 0x1E.
- LCR (DLAB=1) = 1000 1011 = **8BH** (8-bit, 1 stop, parity enable, odd).
- DLL = 1EH; DLM = 00H.
- LCR (DLAB=0) = 0BH.
- FCR = C7H (enable FIFO, reset RX, reset TX, threshold 14).
- IER = 01H (data-available interrupt).
- MCR = 0BH (DTR=1, RTS=1, OUT2=1).

```
  BASE EQU A0H        ; example port
  MOV DX, BASE+3
  MOV AL, 8BH
  OUT DX, AL          ; LCR DLAB=1
  MOV DX, BASE
  MOV AL, 1EH
  OUT DX, AL
  MOV DX, BASE+1
  MOV AL, 00H
  OUT DX, AL
  MOV DX, BASE+3
  MOV AL, 0BH
  OUT DX, AL          ; LCR DLAB=0
  MOV DX, BASE+2
  MOV AL, 0C7H
  OUT DX, AL          ; FCR
  MOV DX, BASE+1
  MOV AL, 01H
  OUT DX, AL          ; IER
  MOV DX, BASE+4
  MOV AL, 0BH
  OUT DX, AL          ; MCR
```

**Solved Problem U2.** *Send a byte via 16550 polling.*
```
SEND_B PROC NEAR
  ; AL = byte to send
  PUSH DX
  MOV DX, BASE+5
SP:
  IN AL, DX            ; read LSR
  TEST AL, 20H         ; bit5 = THRE
  JZ SP                ; wait until empty
  POP DX
  PUSH DX
  MOV DX, BASE
  OUT DX, AL           ; write THR
  POP DX
  RET
SEND_B ENDP
```

**Solved Problem U3.** *Receive a byte via 16550 polling.*
```
RECV_B PROC NEAR
  PUSH DX
  MOV DX, BASE+5
RP:
  IN AL, DX
  TEST AL, 01H         ; DR (data ready)
  JZ RP
  MOV DX, BASE
  IN AL, DX            ; read RBR
  POP DX
  RET
RECV_B ENDP
```

---

# UNSEEN BUT PLAUSIBLE HARD PROBLEMS

### UH1. *Real-time clock with year-month-day display (combined 8254 + 8259 + 8255)*

System: 8254 generates 1 Hz tick using 1.5 MHz clock cascading two counters → IR0 of 8259. ISR updates a software RTC structure; every 1 s it pushes the current HH:MM:SS to port B of 8255 (driving a multiplexed 7-seg display). Port C lower drives digit-select.

Steps:
1. Counter 0: Mode 2, N0 = 15000 → 100 Hz output.
2. Counter 1: Mode 0, N1 = 100 → IR every 100 OUT0 pulses = 1 s.
3. 8259 ICW1 = 13H, ICW2 = 08H, ICW4 = 01H, OCW1 = FEH (only IR0 enabled).
4. 8255 CW = 80H (all outputs Mode 0).
5. ISR increments a 6-byte RTC structure, sends each digit to port B with strobing on PC0–PC2.

### UH2. *DMA-based ADC sampling at 100 kS/s into 4 KB buffer.*

ADC ready signal → DREQ1. 8237 channel 1 in single mode (single byte per request). Each ADC SOC pulse triggers one DMA transfer. Buffer at 50000H, 4 KB.

- Latch B page = 5; Ch1 address = 0000H; count = 0FFFH.
- Mode Ch1 = **01 0 0 01 01 = 45H** (Single, Inc, NoAutoInit, Write transfer, Ch1).
- Cmd = 00H. Mask reg set/reset: 01H (clear ch1).
- After 4 K samples TC raised; ISR via EOP' to 8259 → buffer ready.

### UH3. *Cascaded 8259 chain for an embedded system with 24 interrupt sources.*

3 slaves (each 8 IRs) + 1 master (with 3 cascaded slave inputs) → 24 sources.
- Master ICW3: bits 0,1,2 = 1 (slaves on IR0, IR1, IR2).
- Each slave ICW3 = 00H, 01H, 02H respectively.
- ICW1 same; ICW4 master = 11H (buffered master) or 1FH (with SFNM if needed).

### UH4. *8255 + 8259 + 8254 integration: Frequency counter.*

Use 8254 Counter 1 in Mode 0 to count incoming pulses on CLK1; gate from 8254 Counter 0 in Mode 2 generates a 1-second window. Read counter 1 latched value once per second via 8259 IR (from OUT0). Display on 8255 ports.

### UH5. *Memory-mapped I/O: write a word at 0x80000H to control a relay bank.*

```
  MOV AX, 5555H     ; mask
  MOV DS, 0
  MOV BX, 8000H
  MOV [BX], AX       ; 16-bit word to 80000H (linear) - but 8086 segmentation: physical = DS*16 + BX
  ; with DS = 8000H, BX = 0  → 80000H
```

---

# REFERENCES TO ICW/OCW WORKED EXAMPLES

| Word | Sample value | Means |
|------|--------------|-------|
| ICW1 (single, edge, IC4) | 13H | edge-triggered single-mode 8259, ICW4 follows |
| ICW1 (cascade, edge, IC4) | 11H | edge cascade, IC4 follows |
| ICW1 (single, level, IC4) | 1BH | level-triggered, single, IC4 |
| ICW2 base 40H | 40H | IRn vector = 40H + n |
| ICW3 master with slave on IR2 | 04H | one slave on IR2 |
| ICW3 slave ID = 2 | 02H | slave attached to master IR2 |
| ICW4 8086 + AEOI + buffered master + SFNM | 1FH | multi-master cascade |
| ICW4 8086 normal EOI non-buffered | 01H | simplest |
| OCW1 disable all | FFH | all masks set |
| OCW2 nonspecific EOI | 20H | reset highest ISR bit |
| OCW2 specific EOI IR3 | 63H | bits R=0, SL=1, EOI=1, L=011 |
| OCW3 read ISR | 0BH | next read returns ISR |


---

# PHASE 4 — FINAL VERIFICATION AGAINST MASTER TOPIC LIST

## Master Topic List Coverage

| # | Topic | Source | Covered? |
|---|-------|--------|----------|
| T1  | Signal Types, Noise Margin, Fanout, Currents | L1 | YES |
| T2  | 8086 vs 8088 Specifications | L1, L2 | YES |
| T3  | 8086 Pin-out (common pins) | L1, L2 | YES |
| T4  | Bus Multiplexing rationale & demux | L2, L4 | YES |
| T5  | Min Mode Pins (DT/R, DEN, ALE, M/IO, WR, INTA, HOLD/HLDA) | L2, L3 | YES |
| T6  | Max Mode Pins (S0/S1/S2, QS0/1, RQ/GT, LOCK) | L3 | YES |
| T7  | 8284A Clock Generator | L3 | YES |
| T8  | Reset Operation, RC reset | L4 | YES |
| T9  | Bus Demultiplexing 74LS373 | L4 | YES |
| T10 | Bus Buffering 74LS245 | L4 | YES |
| T11 | Decoders 74LS138 | L4, L7 | YES |
| T12 | Bus Cycle / T-states | L4 | YES |
| T13 | Memory Read/Write Timing | L4, L5 | YES |
| T14 | Memory Access Time, Wait States | L5, L6 | YES |
| T15 | Memory Types (ROM/PROM/EPROM/EEPROM/SRAM/DRAM) | L5, L6 | YES |
| T16 | Memory Chip pins/sizing | L5, L6 | YES |
| T17 | Address Decoding | L6, L7 | YES |
| T18 | Memory Interfacing 8088 (8-bit) | L7 | YES |
| T19 | Memory Interfacing 8086 (16-bit Banks) | L8, L9 | YES |
| T20 | Separate Bank Write Strobes | L9 | YES |
| T21 | 16-bit Memory Decoding 80286/80386SX | L9 | YES |
| T22 | Memory Interfacing larger memory | L9 | YES |
| T23 | 8086 I/O Instructions | L9 | YES |
| T24 | Direct vs Indirect vs String I/O | L9 | YES |
| T25 | I/O Ports concept | L9 | YES |
| T26 | I/O-Mapped vs Memory-Mapped | L9 | YES |
| T27 | Input/Output Device Interfacing (Buffer/Latch) | L9 | YES |
| T28 | Handshaking, Polling vs Interrupts | L10 | YES |
| T29 | I/O Decoding (8/16-bit) | L10 | YES |
| T30 | 8 vs 16-bit I/O Ports, Write Strobes | L10 | YES |
| T31 | 8255 PPI Pinout/Internal | L11 | YES |
| T32 | 8255 Control Word | L11 | YES |
| T33 | 8255 Modes (0,1,2) + BSR | L11, L12 | YES |
| T34 | 8255 Mode 1 strobed I/O | L11, L12 | YES |
| T35 | 8255 Mode 2 bidirectional | L12 | YES |
| T36 | 8254 Introduction, applications | L12 | YES |
| T37 | 8254 Internal block (CE, OL, CR) | L12 | YES |
| T38 | 8254 CW & programming | L12 | YES |
| T39 | 8254 Counter Latch, Read-back, Status | L12, L13 | YES |
| T40 | 8254 Mode 0 Interrupt on Term Count | L13 | YES |
| T41 | 8254 Mode 1 HW Retrig One-shot | L13 | YES |
| T42 | 8254 Mode 2 Rate Generator | L13 | YES |
| T43 | 8254 Mode 3 Square Wave | L13 | YES |
| T44 | 8254 Mode 4 SW Triggered Strobe | L13 | YES |
| T45 | 8254 Mode 5 HW Triggered Strobe | L13 | YES |
| T46 | 8254 Gate effects summary | L14 | YES |
| T47 | 8254 Programming Examples | L15 | YES |
| T48 | DAC0830 | L15 | YES |
| T49 | ADC (Successive Approximation) | L15 | YES |
| T50 | Interrupts: Concept & types | L16 | YES |
| T51 | Interrupt Vector Table | L16 | YES |
| T52 | INT n, INT 3, BOUND | L16 | YES |
| T53 | Interrupt Processing Sequence | L16 | YES |
| T54 | 8259 PIC Block Diagram | L16 | YES |
| T55 | 8259 Pin Description | L16 | YES |
| T56 | 8259 Interrupt Sequence with 8086 | L16 | YES |
| T57 | 8259 Operating Modes | L17, L18 | YES |
| T58 | EOI Modes | L17 | YES |
| T59 | ICW1/2/3/4 | L18 | YES |
| T60 | OCW1/2/3 | L18 | YES |
| T61 | 8259 Cascade programming | L18 | YES |
| T62 | DMA Concept, HOLD/HLDA | L19 | YES |
| T63 | 8237 Pinout | L19, L20 | YES |
| T64 | 8237 Internal Registers | L19, L20 | YES |
| T65 | 8237 Software Commands | L20 | YES |
| T66 | 8237 Programming Address & Count | L20 | YES |
| T67 | 8237 connection to 8086 (Latches A-E) | L20 | YES |
| T68 | 8237 Programming Sequence | L20, L21 | YES |
| T69 | Memory-to-Memory Transfer | L21 | YES |
| T70 | Memory Fill | L21 | YES |
| T71 | DMA Printer Interface | L21 | YES |
| T72 | 80286 vs 8086 differences | L22 | YES |
| T73 | 80286 Architecture (BU, IU, EU, AU) | L22 | YES |
| T74 | 80286 Real vs Protected Mode | L22 | YES |
| T75 | 80286 Privilege & Segment Handling | L22 | YES |
| T76 | Selectors, Descriptors, GDT/LDT | L22 | YES |
| T77 | Virtual Memory in 80286 | L22 | YES |

**Coverage**: 77/77 = 100% ✓

## IMAGE-FLAG List (manual review recommended)

The following slides contain image-only content that text extraction could not parse fully. Cross-check against the original PDFs:

- L1 p.6, p.7, p.15: Noise margin bars, logic-gate voltage diagram, I/O current levels table.
- L4 pp.16-19: Memory read/write timing diagrams with full Intel parameter labels.
- L5/L6 pp.16-21: Detailed timing diagrams with TCLAV, TCLRL, TDVCL annotations.
- L7 pp.7-17: Memory interfacing 8088 worked example schematics (multiple slides only show "Memory Interfacing" title).
- L8 pp.2-10: 8086 memory interfacing schematics (image-only).
- L9 pp.3, 6-12: Bank-write-strobe schematics; large-memory interface examples.
- L10 pp.7-14: I/O decoding circuit images (NAND/PLD examples).
- L11 pp.4-8, p.17: 8255 internal block, pin diagram, control-word format graphic.
- L12 pp.2-7, p.11, p.15: Strobed output, Mode 2 diagrams; 8254 block & address selection.
- L13 pp.16, 20, 23, 27, 30, 33: 8254 Mode 0/1/2/3/4/5 waveform diagrams.
- L14 (subset of L13-14): Gate-pin operation summary table.
- L15 pp.8, 11-16: DAC/ADC pinouts, voltage conversion graph, SAR ADC block.
- L16 pp.3-8, p.16: Interrupt-types diagram; 8259 block diagram.
- L17 pp.12-13: Command-words format diagrams (ICW1).
- L18 pp.12, 17, 18, 21, 24-25, 27-28: ICW2/3/4 diagrams, cascade-mode, OCW1.
- L19 pp.8, 11, 15-25, 28-30: 8237 pinout, register diagrams, mode register.
- L20 pp.2-12, 22, 24, 30-32: 8237 pinouts, internal registers, latches A-E schematic.
- L21 pp.2, 7, 13-19, 32-38: 8237 schematics, mode register variants, printer interface schematic.
- L22 pp.7, 14, 19, 20: 80286 architecture block, pin diagram, additional instructions, virtual-memory diagram.

These do not affect the textual notes' completeness; they are visual aids that students should glance at in the slides. The notes cover the *concepts* the diagrams illustrate.

---

## STUDY ORDER RECOMMENDATION (highest-yield first based on PYQ frequency)

1. **8255 + 8254 + 8259** — guaranteed every paper, often combined.
2. **Memory interfacing with banking** — large-mark synthesis question.
3. **8237 DMA programming** — particularly memory-to-memory.
4. **Interrupt fundamentals (NMI vs INTR, IVT)** — short answer staples.
5. **Wait state / bus cycle calculations** — small-mark numerical guaranteed.
6. **16550 UART init** — open-book rituals.
7. **Memory-mapped vs isolated I/O** — recall, never skip.
8. **Protected mode descriptor mechanics** — when present, 5-15 marks.
9. **8086 vs 8088, instruction queue, addressing modes** — descriptive recall.
10. **8289 bus arbiter / bus arbitration** — emerging topic in recent papers.

---

# END OF NOTES

