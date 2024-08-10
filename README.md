 
```markdown
# Git Commit CLI

Uma ferramenta CLI para adicionar e commitar arquivos não rastreados e modificados em um repositório Git.

## Instalação

Para instalar o pacote globalmente e usá-lo em qualquer projeto, execute:

```bash
npm install -g git-commit-lib
```

Ou você pode instalar localmente em um projeto específico e usar com `npx`:

```bash
npm install git-commit-lib
```

## Uso

Depois de instalar, você pode usar o comando `commit-kat` para adicionar e commitar arquivos em seu repositório Git.

### Comando Básico

```bash
npx commit-kat
```

### Flags

- `--all` ou `-a`: Comita todos os arquivos não rastreados e modificados de uma vez.
  ```bash
  npx commit-kat --all
  ```

- `--push` ou `-p`: Comita os arquivos e faz um `git push` no final.
  ```bash
  npx commit-kat --push
  ```

- `--all --push` ou `-a -p`: Comita todos os arquivos de uma vez e faz um `git push` no final.
  ```bash
  npx commit-kat --all --push
  ```

### Exemplos

1. **Adicionar e commitar arquivos não rastreados e modificados separadamente:**

   ```bash
   npx commit-kat
   ```

2. **Adicionar e commitar todos os arquivos de uma vez:**

   ```bash
   npx commit-kat --all
   ```

3. **Adicionar e commitar arquivos, e fazer um push para o repositório remoto:**

   ```bash
   npx commit-kat --push
   ```

4. **Adicionar e commitar todos os arquivos de uma vez e fazer um push:**

   ```bash
   npx commit-kat --all --push
   ```

## Conventional Commits

O `commit-kat` segue a [Conventional Commits](https://www.conventionalcommits.org/) para criar mensagens de commit mais informativas e padronizadas:

- **`feat:`** Para novos recursos ou adições.
- **`fix:`** Para correções de bugs.
- **`chore:`** Para tarefas e manutenção do projeto (como exclusões de arquivos).

### Exemplo de Mensagens de Commit

- **Para arquivos não rastreados (adicionados):**
  ```bash
  git commit -m "feat: commit 1 - arquivo_exemplo.js"
  ```

- **Para arquivos modificados:**
  ```bash
  git commit -m "fix: commit 2 - arquivo_modificado.js"
  ```

- **Para arquivos excluídos:**
  ```bash
  git commit -m "chore: commit 3 - arquivo_excluido.js"
  ```

## Autor

João Afonso Katombela  
[LinkedIn](https://www.linkedin.com/in/joao-afonso-katumbela)  
[GitHub](https://github.com/katumbela)

## Contribuindo

Contribuições são bem-vindas! Sinta-se à vontade para enviar pull requests ou relatar problemas.

## Licença

Este projeto está licenciado sob a MIT License - veja o arquivo [LICENSE](LICENSE) para detalhes.
```
 