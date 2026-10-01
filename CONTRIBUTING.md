# Contributing

Thanks for helping improve Verilog Templates. Bug reports, fixes and new templates are welcome.

## Report a problem

Open an issue and include:

- the template filename
- what you expected and what happened
- the simulator or lint tool and its version
- a minimal testbench or waveform description if the problem is in the RTL

## Set up

```bash
git clone https://github.com/<your-username>/verilog-templates.git
cd verilog-templates
npm install
npm run dev
```

Before opening a pull request, run `npm run build`. It must finish without errors.

## Change or add a template

All templates live in `src/templates.json`. Each entry has these fields:

| Field | Meaning |
| --- | --- |
| `name` | module name without extension, for example `uart_rx` |
| `filename` | file name with extension (`.v` or `.sv`) |
| `category` | one of the ten categories listed in `src/data.ts` |
| `language` | `Verilog` or `SystemVerilog` |
| `status` | `VERIFIED`, `IMPROVED` or `FIXED` |
| `description` | one short sentence |
| `notes` | what was found or changed, and any limits |
| `code` | the full source, no truncation |

Keep the existing order. Do not rename a `filename` that is already published, because template links use it.

## RTL guidelines

- Put the purpose, parameter limits and any reset or latency behavior in a short header comment.
- Use non-blocking assignments in clocked blocks and blocking assignments in combinational blocks.
- Avoid inferred latches. Give combinational outputs a default value.
- Check parameter limits at elaboration where a bad value would break the module.
- Keep modules small and single-purpose. If a template depends on another one, say so in its header.
- Do not claim synthesis, timing or CDC results unless you ran them and can say with which tool and settings.

## Test your change

For a new or modified template, include evidence in the pull request:

- a self-checking testbench, and the simulator and version you used, for example Icarus Verilog 12.0 with `-g2012`
- lint output, for example `verilator --lint-only -Wall <file>`
- any behavior you could not test

Maintainers decide the final `status` label.

## Pull requests

1. Fork the repository and create a branch, for example `fix-uart-rx-stop-bit`.
2. Make one focused change per pull request.
3. Run `npm run build`.
4. Push your branch and open a pull request describing what changed and how you tested it.

## Code style for the site

- Keep the project small. Avoid new dependencies unless there is a clear need.
- Match the existing style. Comment only where something is not obvious.
- Keep the interface responsive and keyboard friendly, with visible focus states.
