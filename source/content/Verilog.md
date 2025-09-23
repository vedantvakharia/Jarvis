## Gates

```verilog title:Gates
// Use ~ inside gate to flip

gate_type [instance_name] (output_port, input_port1, input_port2, ...);

and g1(O, I1, I2);
nand g2(O, I3, I4);
or g3(O, I4, I5);
nor g4(O, I6, I7);
xor g5(O, I8, I9);
xnor g6(O, I10, I11);
not g7(O, I);
buf g8(O, I);
```


## Vectors 

```verilog
// Declaring a Vector
// You declare a vector by specifying its type (wire, reg, etc.) and its range of bit indices in square brackets. The standard convention is [msb:lsb], where msb is the most significant bit and lsb is the least significant bit.

wire [7:0] data_bus;   // An 8-bit wire vector, indexed 7 down to 0
reg  [3:0] counter;    // A 4-bit register vector, indexed 3 down to 0

// Indexing 
wire ls_bit;
assign ls_bit = data_bus[0]; // Assigns the least significant bit of data_bus

// Slicing
wire [3:0] lower_nibble;
wire [3:0] upper_nibble;

assign lower_nibble = data_bus[3:0]; // Accesses bits 3, 2, 1, and 0
assign upper_nibble = data_bus[7:4]; // Accesses bits 7, 6, 5, and 4

// Concatenation
wire [3:0] A = 4'b1111;
wire [3:0] B = 4'b0000;
wire [7:0] Y;
wire [2:0] Z;

assign Y = {A, B};            // Y becomes 8'b11110000
assign Z = {A[0], B[3:2]};    // Z becomes 3'b100
```


## Behavioral Modeling

The target output of a procedural assignment statement must be of the reg data type. Contrary to the wire data type, whereby the target output of an assignment may be continuously updated, a reg data type retains its value until a new value is assigned.

### Always

Behavioral descriptions use the keyword always, followed by an optional event control expression and a list of procedural assignment statements. The event control expression specifies when the statements will execute.  The procedural assignment statements inside the always block are executed every time there is a change in any of the variables listed after the @ symbol. (Note that there is no semicolon (;) at the end of the always statement.)

A level-sensitive `always` block is used to model **combinational logic**. It should execute whenever any of its inputs change value.
- **Syntax:** `always @(input_a or input_b or ...)`
- **Modern Syntax (Recommended):** `always @(*)`. It automatically makes the block sensitive to **every** signal that is read inside it.

### Loops

For every case, specify the value. If for any case, a value is not given, then a latch occurs. 

#### If else


```verilog title:If-else
// The begin and end keywords are optional if you only have one statement in the block.

// Simple if
if (condition) begin
    // statement(s) to execute
end

// if-else
if (condition) begin
    // statements if true
end
else begin
    // statements if false
end

// if else-if else
// This form is used for multiple, prioritized conditions. It creates a priority encoder where the first true condition is executed and the rest are ignored.
if (condition_1) begin
    // statements for condition 1
end
else if (condition_2) begin
    // statements for condition 2
end
else begin
    // statements if no conditions are met
end


// If you write a level-sensitive always block but your if-else structure does not assign a value to every variable in every possible branch, Verilog will infer a latch to hold the previous value.
always @(*) begin
	if (select == 1'b1) begin
		Y = A;
	end
	// MISTAKE: What happens to Y if select is 0?
	// Verilog creates a latch to remember the last value.
end

// CORRECT: No latch is created
always @(*) begin
	Y = 1'b0; // Assign a default value
	if (select == 1'b1) begin
		Y = A;
	end
end


//4to1 MUX
module mux_4_to_1 (
    output reg Y,
    input A, B, C, D,
    input [1:0] sel
);

    always @(*) begin
        // Use a cascaded if-else if-else structure
        if (sel == 2'b00)
            Y = A;
        else if (sel == 2'b01)
            Y = B;
        else if (sel == 2'b10)
            Y = C;
        else // This covers the sel == 2'b11 case
            Y = D;
    end

endmodule
```

### Switches

The `case` statement compares an `expression` to a list of `case_items`. When it finds the first match, it executes the associated statements and then exits the block. If multiple case items could match the expression (e.g., in a `casex` statement), only the first one in the list will be executed.

A case statement has the following parts
- **Case statement header -** Consists of the case, casez, or casex followed by _case expression_
- **Case expression -** the expression in parentheses immediately following the **case** keyword. Valid expressions include constants (e.g. 1’b1), an expression that evaluates to a constant, or a vector
- _Case item_—the expression that is compared against the _case expression_. Note that C-style **break** is implied following each _case item statement_
- _Case item statement_—one or more statements that is executed if the _case item_ matches the current _case expression_. If more than one statement is required, they must be enclosed with **begin…end**
- _Case default_—optional, but can include statements to be executed if none of the defined _case items_ match the current case expression

- **`x` (Unknown):** This represents a state that is logically unknown. The simulator cannot determine if the value is a `0` or a `1`. This often occurs due to conflicting driver signals or uninitialized registers.
- **`z` (High-Impedance):** This represents a state where a wire is not being driven by any source, effectively like an open circuit. This is the state produced by a disabled three-state buffer.
  
  
```verilog
// Standard case
case (expression)
    case_item_1: begin
        // statements to execute
    end
    case_item_2: begin
        // statements to execute
    end
    default: begin
        // optional: statements if no other item matches
    end
endcase


// Casez
// casez allows z and ? to be treated as don’t care values in either the case expression and/or the case item when doing case comparison. 
always @(irq) begin
  {int2, int1, int0} = 3'b000;
  casez (irq)
    3'b1?? : int2 = 1'b1;
    3'b?1? : int1 = 1'b1;
    3'b??1 : int0 = 1'b1;
    default: {int2, int1, int0} = 3'b000;
  endcase
end

// Casex
// This version treats any x or z or ? bits in either the case expression or the case_item as don't-cares. This is useful for simplifying logic where certain bits are irrelevant.
case (sel) // sel is a 4-bit vector
    4'b101x: Y = A; // Matches if sel is 1010 or 1011
    4'b0x1z: Y = B; // Matches 0010, 0011, 0110, 0111
endcase

//casez
// same as casex, just using z and ?, and not x.

// If a case item needs to execute more than one statement, you must enclose those statements in a `begin...end` block. Forgetting this is a common syntax error.
case (sel)
    2'b00: begin
        Y = A;
        flag = 1'b1;
    end
    // ...
endcase
```


## Study later

## Edge-Sensitive Sensitivity List (for Sequential Logic)

An edge-sensitive `always` block is used to model **sequential logic**, like flip-flops. It executes only at a specific signal transition (the clock edge).

- **Syntax:** `always @(posedge clk)` or `always @(negedge clk)`
    
- **`posedge`**: Triggers on the rising edge of the clock (0 to 1).
    
- **`negedge`**: Triggers on the falling edge of the clock (1 to 0).
    

This is how you model a flip-flop that only changes its state at the exact moment of a clock tick.

### Handling Asynchronous Resets

You can make a block sensitive to both a clock edge and an asynchronous signal.

**Example: D Flip-Flop with Asynchronous Reset**

Verilog