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
## 2. Hardware 

### Device Specifications
  
#### Physical Package

- Both 8086 and 8088 are packaged in **DIP (Dual In-Line Package)** with 40 pins.

|                        | 8086              | 8088                                         |
| ---------------------- | ----------------- | -------------------------------------------- |
| Internal Data Width    | 16-bit            | 16-bit                                       |
| Max Supply Current     | 360 mA            | 340 mA                                       |
| External data bus      | 16-bit (AD0–AD15) | 8-bit (AD0–AD7)                          |
| Address/data mux lines | 16 lines          | 8 lines                                  |
| Latches needed         | 3 × 8282          | 2 × 8282 (one for AD0–7, one for A8–A15) |
| Data transceivers      | 2 × 8286          | 1 × 8286                                 |
| BHE pin                | Present           | Absent (no upper byte)                   |

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

| Pin                   | Name                     | Type                | Description                                                                                                                                                                                                                                             |
| --------------------- | ------------------------ | ------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **BHE/S7**            | Bus High Enable / Status | Output (Active Low) | Enables data on upper half of data bus (D8–D15); multiplexed with S7 (always 1)                                                                                                                                                                         |
| **MN/MX**             | Min/Max Mode Select      | Input               | Selects operating mode (HIGH = Min, LOW = Max)                                                                                                                                                                                                          |
| **RD**                | Read                     | Output (Active Low) | Whenever the read signal is a logic 0, the data bus is receptive to data from the memory or I/O devices connected to the system.                                                                                                                        |
| **NMI**               | Non-Maskable Interrupt   | Input               | Non-maskable interrupt request. Does not check to see whether the IF flag bit is a logic 1. If NMI is activated, this interrupt input uses interrupt vector 2.                                                                                          |
| **INTR**              | Interrupt Request        | Input               | Request a hardware interrupt. If INTR is held<br>high when IF = 1, the 8086/8088 enters an interrupt acknowledge cycle ( becomes active) after the current instruction has completed execution.                                                         |
| **CLK**               | Clock                    | Input               | System clock from 8284A. A duty cycle of 33 % (high for one third of the clocking period and low for two thirds) to provide proper internal timing for the 8086/8088.                                                                                   |
| **RESET**             | Reset                    | Input               | Resets processor to known state                                                                                                                                                                                                                         |
| **VCC**               | Power                    | —                   | +5V supply, ±10 % signal                                                                                                                                                                                                                                |
| **GND**               | Ground                   | —                   | Ground reference                                                                                                                                                                                                                                        |
| **TEST**              |                          |                     | Checked by the `WAIT` instruction. 8086 pauses until TEST goes LOW. Used to **synchronize external activities** with the processor. If Test = 1 → Wait(NOP); If Test = 0 → 8086 resumes execution. Most often connected to the 8087 numeric coprocessor |
| **READY**             |                          |                     | Used to **insert wait states**. If LOW, the processor enters wait states and remains idle (used with slow memory/peripherals).                                                                                                                          |
| **$QS_1$ and $QS_0$** | Queue Status             |                     | Show the status of the internal instruction queue.<br>Provided for access by the numeric coprocessor (8087).                                                                                                                                            |
| **LOCK**              |                          |                     |                                                                                                                                                                                                                                                         |
#### RQ/GT Pins (Request/Grant)

| Pin                | Description                                                                                                                                           |
| ------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| **RQ/GT0, RQ/GT1** | Bidirectional. Used by other bus masters to request and release the local bus (e.g., during DMA). Processor releases bus at end of current bus cycle. |

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

| Pin      | Name                  | Description                                                                                                                                                                                                                                                                                |
| -------- | --------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **ALE**  | Address Latch Enable  | Pulses HIGH during T1 to latch address from multiplexed bus. This address can be a memory address or an I/O port number.                                                                                                                                                                   |
| **DEN**  | Data Enable           | Activates the external **data bus buffer/transceiver**                                                                                                                                                                                                                                     |
| **DT/R** | Data Transmit/Receive | Controls **direction** of data through transceivers: HIGH = Transmit, LOW = Receive                                                                                                                                                                                                        |
| **M/IO** | Memory / I/O Select   | HIGH = **memory** access; LOW = **I/O** access (IN/OUT instructions)                                                                                                                                                                                                                       |
| **WR**   | Write                 | Active low; asserted when processor writes data to memory or I/O port                                                                                                                                                                                                                      |
| **RD**   | Read                  | Active low; asserted during read cycles                                                                                                                                                                                                                                                    |
| **INTA** | Interrupt Acknowledge | Goes LOW when processor accepts an interrupt request                                                                                                                                                                                                                                       |
| **HOLD** | Hold Request          | The hold input requests a direct memory access (DMA). If the HOLD signal is a logic 1, the microprocessor stops executing software and places its address, data, and control bus at the high-impedance state. If the HOLD pin is a logic 0, the microprocessor executes software normally. |
| **HLDA** | Hold Acknowledge      | Output; asserted HIGH when processor grants bus control (accepts HOLD)                                                                                                                                                                                                                     |
| **SS0**  | SS0 Status Line       | Equivalent to the $S_0$ pin in maximum mode operation of the microprocessor. This signal is combined with IO/M and DT/R to<br>decode the function of the current bus cycle.                                                                                                                |

##### Bus cycle status (8088) 

| **IO/M** | **DT/R** | **SS0** | **Function**          |
| -------- | -------- | ------- | --------------------- |
| 0        | 0        | 0       | Interrupt acknowledge |
| 0        | 0        | 1       | Memory read           |
| 0        | 1        | 0       | Memory write          |
| 0        | 1        | 1       | Halt                  |
| 1        | 0        | 0       | Opcode fetch          |
| 1        | 0        | 1       | I/O read              |
| 1        | 1        | 0       | I/O write             |
| 1        | 1        | 1       | Passive               |

#### Maximum Mode Pins

In **Maximum Mode**, the 8086 works with an **8288 Bus Controller** which decodes status signals (S0, S1, S2) to generate bus control signals. Connect the MN/MX pin to ground.

| Pin                                                                                                       | **Name**           | Description                                                                                                                                                                                                                                                                        |
| --------------------------------------------------------------------------------------------------------- | ------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| $\overline{\mathbf{S_2}}, \overline{\mathbf{S_1}},$ and $\overline{\mathbf{S_0}}$                         | Status Bits        | Indicate the function of the current bus cycle. These signals are normally decoded by the 8288 bus controller                                                                                                                                                                      |
| $\overline{\mathbf{RQ}}/ \overline{\mathbf{GT_1}}$ and $\overline{\mathbf{RQ}}/ \overline{\mathbf{GT_0}}$ | Request/grant pins | Request direct memory accesses (DMA) during<br>maximum mode operation. These lines are bidirectional and are used to both request and grant a DMA operation.                                                                                                                       |
| $\overline{\mathbf{LOCK}}$                                                                                |                    | Output signal activated by the `LOCK` prefix instruction.<br>Goes LOW while executing the `LOCK`-prefixed instruction to **prevent other bus masters from taking control** of the system bus.<br>Example: `LOCK MOV CX, [4000H]` — bus is locked for duration of this instruction. |
| **$QS_1$ and $QS_0$**                                                                                     |                    | Show the status of the internal instruction queue.<br>Provided for access by the numeric coprocessor (8087).                                                                                                                                                                       |

##### Bus Controller 8288

| Pine                           | Name                              | Type   | Description                                                                                                                         |
| ------------------------------ | --------------------------------- | ------ | ----------------------------------------------------------------------------------------------------------------------------------- |
| **$S_2, S_1$ and $S_0$**       | Status inputs                     | Input  | Connected to the status output pins, decoded to generate the timing signals                                                         |
| **CLK**                        | Clock                             | Input  | Connected to the CLK output pin of the 8284A                                                                                        |
| **ALE**                        | Address Latch Enable              | Output | Demultiplex the address/data bus                                                                                                    |
| DEN                            | Data Bus Enable                   | Output | Controls the bidirectional data bus buffers in the system                                                                           |
| DT/$\overline{\mathbf{R}}$     | Data Transmit/Receive             | Output | Control the direction of the bidirectional data bus buffers.                                                                        |
| $\overline{\mathbf{AEN}}$      | Address Enable                    | Input  | Enable the memory control signals                                                                                                   |
| CEN                            | Control Enable                    | Input  | Enables the command output pins on the 8288                                                                                         |
| IOB                            | I/O Bus mode                      | Input  | Selects either the I/O bus mode or system bus mode operation                                                                        |
| $\overline{\mathbf{AIOWC}}$    | Advanced I/O Write                | Output | Provide I/O with an advanced I/O write control signal                                                                               |
| $\overline{\mathbf{IORC}}$     | I/O read command                  | Output | Provides I/O with its read control signal.                                                                                          |
| $\overline{\mathbf{IOWC}}$     | I/O write command                 | Output | Provides I/O with its main write signal.                                                                                            |
| $\overline{\mathbf{AMWT}}$     | Advanced Memory Write Control Pin |        | Provides memory with an early or advanced write signal                                                                              |
| $\overline{\mathbf{MWTC}}$     | Memory Write Control Pin          |        | Provides memory with its normal write control signal                                                                                |
| $\overline{\mathbf{MRDC}}$     | Memory Read Control Pin           |        | Provides memory with a read control signal                                                                                          |
| $\overline{\mathbf{INTA}}$     | Interrupt Acknowledge             | Output | Acknowledges an interrupt request input applied to the INTR pin                                                                     |
| MCE/$\overline{\mathbf{PDEN}}$ | Master Cascade/Peripheral Data    | Output | Selects cascade operation for an interrupt controller if IOB is grounded, and enables the I/O bus transceivers if IOB is tied high. |
##### Bus control function generated by the bus controller (8288)

These replace the min-mode control pins and are decoded by the 8288:

| $\overline{\mathbf{S_2}}$ | $\overline{\mathbf{S_1}}$ | $\overline{\mathbf{S_0}}$ | Bus Cycle Function     |
| ------------------------- | ------------------------- | ------------------------- | ---------------------- |
| 0                         | 0                         | 0                         | Interrupt Acknowledge  |
| 0                         | 0                         | 1                         | I/O Read               |
| 0                         | 1                         | 0                         | I/O Write              |
| 0                         | 1                         | 1                         | Halt                   |
| 1                         | 0                         | 0                         | Opcode Fetch           |
| 1                         | 0                         | 1                         | Memory Read            |
| 1                         | 1                         | 0                         | Memory Write           |
| 1                         | 1                         | 1                         | Passive (no operation) |
##### Queue Status

| **$QS_1$​** | **$QS_0$​** | **Function**              |
| ----------- | ----------- | ------------------------- |
| 0           | 0           | Queue is idle             |
| 0           | 1           | First byte of opcode      |
| 1           | 0           | Queue is empty            |
| 1           | 1           | Subsequent byte of opcode |


---
### Bus Demultiplexing

#### The Bus Cycle – 4 Clock States

Every memory/IO access takes place over a **bus cycle** made up of clock states:

```
T1          T2          T3          T4
|-----------|-----------|-----------|-----------|
  Address     ← Data valid window →
  on AD bus              Data on AD bus
  ALE HIGH
  (latch it!)
```

|State|What Happens|
|---|---|
|**T1**|8086 drives the **address** on AD0–AD15 and A16–A19. **ALE pulses HIGH** to signal valid address.|
|**T2**|Address removed from bus. Bus turns around — now driven by memory (read) or CPU (write).|
|**T3**|**Data is valid** on AD0–AD15.|
|**T4**|Bus cycle ends. Data sampled.|

> If `READY` is LOW, **wait states ($T_w$)** are inserted between T3 and T4 to accommodate slow memory.


#### The Demultiplexing Circuit

Three key external chips handle demultiplexing:

```
┌──────────────────────────────────────────┐
│                  8088 CPU                │
│                                          │
│  AD0–AD7 ──────────────────────────────► │─── (to Latch 1 AND Data Bus)
│  A8–A15  ──────────────────────────────► │─── (to Latch 2 only)
│  A16–A19 ──────────────────────────────► │─── (to Latch 3 only)
│                                          │
│  ALE  ─────────────────────────────────► │─── STB of all latches
│  DEN  ─────────────────────────────────► │─── OE of data transceiver
│  DT/R ─────────────────────────────────► │─── T of data transceiver
└──────────────────────────────────────────┘

         Latch 1 (8282)        Latch 2 (8282)       Latch 3 (8282)
         AD0–AD7 → A0–A7      A8–A15 → A8–A15      A16–A19 → A16–A19
              │
              ▼
         Transceiver (8286)
         AD0–AD7 ↔ D0–D7 (system data bus)

         └── A0–A7 ──┐
         └── A8–A15 ─┤──► 20-bit Address Bus → Memory / IO
         └── A16–A19 ┘
```

#### The Three Key Control Signals

##### 1. ALE – Address Latch Enable
- Goes **HIGH during T1** when the address is valid on the AD lines.
- Connected to the **STB (strobe)** input of the 8282 latch.
- On the **falling edge of ALE**, the latch captures and holds the address.
- After T1, ALE goes LOW — the latch holds the address **transparently**, freeing the AD lines for data.

##### 2. DEN – Data Enable (Active LOW)
- Controls the **output enable** of the data bus transceivers (8286).
- Goes LOW during T2–T4 to enable data onto the system data bus.
- Keeps data bus **disabled (high-Z)** when not in use to avoid bus conflicts.

##### 3. DT/R̄ – Data Transmit/Receive
- Controls the **direction** of the data transceiver:
    - **HIGH (Transmit)** → CPU is writing data **to** memory/IO
    - **LOW (Receive)** → CPU is reading data **from** memory/IO

#### The 8282 Latch (Address Latch)

The **8282** (or equivalent 74LS373) is an octal D-type latch:

```
       ALE ──────────────► STB (Strobe)
    AD0–AD7 ─────────────► D0–D7 (inputs)
                           Q0–Q7 ──────► A0–A7 (stable address output)
```

**How it works:**
- While STB (ALE) is **HIGH**: outputs follow inputs (transparent mode)
- When STB (ALE) goes **LOW**: outputs are **latched/frozen** — address is held stable

Three 8282s are used:

|Latch|Input Pins|Output|
|---|---|---|
|Latch 1|AD0–AD7|A0–A7|
|Latch 2|AD8–AD15|A8–A15|
|Latch 3|A16/S3–A19/S6|A16–A19|

#### The 8286 Transceiver (Data Bus Buffer)

The **8286** is a bidirectional octal bus transceiver used to buffer the data bus:

```
    DT/R̄ ─────────────► T (direction control)
    DEN̄  ─────────────► OE̅ (output enable, active low)
    AD0–AD7 ──────────► A side
                        B side ────────► D0–D7 (system data bus)
```

- **DT/R̄ = 1**: Data flows A→B (CPU writing to memory)
- **DT/R̄ = 0**: Data flows B→A (CPU reading from memory)
- **DEN̄ = 1**: Transceiver disabled (high-impedance) — bus is isolated

#### Timing Diagram – Read Cycle

```
CLK    ─┐ ┌─┐ ┌─┐ ┌─┐ ┌─
         └─┘ └─┘ └─┘ └─┘
          T1  T2  T3  T4

ALE    ─┐  ┌──┐
         └──┘  └──────────   (HIGH during T1, latches address)

AD0-15  [  ADDRESS  ][   DATA VALID   ]
          (T1)         (T2 → T4)

A0-15   [  ADDRESS STABLE (held by latch)                ]
          (latched at falling edge of ALE, held through T4)

DT/R̄   ────────────────────── LOW (receive mode, reading)

DEN̄    ────────┐        ┌──── LOW during T2–T4 (data enabled)
                └────────┘
```

#### Timing Diagram – Write Cycle

```
CLK    ─┐ ┌─┐ ┌─┐ ┌─┐ ┌─
         └─┘ └─┘ └─┘ └─┘
          T1  T2  T3  T4

ALE    ─┐  ┌──┐
         └──┘  └──────────   (latches address)

AD0-15  [  ADDRESS  ][ DATA FROM CPU  ]

A0-15   [  ADDRESS STABLE (latched)                      ]

DT/R̄   ──────────────────── HIGH (transmit mode, writing)

DEN̄    ────────┐        ┌──
                └────────┘    (LOW during T2–T4, data enabled)
```

#### Summary

| Step | Signal                    | Action                                  |
| ---- | ------------------------- | --------------------------------------- |
| 1    | **ALE HIGH**              | 8086/88 puts address on AD lines        |
| 2    | **ALE falls LOW**         | 8282 latch captures & holds the address |
| 3    | **AD lines free**         | Now carry data instead of address       |
| 4    | **DT/R̄ set**             | Direction of data flow established      |
| 5    | $\overline{\mathbf{DEN}}$ | 8286 transceiver enabled, data flows    |
| 6    | **T4 complete**           | Data sampled, bus cycle ends            |

---
### Bus Buffering (74LS245)

#### Why Buffering is Needed
- The 8086 can only **drive a limited number of devices** (fan-out limitation).
- Buffers increase the **drive strength** of the bus by placing a high-drive-capability chip between the processor and the rest of the system, so the processor only drives one input (the buffer), and the buffer does the heavy lifting of driving all the other devices.
- They also improve **signal integrity** (reduce noise and distortion).

| Chip               | Type              | Purpose                                                    |
| ------------------ | ----------------- | ---------------------------------------------------------- |
| **8282 / 74LS373** | Octal Latch       | Captures and holds address during T1; demultiplexes AD bus |
| **8286 / 74LS245** | Octal Transceiver | Bidirectional data buffer; controlled by DEN and DT/R      |
| **8288**           | Bus Controller    | Max-mode only; decodes S0–S2 into all bus control signals  |
| **8284A**          | Clock Generator   | Provides CLK, RESET, READY to the 8086                     |
#### Things latched

1. **Address Bus (Unidirectional) -** The address bus flows in one direction only — out of the processor but the AD0–AD15 pins are multiplexed. So, 8282 or 74LS373 latch capture and hold  the address while the pins switch to data mode. 
   
   The **8282** is an octal latch (8 bits wide, so you need two for a 16-bit address, plus one for A16–A19 and BHE).
   **How it works:**
   - During **T1**, the 8086 puts the address on AD0–AD15 and simultaneously pulses **ALE HIGH**.
   - The 8282 latch is **transparent** while ALE is HIGH — the address passes straight through.
   - When **ALE goes LOW** (end of T1), the latch **freezes** the address and holds it stable for the rest of the bus cycle (T2–T4), even as the 8086 repurposes those same pins for data.
   - The latched address drives the memory chips and I/O devices throughout the cycle.

```c title:Timing
CLK:   |‾‾‾|___|‾‾‾|___|‾‾‾|___|‾‾‾|
         T1      T2      T3      T4

ALE:   |‾‾‾‾|_________________________
              ↑ falls — address locked in latch

AD0–15:|ADDRESS | ←——— DATA ————————→|
```

2. **Data Bus (Bidirectional) -** The data bus flows both ways — into the processor during reads, out during writes. A simple latch won't work here because you need directional control. This requires 8286 (or 74LS245) which is a transceiver (bidirectional buffer).
   
   The **8286** is an octal **bidirectional** buffer. Two of them give you a full 16-bit data bus buffer. It has two control pins:
   - **OE (Output Enable)** — connected to the processor's **DEN (Data Enable)** signal
   - **T (Transmit)** — connected to the processor's **DT/R (Data Transmit/Receive)** signal

| $\overline{\mathbf{DEN}}$ | DT/R | Transceiver State                                             |
| ------------------------- | ---- | ------------------------------------------------------------- |
| HIGH                      | —    | **Disabled** (high impedance, bus isolated from processor)    |
| LOW                       | HIGH | **Transmit** — data flows from processor → system bus (Write) |
| LOW                       | LOW  | **Receive** — data flows from system bus → processor (Read)   |

**$\overline{\mathbf{DEN}}$** goes LOW only when valid data needs to pass. During the address phase (T1) and during wait states, DEN is HIGH so the transceiver is disabled, preventing bus conflicts.

**DT/R** is set by the 8086 based on whether the current cycle is a read or write, well before data is actually transferred, giving the transceiver time to switch direction.

3. BHE - The **BHE (Bus High Enable)** signal is also multiplexed — it's valid during T1 alongside the address. So it too must be latched by the 8282 (or a dedicated latch) along with A0–A19 to tell memory whether the upper byte of the data bus (D8–D15) is being used.

#### Schmitt Trigger Action

The 74LS245 uses Schmitt trigger inputs which provide hysteresis (upper and lower thresholds), improving noise immunity on the data bus.

#### Complete Demultiplexed & Buffered System

The full 8086 minimum-mode system has:
- **Latches (74LS373)** → separate address from data → produce buffered address bus A0–A19
- **Bidirectional Buffers (74LS245)** → amplify data bus D0–D15
- **Unidirectional Buffer (74LS244)** → buffer control signals (RD, WR, M/IO)

#### The Demultiplexing + Buffering Circuit

```
                        ALE
                         |
  8086                   ▼
  AD0–AD15 ──────> [ 8282 Latch ] ──────> A0–A15 (Address Bus to memory/IO)
                                   
  AD0–AD15 ──────> [ 8286 Transceiver ] <──────> D0–D15 (Data Bus)
                         ▲           ▲
                        DEN         DT/R
```

The **ALE, DEN, and DT/R** signals from the 8086 (in minimum mode) coordinate exactly when each chip is active and in which direction.

#### Maximum Mode: The 8288 Bus Controller

In **maximum mode**, the 8086 doesn't generate ALE, DEN, DT/R, RD, or WR directly. Instead it outputs **S0, S1, S2** status signals. The **8288 Bus Controller** decodes these and generates all the buffering control signals:

```
8086 → S0, S1, S2 → [ 8288 Bus Controller ] → ALE, DEN, DT/R, MRDC, MWTC, IORC, IOWC
```

The 8288 generates separate read/write strobes for memory and I/O (MRDC, MWTC, IORC, IOWC), which is cleaner and more powerful than the min-mode single M/IO pin approach.

---
---


## 3. 8284A Clock Generator

The **8284A** is a dedicated clock generation chip used with the 8086/8088. It is connected via the **CLK pin (Pin 19)** on the 8086.

### Basic Functions

1. **Clock generation** – Divides crystal frequency to produce CLK for 8086.
2. **RESET synchronization** – Ensures clean, synchronized reset signal.
3. **READY synchronization** – Manages wait states for slow peripherals.
4. **Peripheral clock (PCLK)** – Provides a lower-frequency clock for peripherals.

### Clock Generation Process

1. Crystal is connected to **X1** and **X2** pins of 8284A to.
2. The internal **XTAL OSC** generates a square wave at the crystal frequency (e.g., 15 MHz).
3. The square-wave signal is fed to an AND gate and to an inverting buffer that provides the OSC output signal.
4. A **2-to-1 MUX** selects between crystal (XTAL) or external frequency input (EFI), controlled by the **F/C** pin.
5. The MUX output drives a **÷3 counter** (e.g., 15 MHz → 5 MHz CLK for 8086).
6. The ÷3 output also drives a **÷2 counter** → 2.5 MHz **PCLK** for peripherals.

### 8284A Pin Summary

| Pin                             | Type   | Description                                                                                                                         |
| ------------------------------- | ------ | ----------------------------------------------------------------------------------------------------------------------------------- |
| **X1, X2**                      |        | Crystal oscillator connections                                                                                                      |
| **F/$\overline{\mathbf{C}}$**   | Input  | Selects XTAL oscillator (HIGH) by connecting to VCC or EFI external input (LOW) by connecting to GND                                |
| **OSC**                         | Output | TTL-level signal that is at the same frequency as the crystal or EFI input. Used as EFI for other 8284As in multi-processor systems |
| **CSYNC**                       |        | Clock synchronization in multi-processor systems; grounded when using crystal                                                       |
| **CLK**                         | Output | Output to 8086 CLK pin (crystal freq ÷ 3) and has a 33% duty cycle                                                                  |
| **PCLK**                        | Output | Peripheral Clock output (crystal freq ÷ 6) and has a 50% duty cycle                                                                 |
| **RDY1, RDY2**                  | Input  | Ready inputs from bus devices to cause wait states                                                                                  |
| **AEN1, AEN2**                  | Input  | Address Enable – gate the RDY signals; control wait state generation                                                                |
| **READY**                       | Output | Output pin connected to the 8086/8088 READY input and is synchronized with the RDY1 and RDY2 inputs.                                |
| **$\overline{\mathbf{ASYNC}}$** | Input  | Selects 1-stage (synchronous) or 2-stage synchronization (for slow async devices, to avoid metastability)                           |
| **$\overline{\mathbf{RES}}$     |        | Active LOW input to 8284A; connected to an RC network that provides power-on resetting.                                             |
| **RESET**                       |        | Synchronized RESET output to 8086                                                                                                   |
| **VCC**                         |        | +5V power with a tolerance of ±10%                                                                                                  |
| **GND**                         |        | Ground                                                                                                                              |
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
---
## 4. MEMORY INTERFACE

### Address Decoding
The 8086 has **20 address lines (A0–A19)**, so it can address **1 MB** of memory space. But a single memory chip (like the 2716 EPROM) only has **11 address lines**, covering just **2 KB**. The decoder watches the **upper address lines** and activates the chip's CS (Chip Select) pin **only when the address falls within the chip's assigned range**.

When the 8086 wants to access a memory location, it puts the full 20-bit address on the bus. We split that address into two parts:

```
A19  A18  A17  A16  A15  A14  A13  A12  A11 | A10 ... A0
|___________________________________________|   |_________|
         Upper 9 bits                           Lower 11 bits
    → go to the DECODER                         → go directly
    → generate CS signal                          to the chip
```

The **lower 11 bits (A0–A10)** go directly to the memory chip's address pins — they select _which byte_ inside the chip to read/write.

The **upper 9 bits (A11–A19)** go to the decoder — they determine _which chip_ gets selected.


#### NAND Gate Decoder

The memory chip's **CS pin is active LOW** — meaning the chip is selected when CS = 0, and deselected when CS = 1.

A NAND gate outputs **LOW only when ALL inputs are HIGH**. This is perfect:

```
If all upper address bits are the specific pattern we want → NAND output = LOW → chip selected ✓
If any bit differs from the pattern → NAND output = HIGH → chip deselected ✓
```

##### Example 1: Placing the 2716 at FF800H–FFFFFH

###### Step 1 — Write out the address range in binary

```
FF800H = 1111 1111 1000 0000 0000
FFFFFH = 1111 1111 1111 1111 1111
```

Line them up by bit position:

```
Bit:   A19 A18 A17 A16 A15 A14 A13 A12 A11 | A10 A9 ... A0
FF800:  1   1   1   1   1   1   1   1   1  |  0   0 ...  0
FFFFF:  1   1   1   1   1   1   1   1   1  |  1   1 ...  1
```

###### Step 2 — Identify fixed vs. variable bits
- **A11–A19** are all **1** across the entire range → these are **fixed** → go to the decoder
- **A0–A10** vary (0 to all 1s) → these go directly to the chip's address pins

###### Step 3 — Build the decoder

Since all 9 upper bits (A11–A19) must be HIGH for this chip to be selected, connect them all directly to a **9-input NAND gate (74ALS133, which is a 13-input NAND)**:

```
A11 ─┐
A12 ─┤
A13 ─┤
A14 ─┤  [74ALS133]──── CS' of 2716
A15 ─┤  NAND gate
A16 ─┤
A17 ─┤
A18 ─┤
A19 ─┘
```

Also connect **M/IO (inverted)** to one of the spare inputs of the NAND gate, so the chip is only selected during **memory** accesses (not I/O):

```
IO/M' ──[NOT gate]──→ input of NAND
```

When IO/M = 0 (memory cycle), the inverted signal = 1, so the NAND gate can still activate. When IO/M = 1 (I/O cycle), inverted = 0, NAND output stays HIGH → chip not selected.

###### Step 4 — Connect lower address bits

```
A0  → chip pin A0
A1  → chip pin A1
...
A10 → chip pin A10
```

###### Step 5 — Connect RD to OE

The chip's **OE (Output Enable)** is connected to the **RD** signal from the 8086, so data only appears on the bus during a read cycle.

**Final circuit:**

```
8086 Bus:
  A0–A10  ──────────────────────────→ Address pins of 2716
  A11–A19 ──┐
             ├──→ [NAND gate] ──────→ CS' of 2716
  IO/M' ───[INV]─┘
  RD      ──────────────────────────→ OE of 2716
```

##### Example 2: Selecting DF800H–DFFFFH 

This is where it gets slightly more interesting — not all upper bits are 1.

###### Step 1 — Write out the range in binary

```
DF800H = 1101 1111 1000 0000 0000
DFFFFH = 1101 1111 1111 1111 1111
```

###### Step 2 — Read off the upper 9 bits (A11–A19)

```
Bit:   A19 A18 A17 A16 A15 A14 A13 A12 A11
Value:  1   1   0   1   1   1   1   1   1
```

- A17 = **0** ← this is the tricky one
- All others = **1**

###### Step 3 — Handle the 0-bit

A NAND gate outputs LOW when ALL inputs are HIGH. But A17 needs to be **0** for our address.

Solution: **Invert A17 before feeding it into the NAND gate.**

```
A17 ──[NOT gate]──→ NAND input
```

Now when A17 = 0, the inverted signal = 1, satisfying the NAND gate's requirement.

###### Step 4 — Build the modified decoder

```
A11 ─┐
A12 ─┤
A13 ─┤
A14 ─┤
A15 ─┤  [NAND gate] ──→ CS' of memory chip
A16 ─┤
A17 ─[NOT]─┤
A18 ─┤
A19 ─┘
+ IO/M' ─[NOT]─┘  (memory-only access)
```

**Rule:** For each upper address bit:

- If the bit is **1** in the target range → connect **directly** to NAND input
- If the bit is **0** in the target range → connect through an **inverter** to NAND input

##### General Design Procedure (Step-by-Step)

```
1. Convert the start address to 20-bit binary
2. Identify upper bits (chip address pins determine the split point)
3. For each upper bit:
      bit = 1 → connect directly to NAND input
      bit = 0 → connect through inverter to NAND input
4. Connect IO/M' through inverter to NAND (memory-only selection)
5. NAND output → CS' of the memory chip
6. Lower bits → directly to chip address pins
7. RD → OE of the chip
8. WR → WE of the chip (for RAM)
   
   
n = total address bits of processor
p = address bits of memory chip (= log₂(chip size))
Required decoder inputs = n - p
```


---

#### 74LS138 3-to-8 Line Decoder

The **74LS138** is a high-speed CMOS/TTL integrated circuit commonly used in microprocessor-based systems for memory and I/O decoding. It converts a 3-bit binary input into one of eight mutually exclusive active-low outputs.
* **Inputs:** 3 Selection Inputs (A, B, C).
* **Enable Pins:** 3 Enable Inputs ($\overline{\mathbf{G2A}}$,$\overline{\mathbf{G2B}}$, and G1).
* **Outputs:** 8 Active-Low Outputs ($\overline{\mathbf{0}}$ through $\overline{\mathbf{7}}$).
* **Logic Rule:** Only one output can be low (logic 0) at any given time, provided the chip is enabled.

1.  **Active-Low Outputs:** Remember that the EPROM $\overline{\mathbf{CE}}$ (Chip Enable) is active-low, which matches the 74LS138 outputs.
2.  **Expansion:** Multiple 74LS138s can be cascaded using the three enable inputs to decode even larger memory maps.
3.  **$\overline{\mathbf{RD}}$ Signal:** In the circuit, the $\overline{\mathbf{RD}}$ (Read) signal from the 8088 is connected to the $\overline{\mathbf{OE}}$$ (Output Enable) of all EPROMs. This ensures that the selected EPROM only drives the data bus during a valid read cycle.
##### Logic Functionality & Truth Table

###### Enable Conditions
For the decoder to function, all three enable inputs must be in their "active" state simultaneously:
1.  **G1:** Must be **High** (Logic 1).
2.  **$\overline{\mathbf{G2A}}$:** Must be **Low** (Logic 0).
3.  **$\overline{\mathbf{G2B}}$:** Must be **Low** (Logic 0).

If any of these conditions are not met, all outputs remain **High** (Logic 1), regardless of the selection inputs (A, B, C).

| Enable (G1) | Enable ($\overline{\mathbf{G2A}}$) | Enable ($\overline{\mathbf{G2B}}$) | Select C | Select B | Select A |      Active Output      |
| :---------: | :--------------------------------: | :--------------------------------: | :------: | :------: | :------: | :---------------------: |
|      0      |                 X                  |                 X                  |    X     |    X     |    X     |      None (All 1)       |
|      X      |                 1                  |                 X                  |    X     |    X     |    X     |      None (All 1)       |
|      X      |                 X                  |                 1                  |    X     |    X     |    X     |      None (All 1)       |
|      1      |                 0                  |                 0                  |    0     |    0     |    0     | $\overline{\mathbf{0}}$ |
|      1      |                 0                  |                 0                  |    0     |    0     |    1     | $\overline{\mathbf{1}}$ |
|      1      |                 0                  |                 0                  |    0     |    1     |    0     | $\overline{\mathbf{2}}$ |
|      1      |                 0                  |                 0                  |    0     |    1     |    1     | $\overline{\mathbf{3}}$ |
|      1      |                 0                  |                 0                  |    1     |    0     |    0     | $\overline{\mathbf{4}}$ |
|      1      |                 0                  |                 0                  |    1     |    0     |    1     | $\overline{\mathbf{5}}$ |
|      1      |                 0                  |                 0                  |    1     |    1     |    0     | $\overline{\mathbf{6}}$ |
|      1      |                 0                  |                 0                  |    1     |    1     |    1     | $\overline{\mathbf{7}}$ |

##### 8088 System with 64K EPROM

In this application, a 74LS138 is used to interface **eight 2764 EPROMs** to an 8088 microprocessor.
**Total Capacity:** 8 chips $\\times$ 8K = **64K Bytes**. **Target Memory Range:** F0000H – FFFFFH.
1.  **Enable Logic (The "High-Order" Bits):**
    * **$A_{19}, A_{18}, A_{17}$:** Connected to a 3-input NAND gate. The output of the NAND gate goes to $\\overline{G2B}$. For the NAND output to be Low (Active), $A_{19}, A_{18}, A_{17}$ must all be **1**.
    * **$A_{16}$:** Connected directly to **G1**. It must be **1** to enable the chip.
    * $\overline{\mathbf{G2A}}$:** Hard-wired to **Ground** (always active).
    * *Result:* The decoder is only active when $A_{19}A_{18}A_{17}A_{16} = 1111$ (Hexadecimal 'F').
2.  **Selection Logic (The "Device Select" Bits):**
    * **$A_{15}, A_{14}, A_{13}$:** Connected to the Selection Inputs **C, B, A** respectively. These bits determine which of the eight EPROMs is enabled.
3.  **Local Addressing (The "Offset" Bits):**
    * **$A_{12} – A_0$:** Connected directly to the address pins of all eight EPROMs. These 13 bits provide the 8K ($2^{13}$) unique locations within each chip.

##### Address Range Calculations

To find the address range of any specific device, we fix the "Enable" and "Select" bits and vary the "Don't Care" (X) bits from all 0s to all 1s.

###### Example 10-2: Total Decoder Range (64K Span)
The decoder is active when $A_{19}-A_{16}$ are `1111`. The Select bits ($A_{15}-A_{13}$) and Offset bits ($A_{12}-A_0$) can be anything (X).
* **Start:** `1111` 0000 0000 0000 0000 = **F0000H**
* **End:** `1111` 1111 1111 1111 1111 = **FFFFFH**

###### Example 10-3: Range for EPROM 0 (Connected to Output $\\overline{0}$)
* **Constraint:** Select bits CBA must be `000`.
* **Binary Pattern:** `1111` (Enables) `000` (Selects) `X XXXX XXXX XXXX` (Offset).
* **Start:** `1111 0000 0000 0000 0000` = **F0000H**
* **End:** `1111 0001 1111 1111 1111` = **F1FFFH**

###### Example 10-4: Range for EPROM 1 (Connected to Output $\\overline{1}$)
* **Constraint:** Select bits CBA must be `001`.
* **Binary Pattern:** `1111` (Enables) `001` (Selects) `X XXXX XXXX XXXX` (Offset).
* **Start:** `1111 0010 0000 0000 0000` = **F2000H**
* **End:** `1111 0011 1111 1111 1111` = **F3FFFH**


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

| Parameter            | Description                           | Value  |
| -------------------- | ------------------------------------- | ------ |
| **TCLAV**            | Clock to Address Valid                | 110 ns |
| **TCLRL**            | Clock to Read Line (RD) active        | —      |
| **TDVCL**            | Data Valid to Clock (data setup time) | 30 ns  |
| Clock period (5 MHz) | 1/5MHz                                | 200 ns |

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
## 8. Memory Types & Chips

### Memory Chip Pin Overview

| Pin Type          | Description                                        |
| ----------------- | -------------------------------------------------- |
| Address pins (An) | Select the memory location. pins = log₂(locations) |
| Data pins (Dn)    | Carry data in/out; typically bidirectional for RAM |
| CS / CE / S       | Chip Select – enables the chip for access          |
| OE                | Output Enable – enables data output (active LOW)   |
| WE / R/W          | Write Enable or Read/Write control                 |

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
### Example: 2716 EPROM (2K × 8)

- 11 address lines (A0–A10) → 2K = 2048 locations
- 8 data output lines (O0–O7)
- Pins: **CS** (Chip Select), **PD/PGM** (Power Down / Program), **VPP** (programming voltage)
- Used to store BIOS in early PC systems