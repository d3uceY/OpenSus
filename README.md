<div align="center">
  <img src="build/appicon.png" alt="OpenSus" width="96" height="96" />
  <h1>OpenSus</h1>
  <p>A desktop app for analysing GitHub repository activity and insights.</p>
  <p>Paste any public GitHub URL and instantly see contributors, releases, commit history, languages, branches, tags, and recent activity, all in one place.</p>
</div>

---

## Downloads <a name="downloads"></a>

Always downloads the **latest release**.

| Platform | Download |
|----------|----------|
| **Windows** (amd64) | [![Windows](https://img.shields.io/badge/Windows-amd64-0078D4?style=for-the-badge&logo=windows)](https://github.com/d3uceY/OpenSus/releases/latest/download/OpenSus-windows-amd64-installer.exe) |
| **macOS** (Apple Silicon) | [![macOS ARM64](https://img.shields.io/badge/macOS-arm64-000000?style=for-the-badge&logo=apple)](https://github.com/d3uceY/OpenSus/releases/latest/download/OpenSus-macos-arm64.dmg) |
| **macOS** (Intel) | [![macOS AMD64](https://img.shields.io/badge/macOS-amd64-000000?style=for-the-badge&logo=apple)](https://github.com/d3uceY/OpenSus/releases/latest/download/OpenSus-macos-amd64.dmg) |
| **Linux** (amd64) | [![Linux](https://img.shields.io/badge/Linux-amd64-FCC624?style=for-the-badge&logo=linux&logoColor=black)](https://github.com/d3uceY/OpenSus/releases/latest/download/OpenSus-linux-amd64) |

> All assets for every release are also available on the [Releases page](https://github.com/d3uceY/OpenSus/releases).

---

## Features

- **Repository overview** — stars, forks, open issues, watchers, license, topics
- **Contributors** — ranked list with commit counts
- **Releases** — version history with per-asset download counts
- **Language breakdown** — visual bar showing byte distribution
- **Commit activity** — sparkline of weekly commits over the past year
- **Contributor stats** — weekly additions/deletions per author
- **Activity feed** — recent push, branch, PR, and protection events
- **Branches & Tags** — full listing at a glance
- **History** — recent searches persisted locally across sessions
- **Offline-friendly caching** — 5-minute in-memory cache reduces API calls

## Requirements

OpenSus uses the public GitHub REST API. Without a token you get 60 requests/hour. Add a [Personal Access Token](https://github.com/settings/tokens) (no scopes required for public repos) via the **GitHub Token** button in the app to raise the limit to 5,000/hour.

## License

MIT © 2026 d3uceY
