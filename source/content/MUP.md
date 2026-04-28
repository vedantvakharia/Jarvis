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


### 8086/8088 Pin Out – Common Pins

#### Address/Data Bus Pins
  
| Pin(s)                         | Name                        | Description                                                                                           |
| ------------------------------ | --------------------------- | ----------------------------------------------------------------------------------------------------- |
| AD0–AD15                       | Address/Data Bus            | **Bidirectional, multiplexed.** Carry low-order address (A0–A15) or data (D0–D15) at different times. |
| A16/S3, A17/S4, A18/S5, A19/S6 | High-Order Address / Status | Carry high-order address bits (20-bit total address space = 1 MB) or status signals.                  |

> **Note on Multiplexing:**
> - When transmitting **memory address** → pins are called `A0–A15`
> - When transmitting **data** → pins are called `D0–D15`

#### Why Intel Multiplexed Address and Data Bus?

- To **reduce pin count** and fit the chip in a specific DIP package.
- **Time Multiplexing:** Address and data are sent at different times on the same pins.
- **Demultiplexing:** An external **latch** (e.g., 8282) is used to separate address from data.
- **Performance Impact:** One extra memory cycle is used to send the address before data.

#### Status Signals (S3–S6)

| Signal     | Description                                         |
| ---------- | --------------------------------------------------- |
| **S6**     | Always logic **0**                                  |
| **S5**     | Reflects the state of the **Interrupt Flag (IF)**   |
| **S4, S3** | Indicate which **memory segment** is being accessed |
#### S4/S3 Segment Encoding

| S4  | S3  | Segment            |
| --- | --- | ------------------ |
| 0   | 0   | Extra Segment (ES) |
| 0   | 1   | Stack Segment (SS) |
| 1   | 0   | Code or No Segment |
| 1   | 1   | Data Segment (DS)  |
#### Other Common Pins

| Pin        | Name                     | Type                | Description                                                                     |
| ---------- | ------------------------ | ------------------- | ------------------------------------------------------------------------------- |
| **BHE/S7** | Bus High Enable / Status | Output (Active Low) | Enables data on upper half of data bus (D8–D15); multiplexed with S7 (always 1) |
| **MN/MX**  | Min/Max Mode Select      | Input               | Selects operating mode (HIGH = Min, LOW = Max)                                  |
| **RD**     | Read                     | Output (Active Low) | Signals a read operation                                                        |
| **NMI**    | Non-Maskable Interrupt   | Input               | Non-maskable interrupt request                                                  |
| **INTR**   | Interrupt Request        | Input               | Maskable interrupt request                                                      |
| **CLK**    | Clock                    | Input               | System clock from 8284A                                                         |
| **RESET**  | Reset                    | Input               | Resets processor to known state                                                 |
| **VCC**    | Power                    | —                   | +5V supply                                                                      |
| **GND**    | Ground                   | —                   | Ground reference                                                                |
#### TEST and READY Pins

| Pin       | Description                                                                                                                                                                                   |
| --------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **TEST**  | Checked by the `WAIT` instruction. 8086 pauses until TEST goes LOW. Used to **synchronize external activities** with the processor. If Test = 1 → Wait; If Test = 0 → 8086 resumes execution. |
| **READY** | Used to **insert wait states**. If LOW, the processor enters wait states and remains idle (used with slow memory/peripherals).                                                                |

#### Multiplexed Address/Data Bus

The 8086 uses **time-division multiplexing** on its AD0–AD15 pins:
1. **T1 (Address Phase):** The processor drives the memory address on AD0–AD15. The **ALE (Address Latch Enable)** signal goes HIGH, telling an external latch (8282/74LS373) to capture the address.
2. **T2–T4 (Data Phase):** The address is held by the latch; AD0–AD15 are now used for data transfer.

This allows a **40-pin DIP** to support a **20-bit address bus + 16-bit data bus**.

### Min/Max Mode Operation

### MN/MX Pin (Pin 33)

| MN/MX State        | Mode             | Description                                                                                     |
| ------------------ | ---------------- | ----------------------------------------------------------------------------------------------- |
| HIGH (tied to VCC) | **Minimum Mode** | Single-processor system; 8086 generates all bus control signals itself                          |
| LOW (tied to GND)  | **Maximum Mode** | Multi-processor / co-processor system; external bus controller (8288) generates control signals |

### Minimum Mode Pins

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

### Maximum Mode Pins

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


---

  

## Summary Diagram: Key Relationships

  

```

Crystal (15 MHz)

      |

   8284A

      |--- ÷3 ---> CLK (5 MHz) ----> 8086 CLK pin

      |--- ÷6 ---> PCLK (2.5 MHz) -> Peripherals

      |---------> RESET (synchronized) -> 8086 RESET pin

      |---------> READY (synchronized) -> 8086 READY pin

  

8086 (40-pin DIP)

      |--- AD0–AD15 (Muxed Address/Data)
      |--- A16/S3–A19/S6 (High Address / Status)
      |--- ALE (strobes address into latch)
      |--- BHE (enables upper byte D8–D15)

      |--- MN/MX (selects operating mode)

      |--- RD / WR (read/write control)

      |--- INTR / NMI (interrupts)

      |--- HOLD / HLDA (DMA bus handshake)

```

