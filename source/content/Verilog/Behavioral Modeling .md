## Timing Controls

### Delay-Based Timing Control (`#`)

This control delays the execution of a procedural statement for a specified number of time units.

- **Regular Delay -** This is the most common form. The `#` operator precedes a statement and suspends its execution for the specified delay.
```verilog
// Delays execution of the entire statement by 10 time units.
#<delay> statement;
#10 y = 1;
```

- **Intra-assignment Delay -** This delay is placed on the right of the assignment operator. It works differently from a regular delay: the expression on the right-hand side is evaluated immediately, and the result is stored. The assignment to the left-hand side variable is then postponed by the specified delay.
```verilog
variable = #<delay> expression;
// x and z are evaluated at the current time,
// but y is updated with the result 5 time units later.
y = #5 x + z;
```

- **Zero Delay -** This is a special case used to help control the order of execution within a single simulation time step. A statement with a `#0` delay is executed last, after all other statements in that time step without a delay have been executed. This can help avoid race conditions in simulation. Syntax - `#0 statement;` However, if there are multiple zero delay statements, the order between them is nondeterministic.

```Verilog
initial
begin
    x = 0;
    y = 0;
end

initial
begin
    #0 x = 1; //zero delay control
    #0 y = 1;
end
```

Four statements—_x = 0, y = 0, x = 1, y = 1_—are to be executed at simulation time 0. However, since _x = 1_ and _y = 1_ have #0, they will be executed last. Thus, at the end of time 0, _x_ will have value 1 and _y_ will have value 1. The order in which _x = 1_ and _y = 1_ are executed is not deterministic.


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
//This is an example of a data buffer storing data after the last packet of data has arrived.

event received_data; //Define an event called received_data

always @(posedge clock) //check at each positive clock edge
begin
 if(last_data_packet) //If this is the last data packet
	 ->received_data; //trigger the event received_data
end

always @(received_data) //Await triggering of event received_data
					//When event is triggered, store all four

```

### Level-Sensitive Timing Control (`wait`)

This control is different from `@` because it waits for a condition to be true, not for a signal to change. The `wait` statement continuously monitors the value of an expression.

```Verilog
wait (expression) statement;
// Wait for count_enable to become true (logical 1), then execute the assignment.

// Example
always
	wait (count_enable) #20 count = count + 1;
// Count = count+1 happens only when count_enable = 1.

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
// Using repeat
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

The target output of any assignment within an `always` block (the variable on the left-hand side) must be declared with the `reg` data type.

It is not necessary for the always statement to be followed by @ everytime. It can be even be followed by `#delay` which is commonly used in testbenches. **`always #<delay>`** is used when you are creating a stimulus, like a clock, to test your hardware model in a simulation.

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

The machine normally performs its tasks in a rhythmic, step-by-step fashion (the clock). The emergency button (the asynchronous reset) can stop the machine immediately, at any time, overriding the normal rhythm.

**The Correct Structure -**
1. Add the edge of the asynchronous signal to the sensitivity list (e.g., `negedge reset`).
2. Inside the block, use an `if` statement to check the asynchronous condition first.
3. The synchronous (clocked) behavior goes in the `else` part of the statement.

This structure ensures that asynchronous signals are given priority over the clock, exactly as they behave in hardware.


```Verilog title:"D-Flip-Flop with Asynchronous Reset"
module DFF (output reg Q, input D, Clk, rst);

    always @(posedge Clk, negedge rst)
// posedge Clk - The normal, synchronous operate signal (the rising edge of the clock).
// negedge rst - The asynchronous emergency signal (the falling edge of the reset).
// The block will trigger and execute its code if **either** of these events occurs.
  
        if (!rst) // The asynchronous check (highest priority)
            Q <= 1'b0;
// When the always block is triggered, the very first thing it does is check the if condition. This statement asks, "Is the reset signal currently active?" (In this case, !rst is true when rst is 0). If the reset is active, the condition is true. The flip-flop's output Q is immediately assigned to 0. The else part is completely ignored. This happens regardless of why the block was triggered. Even if a posedge Clk and a negedge rst happen at the exact same instant, the if statement gives the reset priority. The hardware will be reset.

        else      // The synchronous (clocked) behavior
            Q <= D;
// This part of the code can only be reached if the if condition was false, meaning rst is not active (rst is 1). If the reset is not active, what could have triggered the block? The only other possibility in the sensitivity list is the posedge Clk. Therefore, the code inside the else block executes only on a positive clock edge and only when the reset is inactive. This is the definition of normal, synchronous flip-flop operation.
endmodule
```


## Procedural Assignments

The updating of a continuous assignment is triggered whenever an event occurs in a variable included on the right-hand side of its expression. In contrast, a procedural assignment is made only when an assignment statement is executed and assigns value to it within a behavioral statement.

### Non - Blocking Assignment

A non-blocking assignment is a type of procedural assignment that allows for scheduling assignments to happen concurrently, without blocking the execution of subsequent statements within the same `begin...end` block. Its purpose is to model the simultaneous state changes in synchronous hardware like flip-flops.

#### The Core Mechanism: A Two-Phase Process

The most crucial thing to understand about non-blocking assignments is how a simulator processes them. It happens in two distinct phases within a single simulation time step:

1. **Evaluation Phase -** When an event triggers the `always` block (e.g., a positive clock edge), the simulator evaluates the right-hand side (RHS) of **all** non-blocking assignments. It "reads" the current values of the variables on the RHS and stores the calculated results in temporary, internal storage. It does **not** update the left-hand side (LHS) variables yet.
2. **Assignment Phase -** Only after all RHS expressions in the block have been evaluated, the simulator takes the stored temporary values and assigns them to their corresponding LHS variables.

This two-phase mechanism is the key to everything. It ensures that the result of one assignment does not affect the evaluation of another assignment in the same clock cycle, perfectly modeling how multiple flip-flops in a real circuit all change state at the same time.


#### A Critical Use Case: Eliminating Race Conditions

The two-phase mechanism of non-blocking assignments prevents the simulation race conditions that occur with blocking assignments.


```Verilog title:"
// The Problem Code (with a race condition)
always @(posedge clock) a = b;
always @(posedge clock) b = a;
// This fails because the result depends on which statement the simulator executes first.
// Possibility 1 - The simulator executes `a = b;` first. The value of `b` is copied into `a`. Then, it executes `b = a;`. Since `a` _already has the new value_, the original value of `b` is copied into `b`. Result: Both registers end up with the original value of `b`. The swap fails.
    
// Possibility 2 - The simulator executes `b = a;` first. The value of `a` is copied into `b`. Then, it executes `a = b;`. Since `b` now has the new value, the original value of `a` is copied into `a`. Result: Both registers end up with the original value of `a`. The swap fails.

//The Correct Code (race-free)
always @(posedge clock) a <= b;
always @(posedge clock) b <= a;
```


**How the correct code works (every possibility):**

1. A `posedge clock` occurs.
    
2. **Evaluation Phase:**
    
    - The simulator evaluates the RHS of the first statement. It reads the **original value of `b`** and schedules it to be assigned to `a`.
    - The simulator evaluates the RHS of the second statement. It reads the **original value of `a`** and schedules it to be assigned to `b`.
    
3. **Assignment Phase:**
    
    - The simulator assigns the stored original value of `b` to `a`.
    - The simulator assigns the stored original value of `a` to `b`.

The swap works perfectly and predictably, every time, on every simulator, because the assignments are based on the values that existed _before_ the clock edge, not on the intermediate results of other assignments in the same clock cycle.


#### Application of nonblocking assignments

Having described the behavior of nonblocking assignments, it is important to understand why they are used in digital design. They are used as a method to model several concurrent data transfers that take place after a common event. Consider the following example where three concurrent data transfers take place at the positive edge of clock.

```Verilog
always @(posedge clock)
begin
    reg1 <= #1 in1;
    reg2 <= @(negedge clock) in2 ^ in3;
    reg3 <= #1 reg1; //The old value of reg1
end
```

At each positive edge of clock, the following sequence takes place for the nonblocking assignments.

1. A read operation is performed on each right-hand-side variable, in1, in2, in3, and reg1, at the positive edge of clock. The right-hand-side expressions are evaluated, and the results are stored internally in the simulator.
    
2. The write operations to the left-hand-side variables are scheduled to be executed at the time specified by the intra-assignment delay in each assignment, that is, schedule _"write"_ to reg1 after 1 time unit, to reg2 at the next negative edge of clock, and to reg3 after 1 time unit.
    
3. The write operations are executed at the scheduled time steps. The order in which the write operations are executed is not important because the internally stored right-hand-side expression values are used to assign to the left-hand-side values. For example, note that reg3 is assigned the old value of reg1 that was stored after the read operation, even if the write operation wrote a new value to reg1 before the write operation to reg3 was executed.


Thus, the final values of reg1, reg2, and reg3 are not dependent on the order in which the assignments are processed.
