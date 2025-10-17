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
