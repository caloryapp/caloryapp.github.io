# Development Notes

## Publish Beta To npm

Run these commands from the project root (`calory/`):

```bash
# 1) Check current version
npm pkg get version

# 2) Bump prerelease beta version
npm version prerelease --preid=beta

# 3) Publish using beta dist-tag
npm publish --tag beta --access public
```

Optional verification:

```bash
# Check dist-tags (latest, beta, etc.)
npm view @caloryapp/calculator dist-tags

# Check published versions
npm view @caloryapp/calculator versions --json
```
