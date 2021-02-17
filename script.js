let carrito = new Array();
let cantidadItems = 0;
let precioTotal = 0;
let dataNoticias;
const contenedorCarrito = document.querySelector('#lista-carrito tbody');
const carritoHover = document.querySelector('#carrito');
const producto = document.querySelectorAll('#store-card');
const listaProductos = document.querySelector('#tienda')

const modalNoticia = document.querySelector('#myModal')


carritoHover.addEventListener('click', quitarProducto);




document.addEventListener('DOMContentLoaded', () => {
	carrito = JSON.parse(localStorage.getItem('carrito')) || [];

	cantidadItems = carrito.length;

	if (cantidadItems > 0){
		sumarContador();
	}

	$.ajax({
		url: 'productos.json',
		success: function (data, status, xhr) {
			stockProductos = data;
			cargarListaProductos(data);

		},

	});

	$.ajax({
		url: 'noticias.json',
		success: function (data, status, xhr) {
			
			cargarNoticias(data);
			dataNoticias = data;

		},

	});

	// producto = document.querySelectorAll('#store-card');

	mostrarCarrito();
	 $("#carritoImg").on({
	 	'click': function () {
	 		$(".submenu #carrito").slideToggle('slow');
	 	},

	 })

	$(document).on('click', '#noticia', function(e){ 
		redactoNoticia(e)
   });

   $(document).on('click', '#botonTienda', function(e){ 
	agregarProducto(e)
});


});

// $(document).ready(function(){
// 	$("#botonTienda").on({
// 		'click': function (e) {
// 			agregarProducto(e);
// 		},
// 	});})




function agregarProducto(e) {
    e.preventDefault();

	console.log(e)

    // obtenerDatos(e.target.parentElement);
	// if (e.target.classList.contains('botonTienda')){

		const productoElegido = e.target.parentElement.parentElement;
		obtenerDatos(productoElegido);
//	}
}

function obtenerDatos(producto){
    console.log(producto)
    const productoAgregado = {
        imagen: producto.querySelector('img').src,
        nombre: producto.querySelector('#tituloProducto').textContent,
        precio: producto.querySelector('#precioProducto').textContent,
        id: producto.getAttribute('data-id'),
		cantidad: 1
    }
    
    console.log(productoAgregado)

    const existe = carrito.some(producto => producto.id == productoAgregado.id)
    
    if (existe) {
		
		const productos = carrito.map(producto => {
			if (producto.id === productoAgregado.id) {
				producto.cantidad++;
				return producto;
			} else {
				return producto;
			}
		});
		carrito = [...productos];
	} else {
		
		carrito.push(productoAgregado);
		cantidadItems += 1;
	}
	
	sumarContador();

	mostrarCarrito();
	localStorage.setItem('carrito', JSON.stringify(carrito));
}

function redactoNoticia(e){
	e.preventDefault()
	const divId = e.target.closest('[data-id]')



	const varId = divId.getAttribute('data-id')
	
	
	let noticiaAnterior = document.querySelector('.modal-content')
	while(noticiaAnterior.firstChild){
		noticiaAnterior.removeChild(noticiaAnterior.firstChild)
	}
	


	dataNoticias.forEach(noticia => {
		const { img, titulo, texto, categorias, id } = noticia;
		
		if  (varId == id){
			let stringCategorias = new(String)
			stringCategorias = armoStringCategorias(categorias,stringCategorias)
			
			
			const divNoticia = document.createElement('div');
		
			divNoticia.innerHTML = `
			<div class="modal-header cabezal-modal">
				<img src="${img}" class="card-img-top" alt="...">

				<button type="button" class="close" data-dismiss="modal">&times;</button>
			</div>


			<div class="modal-body">
				<h4 class="modal-title">${titulo}</h4>
				<p>${texto}.</p> 
				
				<p>Categorias: ${stringCategorias}</p>
			</div>


			<div class="modal-footer">
				<button type="button" class="btn btn-danger" data-dismiss="modal">Cerrar</button>
			</div>

		`

		const contenidoNoticia = document.querySelector('.modal-content:last-child');
		contenidoNoticia.appendChild(divNoticia);
		}
	})
}

function armoStringCategorias(categorias, stringCategorias){
	categorias.forEach(categoria =>{
		
		stringCategorias += categoria.categoria + ' | '
	})
	return stringCategorias;
}

function mostrarCarrito() {

	
	limpiarCarrito();

	
	carrito.forEach(producto => {

		const { imagen, nombre, precio, cantidad, id } = producto;

		const row = document.createElement('tr');
		row.classList.add('fila-carrito')
		row.innerHTML = `
			<td style="color: black;">
				<img src="${imagen}" class="carrito-img">
			</td>
			<td style="color: black;">
				${nombre}
			</td>
			<td style="color: black;">
				${precio}
			</td> 
			<td style="color: black;">
				${cantidad}
			</td>
			<td>
				<a href="#" class="borrar-producto" data-id="${id}"> X </a>
			</td>
      	`
		contenedorCarrito.appendChild(row);
	});
}

function limpiarCarrito() {
	

	while (contenedorCarrito.firstChild) {
		contenedorCarrito.removeChild(contenedorCarrito.firstChild);
	}
}

function quitarProducto(e) {
	e.preventDefault()
	if (e.target.classList.contains('borrar-producto')) {
		const productoId = e.target.getAttribute('data-id');

		/* Filtro los productos del carrito */
		carrito = carrito.filter(producto => producto.id != productoId);

		/* Renderizo el nuevo carrito */
		mostrarCarrito();

		
		cantidadItems-=1
		

		$("#contador-carrito").empty();
		

		if (cantidadItems == 0 || isNaN(cantidadItems)){
			$("#contador-carrito").fadeOut();
		}else{
			$("#contador-carrito").append(`<strong> ${cantidadItems} </strong>`)
		}

		/* Actualizamos el storage */
		localStorage.setItem('carrito', JSON.stringify(carrito));
	}
}

function sumarContador(){
	

	$("#contador-carrito").fadeIn();
	$("#contador-carrito").empty();
	$("#contador-carrito").append(`<strong> ${cantidadItems} </strong>`)
}


function cargarListaProductos(productos) {
	$('#tienda').hide();
	productos.forEach((producto, index) => {

		const { nombre, imagen, precio, id, vendedor } = producto;


		const divCard = document.createElement('div');
		
		divCard.innerHTML = `
			<div class="card card-tienda " id="store-card" data-id="${id}">
				<img src="${imagen}" class="card-img-top" alt="...">
				<div class="card-body" style="color: black;" >
					<p class="card-text" id="tituloProducto">${nombre}</p>
					<p class="card-text" id="precioProducto">${precio}</p>
					<button class="btn btn-primary btn-sm botonTienda" id="botonTienda" type="button" >
						Agregar al carrito
					</button>
				</div>
			</div>
		`
		if (index % 6 === 0) {
			const row = document.createElement('div');
			row.classList.add('row','fila-tienda', 'top-buffer');

			listaProductos.appendChild(row);
			row.appendChild(divCard);
		} else {
			
			const row = document.querySelector('#tienda .row:last-child');
			row.appendChild(divCard);
		}


	})

	$('#tienda').slideDown(1000)
}

function cargarNoticias(noticias) {
	$('#main-page').hide();

	noticias.forEach((noticia, index) => {

		const { img, titulo, texto, categorias, id } = noticia;

		if (index === 1 || index === 2 || index === 3){
			const divCard = document.createElement('div');
			divCard.innerHTML = `
			<div class="card" id="noticia" style="width: 20rem;" data-toggle="modal" data-target="#myModal" data-id="${id}">
                <img src="${img}"  alt="...">
                <div class="card-body" >
                    <h5 class="card-title tituloTarjeta"><a href="#">${titulo}</a></h5>
                    <p class="card-text textoTarjeta">${texto.substring(0,180)+'...'}</p>
                </div>
			</div>
			`
			const mainPage = document.querySelector('#main-page:last-child');
			mainPage.appendChild(divCard);
		}


		categorias.forEach((categoria) =>{

			

			if (categoria.categoria != 'PC' ){
				const divCard = document.createElement('div');
				
				divCard.innerHTML = `
				<div class="card" id="noticia" style="width: 20rem;" data-toggle="modal" data-target="#myModal" data-id="${id}">
					<img src="${img}"  alt="...">
					<div class="card-body">
						<h5 class="card-title tituloTarjeta"><a href="#">${titulo}</a></h5>
						<p class="card-text textoTarjeta">${texto.substring(0,160)+'...'}</p>
					</div>
				</div>
				`
				const seccionConsolas = document.querySelector('#consolas:last-child');
				seccionConsolas.appendChild(divCard);
			}
			else{
				const lista = document.createElement('li');
				
				lista.innerHTML = `<li class="list-group-item titulosmall"  id="noticia" data-toggle="modal" data-target="#myModal" data-id="${id}"> ${titulo} </li>`

				const seccionPC = document.querySelector('#titulosPc:last-child');
				seccionPC.appendChild(lista);
				
			}
		})

		

	})

	$('#main-page').slideDown(1000)
	$('#consolas').slideDown(1000)
	$('#titulosPc').fadeIn(1000)
}




