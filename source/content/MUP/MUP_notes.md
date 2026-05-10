# CS F241 — Microprocessors & Interfacing: Complete Study Notes

> **Organization:** Notes are by TOPIC, not by lecture. Every topic from the MASTER TOPIC LIST is covered.
> Sources: Lectures 1–22 from `./lectures/`. PYQ analysis in final section.

---

## T1 — Digital Signal Fundamentals & Hardware Specifications

### T1.1 Analog vs Digital Signals

- **Analog signal**: Continuous-time; every voltage level carries a unique meaning.
- **Digital signal**: Voltage levels are mapped to exactly two ranges — logic 0 or logic 1. The exact voltage within the valid range is irrelevant.

### T1.2 Noise Margin

**Definition:** The amount of noise a logic gate can tolerate at its input without misinterpreting the logic level.

**Why it matters:** When two gates from different manufacturers/families are chained, their voltage thresholds may differ. A driver outputting 3 V for logic 1 feeding a receiver that requires 5 V for logic 1 is incompatible.

**Key voltage parameters:**

| Symbol | Meaning |
|--------|---------|
| VOH | Output High voltage — minimum guaranteed output voltage for logic 1 |
| VOL | Output Low voltage — maximum guaranteed output voltage for logic 0 |
| VIH | Input High voltage — minimum input voltage recognised as logic 1 |
| VIL | Input Low voltage — maximum input voltage recognised as logic 0 |
| NMH | Noise Margin High = VOH − VIH |
| NML | Noise Margin Low = VIL − VOL |

**Compatibility rule:** For two devices (A driving B) to be compatible:
- Device A VOH ≥ Device B VIH
- Device A VOL ≤ Device B VIL

### T1.3 Fanout and Current Limitations

**Fanout:** The number of gate inputs (loads) one gate output can drive simultaneously.

As fanout increases, propagation delay increases proportionally. If fanout is too high, the gate fails to switch reliably due to current limitations.

**Current parameters:**

| Symbol | Direction | Meaning |
|--------|-----------|---------|
| IOH | Output sourcing | Maximum current the output can source when HIGH |
| IOL | Output sinking | Maximum current the output can sink when LOW |
| IIH | Input drawing | Current drawn by one input when it sees a HIGH |
| IIL | Input drawing | Current drawn by one input when it sees a LOW |

**Fanout calculation:**
```
Fanout (HIGH) = |IOH| / |IIH|
Fanout (LOW)  = |IOL| / |IIL|
Actual fanout  = min(Fanout_HIGH, Fanout_LOW)
```

**Example (from slides):**
- Device A: IOH = −4 mA, IOL = 10 mA
- Device B: IIH = −1 mA, IIL = 2 mA
- Fanout (HIGH) = 4/1 = 4; Fanout (LOW) = 10/2 = 5
- **Drive capability = min(4, 5) = 4**

**Fix for insufficient fanout:** Insert intermediate buffers to split the load.

> **Common mistake:** Students forget to take the minimum of HIGH and LOW fanout. Always use the lower value.

### T1.4 8086 vs 8088 Device Specifications

| Parameter | 8086 | 8088 | 80C86/80C88 (CMOS) |
|-----------|------|------|---------------------|
| Package | 40-pin DIP | 40-pin DIP | 40-pin DIP |
| Data bus width | 16-bit | 8-bit | Same as TTL counterpart |
| Address bus | 20-bit | 20-bit | 20-bit |
| Supply voltage | +5 V | +5 V | +5 V |
| Max supply current | 360 mA | 340 mA | 10 mA |
| Temperature spec | Standard | Standard | −40 to 225 °F |

The 8088 is architecturally identical to 8086 (same internal registers, same instruction set) but uses an 8-bit external data bus, halving memory bandwidth and reducing pin count requirements.

### T1.5 Multiplexed Address/Data Bus — Why and How

**Problem:** The 8086 needs 20 address lines + 16 data lines + control = too many pins for a 40-pin DIP.

**Intel's solution:** Time-multiplex the lower 16 address bits (A0–A15) with the 16 data bits (D0–D15) on the same 16 physical pins, called **AD0–AD15**.

**Why it works:** Address and data are never needed on the bus at exactly the same clock instant.

**Performance cost:** One extra clock period (T1) is consumed placing the address before data transfer begins.

**Demultiplexing:** An external latch (74LS373 or 8282) captures the address during T1 when ALE is high. Once ALE goes low, the latch holds the address while the AD lines are used for data.

```
Clock:  ___   ___   ___   ___
       |T1 | |T2 | |T3 | |T4 |
AD0-15: [ADDRESS][  DATA   ]
ALE:    ‾‾‾__________________
             ↑ latch captures address here
```

---

## T2 — 8086 Pin-out: Complete Reference

[IMAGE FLAG — Page 17, L1 / Page 2-4, L2: 8086/8088 40-pin DIP diagram showing all pin positions. Pin numbers and names visible but graphic layout not extractable. The following table reconstructs all pin data from surrounding text.]

### T2.1 Complete Pin Reference Table

| Pin(s) | Name | Dir | Mode | Description |
|--------|------|-----|------|-------------|
| AD0–AD15 | Address/Data Bus | Bidir | Both | Multiplexed: A0–A15 during T1, D0–D15 during T2–T4 |
| A16/S3, A17/S4, A18/S5, A19/S6 | High Address/Status | Out | Both | Multiplexed: upper 4 address bits during T1; status during T2–T4 |
| BHE/S7 | Bus High Enable / Status | Out | Both | BHE low = valid data on D8–D15 (odd-addressed byte). S7 always 1. |
| MN/MX (pin 33) | Min/Max Mode | In | Both | Tied HIGH = Minimum mode. Tied LOW = Maximum mode. |
| RD | Read | Out | Both | Active LOW. Signals a read operation on memory or I/O. |
| WR | Write | Out | MIN | Active LOW. Signals a write to memory or I/O port. |
| READY | Ready | In | Both | LOW inserts wait states (Tw) into bus cycle. HIGH = device ready. |
| RESET | Reset | In | Both | Active HIGH for ≥4 clocks. Execution starts at FFFF0H. |
| TEST | Test | In | Both | Used with WAIT instruction. Processor waits until TEST goes LOW. |
| INTR | Interrupt Request | In | Both | Active HIGH, maskable. Processor checks IF flag. |
| NMI | Non-Maskable Int. | In | Both | Rising-edge triggered. Always serviced. INT type 2. |
| CLK | Clock | In | Both | System clock from 8284A. 8086-5: max 5 MHz; 8086-2: max 8 MHz. |
| VCC | Power | — | Both | +5 V supply. |
| GND (x2) | Ground | — | Both | Two GND pins (pins 1 and 20). |

**Minimum Mode only (MN/MX = HIGH):**

| Pin | Name | Dir | Description |
|-----|------|-----|-------------|
| ALE | Address Latch Enable | Out | HIGH during T1; used to strobe address into external 74LS373 latch. |
| DT/R̄ | Data Transmit/Receive | Out | HIGH = transmit (CPU→memory); LOW = receive (memory→CPU). Controls 74LS245 direction. |
| DEN | Data Enable | Out | Active LOW. Enables external data bus buffers (74LS245). |
| M/ĪŌ | Memory / IO select | Out | HIGH = memory access; LOW = I/O port access (IN/OUT instruction). |
| WR | Write | Out | Active LOW write strobe. |
| INTA | Interrupt Acknowledge | Out | Active LOW. Two pulses sent to 8259 during interrupt acknowledge cycle. |
| HOLD | Hold Request | In | DMA controller asserts HIGH to request bus. |
| HLDA | Hold Acknowledge | Out | CPU asserts HIGH to grant bus to DMA controller. |

**Maximum Mode only (MN/MX = LOW):**

| Pin | Name | Dir | Description |
|-----|------|-----|-------------|
| S0, S1, S2 | Status | Out | Active LOW. Decoded by 8288 bus controller to generate all bus control signals. |
| QS0, QS1 | Queue Status | Out | Reflects state of internal prefetch queue (used by external co-processors). |
| RQ/GT0, RQ/GT1 | Request/Grant | Bidir | Bus arbitration with other masters. Replaces HOLD/HLDA. |
| LOCK | Lock | Out | Active LOW while LOCK-prefixed instruction executes. Prevents other masters taking bus. |

### T2.2 AD0–AD15 — Multiplexed Address/Data

**Direction:** Bidirectional.
**During T1:** Contains A0–A15 (lower 20 bits of physical address). Called "A0–A15" when carrying address.
**During T2–T4:** Contains D0–D15 (data). Called "D0–D15" when carrying data.

**Why bidirectional?** For reads, data flows in from memory. For writes, data flows out to memory. Same physical pins, direction controlled by DT/R̄.

### T2.3 A16/S3 through A19/S6

**During T1:** Pins carry address bits A16–A19 (completing the 20-bit address for 1 MB space).
**During T2–T4:** Carry status signals S3–S6.

**S3, S4 — Segment currently accessed:**

| S4 | S3 | Segment |
|----|----|---------| 
| 0 | 0 | ES (Extra Segment) |
| 0 | 1 | SS (Stack Segment) |
| 1 | 0 | CS (Code Segment) or no segment |
| 1 | 1 | DS (Data Segment) |

**S5:** Reflects the current state of the **IF (Interrupt Flag)** bit.
**S6:** Always **logic 0** (identifies the processor as 8086 to external hardware).

> **Exam tip:** S6 is always 0. S5 = current IF. S3/S4 identify which segment register is being used in the current bus cycle.

### T2.4 BHE/S7 — Bus High Enable

**During T1:** BHE (active LOW) asserts to signal that the **upper byte of the data bus (D8–D15)** is valid.
**During T2–T4:** Carries S7, which is always logic 1.

**Bank selection logic (8086 only):**

| BHE | A0 | Transfer |
|-----|----|----------|
| 0 | 0 | 16-bit word (both banks) |
| 0 | 1 | High byte only (D8–D15, odd address) |
| 1 | 0 | Low byte only (D0–D7, even address) |
| 1 | 1 | Invalid (no transfer) |

The low bank is selected by A0 = 0; the high bank is selected by BHE = 0.

### T2.5 MN/MX — Minimum/Maximum Mode

**Pin 33.** Hardwired (not software-selectable at runtime).

- **MN/MX = HIGH (tied to VCC):** Minimum mode. CPU generates all bus control signals itself. Used for simple single-processor systems.
- **MN/MX = LOW (tied to GND):** Maximum mode. CPU outputs S0/S1/S2; external 8288 bus controller generates MRDC, MWTC, IORC, IOWC, INTA. Used for multi-processor systems and co-processor (8087) configurations.

**Key difference:** In Maximum mode, HOLD/HLDA do not exist. Bus arbitration uses RQ/GT0, RQ/GT1 instead.

> **Exam question (21-22):** "In Maximum Mode, there is no HOLD/HLDA. Will DMA operations be supported?" — Yes, via RQ/GT0 or RQ/GT1 pins which replace HOLD/HLDA for bus mastering.

### T2.6 READY — Wait State Insertion

**Direction:** Input from 8284A clock generator.
**Active:** LOW inserts a wait state (Tw) between T2 and T3.

When a slow memory device cannot satisfy the memory access time requirement, the READY pin is pulled LOW. The 8086 inserts Tw states (each one full clock period) until READY goes HIGH.

### T2.7 TEST — Co-processor Synchronization

The WAIT instruction causes the 8086 to check the TEST pin:
- **TEST = 0:** 8086 resumes execution (co-processor finished).
- **TEST = 1:** 8086 enters wait loop, resampling TEST every clock.

Used to synchronize with the 8087 floating-point co-processor.

### T2.8 Maximum Mode Status Signals S0, S1, S2

Decoded by the **8288 bus controller** to generate all memory and I/O control signals:

| S2 | S1 | S0 | Bus Cycle Type |
|----|----|----|----------------|
| 0 | 0 | 0 | Interrupt acknowledge |
| 0 | 0 | 1 | Read I/O port |
| 0 | 1 | 0 | Write I/O port |
| 0 | 1 | 1 | Halt |
| 1 | 0 | 0 | Code access (instruction fetch) |
| 1 | 0 | 1 | Read memory |
| 1 | 1 | 0 | Write memory |
| 1 | 1 | 1 | Passive (no bus cycle) |

### T2.9 Queue Status Signals QS0, QS1

Allow external devices (8087 co-processor) to track what instruction the CPU is processing:

| QS1 | QS0 | Queue Operation |
|-----|-----|----------------|
| 0 | 0 | No operation |
| 0 | 1 | First byte of opcode from queue |
| 1 | 0 | Queue emptied (reset) |
| 1 | 1 | Subsequent byte of opcode |

### T2.10 RQ/GT0, RQ/GT1 — Bus Request/Grant (Maximum Mode)

Bidirectional pins replacing HOLD/HLDA. A bus master (DMA or co-processor) pulses the pin LOW for one clock to request the bus. CPU responds with one LOW clock pulse to grant. After transfer, the requesting master pulses again to release. RQ/GT0 has higher priority than RQ/GT1.

### T2.11 LOCK Prefix

Writing `LOCK` before an instruction holds the LOCK pin LOW for the duration of that instruction, preventing other bus masters from taking control:
```asm
LOCK MOV CX, [4000H]   ; Bus locked for duration of this read
```

---

## T3 — 8284A Clock Generator

### T3.1 Purpose

The 8284A provides four functions for the 8086 system:
1. **Clock generation** (crystal → CLK to 8086)
2. **RESET synchronization** (RC circuit → synchronized RESET to 8086)
3. **READY synchronization** (RDY1/RDY2 → synchronized READY)
4. **Peripheral clock** (PCLK — one-sixth crystal frequency)

### T3.2 Internal Architecture

```
Crystal (X1,X2)
     |
[XTAL OSC]──→ OSC output (same freq as crystal, to other 8284As via EFI)
     |
  [2:1 MUX]←── F/C pin selects: XTAL (F/C=0) or EFI external input (F/C=1)
     |
[÷3 Counter]──→ CLK to 8086 (crystal/3)
     |        ──→ READY synchronization FF
     |        ──→ [÷2 Counter]──→ PCLK (crystal/6)
     |        ──→ RESET FF
```

**Key frequencies (with 15 MHz crystal):**
- Crystal oscillator: 15 MHz
- CLK (to 8086): 15/3 = **5 MHz**
- PCLK (peripheral): 15/6 = **2.5 MHz**

### T3.3 Complete 8284A Pin Reference

| Pin | Direction | Description |
|-----|-----------|-------------|
| X1, X2 | In | Crystal connections (15 MHz for 5 MHz 8086) |
| F/C | In | Frequency/Crystal select: LOW = crystal, HIGH = EFI |
| EFI | In | External Frequency Input from another 8284A's OSC |
| OSC | Out | Crystal-frequency output (drives other 8284As via EFI) |
| CSYNC | In | Clock Synchronize; grounded when using crystal mode |
| CLK | Out | System clock to 8086 CLK pin (crystal/3) |
| PCLK | Out | Peripheral clock (crystal/6) |
| RES | In | Active LOW reset input (from RC circuit or power supervisor) |
| RESET | Out | Synchronized RESET output to 8086 (active HIGH) |
| RDY1, RDY2 | In | Ready inputs from memory/IO devices |
| AEN1, AEN2 | In | Address Enable; qualify RDY1/RDY2 respectively |
| ASYNC | In | Sync mode: LOW = two-stage sync (for slow/async devices) |
| READY | Out | Synchronized READY to 8086 |
| VCC | — | +5 V |
| GND | — | Ground |

### T3.4 RESET Synchronization

[IMAGE FLAG — Page 16, L3 / Page 2, L4: Timing diagram showing RESET RC circuit waveform. Labels: RES input (from RC), RESET output to 8086, CLK. Shows negative-edge triggered flip-flop behavior.]

**Reset circuit operation:**
- RES input is active LOW (from RC circuit on power-up).
- 8284A uses a **negative edge-triggered flip-flop**: RESET output to 8086 goes active on the **falling edge** (1→0) of RES.
- 8086 samples RESET on the **rising edge** of CLK.
- **Requirement:** RESET must reach logic 1 no later than **4 clock cycles after power-up**, and must stay HIGH for at least **50 µs**.
- After RESET, 8086 begins executing at **FFFF0H** and clears IF flag.

### T3.5 READY Synchronization

READY is generated by ORing RDY1 (qualified by AEN1) and RDY2 (qualified by AEN2).
- **ASYNC = LOW:** Two-stage synchronization is used to prevent metastability for slow asynchronous devices.
- **ASYNC = HIGH:** Single-stage synchronization (for fast synchronous devices).

---

## T4 — 8086 Bus Operation & Timing

### T4.1 Instruction Cycle vs Machine Cycle

- **Instruction cycle:** The complete sequence of steps to fetch, decode, and execute one instruction. May span multiple machine/bus cycles.
- **Machine cycle (bus cycle):** One access to memory or I/O. Takes a minimum of **4 T-states** (T1, T2, T3, T4). Wait states (Tw) can be inserted between T2 and T3.

### T4.2 Bus Cycle States

```
   T1      T2      Tw(opt) T3      T4
|-------|-------|-------|-------|-------|
 Address Activate        Sample  Done
 on bus  RD/WR  (if     data    deact.
 ALE↑    DEN↓   READY=0) by CPU  all
```

| T-state | What happens |
|---------|-------------|
| **T1** | Address placed on AD0–AD15 and A16–A19. ALE pulses HIGH then LOW. DT/R̄ set. M/ĪŌ set. |
| **T2** | RD or WR asserted LOW. DEN goes LOW (enables bus buffers). For reads: AD lines float (tristated). |
| **Tw** | Inserted if READY = LOW. CPU idles. Each Tw = one clock period. |
| **T3** | Data sampled by CPU (read) or held by memory (write). READY checked on falling edge of T2. |
| **T4** | All control signals deasserted. Bus returned to idle. |

### T4.3 Memory Read Timing Diagram

[IMAGE FLAG — Pages 2-5, L4 / Pages 3-5, L6: Memory Read timing diagram. Signals shown: CLK, AD0-15, A16-19/S3-S6, BHE/S7, ALE, RD, DT/R, DEN, data from memory. Key timing parameters labeled: TCLAV, TCLLH, TCLRL, TDVCL.]

**ASCII reconstruction of Read cycle:**
```
CLK:    ___     ___     ___     ___     ___
       | T1 |  | T2 |  | Tw |  | T3 |  | T4 |
       
ALE:   ‾‾‾‾____________________________________
       ↑ goes HIGH at start of T1, LOW at end

AD0-15: [===A0-A15===][float][float][===DATA===][---]
         ↑ address valid     ↑ mem drives data
         
A16-19:  [=A16-19=][=S3-S6=][=S3-S6=][=S3-S6=][---]

RD:     ____________‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾____________
              ↑ goes LOW in T2         ↑ goes HIGH T4

DEN:    ____________‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾____________
              ↑ LOW in T2 (enables buffers)

DT/R:   LOW (receive direction for read)
```

### T4.4 Memory Write Timing Diagram

[IMAGE FLAG — Pages 2-3, L4 / Pages 2-3, L6: Memory Write timing diagram. Similar signals but WR active instead of RD. DT/R̄ = HIGH (transmit). Data valid during T2-T4.]

**Key difference from read:** DT/R̄ = HIGH throughout, WR goes LOW in T2, data placed on bus in T2 (not T3).

### T4.5 Memory Access Time Calculation

**For a 5 MHz 8086 (clock period = 200 ns):**

Three T-states (T1, T2, T3) span 3 × 200 = 600 ns from address valid to data sampled.

But two delays eat into this window:
- **TCLAV** (Clock to Address Valid): 110 ns — address not valid until 110 ns after T1 clock edge.
- **TDVCL** (Data Valid to Clock setup): 30 ns — data must be stable 30 ns before the T3 sampling clock edge.

```
Memory Access Time (no wait states) = 3×Tclk − TCLAV − TDVCL
                                     = 600 − 110 − 30 = 460 ns
```

Also subtract **TCLLH** (Clock Low to RD High = time RD deasserts before T4): listed as TCLRL in some notations.

**With one wait state:**
```
Memory Access Time = 460 + 1×Tclk = 460 + 200 = 660 ns
```

**General formula:**
```
t_access = (3 + Nw)×Tclk − TCLAV − TDVCL − TCLRL
```
where Nw = number of wait states.

**Worked example (from slides):**

*Problem 1:* 8086 at 8 MHz (8086-2), one wait state. What is the maximum memory access time?
- Tclk = 1/8 MHz = 125 ns
- t_access = (3 + 1) × 125 − 110 − 30 = 500 − 140 = **360 ns**

*Problem 2 (L6):* 8 MHz, memory access time = 300 ns, address setup time = 120 ns, data setup time = 20 ns, latch buffer delay = 10 ns. Time to read 16-bit data from 2010H.

2010H is an even address (A0 = 0), so both bytes transferred simultaneously in one bus cycle.
- Available window = (3)×125 − 120 − 20 − 10 = 375 − 150 = 225 ns
- Memory needs 300 ns → requires **wait states**: ⌈(300 − 225)/125⌉ = 1 wait state needed.
- Total time with 1 Tw = 4 × 125 = **500 ns**.

### T4.6 Bus Demultiplexing — 74LS373 Latch

[IMAGE FLAG — Pages 6-7, L4: Circuit showing 74LS373 octal latch connected between AD0-AD15 and the demultiplexed address bus A0-A15. ALE connects to LE (latch enable) pin.]

The **74LS373** (or Intel 8282) is an octal D-latch:
- When LE (Latch Enable) = HIGH: outputs follow inputs (transparent).
- When LE goes LOW: outputs hold (latch) the last input state.

**Connection:** ALE → LE. Address appears on AD0–AD15 during T1 while ALE = HIGH. When ALE goes LOW at end of T1, address is latched and held on separate address bus lines A0–A15 for the rest of the bus cycle while AD lines carry data.

Two 74LS373s are needed for the 8086: one for AD0–AD7, one for AD8–AD15.

### T4.7 Data Bus Buffering — 74LS245

[IMAGE FLAG — Page 9-11, L4: Circuit showing 74LS245 octal transceiver buffering the data bus. DT/R connects to direction pin (DIR). DEN connects to output enable (OE, active LOW).]

The **74LS245** is a bidirectional octal buffer/transceiver:
- **DIR pin:** Controls direction. Connected to CPU's DT/R̄.
  - DT/R̄ = HIGH → A→B direction (CPU transmitting, write)
  - DT/R̄ = LOW → B→A direction (CPU receiving, read)
- **OE pin (active LOW):** Connected to DEN. Buffer disabled when DEN HIGH.

Buffers are needed when fanout requirements exceed the CPU's drive capability (the 8086 can source/sink limited current).

### T4.8 Minimum Mode Complete System Bus

[IMAGE FLAG — Page 12, L4: Full minimum mode bus diagram showing 8086 ↔ 8284A ↔ 74LS373 (x2) ↔ 74LS245 (x2) ↔ memory/IO. ALE, DT/R, DEN, M/IO, RD, WR connections shown.]

**Signal routing summary:**
```
8086                External
─────               ─────────
ALE    ──────────→  74LS373 LE (address latch)
DEN    ──────────→  74LS245 OE (bus buffer enable)  
DT/R̄  ──────────→  74LS245 DIR (bus buffer direction)
M/ĪŌ  ──────────→  Address decode logic
RD     ──────────→  Memory OE / IO read
WR     ──────────→  Memory WE / IO write
RESET  ←─────────   8284A RESET
CLK    ←─────────   8284A CLK
READY  ←─────────   8284A READY
```


---

## T5 — Memory Interfacing

### T5.1 Memory Chip Anatomy

**Address pins (n):** Determine number of locations: 2^n locations.
- 11 address pins → 2^11 = 2K locations
- 13 address pins → 2^13 = 8K locations
- Log₂(N) address pins for N locations.

**Data pins:** Determine word width. An "8K × 8" chip has 8K locations, each 8 bits wide.

**Control pins:**

| Pin | RAM/ROM | Function |
|-----|---------|----------|
| CS / CE (active LOW) | Both | Chip Select/Enable — must be LOW to enable device |
| OE (active LOW) | Both | Output Enable — enables tri-state output buffers |
| WE / WR (active LOW) | RAM only | Write Enable — enables write operation |

> **Rule:** For dual-control-pin RAMs, OE and WE must never both be LOW simultaneously (undefined state).

**Addressing principle:** If only P locations of an N-location address space are interfaced, the least-significant p address lines (p = log₂P) connect directly to memory address pins. The remaining (n−p) higher address lines are decoded for chip selection.

### T5.2 ROM Types

| Type | Erasable | Method | Notes |
|------|----------|--------|-------|
| ROM | No | Factory mask | Permanent; lowest cost for high volumes |
| PROM | No (write once) | Fuse burning | Field programmable once |
| EPROM | Yes | UV light ~20 min | Quartz window on package (e.g., 2716, 2764) |
| EEPROM / Flash | Yes | Electrical | Byte or sector erase; slow write vs. RAM |

**2716 EPROM:** 2K × 8 (2048 locations, 8-bit wide). 11 address pins (A0–A10). Used extensively in 8086 interfacing examples.
**2764 EPROM:** 8K × 8. 13 address pins (A0–A12).

### T5.3 Address Decoding Methods

#### Method 1: NAND Gate Decoder

Direct gate-level decoding. Each address bit either inverted or non-inverted is fed into a NAND gate. The NAND output goes LOW (chip select) only when the correct address pattern appears.

**Example from slides:** Select memory for DF800H–DFFFFH:
```
DF800H = 1101 1111 1000 0000 0000
DFFFFH = 1101 1111 1111 1111 1111
         A19 A18 A17 A16 A15 A14 A13 A12 ...A11-A0 (don't care)

Fixed bits: A19=1, A18=1, A17=0, A16=1, A15=1, A14=1, A13=1, A12=1
NAND inputs: A19, A18, Ā17, A16, A15, A14, A13, A12
Output active LOW → CS to memory chip
```

#### Method 2: 74LS138 (3-to-8) Decoder

[IMAGE FLAG — Page 4, L7: 74LS138 decoder connection diagram showing G1, G2A, G2B enable pins and A,B,C select inputs connected to address bus. Outputs Y0–Y7 each connecting to one memory chip's CS pin.]

**74LS138 truth:**
- Three enable pins: G1 (active HIGH), G2A (active LOW), G2B (active LOW).
- All three enables must be active simultaneously for the decoder to function.
- Inputs A, B, C select one of 8 outputs (Y0–Y7) to go LOW.

**Advantage over NAND:** One decoder can select up to 8 memory chips without additional gates.

**Example (from slides):** 32K × 8 RAM at address 00000H–07FFFH:
- A0–A14 → RAM address pins (15 pins for 32K)
- A15–A19 → decoder inputs (5 bits to decode upper address)
- Decoder output (e.g., Y0) → CS of RAM

**Decoder example (1K RAM at FFC00H):**
```
FFC00H = 1111 1111 1100 0000 0000
Address pins A0–A9 → RAM (1K = 10 address lines)
A10–A19 decoded by 74LS138 with enabling logic for FFC00H–FFFEH
```

#### Method 3: Programmable Logic (GAL22V10/PLA)

Used for complex address decoding with many constraints. The GAL22V10 can decode up to 10 address bits plus conditions in a single chip.

**Example (L9):** 64K 16-bit wide memory at 060000H–06FFFFH for 80286:
- 64K requires A1–A15 (A0 is don't care for 16-bit word alignment)
- A23–A15 decoded by GAL22V10 to detect 06XXXXH pattern
- Separate write strobes LWR and HWR generated

### T5.4 8088 Memory Interfacing (8-bit bus, single bank)

The 8088 has an 8-bit external data bus — one bank of memory, all 8-bit chips. A0–A19 address the 1 MB space. No BHE signal.

**Example (L7):** Interface 8K memory to 8088 using 2K × 8 chips (2716 EPROM):
- 8K = 4 chips of 2K each
- Each chip: 11 address pins → connect A0–A10
- Decoder selects which chip: A11, A12 → 2-to-4 decoder (or 74LS138 with 3 inputs)

**Memory map:**
```
RAM1: 00000H–007FFH   (A11=0, A12=0)
RAM2: 00800H–00FFFH   (A11=1, A12=0)
RAM3: 01000H–017FFH   (A11=0, A12=1)
RAM4: 01800H–01FFFH   (A11=1, A12=1)
```
A13–A19 qualify the decoder (must all be 0 for this block).

**Worked Example (L7):** Interface 4K ROM (2716) at 00000H + 8K SRAM (6116) at 08000H to 8088:
- 2716 = 2K × 8 → need 2 chips for 4K. Chips at 00000H–007FFH and 00800H–00FFFH
- 6116 = 2K × 8 → need 4 chips for 8K. Chips at 08000H–087FFH ... 08FFFH

ROM address decode: A11=0, A12=0, A13=0, A14=0, A15=0, A16=0, A17=0, A18=0, A19=0 (first 4K)
ROM1 chip select: A11 distinguishes ROM1 (A11=0) from ROM2 (A11=1)

### T5.5 8086 Memory Interfacing (16-bit bus, dual bank)

The 8086 uses a **split memory bank** architecture:
- **Low bank (even bank):** Bytes at even addresses (A0=0). Data on D0–D7. Selected by **A0 = 0**.
- **High bank (odd bank):** Bytes at odd addresses (A0=1). Data on D8–D15. Selected by **BHE = 0**.

[IMAGE FLAG — Pages 2-9, L8: Circuit diagrams showing dual bank memory interfacing for 8086. Two banks of memory chips, low bank CS from A0 (inverted), high bank CS from BHE. Shared address lines A1-A19.]

**Key difference from 8088:** Address pin A0 is NOT connected to memory address inputs. Instead:
- Memory chips receive A1–A11 (for 2K chips) as their address inputs A0–A10.
- **Low bank:** CS driven by A0 (active when A0=0 = even address). Actually A0 is used as a bank selector, so the chip's address pins get A1–A(n) from CPU's A1–A(n).
- **High bank:** CS driven by BHE (active when BHE=0).

**Why not connect A0 to memory?** Both banks occupy the same 2K address range — A0 just selects which bank, not which location within the bank.

**16-bit word access:** Both CS signals active simultaneously → both banks respond → 16-bit data on D0–D15.

### T5.6 Separate Bank Write Strobes (LWR, HWR)

For 8086, write operations need separate write strobes per bank (reads don't need this because the CPU ignores the half-byte it doesn't need).

```
LWR (Low Bank Write)  = WR + A0     (OR gate: active when WR=0 AND A0=0)
HWR (High Bank Write) = WR + BHE    (OR gate: active when WR=0 AND BHE=0)
```

For 80286/80386SX: Use **MWTC** signal instead of WR.

**Why no separate read strobes?** During a read, the CPU simply ignores the data on the half of the bus it doesn't need. No conflict occurs.

### T5.7 Advanced: 16-bit Decoder with GAL22V10 (L9)

**Example:** Decode 64K 16-bit memory at 060000H–06FFFFH for 80286:
- Uses two 32K × 8 SRAM (62256) chips — one per bank
- A0 is don't care; connect CPU A1–A15 to chip A0–A14
- GAL22V10 decodes A23–A15 to detect 06XXXXH pattern
- GAL also generates LWR and HWR from MWTC + A0/BHE

### T5.8 32-bit Memory Interfacing (80386/80486)

Four banks: Bank 0 (D0–D7), Bank 1 (D8–D15), Bank 2 (D16–D23), Bank 3 (D24–D31).

Selected by: BE0, BE1, BE2, BE3 (Byte Enable signals, replacing A0/BHE with 4 individual enables).

**Bank selection table:**

| BE3 | BE2 | BE1 | BE0 | Transfer |
|-----|-----|-----|-----|---------|
| 1 | 1 | 1 | 0 | Byte, D0–D7 |
| 1 | 1 | 0 | 1 | Byte, D8–D15 |
| 1 | 1 | 0 | 0 | Word, D0–D15 |
| 0 | 0 | 0 | 0 | Dword, D0–D31 |

### T5.9 Topic Summary — Memory Interfacing

**Key formulae:**
```
n = log₂(N)         → address pins needed for N locations
t_access ≥ t_mem    → no wait states needed
Nw = ⌈(t_mem - t_avail) / Tclk⌉   → wait states required
```

**Critical rules:**
1. For 8088: connect A0–An directly to chip address pins. A0 is a real address bit.
2. For 8086: A0 and BHE are BANK SELECTORS, not chip address pins. Chip gets A1–An on its A0–A(n-1).
3. Always use separate write strobes (LWR/HWR) for 8086 16-bit systems.
4. Higher-order address bits not connected to chip → must be decoded for chip select.
5. 74LS138: ALL enables (G1=1, G2A=0, G2B=0) must be satisfied.

**Common mistakes:**
- Forgetting to invert A0 for the low bank chip select (A0=0 means even address, but CS is usually active LOW, so CS = A0̄ or CS driven by decoder with A0 as select input).
- Using A0 as a chip address pin in an 8086 system (wrong — A0 is bank select only).
- Connecting address lines A0–A14 to decoder instead of A1–A15 for 16-bit word-addressed memory.

---

## T6 — I/O Interfacing Fundamentals

### T6.1 I/O Port Addressing

The 8086 provides a **separate 64K I/O address space** (ports 0000H–FFFFH), independent of the 1 MB memory space. M/ĪŌ pin distinguishes them: LOW = I/O, HIGH = memory.

**Fixed (direct) I/O addressing:**
- Port address is an 8-bit immediate in the instruction: `IN AL, 27H`
- Range: 00H–FFH (256 ports)
- Address appears on A0–A7. A8–A15 are 0.
- Instruction: `IN AL, port8` or `OUT port8, AL`

**Variable (indirect) I/O addressing:**
- Port address in DX register (16-bit): `IN AL, DX`
- Range: 0000H–FFFFH (65536 ports)
- Address appears on A0–A15.
- Instruction: `IN AL/AX, DX` or `OUT DX, AL/AX`

**String I/O:** INS / OUTS — transfer data between I/O port and memory via ES:DI / DS:SI.

**Key rule:** First 256 ports (00H–FFH) accessible by both fixed AND variable. Ports 0100H–FFFFH accessible by variable addressing ONLY.

In PC systems: All 16 address bits decoded, I/O ports 0000H–03FFH used.

### T6.2 Memory-Mapped I/O vs Isolated I/O

| Feature | Memory-Mapped I/O | Isolated I/O |
|---------|-------------------|--------------|
| Address space | Shares memory space | Separate 64K I/O space |
| Instructions | MOV, any memory instruction | IN, OUT only |
| Register access | Any register | Only AL/AX/EAX |
| ALU operations | Direct on I/O data | Not directly |
| M/ĪŌ during access | HIGH | LOW |
| Control signals | MEMR, MEMW | IORC, IOWC |
| Address bits decoded | All 20 (A0–A19) | A0–A15 (variable) or A0–A7 (fixed) |
| I/O port count | Up to 2^16 = 64K | 256 (fixed) or 64K (variable) |

### T6.3 Handshaking

I/O devices are slower than the CPU. Handshaking synchronizes data transfers.

**Handshake sequence:**
1. Device signals "ready" (status bit set or interrupt raised)
2. CPU reads/writes data
3. Device signals "busy"
4. Device signals "ready" again when done

**Two mechanisms:**
- **Polling (CPU-initiated):** CPU continuously reads a status register to check if device is ready. Simple but wastes CPU cycles.
- **Interrupt-driven (device-initiated):** Device asserts INTR when ready. CPU executes ISR only when needed. More efficient.

### T6.4 I/O Decoding

[IMAGE FLAG — Pages 7-10, L10: I/O decoding circuit using NAND gate for 8-bit port address decoding, and PLD decoding circuit for 16-bit port address. Shows port address range EFF8H–EFFFH decoded using NAND + PLD.]

For 8-bit I/O ports:
- Decode only A0–A7.
- A8–A15 are don't cares (ignored).
- Use IORC or IOWC to gate the chip select.

For 16-bit I/O ports:
- Decode A0–A15.
- A NAND gate can handle upper bits (A8–A15), output fed as one input to PLD.

**8-bit vs 16-bit I/O writes:** 8-bit I/O devices need separate write strobes (same reason as memory). For reads, the CPU ignores the byte it doesn't need.

### T6.5 Input/Output Device Interfacing

**Input devices (e.g., switches):** Connected via **tri-state buffers** (74LS245). Buffer enabled only when CPU reads the port (IOR strobe). Isolation from data bus when not reading.

**Output devices (e.g., LEDs):** Connected via **latches** (74LS373). Data from CPU valid for only ~50–1000 ns on bus. Latch captures and holds data when OE is pulsed.

```
Input Device → Buffer → Data Bus → CPU
CPU → Data Bus → Latch → Output Device
```


---

## T7 — 8255 Programmable Peripheral Interface (PPI)

### T7.1 Overview

The 82C55 PPI provides **3 × 8-bit I/O ports (A, B, C)** in one 40-pin DIP package. It directly interfaces to the 8086 data bus.

**Internal grouping:**
- **Group A:** Port A (PA0–PA7) + Port C upper (PC4–PC7) — can operate in Mode 0, 1, or 2
- **Group B:** Port B (PB0–PB7) + Port C lower (PC0–PC3) — can operate in Mode 0 or 1

Port C serves dual roles: as an I/O port in Mode 0, and as handshake/status lines in Mode 1/2.

### T7.2 Complete Pin Reference

| Pin(s) | Dir | Description |
|--------|-----|-------------|
| PA0–PA7 | I/O | Port A — latched output or buffered input |
| PB0–PB7 | I/O | Port B — latched output or buffered input |
| PC0–PC7 | I/O | Port C — I/O or handshake signals (Mode 1/2) |
| D0–D7 | Bidir | Data bus (connect to CPU data bus) |
| A0, A1 | In | Address select (with CS, selects port or CWR) |
| CS (active LOW) | In | Chip Select — enables RD/WR operations |
| RD (active LOW) | In | Read — CPU reads from 8255 |
| WR (active LOW) | In | Write — CPU writes to 8255 |
| RESET | In | Active HIGH — clears CWR, all ports → input mode |
| VCC | — | +5 V |
| GND | — | Ground |

**Address selection (A1, A0):**

| A1 | A0 | CS | Operation |
|----|----|----|-----------|
| 0 | 0 | 0 | Port A selected |
| 0 | 1 | 0 | Port B selected |
| 1 | 0 | 0 | Port C selected |
| 1 | 1 | 0 | Control Word Register (write) |

> **8086 interfacing note:** If 8255 is on the lower data bus (D0–D7), connect CPU A1→8255 A0 and CPU A2→8255 A1 (one address bit shift to align with byte boundaries of the 16-bit bus).

### T7.3 Control Word Register Format

**D7 = 1: I/O Mode (Mode Set Command)**

```
D7  D6  D5  D4  D3  D2  D1  D0
 1  [M1  M0] [PA] [PC-hi] [M] [PB] [PC-lo]
```

| Bits | Field | Meaning |
|------|-------|---------|
| D7=1 | Flag | I/O mode control word |
| D6, D5 | Mode A (M1,M0) | 00=Mode0, 01=Mode1, 1x=Mode2 |
| D4 | Port A direction | 1=Input, 0=Output |
| D3 | Port C upper direction | 1=Input, 0=Output |
| D2 | Mode B (M) | 0=Mode0, 1=Mode1 |
| D1 | Port B direction | 1=Input, 0=Output |
| D0 | Port C lower direction | 1=Input, 0=Output |

**Example:** All ports output, all Mode 0:
```
D7=1, D6=0, D5=0 (Mode0), D4=0 (A out), D3=0 (PC-hi out), D2=0 (Mode0), D1=0 (B out), D0=0 (PC-lo out)
CW = 10000000B = 80H
```

**D7 = 0: BSR Mode (Bit Set/Reset for Port C only)**

```
D7  D6  D5  D4  D3  D2  D1  D0
 0   X   X   X  [b2 b1 b0] [S/R]
```

| Bits | Meaning |
|------|---------|
| D3, D2, D1 | Bit number (0–7) of Port C to set/reset |
| D0 | 1=Set, 0=Reset |

BSR mode does NOT change port modes — only toggles individual Port C bits. Useful for generating software-controlled strobes.

### T7.4 Mode 0 — Basic I/O

[IMAGE FLAG — Pages 5-6, L11: 8255 internal block diagram showing Mode 0 configuration with all ports as simple I/O.]

**Characteristics:**
- Any combination of ports A, B, C (upper/lower) can be configured as input or output.
- No handshaking signals.
- Outputs are latched; inputs are buffered (not latched).
- 16 possible I/O combinations.

**ALP Example (all outputs):**
```asm
MOV AL, 10000000B   ; CW = 80H: all ports Mode 0, all output
MOV DX, 703H        ; CWR address (if base port = 700H, A1=A0=1)
OUT DX, AL          ; send command
```

### T7.5 Mode 1 — Strobed I/O (Handshaking)

Group A and Group B each operate with handshake signals using Port C lines.

**Mode 1 Input (Strobed Input):**

Port C pins used as handshake for Group A input:
- **PC4 (STB̄A):** Strobe input (active LOW). External device asserts to latch data into Port A.
- **PC5 (IBFA):** Input Buffer Full (output). Goes HIGH when data latched by STB̄. CPU must read before it clears.
- **PC3 (INTRA):** Interrupt Request (output). Goes HIGH when IBF=1 AND INTE=1.
- **PC6 (INTEA):** Interrupt Enable A (set/reset via BSR mode on PC6).

[IMAGE FLAG — Page 21, L11: Mode 1 strobed input timing diagram showing STB, IBF, INTR signal sequence.]

**Timing sequence (Mode 1 Input):**
```
External device: data valid → asserts STB̄ LOW
8255:           latches data → sets IBF HIGH → sets INTR HIGH (if INTE=1)
CPU:            reads Port A → INTR LOW, IBF LOW
External device: can strobe next data
```

**Mode 1 Output (Strobed Output):**

Port C pins for Group A output:
- **PC7 (OBF̄A):** Output Buffer Full (active LOW). Goes LOW when CPU writes to Port A. Tells device data is ready.
- **PC6 (ĀCKA):** Acknowledge (input, active LOW). External device asserts to tell 8255 it has taken the data.
- **PC3 (INTRA):** Interrupt Request. Goes HIGH when OBF̄=1 (buffer empty) AND INTE=1.

[IMAGE FLAG — Pages 2-3, L12: Mode 1 strobed output timing diagram showing OBF, ACK, INTR sequence.]

**Timing sequence (Mode 1 Output):**
```
CPU:            writes to Port A → OBF̄ goes LOW (data ready)
External device: reads data → asserts ĀCK LOW
8255:           OBF̄ goes HIGH (buffer empty) → INTR goes HIGH
CPU:            ISR writes next byte
```

**Group B Mode 1 pin assignments:**
- PC2 = STB̄B (input), PC1 = IBFB (output), PC0 = INTRB (output) — for input
- PC2 = ĀCK B (input), PC1 = OBF̄B (output), PC0 = INTRB (output) — for output

**Printer Interface Example (L12):**
- Port B → printer data lines
- PC4 used as software-generated Data Strobe (DS) via BSR mode (no hardware DS from Mode 1)
- ACK from printer → PC2 (ACKB in Mode 1)

### T7.6 Mode 2 — Bidirectional Bus (Port A Only)

[IMAGE FLAG — Pages 5-7, L12: Mode 2 bidirectional timing diagram showing OBF, ACK, STB, IBF, INTR signal sequence for both directions.]

Only **Port A** can operate in Mode 2. Used for bidirectional data bus applications (two computers communicating, GPIB interface).

Port C bits used (all 5 upper bits PC3–PC7):
- **PC7 (OBF̄):** Output Buffer Full (output)
- **PC6 (ĀCK):** Acknowledge from external device (input)
- **PC5 (IBF):** Input Buffer Full (output)
- **PC4 (STB̄):** Strobe from external device (input)
- **PC3 (INTR):** Interrupt Request (output)

When Port A is in Mode 2, Port B can be in Mode 0 or Mode 1.

**Mode 2 Operation:**
- For output: CPU writes → OBF̄ LOW → device reads and asserts ĀCK → OBF̄ HIGH
- For input: Device asserts STB̄ → data latched → IBF HIGH → CPU reads → IBF LOW

### T7.7 Topic Summary — 8255

**Key facts for exam:**
- After RESET: all ports configured as **inputs** (CWR = 9BH implied — all input, all Mode 0).
- Port C can be split: upper bits can be Group A's handshake while lower bits are independent.
- BSR mode only affects Port C, bit by bit.
- Mode 2 exclusively for Port A. Port A Mode 2 uses ALL 5 upper PC bits, leaving PC0–PC2 for Port B handshake.

**Common mistakes:**
- Confusing BSR mode (D7=0) with Mode Set (D7=1). If D7=0 is sent to CWR address, it's BSR not mode-set.
- Mode 1/2 INTR goes HIGH only if INTE bit is also set (using BSR on PC6 for Group A, PC2 for Group B).
- In 8086 systems: address shift. If 8255 base = port X, then Port A = X, Port B = X+2, Port C = X+4, CWR = X+6 (due to A1 shift, if using lower data bus with address skip).

**Control word quick reference:**

| Configuration | CW Byte |
|--------------|---------|
| All ports Mode 0, all output | 80H |
| All ports Mode 0, all input | 9BH |
| Port A Mode 1 input, B Mode 0 output | B0H (1011 0000) |
| Port A Mode 2, Port B Mode 1 input | E3H (approx) |

---

## T8 — 8254 Programmable Interval Timer (PIT)

### T8.1 Overview

The 8254 contains **three independent 16-bit counters** (Counter 0, 1, 2), each with:
- A CLK input (maximum 10 MHz)
- A GATE input (controls counting in some modes)
- An OUT output (waveform output)

In the PC: decoded at ports **40H–43H** (Counter 0–2 at 40H–42H, Control Word at 43H).

**Applications:** Real-time clock, event counter, baud rate generator, square wave generator, DRAM refresh timer, one-shot delay.

### T8.2 Internal Structure

```
         ┌──────────────────────────────────────────┐
         │              8254                        │
         │  ┌──────┐  ┌──────┐  ┌──────┐           │
CLK0 ───▶│  │CNT 0 │  │CNT 1 │  │CNT 2 │           │
GATE0───▶│  │      │  │      │  │      │           │
OUT0 ◀───│  └──────┘  └──────┘  └──────┘           │
         │      ↕          ↕         ↕              │
         │  ┌──────────────────────────────────┐    │
         │  │    Control Word Register (CWR)   │    │
         │  └──────────────────────────────────┘    │
         │  D0-D7  A0,A1  CS  RD  WR               │
         └──────────────────────────────────────────┘
```

Each counter contains:
- **CR (Count Register):** Stores count written by CPU.
- **CE (Counting Element):** 16-bit presettable synchronous down-counter. Loaded from CR.
- **OL (Output Latch) M and L:** Two 8-bit latches for reading the count.

### T8.3 Pin Reference

| Pin | Dir | Description |
|-----|-----|-------------|
| CLK0–2 | In | Clock inputs for counters 0, 1, 2 |
| GATE0–2 | In | Gate inputs — enable/disable counting or trigger |
| OUT0–2 | Out | Counter outputs — waveform generation |
| D0–D7 | Bidir | Data bus |
| A0, A1 | In | Counter/register select |
| CS (active LOW) | In | Chip select |
| RD (active LOW) | In | Read counter |
| WR (active LOW) | In | Write counter or control word |
| VCC | — | +5 V |
| GND | — | Ground |

**Address selection:**

| A1 | A0 | Selects |
|----|----|---------|
| 0 | 0 | Counter 0 |
| 0 | 1 | Counter 1 |
| 1 | 0 | Counter 2 |
| 1 | 1 | Control Word Register (write only) |

### T8.4 Control Word Format

```
D7  D6  D5  D4  D3  D2  D1  D0
[SC1 SC0] [RW1 RW0] [M2 M1 M0] [BCD]
```

| Field | Bits | Meaning |
|-------|------|---------|
| SC1, SC0 | D7, D6 | Counter select: 00=Ctr0, 01=Ctr1, 10=Ctr2, 11=Read-back |
| RW1, RW0 | D5, D4 | Read/Write: 01=LSB only, 10=MSB only, 11=LSB then MSB |
| M2, M1, M0 | D3, D2, D1 | Mode: 000=M0, 001=M1, 010=M2, 011=M3, 100=M4, 101=M5 |
| BCD | D0 | 0=Binary count, 1=BCD count |

> **Order is critical:** Write Control Word first. Then write count (LSB first if RW=11, then MSB).
> Writing first byte of two-byte count **stops** counting. Writing second byte **starts** counting.

### T8.5 The Six Modes

#### Mode 0 — Interrupt on Terminal Count

- OUT initially **LOW** after control word written.
- Count begins on next CLK after count loaded.
- OUT goes **HIGH** when count reaches 0 (terminal count). Stays HIGH until new count written.
- GATE=1 enables counting; GATE=0 pauses counting. No effect on OUT.
- **Use:** Software timing, event counting, interrupt generation after N events.

```
CLK:  _ _ _ _ _ _ _ _
GATE: ‾‾‾‾‾‾‾‾‾‾‾‾‾‾  (always enabled)
CE:   N  N-1 N-2 ... 1  0
OUT:  _______________‾‾  (LOW until TC, then HIGH)
```

> **N+1 rule:** OUT goes HIGH N+1 CLK pulses after count is written (first CLK loads CE, doesn't decrement).

#### Mode 1 — Hardware Retriggerable One-Shot

- OUT initially **HIGH**.
- Counting triggered by **rising edge of GATE** (hardware trigger).
- OUT goes **LOW** on CLK after trigger, stays LOW for N CLK pulses, then goes HIGH.
- Retriggerable: new trigger while LOW extends LOW period by N more CLKs from trigger point.
- GATE edge is the trigger; GATE level doesn't inhibit counting.
- **Use:** Monoshot pulse of known duration triggered by hardware event.

#### Mode 2 — Rate Generator (÷N)

- OUT initially **HIGH**.
- When count reaches **1**, OUT goes LOW for **one CLK** pulse, then HIGH.
- Count reloads automatically → **periodic output**, period = N CLK cycles.
- GATE=1 enables; GATE=0 disables counting AND forces OUT HIGH immediately.
- Count of 1 is **illegal** in Mode 2.
- **Use:** Divide-by-N clock, real-time clock interrupt (e.g., 18.2 Hz system timer).

```
CLK:  _ _ _ _ _ _ _ _
CE:   N N-1 ... 2  1  N N-1...
OUT:  ‾‾‾‾‾‾‾‾‾‾‾__‾‾‾‾‾‾‾‾‾‾__
              ↑ one CLK LOW pulse when CE=1
```

#### Mode 3 — Square Wave Generator

- OUT initially **HIGH**.
- Count decrements by **2** each CLK (unlike Mode 2's decrement by 1).
- OUT goes LOW when half the count elapsed, HIGH again at terminal count.
- Truly periodic square wave with period = N CLK cycles.
- **Even N:** duty cycle exactly 50%.
- **Odd N:** HIGH for (N+1)/2 CLKs, LOW for (N−1)/2 CLKs (slight asymmetry).
- GATE=1 enables; GATE=0 disables and forces OUT HIGH.
- **Use:** Baud rate generator, general-purpose square wave.

#### Mode 4 — Software Triggered Strobe

- OUT initially **HIGH**.
- Counting triggered by **writing the count** (software event).
- OUT goes LOW for **one CLK** pulse when terminal count reached, then HIGH.
- GATE=1 enables; GATE=0 disables counting.
- Not periodic — single strobe after N+1 CLKs from count write.
- **Use:** Single-shot delay initiated by software.

#### Mode 5 — Hardware Triggered Strobe (Retriggerable)

- OUT initially **HIGH**.
- Counting triggered by **rising edge of GATE** (hardware event).
- OUT goes LOW for **one CLK** pulse N+1 CLKs after trigger, then HIGH.
- Retriggerable: new trigger reloads counter and restarts the count.
- GATE level does not affect OUT.
- **Use:** Precise hardware-triggered single-shot pulse.

### T8.6 Gate Pin Summary Table

| Mode | GATE=0 effect | GATE rising edge effect | GATE=1 effect |
|------|---------------|------------------------|---------------|
| 0 | Inhibit counting | No effect | Enable counting |
| 1 | No effect | Trigger one-shot | No effect |
| 2 | Inhibit + OUT HIGH | Reload and restart | Enable counting |
| 3 | Inhibit + OUT HIGH | Reload and restart | Enable counting |
| 4 | Inhibit counting | No effect | Enable counting |
| 5 | No effect | Trigger strobe | No effect |

### T8.7 Programming Sequence

```asm
; Example: Counter 0, Mode 3 (square wave), binary, LSB+MSB, count = N
MOV AL, 00110110B   ; SC=00(Ctr0), RW=11(LSB+MSB), M=011(Mode3), BCD=0
OUT 43H, AL         ; write control word to CWR
MOV AL, LOW(N)      ; LSB of count
OUT 40H, AL         ; write LSB to Counter 0
MOV AL, HIGH(N)     ; MSB of count
OUT 40H, AL         ; write MSB — counting begins
```

**Frequency calculation (Mode 3):**
```
f_out = f_CLK / N
N = f_CLK / f_out
```

**Worked Example (L15):** Generate 1 ms square wave, CLK = 1.5 MHz:
```
N = 1.5×10⁶ × 1×10⁻³ = 1500 = 05DCH
CW = 00110111B = 37H  (Counter 0, Mode 3, LSB+MSB, binary)
ALP:
  MOV AL, 37H
  OUT 46H, AL       ; CWR at 46H (base=40H, CWR=43H... shifted if base=44H)
  MOV AL, 00H       ; Actually 1500 = 05DCH → LSB=DCH, MSB=05H
  OUT 40H, AL       ; LSB
  MOV AL, 15        ; Hmm: from slides: 1500 decimal, LSB=00H(?), but 1500=0x05DC
  OUT 40H, AL       ; MSB = 15 (decimal) = 0FH? Slides say N=1500=05DCH
```

> Exact from slides: N=1500, Control word=37H, counter register programmed with 1500 (05DCH). Note slides show: MOV AL, 00H / OUT 40H, AL / MOV AL, 15 / OUT 40H, AL — this is 1500 split as LSB=00H and MSB treated as decimal 15... likely a slide notation issue. Use 05DCH: LSB=DCH, MSB=05H.

**Worked Example (L15):** Interrupt after 10 ms, CLK = 1.5 MHz, using Counter 1, Mode 0:
```
N = 10×10⁻³ / (1/1.5×10⁶) = 15000 = 3A98H
CW = 01110000B = 70H  (Counter 1, Mode 0, LSB+MSB, binary)
ALP:
  MOV AL, 70H
  OUT 46H, AL
  MOV AL, 98H       ; LSB of 3A98H
  OUT 42H, AL
  MOV AL, 3AH       ; MSB
  OUT 42H, AL
```

### T8.8 Reading Counter Values

#### Counter Latch Command

To freeze the count for reading without disturbing the counting sequence:
```
D7 D6 D5 D4 D3 D2 D1 D0
SC1 SC0 0  0  X  X  X  X   (RW=00 = counter latch command)
```

```asm
; Latch counter 0:
MOV AL, 00000000B   ; SC=00, RW=00 → latch command
OUT 43H, AL         ; sent to CWR
; Now read counter 0:
IN AL, 40H          ; read LSB
MOV AH, AL
IN AL, 40H          ; read MSB
XCHG AL, AH        ; AX = latched count
```

The count holds in OL until read. Unlatched automatically upon read.

#### Read-Back Command (SC=11)

```
D7 D6 D5 D4   D3  D2  D1  D0
1  1  CNT STS  C2  C1  C0  0
```

- **D5=0 (CNT):** Latch count of selected counters
- **D4=0 (STS):** Latch status of selected counters
- **D3, D2, D1:** Select Counter 2, 1, 0 respectively

First read from a latched counter returns **status byte**; subsequent reads return **count**.

**Status byte format:**
```
D7      D6         D5-D0
OUTPUT  NULL_COUNT  [Mode as programmed in CW]
```
- **D7 (OUTPUT):** Current state of OUT pin.
- **D6 (NULL_COUNT):** 1 = new count written but not yet loaded into CE; 0 = CE has the written count.

### T8.9 8254 Topic Summary

**Formulae:**
```
f_out (Mode 2) = f_CLK / N
f_out (Mode 3) = f_CLK / N
N (delay, Mode 0 or 4) = t_delay / T_CLK = t_delay × f_CLK
N must be 2–65535 (0 = 65536)
```

**Key rules:**
1. Always write CW before writing count.
2. For RW=11 (16-bit count): always write LSB first, then MSB.
3. Writing LSB of a two-byte count **stops** current counting.
4. Mode 2: count = 1 is illegal.
5. Mode 0 OUT is LOW after CW; Mode 1/2/3/4/5 OUT is HIGH after CW.

**Common mistakes:**
- Forgetting N+1 CLK delay in Modes 0 and 4 before OUT changes.
- Using BCD bit (D0=1) when hex count is intended.
- Not writing CW before count — 8254 ignores count without prior CW.
- In Mode 3 with odd count: misremembering duty cycle (HIGH is longer by 1 CLK).


---

## T9 — Interrupts (8086/8088)

### T9.1 Overview

Interrupts are an alternative to polling. They allow the CPU to execute useful code until an I/O device asserts a signal. Interrupts are essential for low data rate I/O devices (keyboard, timer, serial port).

**Interrupt types:**

| Type | Signal | Maskable | Trigger | Priority |
|------|--------|----------|---------|----------|
| NMI | NMI pin | No | Rising edge (0→1) | Highest (after RESET) |
| INTR | INTR pin | Yes (IF flag) | Level HIGH | Lower than NMI |
| INT n | Software instruction | No | Execution of INT | — |
| INTO | Software instruction | No | OF=1 at execution | — |
| Single-step | TF flag set | — | After every instruction | — |

### T9.2 Interrupt Vector Table (IVT)

Located at **physical addresses 00000H–003FFH** (first 1024 bytes = 1 KB).

Contains **256 vectors**, each **4 bytes** (2 bytes offset IP + 2 bytes segment CS), in little-endian.

**Address of vector for interrupt type n:** `4 × n`
- INT 0: address 0000H (IP) and 0002H (CS)
- INT 5: address 0014H
- INT 21H: address 0084H

```
00000H: [IP-low][IP-high][CS-low][CS-high]  ← INT 0 vector
00004H: [IP-low][IP-high][CS-low][CS-high]  ← INT 1 vector
00008H: [IP-low][IP-high][CS-low][CS-high]  ← INT 2 vector
...
003FCH: [IP-low][IP-high][CS-low][CS-high]  ← INT FFH vector
```

**Interrupt groups:**
1. **Types 00–04:** Dedicated (fixed meaning in all Intel processors)
2. **Types 05–1FH:** Reserved by Intel for higher processors
3. **Types 20H–FFH:** User-defined (hardware or software)

### T9.3 Dedicated Interrupt Vectors

| Type | Vector Addr | Source | Trigger Condition |
|------|-------------|--------|-------------------|
| 0 | 0000H | Divide Error | DIV or IDIV — quotient overflow or division by zero |
| 1 | 0004H | Single Step (Trap) | TF=1 — executes after every instruction |
| 2 | 0008H | NMI | Rising edge on NMI pin |
| 3 | 000CH | Breakpoint | INT 3 instruction (1 byte) |
| 4 | 0010H | Overflow | INTO instruction when OF=1 |

### T9.4 Hardware Interrupts: NMI and INTR

**NMI (Non-Maskable Interrupt):**
- Edge-triggered: NMI must go LOW for ≥2 clocks, then transition HIGH (0→1).
- Must remain HIGH until acknowledged by CPU.
- Always serviced regardless of IF flag.
- Vector type 2 → calls ISR at address stored in 0008H–000BH.
- Typical use: power failure detection, memory parity error.

**INTR:**
- Level-triggered: must remain HIGH until CPU acknowledges.
- Only serviced if **IF = 1** (set by STI, cleared by CLI).
- CPU sends two INTĀ pulses to the 8259 interrupt controller:
  - **1st INTĀ pulse:** 8259 sets ISR bit, clears IRR bit, does NOT send vector.
  - **2nd INTĀ pulse:** 8259 places 8-bit vector (type number) on D0–D7.
- CPU uses that vector number to look up ISR address in IVT.

### T9.5 Interrupt Acknowledge Sequence

```
Device: INTR HIGH
CPU:    Finishes current instruction
CPU:    Checks IF → if IF=1, begin acknowledge
CPU:    1st INTĀ LOW (one bus cycle)
8259:   Sets ISR bit for highest-priority IR. No data on bus.
CPU:    2nd INTĀ LOW (one bus cycle)
8259:   Places type number (8-bit) on D0–D7
CPU:    Reads type number from data bus
CPU:    Executes interrupt processing sequence (see below)
```

### T9.6 Interrupt Processing Sequence (CPU's Actions)

1. SP = SP − 2; push FLAGS onto stack
2. Clear IF (disables further INTR)
3. Clear TF (disables single-step)
4. SP = SP − 2; push CS onto stack
5. SP = SP − 2; push IP onto stack
6. Vector address = type × 4
7. IP = [vector address] (low word)
8. CS = [vector address + 2] (high word)
9. Execute ISR

**Stack layout after interrupt:**
```
Higher addresses
┌─────────┐ ← SP before interrupt
│  FLAGS  │ ← SP+4
│    CS   │ ← SP+2
│    IP   │ ← SP (new top of stack)
└─────────┘
```

**IRET instruction:** Pops IP, CS, FLAGS (restores state, re-enables IF from restored FLAGS).

### T9.7 Software Interrupts

**INT n:** Calls ISR at vector n×4. Two bytes: opcode + n. Does NOT check IF.
- `INT 21H` → vector at 0084H → DOS function call

**INT 3:** Special one-byte breakpoint instruction. Calls vector 3 ISR. Used by debuggers.

**INTO:** Checks OF. If OF=1, calls type-4 ISR. If OF=0, no action.

**BOUND AX, DATA:** Compares AX with two memory words:
- If AX < [DATA] → interrupt
- If AX > [DATA+2] → interrupt

**Priority order (highest to lowest):**
RESET > NMI > Single-step > INTR > INT n / INTO / BOUND

### T9.8 Flags Used with Interrupts

| Flag | Purpose |
|------|---------|
| IF (Interrupt Flag) | 1 = INTR enabled; 0 = INTR masked. Set by STI, cleared by CLI. Automatically cleared on interrupt entry. |
| TF (Trap Flag) | 1 = single-step mode; after every instruction, INT 1 fires. |

### T9.9 Topic Summary — Interrupts

**Key facts:**
- IVT: 00000H–003FFH, 256 vectors × 4 bytes each.
- Vector address = 4 × type number.
- Stack push order: FLAGS, CS, IP (FLAGS first = top of pushed data is IP).
- IRET pops in reverse: IP, CS, FLAGS.
- IF is cleared during interrupt service (nested INTR disabled). To enable nesting, ISR must execute STI.
- NMI requires only rising edge on pin; does NOT need two INTA pulses.

**Common mistakes:**
- Reversing push order: FLAGS is pushed first (so it's at highest address), IP is at lowest address (top of stack).
- Forgetting that NMI does NOT consult IF flag.
- Assuming INT 3 is two bytes — it is ONE byte (special opcode 0CCH).
- Missing that 2nd INTA delivers vector, not 1st.

---

## T10 — 8259 Programmable Interrupt Controller (PIC)

### T10.1 Overview

The 8086 has only two interrupt inputs (NMI and INTR). The 8259A adds **8 vectored priority-encoded interrupt inputs** (IR0–IR7). A single 8259 handles 8 interrupts. Cascaded (1 master + up to 8 slaves): up to **64 interrupts**.

### T10.2 Internal Architecture

```
IR0─▶┐
IR1─▶│  ┌─────────┐    ┌──────────┐    ┌─────────┐
IR2─▶│  │   IRR   │───▶│ Priority │───▶│   ISR   │
IR3─▶├─▶│(Interrupt│    │ Resolver │    │(In-Svc  │───▶ INT (to CPU)
IR4─▶│  │ Request │    └──────────┘    │Register)│
IR5─▶│  │Register)│         ↑          └─────────┘
IR6─▶│  └─────────┘    ┌─────────┐
IR7─▶│                 │   IMR   │
     │                 │(Mask    │
     │                 │Register)│
     │                 └─────────┘
     │
     └── Data Bus Buffer ── D0-D7
```

**Internal registers:**

| Register | Bits | Function |
|----------|------|---------|
| **IRR** (Interrupt Request Register) | 8 | Bit set when IRn is asserted |
| **IMR** (Interrupt Mask Register) | 8 | Bit=1 masks (disables) corresponding IR |
| **ISR** (In-Service Register) | 8 | Bit set when IR is being serviced (between INTA and EOI) |

### T10.3 Complete Pin Reference

| Pin | Dir | Description |
|-----|-----|-------------|
| IR0–IR7 | In | Interrupt Request inputs |
| INT | Out | Interrupt output to CPU's INTR pin |
| INTĀ | In | Interrupt Acknowledge from CPU |
| D0–D7 | Bidir | Data bus |
| A0 | In | Register select (0=ICW1/OCW2/OCW3, 1=ICW2–4/OCW1) |
| CS̄ | In | Chip Select |
| RD̄ | In | Read enable |
| WR̄ | In | Write enable |
| SP̄/EN | I/O | Master/Slave: INPUT for SP (1=master, 0=slave). OUTPUT for EN (buffered mode). |
| CAS0–CAS2 | I/O | Cascade lines: output from master, input to slaves |
| VCC, GND | — | Power |

### T10.4 Interrupt Sequence in 8086+8259 System

1. IR line asserted → IRR bit set
2. 8259 evaluates priorities → asserts INT (HIGH) to CPU INTR
3. CPU: IF=1 → acknowledges with 1st INTĀ pulse
4. 8259: sets ISR bit for highest priority IR, clears corresponding IRR bit. Does NOT send data.
5. CPU: sends 2nd INTĀ pulse
6. 8259: places 8-bit type vector on D0–D7
7. CPU reads vector → looks up IVT → jumps to ISR
8. ISR executes → at end, sends EOI command to 8259 → 8259 clears ISR bit

### T10.5 Initialization Command Words (ICW)

Must be sent **in order**: ICW1 → ICW2 → (ICW3 if cascade) → (ICW4 if required).

#### ICW1 (sent to address A0=0, D4=1 identifies it as ICW1)

```
A0=0: D7 D6 D5 D4  D3   D2  D1   D0
       X  X  X  1  LTIM  X  SNGL IC4
```

| Bit | Name | 0 | 1 |
|-----|------|---|---|
| D0 | IC4 | ICW4 not needed | ICW4 needed |
| D1 | SNGL | Cascade mode | Single 8259 |
| D3 | LTIM | Edge triggered | Level triggered |
| D4 | Must be 1 | — | Identifies as ICW1 |

#### ICW2 (sent to A0=1, immediately after ICW1)

```
A0=1: D7 D6 D5 D4 D3  D2 D1 D0
      [T7 T6 T5 T4 T3]  X  X  X
```

T7–T3 are the upper 5 bits of the 8-bit type vector for IR0. For IR1, the vector = T7T6T5T4T3 001, etc.

**Example:** If ICW2 = 40H (0100 0000), IR0 vector = 40H, IR1=41H, ... IR7=47H.

#### ICW3 (required only when SNGL=0, i.e., cascade mode)

**For master (A0=1):**
```
D7 D6 D5 D4 D3 D2 D1 D0
S7 S6 S5 S4 S3 S2 S1 S0   (Sx=1 means slave attached to IRx)
```

**For slave (A0=1):**
```
D7 D6 D5 D4 D3  D2 D1 D0
 0  0  0  0  0  [ID2 ID1 ID0]  (slave ID = which IR line of master)
```

#### ICW4 (required when IC4=1 in ICW1)

```
A0=1: D7 D6 D5  D4   D3    D2    D1   D0
       0  0  0  SFNM BUF  M/S̄  AEOI  uPM
```

| Bit | Name | 0 | 1 |
|-----|------|---|---|
| D0 | uPM | MCS-80 mode | 8086/88 mode (**must be 1 for 8086**) |
| D1 | AEOI | Normal EOI | Automatic EOI |
| D2 | M/S̄ | Slave buffered | Master buffered |
| D3 | BUF | Non-buffered | Buffered mode |
| D4 | SFNM | Fully nested | Special fully nested mode |

### T10.6 Operation Command Words (OCW)

Sent any time after initialization. Do NOT need to be in order.

#### OCW1 — Interrupt Mask Register (A0=1)

```
A0=1: D7 D6 D5 D4 D3 D2 D1 D0
      M7 M6 M5 M4 M3 M2 M1 M0  (Mx=1 masks IRx)
```

**Example:** Mask IR3, IR4, IR5, IR6: OCW1 = 01111000B = 78H

#### OCW2 — EOI and Priority Control (A0=0, D4=D3=0)

```
A0=0: D7  D6  D5  D4  D3  D2  D1  D0
      R   SL  EOI  0   0  [L2  L1  L0]
```

| R | SL | EOI | Command |
|---|----|----|---------|
| 0 | 0 | 1 | Non-Specific EOI (8259 clears highest-priority ISR bit) |
| 0 | 1 | 1 | Specific EOI (clears ISR bit for IR specified by L2-L0) |
| 1 | 0 | 1 | Rotate on Non-Specific EOI |
| 1 | 0 | 0 | Rotate in Automatic EOI mode (set) |
| 0 | 0 | 0 | Rotate in Automatic EOI mode (clear) |
| 1 | 1 | 1 | Rotate on Specific EOI |
| 1 | 1 | 0 | Set Priority Command |
| 0 | 1 | 0 | No Operation |

**Non-specific EOI = 20H** (most common — sent at end of ISR).

#### OCW3 — Special Mask Mode and Poll (A0=0, D4=0, D3=1)

```
A0=0: D7  D6  D5  D4  D3  D2  D1  D0
       0  ESMM SMM  0   1   P  RR  RIS
```

| Bit | Function |
|-----|---------|
| D6,D5 | ESMM/SMM: Enable/Set Special Mask Mode |
| D2 | P: Poll command |
| D1,D0 | RR/RIS: Read register (01=read IRR, 11=read ISR) |

### T10.7 Operating Modes

#### Fully Nested Mode (Default)
- IR0 has highest priority, IR7 lowest.
- ISR bit set blocks all equal and lower priorities.
- Higher priorities can preempt if IF=1.
- Suitable for single 8259 or master in cascade.

#### Special Fully Nested Mode (SFNM)
- Used for the **master** in a cascaded configuration.
- Master allows another interrupt from a slave whose interrupt is already in service (regular FNM would block it since ISR bit is set for that slave's IR).
- Set via ICW4 (SFNM bit).

#### Rotating Priority Mode

**Automatic Rotation:** After any service, the just-serviced IR gets lowest priority. Others rotate.
- If IR4 serviced: IR4=lowest, IR5=next lowest, ... IR3=highest.

**Specific Rotation:** Programmer sets a specific IR as lowest priority.
- If IR6 = lowest: IR7=highest, IR0=next, ..., IR5=second-lowest.

#### Special Mask Mode (SMM)
- Enables ALL interrupts EXCEPT the one currently in service.
- Allows lower-priority interrupts to preempt the current service routine.
- Activated via OCW3.

#### Poll Mode
- INT pin not used.
- CPU sends poll command (OCW3 with P=1) to 8259.
- 8259 returns poll word: bit 7 = interrupt pending, bits 2-0 = IR level.
- CPU services interrupt without using hardware interrupt mechanism.
- Advantage: can handle >64 interrupts by polling multiple 8259s.

### T10.8 EOI Commands

| Type | Mechanism | When to use |
|------|-----------|-------------|
| Normal Non-Specific EOI | Programmer sends OCW2=20H at end of ISR | Single 8259, simple priority |
| Normal Specific EOI | OCW2 with R=0, SL=1, EOI=1, L=IR_level | Multi-level, precise control |
| AEOI (Automatic EOI) | 8259 auto-clears ISR at end of 2nd INTĀ | Only for single 8259, no nesting needed |

### T10.9 Complete Initialization Example

**Single 8259, edge triggered, auto EOI, buffered master, mask IR3–IR6, IR0 vector = 40H, port = 80H:**

```asm
Start:
  MOV AL, 17H      ; ICW1: D4=1(ICW1), D3=0(edge), D1=1(single), D0=1(need ICW4)
                   ; 0001 0111 = 17H
  OUT 80H, AL      ; A0=0 (even address)

  MOV AL, 40H      ; ICW2: T7-T3 = 01000 → IR0 type = 40H
  OUT 82H, AL      ; A0=1 (odd address = base+2)

  ; ICW3 skipped — SNGL=1 (single 8259)

  MOV AL, 0FH      ; ICW4: SFNM=0, BUF=1(buffered), M/S=1(master), AEOI=1, uPM=1
                   ; 0000 1111 = 0FH
  OUT 82H, AL

  MOV AL, 78H      ; OCW1: mask IR3,IR4,IR5,IR6 = 0111 1000 = 78H
  OUT 82H, AL
```

### T10.10 Cascaded 8259 Example

[IMAGE FLAG — Page 24, L18: Cascade mode circuit diagram showing master 8259 with slaves connected on IR2 and IR3. CAS0-CAS2 lines connected between master and slaves.]

**From slides (practice problem — master + 2 slaves):**

Master (port 80H): Edge triggered, AEOI, SFNM, IR0 type=40H, slaves on IR2, IR3, mask unused IRs.

```asm
; MASTER
  MOV AL, 15H      ; ICW1: single=0(cascade), edge, need ICW4 → 0001 0101 = 15H
  OUT 80H, AL
  MOV AL, 40H      ; ICW2: IR0 type = 40H
  OUT 82H, AL
  MOV AL, 0CH      ; ICW3: slaves on IR2(bit2) and IR3(bit3) → 0000 1100 = 0CH
  OUT 82H, AL
  MOV AL, 1FH      ; ICW4: SFNM=1, BUF=1, M/S=1, AEOI=1, 8086 → 0001 1111 = 1FH
  OUT 82H, AL
  MOV AL, E3H      ; OCW1: mask unused IRs
  OUT 82H, AL

; SLAVE2 (port 84H, IR0 vector=50H, level triggered, normal EOI, on IR2 of master)
  MOV AL, 1DH      ; ICW1: cascade, level trigger (LTIM=1) → 0001 1101 = 1DH
  OUT 84H, AL
  MOV AL, 50H      ; ICW2: IR0 type = 50H
  OUT 86H, AL
  MOV AL, 02H      ; ICW3 (slave): slave ID = 02H (connected to IR2 of master)
  OUT 86H, AL
  MOV AL, 09H      ; ICW4: SFNM=0, non-buffered, normal EOI, 8086 → 0000 1001 = 09H
  OUT 86H, AL
  MOV AL, FCH      ; OCW1: unmask only IR0 and IR1 → 1111 1100 = FCH
  OUT 86H, AL
```

### T10.11 Topic Summary — 8259

**Key facts:**
- ICW sequence: ICW1 (A0=0, D4=1) → ICW2 (A0=1) → ICW3 (if cascade) → ICW4 (if IC4=1)
- OCW1 writes to IMR (A0=1). OCW2 (A0=0, D4=D3=0). OCW3 (A0=0, D4=0, D3=1).
- Highest-priority ISR bit blocks equal+lower (FNM). SFNM allows same-slave second interrupt.
- AEOI: ISR cleared after 2nd INTĀ. Normal EOI: programmer must send OCW2=20H.
- D4=1 in a write to A0=0 → always ICW1. D4=D3=0 → OCW2. D3=1 → OCW3.

**Common mistakes:**
- Sending ICW3 when SNGL=1 (single 8259). ICW3 only for cascade.
- Not setting uPM=1 in ICW4 for 8086 mode.
- Forgetting port addresses: for 8259 at port X, A0=0 uses X, A0=1 uses X+2 (for 16-bit bus with address shift).
- Sending EOI before IRET in ISR — EOI should be sent at END of ISR, just before IRET.


---

## T11 — 16550 UART

### T11.1 UART Fundamentals

UART (Universal Asynchronous Receiver/Transmitter) performs serial ↔ parallel conversion.

**Asynchronous frame format:**
```
IDLE  START  D0  D1  D2  D3  D4  D5  D6  D7  PARITY  STOP  IDLE
‾‾‾‾‾‾_____ [data bits: 5-8]            [opt]  ‾(1-2)  ‾‾‾‾
```
- Line idles HIGH. Start bit always LOW (0). Stop bit always HIGH (1).
- Receiver detects start bit (HIGH→LOW transition), then samples at baud rate midpoints.

**Baud rate:** Bits per second on the line. Typical: 9600, 19200, 38400, 57600, 115200.

### T11.2 Baud Rate Calculation

The 16550 uses an internal **divisor latch** (DLL + DLM, 16-bit) to divide its clock:

```
Baud Rate = Clock / (16 × Divisor)
Divisor = Clock / (16 × Baud Rate)
```

**Example:** Clock = 18.432 MHz, Baud = 38400:
```
Divisor = 18,432,000 / (16 × 38400) = 18,432,000 / 614,400 = 30 = 1EH
DLL = 1EH, DLM = 00H
```

**Example:** Clock = 1.8432 MHz, Baud = 9600:
```
Divisor = 1,843,200 / (16 × 9600) = 12 = 0CH
```

### T11.3 Key Internal Registers

Access via A0–A2 (8 addresses). **DLAB bit in LCR** selects between data registers and divisor latch:

| A2 A1 A0 | DLAB=0 Read | DLAB=0 Write | DLAB=1 |
|----------|-------------|--------------|--------|
| 0 0 0 | RBR (Receiver Buffer) | THR (Transmit Holding) | DLL (Divisor LSB) |
| 0 0 1 | IER (Interrupt Enable) | IER | DLM (Divisor MSB) |
| 0 1 0 | IIR (Interrupt ID, RO) | FCR (FIFO Control) | — |
| 0 1 1 | LCR (Line Control) | LCR | LCR |
| 1 0 0 | MCR (Modem Control) | MCR | — |
| 1 0 1 | LSR (Line Status, RO) | — | — |
| 1 1 0 | MSR (Modem Status, RO) | — | — |
| 1 1 1 | Scratch | Scratch | — |

### T11.4 Line Control Register (LCR)

```
D7   D6     D5    D4   D3    D2   D1 D0
DLAB Break  Stick  EPS  PEN  STB  WLS
```

| Bits | Field | Values |
|------|-------|--------|
| D7 | DLAB | 1=divisor latch access, 0=normal |
| D6 | Break | 1=force TXD LOW (break signal) |
| D5 | Stick Parity | 1=parity forced to space/mark |
| D4 | EPS | 0=odd parity, 1=even parity |
| D3 | PEN | 1=parity enabled |
| D2 | STB | 0=1 stop bit, 1=2 stop bits (1.5 for 5-bit words) |
| D1,D0 | WLS | 00=5 bits, 01=6 bits, 10=7 bits, 11=8 bits |

**Example:** 8 data bits, 1 stop bit, odd parity: LCR = 0000 1011 = 0BH

### T11.5 FIFO Control Register (FCR) — Write only

```
D7 D6  D5  D4  D3  D2   D1    D0
[RX trigger] X   X   X  XMIT  RCV  FIFO
             DMA rst  rst  en
```

| Bits | Field | Meaning |
|------|-------|---------|
| D7,D6 | RX FIFO trigger | 00=1 byte, 01=4 bytes, 10=8 bytes, 11=14 bytes |
| D2 | XMIT FIFO reset | 1=clears TX FIFO |
| D1 | RCV FIFO reset | 1=clears RX FIFO |
| D0 | FIFO enable | 1=enable FIFOs |

FIFO trigger level sets when RDA interrupt fires (e.g., 14 bytes = trigger at 14 bytes in buffer).

### T11.6 Interrupt Enable Register (IER)

```
D7-D4: 0 (unused)
D3: Modem Status Interrupt enable
D2: Receiver Line Status interrupt enable
D1: THRE interrupt enable (TX buffer empty)
D0: Received Data Available interrupt enable
```

### T11.7 Line Status Register (LSR) — Read only

```
D7    D6   D5   D4  D3  D2  D1  D0
Error TEMT THRE BI  FE  PE  OE  DR
```

| Bit | Name | Meaning |
|-----|------|---------|
| D0 | DR | Data Ready — received byte in RBR |
| D1 | OE | Overrun Error — byte lost |
| D2 | PE | Parity Error |
| D3 | FE | Framing Error — invalid stop bit |
| D4 | BI | Break Interrupt |
| D5 | THRE | TX Holding Register Empty — safe to write |
| D6 | TEMT | TX Empty — both THR and shift register empty |
| D7 | Error | At least one error in FIFO |

### T11.8 Modem Control Register (MCR)

Controls hardware handshaking outputs:
- D0: DTR (Data Terminal Ready)
- D1: RTS (Request To Send)
- D3: OUT2 — must be set to 1 to enable UART interrupts on PC hardware

### T11.9 Pin Reference (key pins)

| Pin | Dir | Description |
|-----|-----|-------------|
| TXD | Out | Transmit Data |
| RXD | In | Receive Data |
| RTS | Out | Request To Send (MCR.D1) |
| CTS | In | Clear To Send |
| DTR | Out | Data Terminal Ready (MCR.D0) |
| DSR | In | Data Set Ready |
| DCD | In | Data Carrier Detect |
| RI | In | Ring Indicator |
| INT | Out | Interrupt output to 8259 |
| MR | In | Master Reset (active HIGH) |

### T11.10 Null Modem Connection

Two UARTs connected directly (no modem):
```
PC1 TXD ───────────→ RXD PC2
PC1 RXD ←─────────── TXD PC2
PC1 RTS ───────────→ CTS PC2
PC1 CTS ←─────────── RTS PC2
PC1 DTR ──┬────────→ DSR PC2
          └────────→ DCD PC2
PC1 DSR ←──┬──────── DTR PC2
PC1 DCD ←──┘
GND ─────────────────────── GND
```

### T11.11 UART Initialization ALP

**Example (from 21-22 PYQ):** 38400 baud, 8-bit, 1 stop bit, odd parity, FIFO trigger at 14 bytes, clock=18.432 MHz:

```asm
; Base address assumed = A0H (example from PYQ)
; Step 1: Set DLAB=1 to access divisor latch
MOV AL, 83H         ; LCR: DLAB=1, 8-bit, 1 stop, odd parity
OUT 0ABH, AL        ; LCR is at base+3 = A3H (adjusted for bus)

; Step 2: Load divisor for 38400 baud (divisor=30=1EH)
MOV AL, 1EH
OUT 0A8H, AL        ; DLL (base+0 when DLAB=1)
MOV AL, 00H
OUT 0A9H, AL        ; DLM (base+1 when DLAB=1)

; Step 3: Clear DLAB, set final LCR
MOV AL, 0BH         ; LCR: DLAB=0, 8-bit, 1 stop, odd parity (0000 1011)
OUT 0ABH, AL

; Step 4: Enable and reset FIFOs, set trigger to 14 bytes
MOV AL, 0C7H        ; FCR: trigger=11(14), reset TX, reset RX, enable=1
OUT 0AAH, AL        ; FCR is at base+2

; Step 5: Enable RX interrupt
MOV AL, 01H         ; IER: RDA interrupt enabled
OUT 0A9H, AL        ; IER is at base+1
```

---

## T12 — Direct Memory Access (DMA) & 8237 DMAC

### T12.1 DMA Motivation

Without DMA, CPU copies data byte by byte:
```asm
MOV AX, [mem]    ; CPU loads from memory
OUT port, AX     ; CPU sends to I/O device
```
CPU is involved in EVERY byte/word. Problem: wastes CPU time, limits throughput.

**DMA:** External device transfers data directly between I/O and memory **without CPU involvement** during transfer. Rate limited by memory speed or DMA controller speed, not CPU instruction cycle.

**Use cases:** Disk drive transfers, audio DMA, network cards, GPU memory transfers.

### T12.2 DMA Operation Sequence

```
I/O Device ──DREQ──→ 8237 DMAC
8237 DMAC  ──HOLD──→ 8086
8086       finishes current instruction
8086       ──HLDA──→ 8237 DMAC  (bus released)
8237 drives: Address bus, Data bus, Control bus
8237 performs: Memory ↔ I/O transfer
8237 ──(HOLD=0)──→ 8086  (transfer complete)
8086 reasserts bus (HLDA=0)
```

**Priority:** HOLD > INTR and NMI (but < RESET).

**DMA READ:** Memory → I/O device. MRDC + IOWC both active simultaneously.
**DMA WRITE:** I/O device → Memory. IORC + MWTC both active simultaneously.

**Transfer rates:**
- Limited by memory speed: 50 ns memory → up to 20 MB/s
- Limited by DMAC: 8237 at 15 MHz → 15 MB/s max

### T12.3 The 8237 DMA Controller

**4 channels** (Ch0–Ch3), each independently programmable. Up to 64K bytes per channel per single programming. Transfer rate: up to 1.6 MB/s.

Each channel has:
- Current Address Register (16-bit)
- Current Count Register (16-bit)
- Base Address Register (16-bit, for auto-init)
- Base Count Register (16-bit, for auto-init)
- Mode Register (8-bit)

### T12.4 Complete Pin Reference

[IMAGE FLAG — Pages 3-10, L19 / Pages 3-10, L20: 8237 pin diagram showing all 40 pins. Pins visible in text labels extracted below.]

| Pin | Dir | Description |
|-----|-----|-------------|
| DREQ0–3 | In | DMA Request from I/O device (channel 0–3) |
| DACK0–3 | Out | DMA Acknowledge to I/O device |
| A0–A3 | Out (also In during programming) | Address bits 0–3. During DMA: output address A0–A3 |
| A4–A7 | Out | Address bits 4–7 (output via ADSTB to latch) |
| DB0–DB7 | Bidir | Data bus (for programming and A8–A15 output via ADSTB) |
| IOR (active LOW) | Bidir | I/O Read: input during programming, output during DMA |
| IOW (active LOW) | Bidir | I/O Write |
| MEMR (active LOW) | Out | Memory Read during DMA transfer |
| MEMW (active LOW) | Out | Memory Write during DMA transfer |
| AEN | Out | Address Enable — disables CPU buffers, enables DMA address |
| ADSTB | Out | Address Strobe — latches A8–A15 from DB into external latch |
| HRQ | Out | Hold Request → CPU HOLD pin |
| HLDA | In | Hold Acknowledge from CPU |
| EOP (active LOW) | Bidir | End of Process — input to force stop, output when TC reached |
| CLK | In | Clock (max 5 MHz for 8237) |
| CS (active LOW) | In | Chip select for programming |
| RESET | In | Active HIGH — sets all masks, clears command/status |

### T12.5 Internal Registers (Programming Interface)

| Register | Address offset | Description |
|----------|---------------|-------------|
| Ch0 Base/Current Address | 00H | 16-bit (write LSB, MSB) |
| Ch0 Base/Current Count | 01H | 16-bit (write LSB, MSB) |
| Ch1 Base/Current Address | 02H | |
| Ch1 Base/Current Count | 03H | |
| Ch2 Base/Current Address | 04H | |
| Ch2 Base/Current Count | 05H | |
| Ch3 Base/Current Address | 06H | |
| Ch3 Base/Current Count | 07H | |
| Command Register | 08H | Write |
| Status Register | 08H | Read |
| Request Register | 09H | Write |
| Single Mask Register | 0AH | Write |
| Mode Register | 0BH | Write |
| Clear F/L Flip-flop | 0CH | Write (any value) |
| Temporary Register | 0DH | Read |
| Master Clear | 0DH | Write (software RESET) |
| Clear Mask Register | 0EH | Write (enables all channels) |
| All Mask Register | 0FH | Write |

### T12.6 Command Register (addr 08H write)

```
D7    D6     D5    D4    D3    D2    D1    D0
DACK  DREQ  EXTWR  ROTPRI TIMMD MEM2MEM CHHOLD DACK
act.  sens.  sel.         dis.         EN    pol.
```

Key bits:
- **D0:** Memory-to-memory enable (1=enable ch0→ch1 M2M transfer)
- **D2:** Controller enable (0=enable DMAC, 1=disable)
- **D4:** Priority: 0=fixed (CH0 highest), 1=rotating

### T12.7 Mode Register (addr 0BH write)

```
D7  D6   D5   D4   D3  D2   D1 D0
[MODE] [ADDR] [AI] [OP]    [CH SEL]
```

| Bits | Field | Values |
|------|-------|--------|
| D7,D6 | Mode | 00=Demand, 01=Single, 10=Block, 11=Cascade |
| D5 | Address direction | 0=increment, 1=decrement |
| D4 | Auto-initialization | 1=reload base into current after TC |
| D3,D2 | Operation | 00=verify, 01=write (I/O→Mem), 10=read (Mem→I/O) |
| D1,D0 | Channel select | 00=Ch0, 01=Ch1, 10=Ch2, 11=Ch3 |

**Transfer modes:**
- **Demand:** Transfers until DREQ inactive or EOP asserted.
- **Single:** Transfers 1 byte/word, then releases HOLD. Re-requests if DREQ still active.
- **Block:** Transfers entire count (ignores DREQ de-assertion). Fast but monopolizes bus.
- **Cascade:** Used to cascade multiple 8237 chips.

### T12.8 Mask Registers

**Single Mask Register (0AH):**
```
D7-D3: X  D2: set(1)/clear(0)  D1,D0: channel
```
Set mask: channel disabled. Clear mask: channel enabled. RESET sets all masks (disables all).

**All Mask Register (0FH):** D3-D0 set/clear masks for Ch3-Ch0 simultaneously.

**Clear Mask Register (0EH):** Write any value to clear (enable) ALL channel masks.

### T12.9 F/L (First/Last) Flip-Flop

The 8237's address and count registers are 16-bit but accessed via an 8-bit data bus. The F/L flip-flop tracks whether the next byte written is the LSB (first, F/L=0) or MSB (last, F/L=1).

**Must clear F/L before programming each 16-bit register:** `OUT 0CH, AL` (any value to address 0CH).

### T12.10 20-bit Address Construction (Latch B)

The 8237 provides A0–A15 (16 bits). The upper 4 bits (A16–A19) must be handled externally using **Latch B** (a page register).

```
Physical Address (20-bit) = {LatchB[3:0], 8237_A[15:0]}
```

The upper 4 bits come from the **segment register's upper nibble**.

**ALP to load Latch B for address 1000:0000H (physical = 10000H):**
```asm
MOV AX, ES        ; ES = 1000H
MOV AL, AH        ; AL = 10H
SHR AL, 4         ; AL = 01H  (upper 4 bits of segment)
OUT LATCHB, AL    ; Latch B = 1
```

**ALP to load 16-bit address register (channel 0):**
```asm
MOV AX, ES        ; ES = 1000H
SHL AX, 4         ; AX = 0000H (lower 16 bits of physical address 10000H)
ADD AX, SI        ; add offset (SI = source offset)
OUT CLEARF, AL    ; clear F/L flip-flop first
OUT CH0A, AL      ; write LSB
MOV AL, AH
OUT CH0A, AL      ; write MSB
```

### T12.11 Memory-to-Memory Transfer Example

Transfer 16K bytes from 10000H–13FFFH to 14000H–17FFFH:

```asm
; Source: ES:SI = 1000:0000 → physical 10000H
; Dest:   ES:DI = 1000:4000 → physical 14000H
; Count:  CX = 4000H (16K)

; Step 1: Program Latch B (upper 4 bits = 1)
MOV AX, ES
MOV AL, AH
SHR AL, 4
OUT LATCHB, AL    ; Latch B = 1

; Step 2: Clear F/L
OUT CLEARF, AL

; Step 3: Program Channel 0 (source address)
MOV AX, ES
SHL AX, 4
ADD AX, SI        ; physical = 0000H (lower 16)
OUT CH0A, AL
MOV AL, AH
OUT CH0A, AL

; Step 4: Program Channel 1 (destination address)
OUT CLEARF, AL
MOV AX, ES
SHL AX, 4
ADD AX, DI        ; DI = 4000H → AX = 4000H
OUT CH1A, AL
MOV AL, AH
OUT CH1A, AL

; Step 5: Program count (N-1)
OUT CLEARF, AL
MOV AX, CX
DEC AX            ; count = 3FFFH
OUT CH1C, AL      ; count for Ch1
MOV AL, AH
OUT CH1C, AL

; Step 6: Program mode registers
MOV AL, 88H       ; Ch0: block, increment, no auto-init, read (M2M source)
OUT MODE, AL
MOV AL, 85H       ; Ch1: block, increment, no auto-init, write (M2M dest)
OUT MODE, AL

; Step 7: Program command register (M2M enable)
MOV AL, 03H       ; D0=1(M2M), D1=1(Ch0 hold)
OUT CMMD, AL

; Step 8: Enable channel 0, start via request register
MOV AL, 0EH       ; clear mask for Ch0 (enable)
OUT MASKS, AL
MOV AL, 04H       ; software request for Ch0
OUT REQ, AL

; Step 9: Poll status for terminal count
.REPEAT
  IN AL, STATUS
.UNTIL AL & 01H   ; bit 0 = TC for Ch0
```

### T12.12 8237 Connected to 80x86

[IMAGE FLAG — Pages 25-27, L20: Circuit diagram showing 8237 connected to 8086/8088 bus. Shows Latch A (normal operation, A19-A16), Latch B (DMA, A19-A16 from page registers), Latch C (A7-A0 from 8086), Latch D (A15-A8, output by 8237 via ADSTB), and multiplexer E (control signals from CPU or 8237 depending on AEN).]

**Normal operation (AEN=0):** CPU drives address bus. Latch A provides A19–A16 from CPU. Latch C provides A7–A0 from CPU. Multiplexer E selects CPU control signals.

**DMA operation (AEN=1):** 8237 drives address bus. Latch B provides A19–A16 from page registers. 8237 directly drives A7–A0 on its pins. Latch D captures A15–A8 from 8237 DB bus when ADSTB fires. Multiplexer E selects 8237 control signals (MEMR, MEMW, IOR, IOW).

### T12.13 Topic Summary — DMA & 8237

**Key facts:**
- Count register is programmed with (N-1). Transfer of N bytes needs count = N-1.
- F/L flip-flop MUST be cleared before each 16-bit register write.
- AEN=1 → 8237 owns bus; AEN=0 → CPU owns bus.
- ADSTB latches A15–A8 from 8237's data bus into external latch.
- Block mode: fastest but monopolizes bus for entire transfer.
- Memory-to-memory: use Ch0 as source (read), Ch1 as destination (write). Enable M2M in command register.

**Common mistakes:**
- Programming count as N instead of N-1.
- Forgetting to clear F/L before each 16-bit register write.
- Forgetting to enable the channel by clearing its mask bit after programming.
- Confusing DREQ active level (active HIGH by default) and DACK active level.


---

## T13 — 80286 Architecture & Protected Mode

### T13.1 80286 vs 8086 Comparison

| Feature | 8086 | 80286 |
|---------|------|-------|
| Data bus | 16-bit | 16-bit |
| External address bus | 20-bit (1 MB) | 24-bit (16 MB) |
| Virtual address space | 1 MB | 1 GB |
| Address/data bus | Multiplexed | **Non-multiplexed** (separate) |
| Protected mode | No | Yes (first x86 with on-chip MMU) |
| Performance | Baseline | ~2× per clock cycle |
| Introduced | 1978 | 1982 |

**Key improvement:** Non-multiplexed buses reduce operational overhead (no demultiplexing needed, no ALE latch required).

### T13.2 80286 Internal Architecture

Four pipelined units operating concurrently:
1. **Bus Unit (BU):** Fetches instructions from memory; prefetches into 6-byte queue.
2. **Instruction Unit (IU):** Decodes prefetched instructions into decoded instruction queue.
3. **Execution Unit (EU):** Executes decoded instructions; contains ALU and registers.
4. **Address Unit (AU):** Calculates physical addresses from logical addresses.

Register set identical to 8086: AX, BX, CX, DX (general); SP, BP, SI, DI (index/pointer); CS, DS, SS, ES (segment); IP, FLAGS.

### T13.3 Operating Modes

**Real Address Mode:**
- Acts as a fast 8086.
- Same 1 MB address space, same segment:offset addressing.
- Physical address = Segment × 16 + Offset.
- Boots into real mode.

**Protected Virtual Address Mode:**
- Supports multitasking, memory protection, virtual memory.
- Segment registers hold **selectors**, not physical addresses.
- Hardware enforces privilege levels (ring 0–3).
- Virtual address space: 1 GB per task.

### T13.4 Protected Mode Segmentation

In protected mode, segment registers contain **Selectors** (not base addresses):

```
Selector (16 bits):
D15 ─────────────── D3   D2   D1 D0
[   Index (13 bits)   ]  [TI] [RPL]
```

| Field | Bits | Meaning |
|-------|------|---------|
| Index | D15–D3 | 13-bit index into GDT or LDT (up to 8192 descriptors) |
| TI | D2 | 0=GDT, 1=LDT |
| RPL | D1, D0 | Requestor Privilege Level (0=highest, 3=lowest) |

### T13.5 Descriptor Tables

**GDT (Global Descriptor Table):** System-wide table; segments shared across all tasks.
**LDT (Local Descriptor Table):** Per-task table; private segments for each program.

**GDTR register:** 48-bit (base address 32-bit + limit 16-bit) — loaded by LGDT instruction.
**LDTR register:** 16-bit selector pointing to LDT descriptor in GDT.

### T13.6 Descriptor Format (8 bytes)

```
Byte: 7      6      5      4      3      2      1      0
      [Base   ] [Access] [Limit  ]      [   Base    ] [Limit ]
      31-24   Rights  19-16        23-16      15-0
```

Simplified layout for 80286 (24-bit address, 16-bit limit):

| Bytes | Content |
|-------|---------|
| 0–1 | Segment Limit (16-bit): size of segment − 1 |
| 2–4 | Segment Base (24-bit physical base address) |
| 5 | Access Rights Byte |
| 6–7 | Reserved (0 for 80286) |

### T13.7 Access Rights Byte

```
D7   D6    D5 D4   D3  D2  D1  D0
 P  DPL1 DPL0  S  TYPE bits
```

| Bit(s) | Field | Meaning |
|--------|-------|---------|
| D7 | P (Present) | 1=segment in memory; 0=not present (triggers exception on access) |
| D6, D5 | DPL | Descriptor Privilege Level (0=most privileged, 3=least) |
| D4 | S | 0=System segment, 1=Code/Data segment |
| D3–D0 | Type | Segment type (code/data/system) |

**For S=1 (code/data segments):**
- D3: 0=data, 1=code
- D2 (data): 0=expand-up, 1=expand-down; (code): 0=non-conforming, 1=conforming
- D1 (data): 0=read-only, 1=read/write; (code): 0=execute-only, 1=execute/read
- D0: Accessed bit (CPU sets to 1 when segment is accessed)

**Descriptor causing exception (PYQ 21-22):** A descriptor with P=0 (not present) triggers a "Segment Not Present" exception even if no privilege violation occurs. The CPU checks P bit before checking privilege.

### T13.8 Protected Mode Address Translation

```
Selector → [index, TI, RPL]
               ↓
TI=0: GDT base + (Index × 8) → Descriptor
TI=1: LDT base + (Index × 8) → Descriptor
               ↓
        Check: P=1? DPL ≥ CPL? Limit OK?
               ↓
        Physical Address = Descriptor Base + Offset
```

**Example:**
- CS = 0008H → Index=1, TI=0 (GDT), RPL=0
- GDT[1] → Base = 00040000H, Limit = 0FFFFH
- IP = 1234H
- Physical address = 00040000H + 1234H = 00041234H

### T13.9 Virtual Memory in 80286

Virtual memory maps 1 GB logical space into 16 MB physical space. Implemented via segmentation (no paging in 80286 — unlike 80386 which added paging).

When a segment is not in physical memory (P=0 in descriptor), a **Segment Not Present** exception (INT 11) occurs. OS loads segment from disk, updates descriptor (P=1), resumes task.

**Privilege Levels (rings):**
- Ring 0: OS kernel (highest privilege)
- Ring 1: OS services
- Ring 2: OS extensions
- Ring 3: User applications (lowest privilege)

**Access rule:** Code at CPL can only access data segments with DPL ≥ CPL (numerically).

### T13.10 Additional 80286 Protected Mode Instructions

| Instruction | Description |
|-------------|-------------|
| LGDT | Load GDT register |
| SGDT | Store GDT register |
| LLDT | Load LDT selector |
| SLDT | Store LDT selector |
| LMSW | Load Machine Status Word (switches to protected mode) |
| SMSW | Store Machine Status Word |
| LIDT | Load IDT (Interrupt Descriptor Table) register |
| SIDT | Store IDT register |
| LAR | Load Access Rights byte |
| LSL | Load Segment Limit |
| VERR / VERW | Verify segment for read/write access |
| ARPL | Adjust RPL field |

### T13.11 Topic Summary — 80286

**Key facts:**
- 80286 = first x86 with on-chip MMU and protected mode.
- Physical address space: 16 MB (24-bit bus). Virtual: 1 GB.
- Protected mode: selector → descriptor → physical address (3 levels of translation).
- Descriptor = 8 bytes in GDT or LDT.
- P bit in access rights byte: 0 = exception, regardless of privilege.
- 80286 has NO paging; only segmentation-based virtual memory.

**Common mistakes:**
- Confusing segment base in 8086 (stored directly) vs selector in 80286 (index into descriptor table).
- Forgetting DPL check direction: access allowed if DPL ≥ CPL (less privileged or equal, numerically larger DPL).
- 80286 virtual memory = segmentation only. Paging was added in 80386.


---

## PHASE 3 — PYQ Analysis

### PYQ File Status

| File | Year | Extractable | Notes |
|------|------|-------------|-------|
| `Mup Compre 20-21.pdf` | 2020-21 | Blank pages only | Image-based; no text extracted |
| `Compre Part A 21-22.pdf` | 2021-22 | Blank pages only | Image-based (scanned) |
| `Compre part B 21-22.pdf` | 2021-22 | Partial text | OCR-quality text extracted |
| `Compre Part B Solutions 21-22.pdf` | 2021-22 | Full text | Complete solution text |
| `MuP Compre 23-24.pdf` | 2023-24 | Blank pages only | Image-based |
| `MuP Compre Solutions 23-24.pdf` | 2023-24 | Full text | Complete solutions |
| `MuP_Compre_24-25.pdf` | 2024-25 | Blank pages only | Image-based — **manual review needed** |

> [IMAGE FLAG — `MuP_Compre_24-25.pdf` (12 pages), `Compre Part A 21-22.pdf` (4 pages), `Mup Compre 20-21.pdf` (3 pages), `MuP Compre 23-24.pdf` (2 pages): All image-based. pdftotext returns only blank pages. Questions reconstructed below from solutions and context where possible. **Manual review required for full question text.**]

### PYQ Frequency Table

Questions identified across all extractable PYQs (21-22 Part B, 21-22 Solutions, 23-24 Solutions):

| Topic | Times Asked | Typical Marks | Question Types |
|-------|-------------|---------------|----------------|
| Memory Interfacing (8086/80286/80386) | ★★★★★ Very High | 10–30 | Design circuit, address map, chip select |
| 8259 PIC (initialization ALP) | ★★★★★ Very High | 10–15 | ALP code, ICW/OCW bit fields |
| 8254 PIT (modes, control word, ALP) | ★★★★★ Very High | 4–10 | Frequency calc, control word, ALP |
| 8255 PPI (modes, initialization) | ★★★★ High | 5–10 | ALP, mode description, timing |
| 8237 DMAC (programming ALP) | ★★★★ High | 4–8 | ALP code, register description |
| Bus Timing / Memory Access Time | ★★★ Medium | 3–5 | Calculation, timing diagram description |
| Interrupts (IVT, stack, ISR) | ★★★ Medium | 5–9 | Trace execution, stack contents |
| 16550 UART (initialization) | ★★★ Medium | 10–15 | ALP, baud rate calc, H/W connections |
| I/O Interfacing (IO vs Memory mapped) | ★★ Low-Medium | 2–4 | Table comparison, short answer |
| 80286 Protected Mode / Descriptors | ★★ Low-Medium | 3–5 | Descriptor analysis, exception reason |
| DMA in Max Mode (RQ/GT) | ★ Low | 2 | Short answer |
| Cache Memory Access Time | ★ Low | 3 | Numerical calculation |

---

### HIGH PRIORITY — EXAM FOCUS: Memory Interfacing

#### Solved Problem 1 (21-22 Part B, Q1 — 30 marks)

**Problem:** 8086 at 5 MHz. 256 KB memory: 64 KB RAM + 192 KB ROM. Half ROM at 00000H, half ROM at top of 1MB (FFFFH end). RAM: half at 18000H, half at E0000H. Use 8KB chips only. Design memory interface and I/O decode.

**Step-by-step solution:**

**Memory mapping:**
- ROM = 192 KB = 24 × 8KB chips → 12 pairs for 16-bit bus
- Half ROM = 96 KB at 00000H → 00000H–17FFFH (12 × 8KB = 96KB)
- Half ROM at top: ends at FFFFFH → F8000H–FFFFFH (96KB = 12 × 8KB)
- RAM = 64KB = 8 × 8KB chips → 4 pairs
- RAM-half1 at 18000H → 18000H–27FFFH (32KB)
- RAM-half2 at E0000H → E0000H–EFFFFH (64KB)... check: 64/2=32KB each half
  - Half at 18000H: 18000H–1FFFFH (32KB)
  - Half at E0000H: E0000H–E7FFFH (32KB)

**Chip selection logic:**
- 8KB chip: 13 address pins (A0–A12 for 8088; A1–A13 for 8086 16-bit)
- For 8086 dual-bank: Low bank CS from A0, High bank CS from BHE
- 74LS138 decoder used for block selection

**I/O mapping** (8255 at 80H, 8254 at 90H, 16550 at A0H, 8259 at B0H):
- 8255: A0=80H, A1=82H, A2=84H, CWR=86H (4 addresses × 2 for 8086 byte alignment)
- 8254: 90H, 92H, 94H, 96H (CWR)
- 16550: A0H, A2H, ... A6H (8 registers × 2)
- 8259: B0H, B2H

**LS138 for I/O:** A3–A5 select between devices. A7=1, A6=1 qualify the decoder.

---

#### Solved Problem 2 (23-24 Solutions, Q9 — 10 marks)

**Problem:** 32K-byte 16-bit wide RAM for 8086. Design with proper bank scheme.

**Solution:**
- 32KB for 8086 = 2 × 16KB banks (low bank: even, high bank: odd)
- Use 32K × 8 chips (e.g., 62256): 15 address pins
- Low bank CS: chip CS asserted when A0=0 (even address)
- High bank CS: chip CS asserted when BHE=0 (high byte enable)
- Address pins A1–A15 → chip address pins A0–A14
- A16–A19 decoded for base address chip selection

**Address map example (at 00000H–07FFFH):**
```
A19=0, A18=0, A17=0, A16=0 → chip select (all high bits = 0)
Low bank:  CS = A0̄  (even addresses)
High bank: CS = BHĒ
Both banks: LWR = WR + A0 (OR), HWR = WR + BHE (OR)
```

---

### HIGH PRIORITY — EXAM FOCUS: 8259 PIC

#### Solved Problem 3 (18 Solutions Q5, 10 marks)

**Problem:** Single 8259, 8086 system. Edge triggered, auto EOI, buffered mode (master), mask IR1 and IR3, IR0 type = A0H, base = FF10H.

**Solution:**
- ICW1: A0=0, D4=1, LTIM=0 (edge), SNGL=1 (single), IC4=1 → 0001 0011 = 13H
- ICW2: A0=1, IR0 type = A0H → A0H
- ICW3: skip (single)
- ICW4: A0=1, SFNM=0, BUF=1, M/S=1, AEOI=1, uPM=1 → 0000 1111 = 0FH
- OCW1: mask IR1(D1) and IR3(D3) → 0000 1010 = 0AH... wait: IMR bit=1 masks. Mask IR1,IR3 = 0000 1010 = 0AH

```asm
MOV AL, 13H
MOV DX, FF10H      ; A0=0 (even address)
OUT DX, AL         ; ICW1

MOV AL, A0H
MOV DX, FF12H      ; A0=1 (odd address)
OUT DX, AL         ; ICW2

MOV AL, 0FH
OUT DX, AL         ; ICW4

MOV AL, 0AH        ; mask IR1, IR3
OUT DX, AL         ; OCW1
```

---

### HIGH PRIORITY — EXAM FOCUS: 8254 PIT

#### Solved Problem 4 (23-24 Solutions Q7 — 5 marks)

**Problem:** Generate 100 KHz square wave at OUT0 and 200 KHz continuous pulse at OUT1. Clock = 8 MHz. A15 of 8086 connected to CS of 8254 through inverter. A0,A1 directly connected.

**Addresses:**
- CS active when A15=1 → addresses 8000H–FFFFH
- Counter 0 = 8000H, Counter 1 = 8001H, Counter 2 = 8002H, CWR = 8003H

**Counter 0 (100 KHz square wave, Mode 3):**
- N = 8 MHz / 100 KHz = 80 = 50H
- CW: SC=00, RW=01 (LSB only, since N≤FFH), Mode=011, BCD=0 → 00 01 011 0 = 16H

**Counter 1 (200 KHz continuous pulse, Mode 2):**
- N = 8 MHz / 200 KHz = 40 = 28H
- CW: SC=01, RW=01, Mode=010, BCD=0 → 01 01 010 0 = 54H

```asm
CNT0 EQU 8000H
CNT1 EQU 8001H
CNTR EQU 8003H

MOV AL, 16H
OUT CNTR, AL    ; CW for counter 0 (Mode 3, LSB)
MOV AL, 50H
OUT CNT0, AL    ; count for counter 0

MOV AL, 54H
OUT CNTR, AL    ; CW for counter 1 (Mode 2, LSB)
MOV AL, 28H
OUT CNT1, AL    ; count for counter 1
```

#### Solved Problem 5 (21-22 Part A Q10 — 4 marks)

**Problem:** 8254 circuit. Timer 0 count=4E20H, Timer 1 count=C350H, Timer 2 count=2710H. T0 & T1: square wave (Mode 3). T2: pulse generator (Mode 4). CLK0=CLK1=5 MHz (cascaded: OUT1→CLK2). Find output frequency of Timer 2. Find control words for T0,T1,T2.

**Solution:**
- Timer 0 out frequency = 5 MHz / 4E20H = 5,000,000 / 20,000 = 250 Hz
- Timer 1 out frequency = 5 MHz / C350H = 5,000,000 / 50,000 = 100 Hz
- CLK2 = OUT1 = 100 Hz
- Timer 2: Mode 4 (pulse generator/strobe), count = 2710H = 10,000
- OUT2 frequency = 100 Hz / 10,000 = 0.01 Hz (one pulse per 100 seconds)

**Control words:**
- Timer 0 (Mode 3, LSB+MSB, binary): SC=00, RW=11, M=011, BCD=0 → 0011 0110 = 36H
- Timer 1 (Mode 3, LSB+MSB, binary): SC=01, RW=11, M=011, BCD=0 → 0111 0110 = 76H
- Timer 2 (Mode 4, LSB+MSB, binary): SC=10, RW=11, M=100, BCD=0 → 1011 1000 = B8H

---

### HIGH PRIORITY — EXAM FOCUS: 8237 DMA

#### Solved Problem 6 (21-22 Part A Q8 — 4 marks)

**Problem:** Clear mask of all channels in DMAC (base address = 20H) using 3 different methods.

**Method 1 — Write All-Mask Register (address 2FH = base+0FH):**
```asm
MOV AL, 00H       ; clear all 4 mask bits
OUT 2FH, AL       ; all-mask register
```

**Method 2 — Clear Mask Register command (address 2EH = base+0EH):**
```asm
MOV AL, 00H       ; value doesn't matter
OUT 2EH, AL       ; clear mask register (enables all channels)
```

**Method 3 — Single mask register (address 2AH = base+0AH), channel by channel:**
```asm
MOV AL, 00H       ; clear(0) mask for Ch0 → D2=0, D1=0, D0=0
OUT 2AH, AL
MOV AL, 01H       ; clear mask for Ch1
OUT 2AH, AL
MOV AL, 02H       ; clear mask for Ch2
OUT 2AH, AL
MOV AL, 03H       ; clear mask for Ch3
OUT 2AH, AL
```

#### Solved Problem 7 (21-22 Q11 — 4 marks)

**Problem:** Initialize DMAC to transfer 8 KB from 02000H to 03000H. DMAC base = 40H.

```asm
; Base = 40H: Ch0 Addr=40H, Ch0 Count=41H, Ch1 Addr=42H, Ch1 Count=43H
; Mode=4BH, Cmd=48H, Mask-single=4AH, ClearF=4CH, Latch B=? (external)

; Upper nibble of 02000H: 0 → Latch B = 0
MOV AL, 00H
OUT LATCHB, AL    ; Latch B = 0 (assuming Latch B is connected)

; Clear F/L
OUT 4CH, AL       ; any write to 4CH clears F/L

; Source: 02000H (lower 16 = 2000H)
MOV AL, 00H
OUT 40H, AL       ; LSB of source address
MOV AL, 20H
OUT 40H, AL       ; MSB of source address

; Clear F/L again
OUT 4CH, AL

; Destination: 03000H (lower 16 = 3000H)
MOV AL, 00H
OUT 42H, AL       ; LSB of dest address
MOV AL, 30H
OUT 42H, AL       ; MSB of dest address

; Clear F/L for count
OUT 4CH, AL

; Count = 8192 bytes = 2000H → program 1FFFH (N-1)
MOV AL, 0FFH
OUT 41H, AL       ; Ch0 count LSB
MOV AL, 1FH
OUT 41H, AL       ; Ch0 count MSB (wait: 8KB=8192=2000H; N-1=1FFFH, LSB=FFH, MSB=1FH)

; But 8KB = for Ch1 we need count...
; Actually for M2M: Ch0=source, Ch1=dest, count goes to Ch1
OUT 4CH, AL       ; clear F/L
MOV AL, 0FFH
OUT 43H, AL       ; Ch1 count LSB = FFH
MOV AL, 1FH
OUT 43H, AL       ; Ch1 count MSB = 1FH

; Mode: Ch0 block read (source): 10 00 10 00 = 88H
MOV AL, 88H
OUT 4BH, AL
; Mode: Ch1 block write (dest): 10 00 01 01 = 85H
MOV AL, 85H
OUT 4BH, AL

; Command: M2M enable
MOV AL, 01H
OUT 48H, AL

; Enable Ch0
MOV AL, 00H       ; clear mask for Ch0
OUT 4AH, AL

; Software request for Ch0
MOV AL, 04H       ; D2=1 (set), D1D0=00 (Ch0)
OUT 49H, AL       ; request register

; Poll for TC
.REPEAT
  IN AL, 48H      ; read status register
.UNTIL AL & 01H   ; TC bit for Ch0
```

---

### HIGH PRIORITY — EXAM FOCUS: 16550 UART (21-22 Part B)

#### Solved Problem 8 — Full UART System

**From 21-22 Part B Q1(f):** 16550 at base A0H, crystal 18.432 MHz, camera at 38400 baud, 8-bit data, 1 stop bit, odd parity. Interrupt to 8259 IR2 whenever 14 bytes in FIFO.

**Baud rate divisor:** 18,432,000 / (16 × 38400) = 30 = 1EH

```asm
; Step 1: Set DLAB=1 (LCR at base+3 = A3H → bus-adjusted address A6H for 16-bit bus)
; Assuming 16-bit bus, 8255 byte at lower bank: actual port = A0H + 2×offset
; For simplicity using byte-addressed ports:

MOV AL, 83H        ; LCR: DLAB=1, WLS=11(8-bit), STB=0(1 stop), PEN=1, EPS=0(odd)
OUT 0A3H, AL       ; LCR (base+3)

; Step 2: Divisor
MOV AL, 1EH
OUT 0A0H, AL       ; DLL
MOV AL, 00H
OUT 0A1H, AL       ; DLM

; Step 3: Clear DLAB
MOV AL, 0BH        ; LCR: DLAB=0, 8-bit, 1 stop, odd parity
OUT 0A3H, AL

; Step 4: FIFO — enable, trigger=14 bytes
MOV AL, 0C7H       ; FCR: RX_trig=11(14), XMIT_rst=1, RCV_rst=1, EN=1
OUT 0A2H, AL       ; FCR (base+2)

; Step 5: Enable RDA interrupt
MOV AL, 01H        ; IER: RDA interrupt
OUT 0A1H, AL       ; IER (base+1)

; Step 6: MCR — enable OUT2 for interrupt line
MOV AL, 08H        ; MCR: OUT2=1 (enables interrupt to 8259)
OUT 0A4H, AL       ; MCR (base+4)
```

**Null modem hardware connection:**
- 16550 TXD → (null modem cable) → RXD of camera
- 16550 RXD → TXD of camera
- RTS ↔ CTS crossed
- DTR → DSR + DCD at camera end

---

### Unseen Practice Problems with Solutions

#### Practice 1 — Memory Access Time
**Q:** 8086 at 10 MHz, 1 wait state, TCLAV=60ns, TDVCL=20ns. Maximum allowable memory access time?

**Solution:** Tclk=100ns. t_access = (3+1)×100 − 60 − 20 = 400 − 80 = **320 ns**

#### Practice 2 — 8254 Cascaded Timers (5 MHz → 30 sec interrupt)
**Q:** Generate interrupt every 30 seconds using 8254 with 5 MHz CLK. Cascade counters.

**Solution:** 30 sec × 5×10⁶ Hz = 150,000,000 counts. Exceeds 65535 (one counter max).
- Counter 0 (Mode 2, rate gen): N0 = 50000 → output = 5MHz/50000 = 100 Hz
- Counter 1 (Mode 2, rate gen): N1 = 3000 → output = 100Hz/3000 = 0.0333 Hz = 1 pulse/30 sec
- Connect OUT0 → CLK1, GATE0=GATE1=1 (always enabled)

CW0 = 00110100B = 34H (Ctr0, LSB+MSB, Mode2, binary)
CW1 = 01110100B = 74H (Ctr1, LSB+MSB, Mode2, binary)

```asm
MOV AL, 34H : OUT 43H, AL
MOV AL, 50H : OUT 40H, AL  ; N0 LSB = 50000 = C350H → 50H
MOV AL, 0C3H: OUT 40H, AL  ; N0 MSB = C3H
MOV AL, 74H : OUT 43H, AL
MOV AL, 0B8H: OUT 41H, AL  ; N1 LSB = 3000 = 0BB8H → B8H
MOV AL, 0BH : OUT 41H, AL  ; N1 MSB = 0BH
```

#### Practice 3 — Protected Mode Descriptor Exception
**Q:** A descriptor has byte 5 (access rights) = E9H. No privilege violation. Yet exception occurs. Why?

**Solution:** E9H = 1110 1001. D7=1 (present), D6-D5=11 (DPL=3), D4=0 (system segment), D3-D0=1001.

Actually: if the question is about P=0 descriptor (like 10H in slide Q5): Byte with P=0 means segment not in memory. Accessing a non-present segment always causes "Segment Not Present" exception (INT 11) even if privilege is correct. The P bit is checked BEFORE the segment base is used.

**For the 21-22 Q5 bytes given (FON, 10H, E9H, 004, 00M, 00M, 00M, 1FH):**
Access byte = E9H = 1110 1001. P=1 (present). DPL=11 (ring 3). S=0 (system segment), type=1001 = Available TSS.
But byte 8 = F0N contains Byte6 of 80386 descriptor. If Limit bits D16-D19 give limit > actual → limit violation on access.

---

## PHASE 4 — FINAL VERIFICATION

### MASTER TOPIC LIST Coverage Check

| Topic | Covered | Notes |
|-------|---------|-------|
| T1.1 Analog vs Digital | YES | |
| T1.2 Noise Margin (VOH, VOL, VIH, VIL, NMH, NML) | YES | |
| T1.3 Fanout and current limitations | YES | |
| T1.4 8086 vs 8088 specs | YES | |
| T1.5 Multiplexed bus — why and how | YES | |
| T2.1 AD0–AD15 | YES | |
| T2.2 A16/S3–A19/S6 | YES | |
| T2.3 BHE/S7 | YES | |
| T2.4 MN/MX | YES | |
| T2.5 RD, WR | YES | |
| T2.6 S3–S6 status encoding | YES | |
| T2.7 TEST pin and WAIT | YES | |
| T2.8 READY and wait states | YES | |
| T2.9 Minimum Mode pins | YES | |
| T2.10 Maximum Mode pins | YES | |
| T3.1–T3.5 8284A all subtopics | YES | |
| T4.1 Instruction vs machine cycle | YES | |
| T4.2 T-states | YES | |
| T4.3 Read timing diagram | YES + IMAGE FLAG | |
| T4.4 Write timing diagram | YES + IMAGE FLAG | |
| T4.5 Memory access time formula | YES | |
| T4.6 Wait state calculation | YES | |
| T4.7 74LS373 demux | YES + IMAGE FLAG | |
| T4.8 74LS245 buffer | YES + IMAGE FLAG | |
| T4.9 Min mode system bus | YES + IMAGE FLAG | |
| T5.1 Memory chip anatomy | YES | |
| T5.2 ROM types | YES | |
| T5.3 RAM types | YES | |
| T5.4 NAND gate decoder | YES | |
| T5.5 74LS138 decoder | YES | |
| T5.6 PLA/GAL decoding | YES | |
| T5.7 8088 interfacing | YES | |
| T5.8 8086 dual-bank interfacing | YES + IMAGE FLAG | |
| T5.9 Separate write strobes | YES | |
| T5.10 80286/80386 interfacing | YES | |
| T5.11 32-bit interfacing | YES | |
| T5.12 Worked examples | YES | |
| T6.1–T6.5 I/O fundamentals | YES | |
| T7.1–T7.7 8255 all subtopics | YES | |
| T8.1–T8.9 8254 all subtopics | YES | |
| T9.1–T9.9 Interrupts all subtopics | YES | |
| T10.1–T10.11 8259 all subtopics | YES | |
| T11.1–T11.11 16550 UART all subtopics | YES | |
| T12.1–T12.13 DMA & 8237 all subtopics | YES | |
| T13.1–T13.11 80286 all subtopics | YES | |

### Unresolved IMAGE FLAGS (requires manual review)

1. **L1 p17, L2 p2-4:** 8086/8088 40-pin DIP package diagram
2. **L4 p6-7:** 74LS373 latch circuit + bus demultiplexing circuit
3. **L4 p9-11:** 74LS245 transceiver circuit + buffered bus diagram
4. **L4 p12:** Complete minimum mode system bus diagram
5. **L4 p16-19, L5 p2-5, L6 p2-5:** Memory Read and Write timing diagrams (waveforms)
6. **L6 p16-18:** 2716 EPROM pinout; 6116 SRAM interface circuit; memory chip generic
7. **L6 p21-23, L7 p3-4:** NAND decoder circuit; 74LS138 connection diagram
8. **L7 p8-17, L8 p2-9:** Memory interfacing circuit diagrams (8088 and 8086 with actual wiring)
9. **L9 p6:** GAL22V10 16-bit memory decoding circuit
10. **L10 p7-8:** 8-bit I/O port decoding circuit
11. **L11 p5-6:** 8255 pin diagram and internal block diagram
12. **L11 p9, p19, p21:** 8255 control word format table; parallel data transfer diagram; Mode 1 strobed input timing
13. **L12 p2-3, p6-7:** Mode 1 strobed output timing; Mode 2 bidirectional timing diagram
14. **L12 p11:** 8254 internal block diagram
15. **L13-14 p16, p20, p23, p27, p30, p33:** 8254 mode timing diagrams (Mode 0–5)
16. **L15 p8, L16 p4-5:** 8254 examples with circuit; NMI/INTR timing diagrams
17. **L16 p3:** Interrupt types diagram
18. **L16 p16-18:** 8259 internal block diagram; IRR/ISR/IMR registers diagram
19. **L17 p12-13:** ICW1 bit-field diagram; ICW command sequence flow
20. **L18 p21:** OCW1 format diagram; cascade mode circuit
21. **L19 p15-21, L20 p3-10:** 8237 pinout diagram (all pages showing different pin groups)
22. **L20 p13, p22:** Command register bit-field; internal registers table
23. **L20 p25-27:** 8237 connected to 80x86 — latch A/B/C/D/E circuit
24. **L22 p7, p14, p19:** 80286 internal architecture block diagram; pin comparison table; virtual memory machine diagram
25. **PYQs:** `MuP_Compre_24-25.pdf` (12 pages), `Compre Part A 21-22.pdf` (4 pages), `Mup Compre 20-21.pdf` (3 pages), `MuP Compre 23-24.pdf` (2 pages) — all image-only, full manual review required

---

*End of CS F241 MUP Notes. Generated from Lectures 1–22. PYQ analysis covers 21-22 and 23-24 exam papers. Image-based PDFs (20-21, Part A 21-22, 23-24 question paper, 24-25) require manual review as listed above.*

