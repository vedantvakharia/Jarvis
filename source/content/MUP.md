## Table of Contents
```table-of-contents
```


---
  
## 1. Signal Types

### Analog Signal

- A **continuous time signal** where **each voltage level has a unique meaning**.
- Every point on the waveform carries distinct information.
### Digital Signal

- A signal where voltage levels are **mapped into 2 ranges**: logic `0` or logic `1`.
- A **threshold** is used to distinguish between the two levels.
- Voltages in the **illegal/threshold range** (e.g., 0.8V–2.0V in TTL) are undefined and should be avoided.

| Signal Type  | Voltage Range (TTL) | Logic Level |
| ------------ | ------------------- | ----------- |
| Digital Low  | 0.0V – 0.8V         | Logic 0     |
| Illegal Zone | 0.8V – 2.0V         | Undefined   |
| Digital High | 2.0V – 5.0V         | Logic 1     |

### Noise Margin

#### Definition

> **Noise Margin** = How much noise a logic gate can tolerate **without affecting its normal operation**.
   
#### Importance
1. **Compatibility** of circuit elements/gates from different vendors/families.
2. **Circuit performance stability** under electromagnetic interference (EMI) or power spikes.

#### Key Voltage Parameters

| Parameter | Description                                    |
| --------- | ---------------------------------------------- |
| **V_OH**  | Minimum output voltage considered as logic '1' |
| **V_OL**  | Maximum output voltage considered as logic '0' |
| **V_IH**  | Minimum input voltage considered as logic '1'  |
| **V_IL**  | Maximum input voltage considered as logic '0'  |

#### Compatibility Condition

For two devices to work together:
- $V_{OH}$ (driver) > $V_{IH}$  (receiver) — Output HIGH must exceed receiver's HIGH threshold
- $V_{OL}$ (driver) < $V_{IL}$ (receiver) — Output LOW must be below receiver's LOW threshold

> **Failure Case:** If output produces 3V for logic '1' but receiving device requires 5V for logic '1', the circuit will malfunction.

#### Worked Example

| Device | V_OH | V_IH | V_OL | V_IL | I_OH  | I_IH  | I_OL  | I_IL |
| ------ | ---- | ---- | ---- | ---- | ----- | ----- | ----- | ---- |
| A      | 3.4V | 3.3V | 0.5V | 1.0V | -4 mA | -1 mA | 10 mA | 2 mA |
| B      | 3.2V | 3.0V | 0.6V | 0.7V | -2 mA | -1 mA | 6 mA  | 2 mA |
  
  **Voltage Check:**
- Device A V_OH (3.4V) > Device B V_IH (3.0V) 
- Device A V_OL (0.5V) < Device B V_IL (0.7V) → **Compatible!**

**Fanout Calculation (Drive Capability):**

- When outputting '1': `|I_OH / I_IH| = |-4 / -1| = 4`
- When outputting '0': `|I_OL / I_IL| = |10 / 2| = 5`
- **Drive capability = min(4, 5) = 4** → Device A can drive up to 4 Device B inputs.


### Fanout and Current Limitations

#### Fanout

- **Fanout** = the number of gate inputs ("loads") an output can drive.
- As fanout increases → **propagation delay increases** proportionally.
- If fanout is **too high**, the circuit may stop working due to **current limitations**.
#### Current Parameters

| Condition   | Parameter | Meaning                                   |
| ----------- | --------- | ----------------------------------------- |
| Output HIGH | $I_{OH}$  | Max current output can *source* when high |
| Output LOW  | $I_{OL}$  | Max current output can *sink* when low    |
| Input HIGH  | $I_{IH}$  | Current needed by input to recognize '1'  |
| Input LOW   | $I_{IL}$  | Current needed by input to recognize '0'  |
#### 8086 Specific I/O Current Levels (TTL)

| Logic Level | Side   | Voltage   | Current     |
| ----------- | ------ | --------- | ----------- |
| 0           | INPUT  | 0.8V max  | ±10 µA max  |
| 1           | INPUT  | 2.0V min  | ±10 µA max  |
| 0           | OUTPUT | 0.45V max | +2 mA max   |
| 1           | OUTPUT | 2.4V min  | -400 µA max |
#### Solution for High Fanout

- If $I_{OH}$ or $I_{OL}$ is insufficient → **insert intermediate buffers** to split the load between multiple driver stages.

### Schmitt Trigger (Extra, just mentioned in slides)

A **Schmitt Trigger** is a special type of comparator circuit that converts a **slow, noisy, or gradually changing input signal** into a **clean, sharp digital output**. It appears in the 8284A clock generator specifically in the **RESET synchronization path**. The key feature that makes it special is something called **hysteresis**.

#### The Problem It Solves

Imagine you have a slowly rising voltage (like a capacitor charging during power-up) feeding into a normal logic gate. A normal gate has a **single threshold voltage** — the moment the input crosses it, the output switches.

But in the real world, signals don't rise perfectly cleanly. They wobble slightly around the threshold due to noise:

```
Voltage
  |          /‾‾‾‾‾‾‾‾‾
  |         /
  |    ~~~~/ ← noise causes
  |   /      multiple crossings
  |  /
  |_/_____________________________ time

Normal gate output:
  |    ___ _  ____________
  |___|   | |_|            (multiple unwanted transitions!)
```

Every time the noisy signal crosses the threshold, the gate switches — producing **multiple spurious output pulses** instead of one clean transition. This is catastrophic in digital systems.

#### The Solution: Hysteresis

A Schmitt Trigger solves this by using **two different threshold voltages** instead of one:

- **$V_{T+}$ (Upper Threshold / Positive-going threshold):** The input must rise **above** this to switch the output LOW (for an inverting Schmitt Trigger).
- **$V_{T−}$ (Lower Threshold / Negative-going threshold):** The input must fall **below** this to switch the output HIGH.

The gap between $V_{T+}$ and $V_{T−}$ is called the **hysteresis band** or **dead band**.

```
Voltage
  |                V_T+ ─ ─ ─ ─ ─ ─ ─ ─
  |               /        ↑
  |              /    hysteresis band
  |             /          ↓
  |  V_T− ─ ─ /─ ─ ─ ─ ─ ─
  |           /
  |__________/________________________________ time
```

#### How Hysteresis Creates Noise Immunity

Because there are **two separate thresholds**, the signal has to travel all the way across the hysteresis band before the output can switch back. Small noise fluctuations near one threshold **cannot cause false retriggering** because they don't reach the other threshold.

```
Input Voltage
  |
  |    V_T+ ─ ─ ─ ─ ─ ─ /‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾
  |                     /  ↑ output switches here (LOW)
  |              ~~~~~~/
  |    V_T− ─ ─/─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─
  |           /   ↑ output switches here (HIGH)
  |__________/____________________________________ time

Output (inverting Schmitt Trigger):
  |‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾|
  |                     |___________________
  
  → One clean transition, no glitches!
```

The noise wiggling around $V_{T+}$ **cannot pull the signal back down to $V_{T−}$**, so the output stays stable.

#### The Hysteresis Loop

This behavior is best visualized as a **loop** — which is why it's called a hysteresis loop:

```
Output
HIGH |‾‾‾‾‾‾‾‾‾‾‾‾‾←─────────────┐
     |                            │ (falling input switches at V_T−)
     |                            │
LOW  |             ──────────────►│_____________
     |
     └────────────────────────────────── Input Voltage
                   V_T−          V_T+

     Rising input:  switches at V_T+  (higher threshold)
     Falling input: switches at V_T−  (lower threshold)
```

The output follows **different paths** depending on whether the input is rising or falling — this is the hallmark of hysteresis.
#### Typical Schmitt Trigger Thresholds (TTL family)

| Parameter              | Typical Value |
| ---------------------- | ------------- |
| V_T+ (upper threshold) | ~1.7V         |
| V_T− (lower threshold) | ~0.9V         |
| Hysteresis band        | ~0.8V         |

#### Schmitt Trigger vs Normal Gate — Side by Side

|Feature|Normal Gate|Schmitt Trigger|
|---|---|---|
|Thresholds|Single threshold|Two thresholds (V_T+ and V_T−)|
|Noise immunity|Low|High|
|Output on noisy input|Multiple glitchy transitions|Single clean transition|
|Response to slow input|Oscillates near threshold|Switches cleanly|
|Hysteresis|None|Yes (V_T+ − V_T−)|
|Symbol|Standard gate symbol|Gate symbol with ⊓ inside|

---
---
## 2. 8086/8088 

### Device Specifications
  
#### Physical Package

- Both 8086 and 8088 are packaged in **DIP (Dual In-Line Package)** with 40 pins.

#### Architecture Difference

| Processor | Internal Data Width | External Data Bus |
| --------- | ------------------- | ----------------- |
| **8086**  | 16-bit              | **16-bit**        |
| **8088**  | 16-bit              | **8-bit**         |
#### Power Specifications (5V parts)

| Processor          | Max Supply Current                      |
| ------------------ | --------------------------------------- |
| 8086               | 360 mA                                  |
| 8088               | 340 mA                                  |
| 80C86/80C88 (CMOS) | 10 mA (operating range: -40°F to 225°F) |
#### Available Frequencies (8086 Variants)

| Model  | Frequency | Technology |
| ------ | --------- | ---------- |
| 8086   | 5 MHz     | HMOS       |
| 8086-1 | 10 MHz    | HMOS II    |
| 8086-2 | 8 MHz     | HMOS II    |
| 8086-4 | 4 MHz     | HMOS       |
| I8086  | 5 MHz     | HMOS       |
| M8086  | 5 MHz     | HMOS       |

---
### 8086/8088 Pins

#### Address/Data Bus Pins
  
| Pin(s)                         | Name                        | Description                                                                                                        |
| ------------------------------ | --------------------------- | ------------------------------------------------------------------------------------------------------------------ |
| AD0–AD15                       | Address/Data Bus            | **Bidirectional, multiplexed.** Carry low-order address (A0–A15) when ALE = 1 or data (D0–D15) at different times. |
| A16/S3, A17/S4, A18/S5, A19/S6 | High-Order Address / Status | Carry high-order address bits (20-bit total address space = 1 MB) or status signals.                               |
#### Status Signals (S3–S6)

| Signal     | Description                                                                                                                                              |
| ---------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **S6**     | Always logic **0**                                                                                                                                       |
| **S5**     | Reflects the state of the **Interrupt Flag (IF)**                                                                                                        |
| **S4, S3** | Indicate which **memory segment** is being accessed. Can be used to address four separate 1M byte memory banks by decoding them as $A_{21}$ and $A_{20}$ |
#### S4/S3 Segment Encoding

| S4  | S3  | Segment            |
| --- | --- | ------------------ |
| 0   | 0   | Extra Segment (ES) |
| 0   | 1   | Stack Segment (SS) |
| 1   | 0   | Code or No Segment |
| 1   | 1   | Data Segment (DS)  |
#### Other Common Pins

| Pin        | Name                     | Type                | Description                                                                                                                                                                                   |
| ---------- | ------------------------ | ------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **BHE/S7** | Bus High Enable / Status | Output (Active Low) | Enables data on upper half of data bus (D8–D15); multiplexed with S7 (always 1)                                                                                                               |
| **MN/MX**  | Min/Max Mode Select      | Input               | Selects operating mode (HIGH = Min, LOW = Max)                                                                                                                                                |
| **RD**     | Read                     | Output (Active Low) | Signals a read operation                                                                                                                                                                      |
| **NMI**    | Non-Maskable Interrupt   | Input               | Non-maskable interrupt request                                                                                                                                                                |
| **INTR**   | Interrupt Request        | Input               | Maskable interrupt request                                                                                                                                                                    |
| **CLK**    | Clock                    | Input               | System clock from 8284A                                                                                                                                                                       |
| **RESET**  | Reset                    | Input               | Resets processor to known state                                                                                                                                                               |
| **VCC**    | Power                    | —                   | +5V supply                                                                                                                                                                                    |
| **GND**    | Ground                   | —                   | Ground reference                                                                                                                                                                              |
| **TEST**   | TEST                     |                     | Checked by the `WAIT` instruction. 8086 pauses until TEST goes LOW. Used to **synchronize external activities** with the processor. If Test = 1 → Wait; If Test = 0 → 8086 resumes execution. |
| **READY**  |                          |                     | Used to **insert wait states**. If LOW, the processor enters wait states and remains idle (used with slow memory/peripherals).                                                                |


#### Queue Status Signals (QS0, QS1)

Used by external devices (e.g., 8087 coprocessor) to track the 8086's internal instruction queue:

| QS1 | QS0 | Queue Status                 |
| --- | --- | ---------------------------- |
| 0   | 0   | Queue is idle                |
| 0   | 1   | First byte of opcode fetched |
| 1   | 0   | Queue is empty               |
| 1   | 1   | Subsequent byte of opcode    |
#### RQ/GT Pins (Request/Grant)

| Pin                | Description                                                                                                                                           |
| ------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| **RQ/GT0, RQ/GT1** | Bidirectional. Used by other bus masters to request and release the local bus (e.g., during DMA). Processor releases bus at end of current bus cycle. |
#### LOCK Pin

- Output signal activated by the `LOCK` prefix instruction.
- Goes LOW while executing the `LOCK`-prefixed instruction to **prevent other bus masters from taking control** of the system bus.
- Example: `LOCK MOV CX, [4000H]` — bus is locked for duration of this instruction.

---
### Reset Operation

#### How Reset Works

- The 8086 microprocessor **resets** when the RESET pin is held **HIGH for at least 4 clock periods**.
- After reset:
    - Instruction execution begins at address **FFFF0H**
    - The **Interrupt Flag (IF)** is cleared

#### RC Circuit for Reset

An RC (Resistor-Capacitor) circuit is used to generate the reset signal automatically at power-on.

|Component|Value|
|---|---|
|Resistor|10 KΩ|
|Capacitor|10 µF|
|RC Time Constant|10K × 10µF ≈ **100 ms**|

This ensures the RESET pin stays high long enough during power-up for the processor to reset reliably.

---
### Min/Max Mode Operation

#### MN/MX Pin (Pin 33)

| MN/MX State        | Mode             | Description                                                                                     |
| ------------------ | ---------------- | ----------------------------------------------------------------------------------------------- |
| HIGH (tied to VCC) | **Minimum Mode** | Single-processor system; 8086 generates all bus control signals itself                          |
| LOW (tied to GND)  | **Maximum Mode** | Multi-processor / co-processor system; external bus controller (8288) generates control signals |

#### Minimum Mode Pins

In **Minimum Mode**, pin 33 is tied to VCC and the 8086 generates all bus control signals directly.

| Pin      | Name                  | Description                                                                         |
| -------- | --------------------- | ----------------------------------------------------------------------------------- |
| **ALE**  | Address Latch Enable  | Pulses HIGH during T1 to latch address from multiplexed bus                         |
| **DEN**  | Data Enable           | Activates the external **data bus buffer/transceiver**                              |
| **DT/R** | Data Transmit/Receive | Controls **direction** of data through transceivers: HIGH = Transmit, LOW = Receive |
| **M/IO** | Memory / I/O Select   | HIGH = **memory** access; LOW = **I/O** access (IN/OUT instructions)                |
| **WR**   | Write                 | Active low; asserted when processor writes data to memory or I/O port               |
| **RD**   | Read                  | Active low; asserted during read cycles                                             |
| **INTA** | Interrupt Acknowledge | Goes LOW when processor accepts an interrupt request                                |
| **HOLD** | Hold Request          | Input from DMA controller or bus master requesting bus control                      |
| **HLDA** | Hold Acknowledge      | Output; asserted HIGH when processor grants bus control (accepts HOLD)              |

#### Maximum Mode Pins

In **Maximum Mode**, the 8086 works with an **8288 Bus Controller** which decodes status signals (S0, S1, S2) to generate bus control signals.

#### Status Signals S0, S1, S2 (Active Low)

These replace the min-mode control pins and are decoded by the 8288:

| S2  | S1  | S0  | Bus Cycle Function     |
| --- | --- | --- | ---------------------- |
| 0   | 0   | 0   | Interrupt Acknowledge  |
| 0   | 0   | 1   | I/O Read               |
| 0   | 1   | 0   | I/O Write              |
| 0   | 1   | 1   | Halt                   |
| 1   | 0   | 0   | Opcode Fetch           |
| 1   | 0   | 1   | Memory Read            |
| 1   | 1   | 0   | Memory Write           |
| 1   | 1   | 1   | Passive (no operation) |

---
### Bus Demultiplexing

#### Three Buses in a Computer System

|Bus|Width|Purpose|
|---|---|---|
|Address|20-bit|Selects memory/IO location|
|Data|8-bit (8088) / 16-bit (8086)|Carries data being read/written|
|Control|Various signals|Controls direction & type of transfer|

#### Why Multiplexing?

- The 8086 has a **limited number of pins (40 pins)**.
- To save pins, the **address and data buses are multiplexed** (time-shared) on the same physical lines.
- **T1 (Address Phase):** The processor drives the memory address on AD0–AD15. The **ALE (Address Latch Enable)** signal goes HIGH, telling an external latch (8282/74LS373) to capture the address.
- **T2–T4 (Data Phase):** The address is held by the latch; AD0–AD15 are now used for data transfer.

#### Multiplexed Pins

|Pin Group|Dual Function|
|---|---|
|AD0–AD15|Address A0–A15 / Data D0–D15|
|A16–A19 / S3–S6|Upper address / Status signals|
|BHE / S7|Bus High Enable / Status|

---
### Demultiplexing with Latch IC 74LS373

To separate the address from the data, **latch ICs (74LS373)** are used.

#### Key Features
- 8-bit transparent D-latch
- Pins: $D_0$–$D_7$ (inputs), $O_0$–O7 (outputs)
- **LE (Latch Enable):** When HIGH, output follows input (transparent); when LOW, output is **latched** (held).
- **OE (Output Enable, active LOW):** When LOW, outputs are enabled; when HIGH, outputs go to **high impedance** (tri-state).

#### How it works in 8086 System
- **ALE → G (LE):** When ALE is HIGH, address is passed through; when ALE goes LOW, address is latched.
- **OE tied to GND:** Outputs always enabled.
- Three 74LS373s are used:
    1. Latch for **A0–A7** (from AD0–AD7)
    2. Latch for **A8–A15** (from AD8–AD15)
    3. Latch for **A16–A19 + BHE** (from the upper address/status lines)

---
### Bus Buffering (74LS245)

#### Why Buffering is Needed
- The 8086 can only **drive a limited number of devices** (fan-out limitation).
- Buffers increase the **drive strength** of the bus, allowing more memory/IO chips to be connected.
- They also improve **signal integrity** (reduce noise and distortion).

#### 74LS245 – Bidirectional Buffer
- 8-bit **bidirectional** (Octal Bus Transceiver) buffer
- **DEN (Data Enable, active LOW):** Enables the buffer
- **DT/R (Data Transmit/Receive):**
    - HIGH → Data flows from A to B (CPU **writing** to memory/IO)
    - LOW → Data flows from B to A (CPU **reading** from memory/IO)

#### Schmitt Trigger Action

The 74LS245 uses Schmitt trigger inputs which provide hysteresis (upper and lower thresholds), improving noise immunity on the data bus.

#### Complete Demultiplexed & Buffered System

The full 8086 minimum-mode system has:
- **Latches (74LS373)** → separate address from data → produce buffered address bus A0–A19
- **Bidirectional Buffers (74LS245)** → amplify data bus D0–D15
- **Unidirectional Buffer (74LS244)** → buffer control signals (RD, WR, M/IO)

---

## 5. Decoder

### Role of the Decoder

A **3:8 decoder (74LS138)** decodes the control signals from the 8086 to generate distinct memory/IO read and write strobes.

### Decoder Truth Table (using M/IO, RD, WR)

|M/IO|RD|WR|Function|
|---|---|---|---|
|1|0|1|**MEMR** (Memory Read)|
|1|1|0|**MEMW** (Memory Write)|
|0|0|1|**IOR** (I/O Read)|
|0|1|0|**IOW** (I/O Write)|

### 74LS138 as a 3:8 Decoder

- Inputs: M/IO → A (MSB), RD → B, WR → C (LSB)
- Outputs used:
    - Y1 → **IORD** (I/O Read)
    - Y2 → **IOWR** (I/O Write)
    - Y5 → **MRD** (Memory Read)
    - Y6 → **MWR** (Memory Write)

### Logic Gate Implementation

Alternatively, these control signals can be derived using simple logic gates:

- **MRD** = NAND(RD, M/IO)
- **MWR** = NAND(WR, M/IO)
- **IORD** and **IOWR** similarly derived using inverted M/IO


## 6. Bus Timing & Timing Diagrams

### Bus Cycle / Machine Cycle

- A **bus cycle** is the sequence of events for a single memory or I/O access.
- It starts with the address being placed on the bus and ends after the read or write data transfer completes.
- Each bus cycle = **4 T-states** (clock periods): T1, T2, T3, T4

### Memory Write Timing Diagram

| T-State | What Happens                                                                 |
| ------- | ---------------------------------------------------------------------------- |
| T1      | ALE goes HIGH; address placed on AD0–AD15 and A16–A19; M/IO and DT/R go HIGH |
| T1→T2   | ALE falls; address latched; WR goes LOW                                      |
| T2      | Data placed on AD0–AD15                                                      |
| T2–T3   | DEN goes LOW (buffer enabled)                                                |
| T3–T4   | Data held; WR still LOW                                                      |
| T4      | WR goes HIGH; DEN goes HIGH; bus cycle ends                                  |

**Key timings (5 MHz clock, 200 ns per T-state):**

- Address setup time: ~200 ns (1 T-state)
- Total bus cycle: 800 ns (4 × 200 ns)

### Memory Read Timing Diagram

|T-State|What Happens|
|---|---|
|T1|ALE HIGH; address driven on AD lines; DT/R LOW (receive mode)|
|T2|AD lines **float** (tristate); RD goes LOW; DEN goes LOW|
|T3|Memory places valid **data** on the bus; CPU samples data at end of T3|
|T4|RD goes HIGH; DEN goes HIGH; DT/R goes HIGH; bus floats|

> A **wait state (Tw)** can be inserted between T2 and T3 if the memory is slow, extending the bus cycle by one clock period.

---

## 7. Memory Access Time

### Key Timing Parameters (5 MHz Clock)

|Parameter|Description|Value|
|---|---|---|
|**TCLAV**|Clock to Address Valid|110 ns|
|**TCLRL**|Clock to Read Line (RD) active|—|
|**TDVCL**|Data Valid to Clock (data setup time)|30 ns|
|Clock period (5 MHz)|1/5MHz|200 ns|

### Memory Access Time Calculation (No Wait States)

- Time available between address appearance (T1) and data sampling (T3) = **3 × 200 ns = 600 ns**
- Subtract TCLAV: 600 – 110 = 490 ns
- Subtract TDVCL: 490 – 30 = **460 ns**

> **Memory Access Time (5 MHz, no wait) = 460 ns**

### With One Wait State

- One Tw adds one extra clock period (200 ns)
- New memory access time = 460 + 200 = **660 ns**

### Formula Summary

```
Memory Access Time = (3 × T_clk) - TCLAV - TDVCL
With n wait states  = ((3 + n) × T_clk) - TCLAV - TDVCL
```





---


## 3. 8284A Clock Generator

The **8284A** is a dedicated clock generation chip used with the 8086/8088. It is connected via the **CLK pin (Pin 19)** on the 8086.

### Basic Functions

1. **Clock generation** – Divides crystal frequency to produce CLK for 8086.
2. **RESET synchronization** – Ensures clean, synchronized reset signal.
3. **READY synchronization** – Manages wait states for slow peripherals.
4. **Peripheral clock (PCLK)** – Provides a lower-frequency clock for peripherals.

### Clock Generation Process

1. Crystal is connected to **X1** and **X2** pins of 8284A.
2. The internal **XTAL OSC** generates a square wave at the crystal frequency (e.g., 15 MHz).
3. A **2-to-1 MUX** selects between crystal (XTAL) or external frequency input (EFI), controlled by the **F/C** pin.
4. The MUX output drives a **÷3 counter** (e.g., 15 MHz → 5 MHz CLK for 8086).
5. The ÷3 output also drives a **÷2 counter** → 2.5 MHz **PCLK** for peripherals.

### 8284A Pin Summary

| Pin            | Description                                                                                               |
| -------------- | --------------------------------------------------------------------------------------------------------- |
| **X1, X2**     | Crystal oscillator connections                                                                            |
| **F/C**        | Selects XTAL oscillator (HIGH) or EFI external input (LOW)                                                |
| **OSC**        | Oscillator output at crystal frequency; used as EFI for other 8284As in multi-processor systems           |
| **CSYNC**      | Clock synchronization in multi-processor systems; grounded when using crystal                             |
| **CLK**        | Output to 8086 CLK pin (crystal freq ÷ 3)                                                                 |
| **PCLK**       | Peripheral Clock output (crystal freq ÷ 6)                                                                |
| **RDY1, RDY2** | Ready inputs from bus devices                                                                             |
| **AEN1, AEN2** | Address Enable – gate the RDY signals; control wait state generation                                      |
| **READY**      | Synchronized READY output to 8086                                                                         |
| **ASYNC**      | Selects 1-stage (synchronous) or 2-stage synchronization (for slow async devices, to avoid metastability) |
| **RES**        | Active LOW input to 8284A; triggers power-on reset                                                        |
| **RESET**      | Synchronized RESET output to 8086                                                                         |
| **VCC / GND**  | +5V power and Ground                                                                                      |
### RESET Timing Details

- The 8284A uses a negative edge-triggered (1→0) flip-flop to apply RESET to the 8086 on the falling edge.
- The 8086 samples RESET on the rising edge (0→1).
- Correct reset timing -
  - RESET must go HIGH no later than 4 clock cycles after power-up.
  - RESET must stay HIGH for at least 50 µs.


### Schmitt Trigger in the 8284A

The 8284A clock generator contains a Schmitt Trigger specifically in the **RESET path**:

```
RES (active low input)
        │
        ▼
  ┌─────────────┐
  │   Schmitt   │──► D flip-flop ──► RESET (to 8086)
  │   Trigger   │
  └─────────────┘
```

#### Why is it needed here?

When power is first applied to the system, the **RES pin voltage rises slowly** as capacitors charge up. Without a Schmitt Trigger, this slow rise would cause the internal flip-flop to see multiple glitchy transitions, producing an unreliable RESET signal that could leave the 8086 in an unknown state.

The Schmitt Trigger ensures:
- The RESET flip-flop only triggers **once**, at a well-defined point.
- The slow power-on ramp is converted into a **single clean edge**.
- Even if there is noise on the power supply during startup, the hysteresis band absorbs it.



---

## 8. Memory Types & Chips

### Two Basic Types

|Type|Full Name|Description|
|---|---|---|
|ROM|Read-Only Memory|Non-volatile; retains data when powered off|
|RAM|Read-Write Memory|Volatile; loses data when powered off|

### Four Commonly Used Memories

1. **ROM** – Mask-programmed at factory
2. **Flash (EEPROM)** – Electrically erasable; used in modern storage
3. **Static RAM (SRAM)** – Fast; uses flip-flops; no refresh needed
4. **Dynamic RAM (DRAM)** – Dense; uses capacitors; needs periodic refresh

### Memory Chip Pin Overview

|Pin Type|Description|
|---|---|
|Address pins (An)|Select the memory location. # pins = log₂(# locations)|
|Data pins (Dn)|Carry data in/out; typically bidirectional for RAM|
|CS / CE / S|Chip Select – enables the chip for access|
|OE|Output Enable – enables data output (active LOW)|
|WE / R/W|Write Enable or Read/Write control|

### Memory Chip Notation

- **1K × 8** means:
    - 1K = 1024 memory **locations**
    - 8 = 8 bits (1 byte) per location
    - Total = **1 KB** of memory
    - Requires **10 address pins** (2¹⁰ = 1024)

### Chip Select Logic

- Each memory chip needs at least one CS/CE pin.
- To enable a chip, **all CS pins must be LOW** simultaneously.
- The CS is driven by the **address decoder** output.

### Control Pin Rules

- **ROMs:** Have OE (output enable) or G (gate) pin
- **RAMs:** Have both WE (write enable) and OE (read enable)
- **Rule:** WE and OE must **never both be LOW** simultaneously (would cause bus contention)

---

## 9. ROM Variants

|Type|Full Name|Programmable?|Erasable?|Notes|
|---|---|---|---|---|
|**ROM**|Read-Only Memory|Factory only|No|Oldest style|
|**PROM**|Programmable ROM|Once (field)|No|Blow fuses to program|
|**EPROM**|Erasable Programmable ROM|Yes|UV light (~20 min)|Has quartz window|
|**EEPROM / Flash**|Electrically Erasable Programmable ROM|Yes|Electrically|Also called EAROM / NOVRAM; write is slower than RAM|

### Example: 2716 EPROM (2K × 8)

- 11 address lines (A0–A10) → 2K = 2048 locations
- 8 data output lines (O0–O7)
- Pins: **CS** (Chip Select), **PD/PGM** (Power Down / Program), **VPP** (programming voltage)
- Used to store BIOS in early PC systems

---

## 10. Memory Address Decoding & Interfacing

### The Core Problem

- 8086 has **20-bit address lines** → can address **1 MB** (2²⁰ = 1,048,576 locations)
- A single memory chip (e.g., 2716 EPROM) only has **11 address pins** (covers 2 KB)
- The remaining **9 address bits (A11–A19)** must be decoded to generate the Chip Select signal

### Interfacing Rule

```
If processor has n address lines and memory chip has p address lines:
- Connect A0 to Ap-1 directly to the memory chip
- Use A_p to A_(n-1) for chip select decoding
```

### Example: Placing 2716 at Address FF800H–FFFFFH

```
FF800H = 1111 1111 1000 0000 0000
FFFFFH = 1111 1111 1111 1111 1111
```

- A0–A10: Connected directly to memory chip (2K range = 11 bits)
- A11–A19: All HIGH (= 1111 1111 1) → Input to a NAND decoder
- When all A11–A19 = 1, NAND output goes LOW → activates CS' of the memory chip

### NAND Gate Decoder (74ALS133)

- 13-input NAND gate
- Inputs: A11–A19 (9 bits) + M/IO (inverted, to ensure memory-only access)
- Output LOW only when **all inputs are HIGH** → selects the 2K EPROM block

### Example: Selecting DF800H–DFFFFH

```
DF800H = 1101 1111 1000 0000 0000
DFFFFH = 1101 1111 1111 1111 1111
```

- Fixed high-order bits: A19=1, A18=1, A17=0, A16=1, A15=1, A14=1, A13=1, A12=1, A11=1
- A17 = 0 → must be **inverted** before connecting to NAND gate inputs
- All other fixed-high bits connect directly

### General Interfacing Formula

```
n = total address bits of processor
p = address bits of memory chip (= log₂(chip size))
Required decoder inputs = n - p
```

---

## 11. Practice Problems

### Problem 1

**An 8086 operates at 8 MHz (8086-2). If one wait state (Tw) is inserted, what is the total time allowed for memory access?**

**Solution:**

- Clock period at 8 MHz = 1/8 MHz = **125 ns**
- Without wait states: 3 clock periods available = 3 × 125 = 375 ns
- Subtract TCLAV (8086-2): ~60 ns
- Subtract TDVCL: ~30 ns
- Base access time = 375 – 60 – 30 = **285 ns**
- With 1 wait state: 285 + 125 = **410 ns**

---

### Problem 2

**A processor operates at 8 MHz. Memory access time = 300 ns. Address setup time = 120 ns, data setup time = 20 ns, latch buffer delay = 10 ns. What is the total time to read 16-bit data from memory location 2010H?**

**Solution:**

- Clock period = 125 ns
- Available time = 3 × 125 = 375 ns
- Subtract address setup (TCLAV): 375 – 120 = 255 ns
- Subtract data setup (TDVCL): 255 – 20 = 235 ns
- Subtract buffer delay: 235 – 10 = **225 ns** available for memory

Since memory access time required is **300 ns > 225 ns**, a **wait state is needed**.

- With 1 Tw: Available = 225 + 125 = 350 ns ≥ 300 ns ✓

**Address 2010H is even (A0 = 0)**, so 16-bit data can be read in **one bus cycle** (both bytes on D0–D15 simultaneously).

Total read time = 1 bus cycle + 1 wait state = **5 T-states × 125 ns = 625 ns**

---

## Quick Reference Summary

|Topic|Key Point|
|---|---|
|Reset|RESET HIGH for 4 clocks → execution from FFFF0H|
|ALE|HIGH during T1 → latch address with 74LS373|
|Bus cycle|4 T-states (T1–T4)|
|Wait state|Extra clock between T2 and T3 for slow memory|
|Memory access time (5 MHz)|460 ns (no wait), 660 ns (1 wait state)|
|74LS373|Address latch – captures address when ALE falls|
|74LS245|Bidirectional data buffer – controlled by DEN and DT/R|
|74LS138|3:8 decoder for MEMR, MEMW, IOR, IOW|
|ROM|Non-volatile; factory/PROM/EPROM/Flash variants|
|RAM|Volatile; SRAM (fast) or DRAM (dense, needs refresh)|
|CS decoding|Connect lower address bits to chip; decode upper bits for CS|

---

_Notes compiled from Lectures 4, 5, and 6 – CS F241: Microprocessors & Interfacing_