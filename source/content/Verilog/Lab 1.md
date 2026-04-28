```verilog title:"dff with chip select"
module D_ff (
    input clk,
    input chipSelect,
    input reset,
    input regWrite,
    input enable,
    input d,
    output reg q
);

    always @(posedge clk) begin
        // Everything happens only if the chip is selected
        if (chipSelect) begin
            if (reset) begin
                q <= 1'b0; // Synchronous reset to 0
            end 
            else if (enable && regWrite) begin
                q <= d;    // Capture input d 
            end
            // If none of the above, q implicitly retains its value
        end
    end

endmodule
```