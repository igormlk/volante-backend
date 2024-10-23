// build.js
import esbuild from 'esbuild'

esbuild.build({
  entryPoints: ['./index.js'], // Arquivo de entrada principal
  bundle: true, // Empacota todas as dependências em um único arquivo
  minify: true, // Minimiza o código para produção
  platform: 'node', // Define como plataforma Node.js
  target: 'node14', // Define a versão-alvo do Node.js
  outfile: 'dist/index.js', // Arquivo de saída
}).catch(() => process.exit(1));
