# tsconfig-diff

Compare two tsconfig files

## Installation

    # Yarn
    yarn global add tsconfig-diff

    # NPM
    npm install --global tsconfig-diff

## Usage

Compare two tsonfig files:

```bash
tsconfig-diff <base> <target>
```

## Example

Let's check differences between `tsconfig.app.json` and `tsconfig.server.json`.

```bash
tsconfig-diff tsconfig.app.json tsconfig.server.json
```

**tsconfig.app.json**

```json
{
  "compilerOptions": {
    "outDir": "dist/app",
    "target": "es2015",
    "declaration": true,
  }
}
```

**tsconfig.server.json**

```json
{
  "compilerOptions": {
    "outDir": "dist/server",
    "target": "es2015",
    "declaration": true,
  }
}
```

Result:

```diff
  {
    "compilerOptions" {
-     "outDir": "dist/app",
+     "outDir": "dist/server",
      "target": "es2015",
      "declaration": true
    }
  }
```


In `tsconfig.app.json` we had `dist/app`, in `tsconfig.server.json` there's `dist/server`.

