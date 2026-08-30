<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Browser automation (agent-browser)

Always give `agent-browser` commands a hard 2-minute cap (120000 ms) — the tool-call
timeout alone is not enough; wrap each command so it is killed at 120 s even if the
daemon hangs on first launch or a stuck tab:

```powershell
$job = Start-Job { agent-browser <args> };   # substitute real args
if (Wait-Job $job -Timeout 120) { Receive-Job $job } else { Stop-Job $job; "TIMED OUT after 120s" }
Remove-Job $job -Force
```

If a command times out, recover with `agent-browser doctor --offline --quick` and/or
`agent-browser close --all` (also wrapped), then retry once before giving up.
