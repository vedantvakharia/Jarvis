## Adders

```verilog title:"Half adder"
// Dataflow
module ha_df(input a, b, output s, c);
    assign {c, s} = a + b;
endmodule

// Structural 
module ha_str(input a, b, output s, c);
    xor g1(s, a, b);
    and g2(c, a, b);
endmodule

// Behavioral
module ha_beh(input a, b, output reg s, c);
    always @* {c, s} = a + b;
endmodule
```

```verilog title:"Full adder"
// Dataflow
module fa_df(input a, b, cin, output s, cout);
	assign {cout, s} = a + b + cin;
endmodule

// Structural
module fa_str(input a, b, cin, output s, cout);
	wire w1, w2, w3;
	xor x1(s, a, b, cin);
	and a1(w1, a, b), a2(w2, b, cin), a3(w3, a, cin);
	or o1(cout, w1, w2, w3);
endmodule

// Behavioral
module ha_beh(input a, b, cin, output s, cout);
	always @* {cout, s} = a + b +cin;
endmodule
```

```verilog title:"BCD Adder"
// Dataflow
module bcd_df(input [3:0] a, b, input cin, output [3:0] s, output cout);
	wire [4:0] d = a + b + cin;
	assign cout = (d > 9);
	assign s = cout ? (d+6) : d; // Truncatation of vector, discards MSB
endmodule

// Strcutural
// Helper module
module adder4(input [3:0] a, b, input cin, output [3:0] s, output cout);
	assign {cout, s} = a + b + cin;
endmodule

module bcd_str(input [3:0] a, b, input cin, output [3:0] s, output cout);
	wire [3:0] z, y;
	wire c1, c2, adj, t1, t2;
	
	adder4 add1(a, b, cin, z, c1);
	
	// If z>9, we add 6. adj = 1 if c1 = 1 or z>9.
	// z>9 when z[3] = 1 and (z[2] = 1 or z[1] = 1).
	or o1(t1, z[2], z[1]);
	and a1(t2, o1, z[3]);
	or o2(adj, t2, c1);
	
	assign cout = adj;
	
	adder4 add2(z, 4'b0110, 1'b0, y, c2);
	assign s = adj ? y : z;
endmodule

// Behavioral
module bcd_beh(input [3:0] a, b, input cin, output reg [3:0] s, output reg cout);
	reg [4:0] sum_temp; 
	always @(*) begin
		sum_temp  = a + b + cin;
		
		if(sum_temp>9) {cout, s} = sum_temp + 6;
		else if begin
			s = sum_temp;
			cout = 0;
		end
	end
endmodule
```

## Multipliers

```verilog title:"Multiplier"
// Dataflow
module mul_df(input [1:0] a, b, output [3:0] p);
	assign p = a*b;
endmodule

// Behavioral
module mul_bf(input [1:0] a, b, output reg [3:0] p);
	always @* p = a*b;
endmodule

// Multiplier code will be same for all a bit x b bit numbers, only the input and output vector will change when using dataflow and behavioral. 

// Structural for 4x3
module mul4x3_str(input [3:0] a, input [2:0] b, output [6:0] p);
    wire [3:0] pp0, pp1, pp2; // Partial products
    wire [6:0] sum1;

    // 1. Generate Partial Products (AND gates)
    and g0[3:0](pp0, a, {4{b[0]}}); // a * b[0]
    and g1[3:0](pp1, a, {4{b[1]}}); // a * b[1]
    and g2[3:0](pp2, a, {4{b[2]}}); // a * b[2]
    // {4{b[0]}} means that we need to make 4 copies of b[0] so that the number becomes b[0], b[0], b[0], b[0].

    // 2. Summation (Shift and Add)
    // sum1 = pp0 + (pp1 << 1)
    adder7 add1({3'b0, pp0}, {2'b0, pp1, 1'b0}, sum1);
    // We are padding here because the output needs 7 bit output. Also, we don't directly add ro1 and ro2, we shift the row2 1 left and then add in multiplication.
    // p = sum1 + (pp2 << 2)
    adder7 add2(sum1, {1'b0, pp2, 2'b0}, p);

endmodule

// Helper adder module
module adder7(input [6:0] x, y, output [6:0] s);
    assign s = x + y;
endmodule
```

## Decoders

```verilog title:Decoders
module dec3to8_en_df(input [2:0] in, input en, output [7:0] out);
    assign out = en ? (1'b1 << in) : 8'b0; // With enable
    // For 4 to 16 decoder, it will be 16'b0 instead of 8'b0.
    assign out = 1'b1<<in; // Without enable, same for both cases. 
endmodule

module dec3to8_en_beh(input [2:0] in, input en, output reg [7:0] out);
    always @* out = en ? (1'b1 << in) : 8'b0; // With enable
    // For 4 to 16 decoder, it will be 16'b0 instead of 8'b0.
    always @* out = 1'b1<<in; // Without enable, same for both cases. 
endmodule
```

## Encoders

```verilog title:Encoders
// Dataflow
module enc8to3_df(input [7:0] i, output [2:0] y);
    assign y [2] = i[4]|i[5]|i[6]|i[7];
    assign y [1] = i[2]|i[3]|i[6]|i[7];
    assign y [0] = i[1]|i[3]|i[5]|i[7];
endmodule

// Behavioral
module enc8to3_beh(input [7:0] i, output reg [2:0] y);
    always @* begin
        y[2] = i[4] | i[5] | i[6] | i[7];
        y[1] = i[2] | i[3] | i[6] | i[7];
        y[0] = i[1] | i[3] | i[5] | i[7];
    end
endmodule

// Strcutural
module enc8to3_str(input [7:0] i, output [2:0] y);
    or g2(y[2], i[4], i[5], i[6], i[7]);
    or g1(y[1], i[2], i[3], i[6], i[7]);
    or g0(y[0], i[1], i[3], i[5], i[7]);
endmodule
```

```verilog title:"Priority Encoder"
module pe4to3_df(input [3:0] d, output [2:0] y);
    assign y[2] = |d;                       // Valid bit (OR reduction)
    assign y[1] = d[3] | d[2];              // Bit 1
    assign y[0] = d[3] | (~d[2] & d[1]);    // Bit 0
endmodule

module pe4to3_beh(input [3:0] d, output reg [2:0] y);
	integer i;
	always @* begin
	y = 0;
		for(i = 0; i < 4, i = i+1)
			if(d[i]) y = i[2:0];
			// i is first converted to bin, then sliced for it's last 3 digits
	end
	// Use loops if there are like 8 or 16, where for loop will be better than writing cases. We can use cases for 4:3 as there are only 4 cases. 
endmodule

module pe4to3_str(input [3:0] d, output [2:0] y);
    wire not_d2, term;
    
    or valid(y[2], d[3], d[2], d[1], d[0]); // Valid Bit
    or out1 (y[1], d[3], d[2]);             // Bit 1 logic
    
    // Bit 0 logic: d[3] + (!d[2] * d[1])
    not inv2(not_d2, d[2]);
    and and1(term, not_d2, d[1]);
    or  out0(y[0], d[3], term);
endmodule
```

## MUX

```verilog title:"2:1 MUX"
module mux2to1_df(input a, b, s, output y)
	assign y = s ? b : a;
endmodule

module mux2to1_beh(input a, b, s, output reg y)
	always @* begin
		if(s) y = b;
		else y = a;
	end
endmodule
```

```verilog title:"4:1 MUX"
module mux4to1_df(input [3:0] i, input [1:0] s, output y)
	assign y = i[s];
endmodule

module mux4to1_beh(input [3:0] i, input [1:0] s, output y)
	always @* begin
		case (s)
			2'b00 : y = i[0];
			2'b00 : y = i[0];
			2'b00 : y = i[0];
			2'b00 : y = i[0];
		endcase
	end
endmodule
```

## Latches

```verilog title:"Latches"
module srnorlatch(input s, r, output reg q, qn)
	always @* begin
		if(s) {q, qn} = 2'b10;
		else if(r) {q, qn} = 2'b01;
		// For all the other cases, q and qn don't change as they are supossed to as those cases have not been mentioned.
	end
endmodule

module srnandlatch(input s, r, output reg q, qn)
	always @* begin
		if(~s) {q, qn} = 2'b10;
		else if(~r) {q, qn} = 2'b01;
	end
endmodule

module srenlatch(input s, r, en, output reg q, qn)
	always @* begin
		if(en) begin
			if(s) {q, qn} = 2'b10;
			else if(r) {q, qn} = 2'b01;
		end
	end
endmodule

module dlatch(input d, en, output reg q, qn)
	always @* begin
		if(en) begin
			if(d) {q, qn} = 2'b10;
			else if {q, qn} = 2'b01;
		end
	end
endmodul
```









## Mealy Finite State Machine

## Using Behavioral Modeling

```verilog title:"3 Always blocks"
module mealy_fsm (
    // -- Port Declarations --
    input        clk,
    input        reset_n,
    input        x_in,
    output       <output_name>
);

    // -- 1. State Declaration and Encoding --
    // Use parameters for readable state names
    parameter <S0_name> = 2'b00;
    parameter <S1_name> = 2'b01;
    // ... add more states as needed

    // State registers
    reg [1:0] state, next_state;

    // -- 2. State Register Block (Sequential Logic) --
    // This block models the D flip-flops that hold the machine's state.
    always @(posedge clk or negedge reset_n) begin
        if (!reset_n)
            state <= <S0_name>; // Asynchronous reset to an initial state
        else
            state <= next_state; // On a clock edge, update the state
    end

    // -- 3. Next-State Logic Block (Combinational Logic) --
    // This block determines the next state based on the current state and inputs.
    always @(state, in) begin
        case (state)
            <S0_name>: if (<input_name>) next_state = <S1_name>;
                       else            next_state = <S0_name>;
            
            <S1_name>: // ... logic for transitions from S1
            
            // ... add cases for all other states

            default: next_state = <S0_name>; // Default to a safe state
        endcase
    end

    // -- 4. Output Logic Block (Combinational Logic - MEALY) --
    // This block determines the output based on the current state AND current inputs.
    always @(state, x_in) begin
        case (state)
            <S0_name>: if (<input_name>) <output_name> = <value_1>;
                       else            <output_name> = <value_2>;

            <S1_name>: if (<input_name>) <output_name> = <value_3>;
                       else            <output_name> = <value_4>;

            // ... add cases for all other states

            default: <output_name> = <default_value>; // Default output
        endcase
    end

endmodule
```

```verilog title:"2 Always blocks"
module FSM (input clk, input reset, input in, output reg out);

	reg [1:0]state; nextState;
	
	parameter S0 = 2'b00, S1 = 2'b01, S2 = 2'b10;
	
	always @(posedge clk, posedge reset) begin
		if(reset)
			state <= S0;
		else
			state <= nextState;
		end
	
	always @(state, in) begin
		case (state)
			S0: begin
				if(!in) begin
					nextState = S0;
					out = ;
				end
				else begin
					nextState = S1;
					out = ;
				end
			end
	// ... add cases for all other states

		endcase
	end
endmodule
```
