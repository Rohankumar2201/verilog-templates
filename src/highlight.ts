const KEYWORDS = new Set(
  `module endmodule input output inout parameter localparam wire reg logic integer int bit real string
  genvar generate endgenerate assign always always_ff always_comb initial begin end if else case endcase
  default for forever repeat posedge negedge typedef enum interface endinterface modport package
  endpackage function endfunction automatic return property endproperty assert cover disable iff
  signed or`.split(/\s+/),
)

const token =
  /(\/\/.*)|("(?:[^"\\]|\\.)*")|(`\w+)|(\$\w+)|(\d*'[sS]?[bBhHdDoO][0-9a-fA-FxXzZ_]+|\b\d[\d_]*\b)|(\b[A-Za-z_]\w*\b)/g

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

export function highlight(src: string): string {
  let out = ''
  let last = 0
  for (const m of src.matchAll(token)) {
    out += esc(src.slice(last, m.index))
    last = m.index! + m[0].length
    const cls = m[1] ? 'c' : m[2] ? 's' : m[3] ? 'd' : m[4] ? 'f' : m[5] ? 'n' : KEYWORDS.has(m[0]) ? 'k' : ''
    out += cls ? `<span class="t-${cls}">${esc(m[0])}</span>` : esc(m[0])
  }
  return out + esc(src.slice(last))
}
