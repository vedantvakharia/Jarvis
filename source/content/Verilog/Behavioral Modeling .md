### Delay-Based Timing Control (`#`)

This control delays the execution of a procedural statement for a specified number of time units.

- **Regular Delay -** This is the most common form. The `#` operator precedes a statement and suspends its execution for the specified delay.
```verilog
// Delays execution of the entire statement by 10 time units.
#<delay> statement;
#10 y = 1;
```

- **Intra-assignment Delay -** This delay is placed on the right of the assignment operator. It works differently from a regular delay: the expression on the right-hand side is evaluated **immediately**, and the result is stored. The assignment to the left-hand side variable is then postponed by the specified delay.
```verilog
variable = #<delay> expression;
// x and z are evaluated at the current time,
// but y is updated with the result 5 time units later.
y = #5 x + z;
```

- **Zero Delay -** This is a special case used to help control the order of execution within a single simulation time step. A statement with a `#0` delay is executed last, after all other statements in that time step without a delay have been executed. This can help avoid race conditions in simulation. Syntax - `#0 statement;`
Based on the provided sources, Verilog has three main categories of procedural timing controls that use operators like `@` and `#`.

### Event-Based Timing Control (`@`)

This control suspends execution of a statement until a specific event—a change in the value of a signal occurs.

- **Edge-Triggered Events -** This is the primary control for modeling synchronous sequential logic (flip-flops). The block executes only on a specific signal transition.
    - **`posedge`**: Triggers on a positive transition (e.g., 0 to 1).
    - **`negedge`**: Triggers on a negative transition (e.g., 1 to 0).

```Verilog
// Update q with the value of d at the positive edge of the clock.
always @(posedge clock)
	q <= d;
```

- **Level-Triggered Events (Event OR / Sensitivity List) -** This control is used for modeling combinational logic. The block executes whenever any signal in its sensitivity list changes value. The signals are joined by the or keyword (or a comma in Verilog-2001).

```Verilog
// Re-evaluate the logic if reset, clock, or d changes.
always @(reset or clock or d)
```

- **Implicit Events (@*) -** This is a special form of level-sensitive event control introduced in Verilog-2001. The @* automatically creates a sensitivity list of all signals that are read inside the always block. It is the modern, recommended way to model combinational logic to prevent accidentally creating latches.

- **Named Events -** Verilog allows you to declare a named event, which can then be triggered manually. The always block can wait for this named event. An event is declared with the keyword event and triggered with the -> operator.

```Verilog
event received_data; // Declare the event
...
->received_data; // Trigger the event
...
always @(received_data) // Wait for the event to be triggered
	...
```

### Level-Sensitive Timing Control (`wait`)

This control is different from `@` because it waits for a condition to be true, not for a signal to change. The `wait` statement continuously monitors the value of an expression.

```Verilog
wait (expression) statement;
// Wait for count_enable to become true (logical 1),
// then execute the assignment.
wait (count_enable) count = count + 1;
```

## Initial Statement

An`initial` statement constitutes an`initial` block and is one of the two main structured procedure statements in Verilog, the other being the `always` statement. All behavioral statements in Verilog must be contained within either an `initial` or an `always` block.

The primary purpose of an `initial` block is to describe behaviors that are executed only once during a simulation run. Consequently, they are typically used for tasks such as:

- Initialization of variables (registers, clocks, etc.).
- Generating stimulus waveforms in a test bench.
- Monitoring processes that are executed only once.
- Controlling the simulation run, for example, using`$finish` to terminate it.

An`initial` block is considered a "single-pass behavior" because it executes its statements and then expires. For this reason, `initial` statements are not synthesizable and are not used to model the behavior of actual hardware; their main role is in creating a test bench for simulation.

### Execution Characteristics

- **Start Time -** Every `initial` block starts executing concurrently at the very beginning of a simulation, at time 0.
- **Single Execution -** An `initial` block executes its statements exactly once during a simulation and then becomes inactive.
- **Concurrency -** If there are multiple `initial` blocks in a module, they all start to execute in parallel at a time. Each`initial` statement represents a separate “activity flow” that finishes independently of the others.
- **Statement Grouping -** An `initial` block can contain a single statement. If multiple statements are needed, they must be grouped using the keywords`begin` and `end`.
- **Timing Control -** Delays can be specified within an `initial` block using the `#<delay>` syntax. When a delay is encountered, the execution of that statement is postponed by the specified number of time units.
- **Nesting -** An `initial` statement cannot be nested inside another `initial` or `always` statement.


```verilog
initial
    m = 1'b0; // Executes at time 0

initial
begin
    #5 a = 1'b1; // Executes at time 5
    #25 b = 1'b0; // Executes at time 30 (5 + 25)
end

initial
begin
    #10 x = 1'b0; // Executes at time 10
    #25 y = 1'b1; // Executes at time 35 (10 + 25)
end

/* The execution sequence of the statements inside these blocks is as follows
1. Time 0: m is assigned the value 1'b0. 
2. Time 5: a is assigned the value 1'b1. 
3. Time 10: x is assigned the value 1'b0. 
4. Time 30: b is assigned the value 1'b0. 
5. Time 35: y is assigned the value 1'b1.
*/


// Sequential Circuits
// Usssing repeat
Initial 
begin 
clock = 1'b0; 
repeat (30) 
#10 clock = ~clock;
end 
// The first statement sets clock to 0 at time = 0. The second statement specifies a loop that reexecutes 30 times to wait 10 time units and then complement the value of clock . This produces 15 clock cycles, each with a cycle time of 20 time units. 

// Using finish
initial
	begin
		clock = 1'b0;
	end

initial 300 $finish;
always #10 clock = ~clock;
// The first initial behavior has a single statement that sets clock to 0 at time = 0, and it then expires (causes no further simulation activity). The second single pass behavior declares a stopwatch for the simulation. The system task finish causes the simulation to terminate unconditionally after 300 time units have elapsed. Because this behavior has only one statement associated with it, there is no need to write the begin . . .end keyword pair. After 10 time units, the always statement repeatedly complements clock, providing a clock generator having a cycle time of 20 time units. The three behavioral statements in the second example can be written in any order.

// Using forever
initial 
	begin 
		clock = 0; 
		forever #10 
		clock = ~clock; 
	end
// Initializes the clock and then executes an indefinite loop (forever) in which the clock is complemented after a delay of 10 time steps. Note that the single-pass behavior never finishes executing and so does not expire. Another behavior would have to terminate the simulation.


```

---

## Always Statement

Behavioral descriptions use the keyword always, followed by an optional event control expression and a list of procedural assignment statements. The event control expression specifies when the statements will execute.  The procedural assignment statements inside the always block are executed every time there is a change in any of the variables listed after the @ symbol. (Note that there is no semicolon (;) at the end of the always statement.)



A sensitivity list is the expression that defines when the always block should be executed and is specified after the `@` operator within parentheses `( )`. This list may contain either one or a group of signals whose value change will execute the always block.

The target output of any assignment within an `always` block (the variable on the left-hand side) must be declared with the `reg` data type

### Level Sensitive Always Statement

A level-sensitive `always` block is used to model combinational logic, i.e., for non sequential circuits. It should execute whenever any of its inputs change value.
- **Syntax:** `always @(input_a or input_b or ...)`. The "or" can be replaced with a ",".
- **Modern Syntax (Recommended):** `always @(*)`. It automatically makes the block sensitive to **every** signal that is read inside it.

#### Incomplete Sensitivity List and Unintended Latches

If you forget to include an input signal in the sensitivity list, the block will _not_ re-execute when that signal changes. From a hardware perspective, this means that for certain input changes, the output must hold its previous value. The only hardware component that can "hold" a value is a memory element. Therefore, a synthesis tool will literally interpret this behavior and infer a latch to store the output.

### Edge Sensitive Always Statement

A level-sensitive `always` block is used to model sequential circuits. The primary purpose of an edge-sensitive `always` block is to model hardware that responds to a signal transition, not a signal level. These transitions are specified using the `posedge` (positive edge, 0 to 1 transition) or `negedge` (negative edge, 1 to 0 transition) keywords. 

#### Handling Asynchronous Control Signals

A common requirement is to model a flip-flop with an asynchronous reset or set input, which can change the flip-flop's state immediately, regardless of the clock. This is handled by adding the edge of the asynchronous signal to the sensitivity list and using an `if-else` statement to give it priority.

**The Correct Structure -**
1. Add the edge of the asynchronous signal to the sensitivity list (e.g., `negedge reset`).
2. Inside the block, use an `if` statement to check the asynchronous condition first.
3. The synchronous (clocked) behavior goes in the `else` part of the statement.

This structure ensures that asynchronous signals are given priority over the clock, exactly as they behave in hardware.
