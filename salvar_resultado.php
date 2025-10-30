<?php
date_default_timezone_set('America/Sao_Paulo');

$arquivo = "resultados_quiz.txt";

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // SALVAR RESULTADO
    $nome = $_POST['nome'] ?? 'Desconhecido';
    $score = $_POST['score'] ?? '0';
    $data = date('d/m/Y H:i:s');

    $linha = "Nome: $nome | Pontuação: $score | Data: $data\n";
    file_put_contents($arquivo, $linha, FILE_APPEND);
    echo "OK";
} 
else if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    // LISTAR RESULTADOS
    if (file_exists($arquivo)) {
        header("Content-Type: application/json; charset=utf-8");
        $linhas = file($arquivo, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
        $dados = [];
        foreach ($linhas as $linha) {
            if (preg_match('/Nome: (.*?) \| Pontuação: (\d+) \| Data: (.*)/', $linha, $m)) {
                $dados[] = ["name"=>$m[1], "score"=>(int)$m[2], "date"=>$m[3]];
            }
        }
        echo json_encode($dados);
    } else {
        echo json_encode([]);
    }
}
else if ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
    parse_str(file_get_contents("php://input"), $params);

    if (isset($params['nome'])) {
        // REMOVER APENAS UM JOGADOR
        $nomeRemover = $params['nome'];
        if (file_exists($arquivo)) {
            $linhas = file($arquivo, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
            $novas = [];
            foreach ($linhas as $linha) {
                if (strpos($linha, "Nome: $nomeRemover |") !== 0) {
                    $novas[] = $linha;
                }
            }
            file_put_contents($arquivo, implode("\n", $novas) . "\n");
        }
        echo "Removido: $nomeRemover";
    } else {
        // LIMPAR TODOS
        if (file_exists($arquivo)) {
            unlink($arquivo);
        }
        echo "Ranking limpo.";
    }
}
