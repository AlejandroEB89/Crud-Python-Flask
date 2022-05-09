from flask import Flask, render_template, jsonify, request
from flask_mysqldb import MySQL
from flask_cors import CORS, cross_origin

app = Flask(__name__)
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-type'
app.config['MYSQL_HOST'] = 'localhost'
app.config['MYSQL_USER'] = 'root'
app.config['MYSQL_PASSWORD'] = ''
app.config['MYSQL_DB'] = 'clientescrud'
mysql = MySQL(app)


# cross_origin se usa para poder llamar desde distintos puertos (solo en produccion)
@app.route('/api/clients/<int:id>')  # en estos casos estamos usando el GET
def getClient(id):
    cur = mysql.connection.cursor()
    cur.execute('SELECT * FROM clientes WHERE id=' + str(id))
    allData = cur.fetchall()
    content = {}
    for data in allData:
        content = {
            'id': data[0],
            'nombre': data[1],
            'apellido': data[2],
            'telefono': data[3],
            'email': data[4]
        }
    return jsonify(content)


@app.route('/api/clients')  #  GET
@cross_origin()
def getAllClients():
    cur = mysql.connection.cursor()
    cur.execute('SELECT * FROM clientes')
    allData= cur.fetchall()
    res = []
    for data in allData:
        content = {
                    'id': data[0],
                   'nombre': data[1],
                   'apellido': data[2],
                   'telefono': data[3],
                   'email': data[4]
                }
        res.append(content)
    return jsonify(res)

@app.route('/api/clients', methods=['POST'])  # aca necesito usar POST
@cross_origin()
def addClient():
    if 'id' in request.json:
        editClient()
    else:
        addClient()
    return "ok"

def addClient():
    cur = mysql.connection.cursor()
    cur.execute("INSERT INTO `clientes` (`id`, `nombre`, `apellido`, `telefono`, `email`) VALUES (NULL, %s, %s, %s, %s);",
                (request.json['nombre'], request.json['apellido'], request.json['telefono'], request.json['email']))
    mysql.connection.commit()
    return 'agrego cliente'


def editClient():
    cur = mysql.connection.cursor()
    cur.execute("UPDATE `clientes` SET `nombre` = %s, `apellido` = %s, `telefono` = %s, `email` = %s WHERE `clientes`.`id` = %s;",
                (request.json['nombre'], request.json['apellido'], request.json['telefono'], request.json['email'], request.json['id']))
    mysql.connection.commit()
    return 'edito cliente'

@app.route('/api/clients/<int:id>', methods=['DELETE'])  # Metodo DELETE
@cross_origin()
def deleteClient(id):
    cur = mysql.connection.cursor()
    cur.execute("DELETE FROM `clientes` WHERE `clientes`.`id` = " + str(id) +";")
    mysql.connection.commit()
    return 'borro cliente'

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/<path:path>')
def publicFiles(path):
    return render_template(path)

if __name__ == '__main__':
    app.run(None, 3000, True)
