let readline = require("readline-sync");
let {MongoClient, ObjectId} = require("mongodb");

let username = "usuario";
let password = "1234567890";
let cluster = "Cluster0";
let dbName = "1571432412014";
let collectionName = "1571432412014_atividade";

const url = `mongodb+srv://${username}:${password}@${cluster}.6zbcylw.mongodb.net/${dbName}?retryWrites=true&w=majority`;

// mongodb+srv://<db_username>:<db_password>@cluster0.6zbcylw.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0

const client = new MongoClient(url);

function exibirMenu(){
    let op = 0;
    console.clear();
    console.log("CRUD MongoDB");
    console.log("1 - Inserir");  
    console.log("2 - Alterar");         
    console.log("3 - Listar"); 
    console.log("4 - Localizar");
    console.log("5 - Excluir");
    console.log("6 - Sair");
    op = parseInt(readline.question("Opcao: "));
    return op;
}

async function main(){
   
    let db = "";
    let collection = "";

    let atividades = "";
    let id = "";
    let nome = "";
    let descricao = "";
    let data = "";
    let realizada = "";

    let op ="";
    let resultado = "";
    let filtro = "";

//programa principal
    try {

        await client.connect();
        console.log("Conexao efetuada como o banco de dados MongoDB");
        db = client.db(dbName);
        collection = db.collection(collectionName);
        //.....
        while(op!=6){
            op = exibirMenu();

            if(op == 1){
                //inserir
                nome = readline.question("Nome: ");
                descricao = readline.question("Descricao: ");
                data = readline.question("Data: ");
                realizada = readline.question("Realizada (Sim ou Nao): ");
                atividade = {'nome':nome, 'descricao':descricao, 'data':data, 'realizada':realizada};
                resultado = await collection.insertOne(atividade);
                console.log("Atividade inserida:",resultado.insertedId);
                readline.question("Pressione enter para voltar para o menu.");
            }

            if(op == 2){
                //Alterar
                id = readline.question("Id: ");
                filtro = {'_id':new ObjectId(id)}
                atividades = await collection.find(filtro).toArray();
                console.log("Atividade a ser alterada:",atividades[0]);
                console.log("Informe os novos dados da atividade");
                nome = readline.question("Nome: ");
                descricao = readline.question("Descricao: ");
                data = readline.question("Data: ");
                realizada = readline.question("Realizada: ");
                atividade = {$set: {'nome':nome, 'descricao':descricao, 'data':data, 'realizada':realizada}};
                resultado = await collection.updateOne(filtro,atividade);
                readline.question("Pressione enter para voltar para o menu.");
            }

            if(op == 3){
                //Listar
                atividades = await collection.find({}).toArray();
                console.log('Lista de atividades: ',atividades);
                readline.question("Pressione enter para voltar para o menu.");
            }

            if(op == 4){
                //Localizar
                nome = readline.question("Nome: ");
                filtro = {'nome':{'$regex':`${nome}`,'$options':'i'}};
                atividades = await collection.find(filtro).toArray();
                console.log('Lista de atividades: ',atividades);
                readline.question("Pressione enter para voltar para o menu.");
            }

            if(op == 5){
                //Excluir
                id = readline.question("Id: ");
                filtro = {'_id':new ObjectId(id)}
                resultado = await collection.deleteOne(filtro);
                if(resultado.deletedCount > 0){
                    console.log("Registro excluido com sucesso!!!!!");
                }else{
                    console.log("Registro não encontrado!!!!!");
                }
                readline.question("Pressione enter para voltar para o menu.");
            }
        }

    } catch (error) {
        console.error(error);
    } finally {
        await client.close();
    }
}
main().catch(console.error);