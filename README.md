**RF** => Requisitos funcionais

**RNF** => Requisitos não funcionais

**RN** => Regras de negócio

# Cadastro de Carro

**RF**
[] Deve ser possível cadastrar um novo carro.
**RNF**

**RN**
[] Não deve ser possível cadastrar um carro com uma placa já existente.
[] O carro deve ser cadastrado, por padrão, com disponibilidade.
[] * O usuário responsável pelo cadastro deve ser um usuário administrador.


# Listagem de Carros

**RF**
[] Deve ser possível listar todos carros disponíveis.
[] Deve ser possível listar todos carros disponíveis pelo nome da categoria.
[] Deve ser possível listar todos carros disponíveis pelo nome da marca.
[] Deve ser possível listar todos carros disponíveis pelo nome do carro.

**RNF**

**RN**
[] O usuário não precisa estar logado no sistema.


# Cadastro de Especificação no Carro

**RF**
[] Deve ser possível cadastrar uma especificação para um carro

**RNF**

**RN**
[] Não deve ser possível cadastrar uma especificação para um carro não cadastrado.
[] Não deve ser possível cadastrar uma especificação já existente para o mesmo carro.
[] O usuário responsável pelo cadastro deve ser um usuário administrador.


# Cadastro de Imagem do Carro

**RF**
[] Deve ser possível a imagem do carro.

**RNF**
[] Utilizar o multer para upload dos arquivos

**RN**
[] O usuário deve poder cadastrar mais de uma imagem para o mesmo carro.
[] O usuário responsável pelo cadastro deve ser um usuário administrador.


# Aluguel de Carro

**RF**
[] Deve ser possível cadastrar um aluguel.


**RNF**

**RN**
[] O aluguel deve ter duração mínima de 24 horas.
[] Não deve ser possível cadastrar um novo aluguel, caso já exista um aberto para o mesmo usuário.
[] Não deve ser possível cadastrar um novo aluguel, caso já exista um aberto para o mesmo carro.
[] O usuário deve estar logado na aplicação.