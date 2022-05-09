document.addEventListener('DOMContentLoaded', init);
const URL_API = 'http://localhost:3000/api/'
var clients = [];



function openModal() {
    modalElement= document.getElementById( "modal" );
    modalElement.setAttribute( "class", "modale opened" );
    
}

function clear() {
    document.getElementById('id').value = '';
    document.getElementById('nombre').value = '';
    document.getElementById('apellido').value = '';
    document.getElementById('tel').value = '';
    document.getElementById('email').value = '';

}

function addClient() {
    openModal();
    clear();
    document.getElementById('modalTitle').innerHTML = 'Agregar Cliente';
}


function closeModal() {
    modalElement= document.getElementById( "modal" );
    modalElement.setAttribute( "class", "modale" );
}

function init() {
    search();
}

async function search(){

    let url = URL_API + 'clients';
    let response = await fetch( url, {
        'method': 'GET',
        'headers': {'Content-type': 'application/json'}
        })

    clients = await response.json();
    
    
    html = ''; 
    for (client of clients) {
        let registro = `
        <tr>
        <td> ${client.nombre} </td>
        <td> ${client.apellido} </td>
        <td> ${client.telefono} </td>
        <td> ${client.email} </td>
        <td> <button onclick="editClient(${client.id})"> Editar </button> <button onclick="deleteClient(${client.id})" class="eliminar"> Eliminar </button> </td>
        </tr>
        `;
    html = html + registro; 
    }

    

    document.querySelector("#tableBody").outerHTML = html;
}


async function deleteClient(id) {
    respuesta = confirm("Esta seguro que desea eliminarlo?");
    if (respuesta) {
        let url = URL_API + 'clients/' + id;
        await fetch( url, {
            'method': 'DELETE',
            'headers': {'Content-type': 'application/json'}
            })
        alert('Se eliminó correctamente');
        window.location.reload();  // recargar la pagina una vez eliminado
    }
}


async function saveClient() {
        debugger;
        var data = {
            'nombre': document.getElementById('nombre').value,
            'apellido': document.getElementById('apellido').value,
            'telefono': document.getElementById('tel').value,
            'email': document.getElementById('email').value,
        }

        var id = document.getElementById('id').value;
        if ( id != '') { 
            data.id = id;
            console.log(id) ;
        }

        let url = URL_API + 'clients';
        await fetch( url, {
            'method': 'POST',
            'body' : JSON.stringify(data),
            'headers': {'Content-type': 'application/json'}
            })
        alert('Se guardó correctamente');
        window.location.reload();
}

 function editClient(id){
    openModal();
    clientToEdit = clients.find( clnt => clnt.id == id);
    console.log(clientToEdit);
    
    document.getElementById('modalTitle').innerHTML = 'Editar Cliente';
    document.getElementById('id').value = clientToEdit.id;
    document.getElementById('nombre').value = clientToEdit.nombre;
    document.getElementById('apellido').value = clientToEdit.apellido;
    document.getElementById('tel').value = clientToEdit.telefono;
    document.getElementById('email').value = clientToEdit.email;

    
}


