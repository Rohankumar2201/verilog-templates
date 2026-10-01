# Verilog Templates

48 reusable Verilog and SystemVerilog RTL templates for digital design, verification and FPGA development.

**Live site:** https://verilog-templates.vercel.app

Search the library, filter by category, open a template, read the code and copy it into your project.

## What is inside

48 modules in 10 categories:

| Category | Count | Examples |
| --- | --- | --- |
| Combinational | 8 | comparator, decoder_3to8, mux_4to1, priority_encoder |
| Arithmetic | 6 | barrel_shifter, carry_lookahead_adder, mac_unit |
| Sequential | 11 | clock_divider, shift_register, switch_debouncer |
| FSM | 3 | mealy/moore sequence detectors, traffic_light_controller |
| Memory | 4 | single/dual port RAM, register_file, rom |
| FIFO | 2 | sync_fifo, async_fifo |
| Communication | 2 | uart_tx, uart_rx |
| Clock-domain Crossing | 3 | two_flop, pulse and handshake synchronizers |
| SystemVerilog | 4 | axi_lite_if, assertions, package example |
| Verification | 5 | clock/reset generators, self-checking testbenches |

Each template page shows the source with line numbers, syntax highlighting and a copy button, plus the review note for that file.

## About the review

The templates come from a reviewed and corrected library. According to that review:

- 48 files were reviewed: 15 defects corrected, 13 made more robust, 20 already correct.
- Files were simulated with Icarus Verilog 12.0 using self-checking testbenches, and linted with Verilator 5.020 (`-Wall`).

**Limitations**

- `sv_assertions_example.sv` uses the range delay `##[1:3]`, which neither Icarus nor Verilator 5.020 supports. It was reviewed by hand against IEEE 1800 and not simulated.
- Nothing was synthesized or timed.
- No CDC constraints or metastability analysis were run. The CDC modules are verified functionally only.
- Behavior that depends on a specific FPGA/ASIC tool (RAM inference, `ASYNC_REG` handling) should be confirmed in your own flow.

## Run locally

Requires Node.js 20 or newer.

```bash
git clone https://github.com/<your-username>/verilog-templates.git
cd verilog-templates
npm install
npm run dev
```

Build for production:

```bash
npm run build
npm run preview
```

## Project structure

```
index.html          entry page, applies the saved theme before load
src/
  main.tsx          mounts the app
  App.tsx           navbar, explorer, template view, usage, footer
  data.ts           types, category list, social links
  templates.json    the 48 templates (source of truth)
  highlight.ts      small Verilog/SystemVerilog syntax highlighter
  styles.css        styles and light/dark theme
```

It is a static React + TypeScript + Vite app with no backend. Routing is hash-based (`#/t/uart_rx.sv`), so it works on any static host.

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md).

## Author

Made by Rohan. [LinkedIn](https://www.linkedin.com/in/rohankumar2201/)
