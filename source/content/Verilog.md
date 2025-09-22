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
