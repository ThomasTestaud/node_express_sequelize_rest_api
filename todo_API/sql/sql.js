const mysql = require('mysql');
const pool = mysql.createPool({
    host: '127.0.0.1',  // The hostname or IP address of your MySQL server
    port: 8889,        // The port number
    user: 'root',
    password: 'root',
    database: 'todo_express'
});
/**
 * Fonction utilitaire permettant de faire une requête
 * 
 * Arguments: 
 *   query : Chaîne de caractères d'une requête SQL
 *   callback : Fonction de rappel qui sera appelée avec le résultat de la requête en cas de succès
 * 
 * Attention ! En cas d'erreur une exception sera levée, il faut entourer les appels à cette fonction par un try/except
 * try {
 *     sqlQuery(....)
 * } except {
 *     // Gestion de l'erreur ici
 * }
 * 
 * Exemple d'utilisation
 * try {
 *   sqlQuery("SELECT * FROM ma_table", (results) => {
 *     console.log(results);
 *   })
 * } catch (error) {
 *   console.log(error);   
 * }
 */
function sqlQuery(query, callback){
    pool.getConnection((connError, connection) => {
        if(connError){
            console.log(connError);
            throw new Error("Connection error " + connError);
        }
        try {
            connection.query(query, (error, result) => {
                if(error){
                    console.log(error);
                    throw new Error("Query error " + error);
                }
                
                callback(result);
            });
        } catch(error){
            throw new Error("Unexpected error occured : " + error);
        }
        connection.release();
    });
}
    module.exports = sqlQuery;