const express = require('express');
const router = express.Router();
const connection = require('./db'); //

    // Rota para listar registros
    router.get('/listar-registros', (req, res) => {
        const sql = 'SELECT * FROM RIFA';
        connection.query(sql, (error, results) => {
        if (error) {
            console.error('Erro ao executar consulta:', error);
            res.status(500).send('Erro interno do servidor');
        } else {
            res.json(results);
        }
        });
    });
    
  // Rota para criar um novo registro
  router.post('/criar-registro', (req, res) => {
    const { num, nome, telefone } = req.body;
    const sql = 'INSERT INTO RIFA (num, nome, telefone) VALUES (?, ?, ?)';
  
    connection.query(sql, [num, nome, telefone], (error, results) => {
      if (error) {
        console.error('Erro ao criar registro:', error);
        res.status(500).send('Erro interno do servidor');
      } else {
        res.status(201).send('Registro criado com sucesso');
      }
    });
  });
  
  // Rota para atualizar um registro pelo ID
  router.put('/atualizar-registro/:id', (req, res) => {
    const id = req.params.id;
    const { num, nome, telefone } = req.body;
    const sql = 'UPDATE RIFA SET num=?, nome=?, telefone=? WHERE id=?';
  
    connection.query(sql, [num, nome, telefone, id], (error, results) => {
      if (error) {
        console.error('Erro ao atualizar registro:', error);
        res.status(500).send('Erro interno do servidor');
      } else {
        res.status(200).send('Registro atualizado com sucesso');
      }
    });
  });
  
  
  // Rota para excluir um registro pelo ID
  router.delete('/excluir-registro/:id', (req, res) => {
    const id = req.params.id;
    const sql = 'DELETE FROM RIFA WHERE id=?';
  
    connection.query(sql, [id], (error, results) => {
      if (error) {
        console.error('Erro ao excluir registro:', error);
        res.status(500).send('Erro interno do servidor');
      } else {
        res.status(200).send('Registro excluído com sucesso');
      }
    });
  });
  
  router.get('/listar-registros/:id', (req, res) => {
    const id = req.params.id;
    
    // Consulta SQL para obter um registro específico da tabela RIFA
    const sql = 'SELECT * FROM RIFA WHERE id = ?';
  
    connection.query(sql, [id], (error, result) => {
      if (error) {
        console.error('Erro ao obter registro:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
      } else {
        // Retorna o registro como JSON
        res.json(result[0]);
      }
    });
  });
  
  router.get('/gerar-numero-aleatorio', (req, res) => {
    const sql = 'SELECT num FROM RIFA WHERE nome IS NULL';
    
    connection.query(sql, (error, results) => {
      if (error) {
        console.error('Erro ao obter números não nulos:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
      } else {
        if (results.length === 0) {
          res.json({ randomNumber: null });
        } else {
          const randomNumber = results[Math.floor(Math.random() * results.length)].num;
          res.json(randomNumber);  // Retorna apenas o número aleatório, sem o objeto
        }
      }
    });
  });
  
  router.get('/numeros-preenchidos', (req, res) => {
    // Consulta SQL para obter números com nome não nulo
    const sqlNotNull = 'SELECT count(*) as total FROM RIFA WHERE nome IS NOT NULL';
  
    // Consulta SQL para obter números com nome nulo
    const sqlNull = 'SELECT count(*) as total FROM RIFA WHERE nome IS NULL';
  
    // Executa as consultas em paralelo
    connection.query(sqlNotNull, (errorNotNull, resultNotNull) => {
      if (errorNotNull) {
        console.error('Erro ao obter registros com nome não nulo:', errorNotNull);
        res.status(500).json({ error: 'Erro interno do servidor' });
      } else {
        // Executa a segunda consulta dentro do callback da primeira
        connection.query(sqlNull, (errorNull, resultNull) => {
          if (errorNull) {
            console.error('Erro ao obter registros com nome nulo:', errorNull);
            res.status(500).json({ error: 'Erro interno do servidor' });
          } else {
            // Retorna ambos os resultados como JSON
            res.json({ notNull: resultNotNull, isNull: resultNull });
          }
        });
      }
    });
  });
  
  
  router.get('/', (req, res) => {
    res.render('index');
  });
  
  // Definir a rota para a página lista.ejs
  router.get('/lista', (req, res) => {
    res.render('lista'); // Assume que você configurou o EJS como seu mecanismo de visualização
  });

  
module.exports = router;