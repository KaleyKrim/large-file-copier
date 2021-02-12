# large-file-copier

CLI tool to copy specific lines of text from one file to another

## Usage

```sh
npm run copy -- --fp ${fromFilePath} --tp ${toFilePath} --fl ${fromLineNum} --tl ${toLineNum}

Options:
  --help             Show help                                         [boolean]
  --version          Show version number                               [boolean]
  --from-path, --fp                                          [string] [required]
  --to-path, --tp                                            [string] [required]
  --from-line, --fl                                                     [number]
  --to-line, --tl                                                       [number]
```

## Examples
```sh
npm run copy -- --fp ./super-big-file.sql --tp ./smaller-file.sql --fl 10000 --tl 15000
```
