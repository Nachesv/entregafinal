let carrito = new Array();
let cantidadItems = 0;
let precioTotal = 0;
const contenedorCarrito = document.querySelector('#lista-carrito tbody');
const carritoHover = document.querySelector('#carrito');
const producto = document.querySelectorAll('#store-card');
const listaProductos = document.querySelector('#tienda')
console.log(producto)


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

		},

	});

	mostrarCarrito();
	 $(".submenu").on({
	 	'click': function () {
	 		$(".submenu #carrito").slideToggle('slow');
	 	},

	 })
});

  for (let i = 0; i < producto.length; i++){

      producto[i].addEventListener('click', agregarProducto)

  }

function agregarProducto(e) {
    e.preventDefault();
    // obtenerDatos(e.target.parentElement);
	if (e.target.classList.contains('botonTienda')){

		const productoElegido = e.target.parentElement.parentElement;
		obtenerDatos(productoElegido);
	}
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
	if (e.target.classList.contains('borrar-producto')) {
		const productoId = e.target.getAttribute('data-id');

		/* Filtro los productos del carrito */
		carrito = carrito.filter(producto => producto.id != productoId);

		/* Renderizo el nuevo carrito */
		mostrarCarrito();

		
		cantidadItems-=1
		

		$("#contador-carrito").empty();
		

		if (cantidadItems == 0 || cantidadItems.isNaN()){
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
				<div class="card-body" style="color: black;">
					<p class="card-text" id="tituloProducto">${nombre}</p>
					<p class="card-text" id="precioProducto">${precio}</p>
					<button class="btn btn-primary btn-sm botonTienda" type="button" >
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
			<div class="card" style="width: 20rem;" data-toggle="modal" data-target="#myModal">
                <img src="${img}"  alt="...">
                <div class="card-body">
                    <h5 class="card-title tituloTarjeta"><a href="#">${titulo}</a></h5>
                    <p class="card-text textoTarjeta">${texto}</p>
                </div>
			</div>
			`
			const mainPage = document.querySelector('#main-page:last-child');
			mainPage.appendChild(divCard);
		}


		categorias.map((categoria, index) =>{

			console.log(categoria.categoria)

			if (categoria.categoria == 'Nintendo' || categoria.categoria == 'Playstation' || categoria.categoria == 'Multiconsola' ){
				const divCard = document.createElement('div');
		
				divCard.innerHTML = `
				<div class="card" style="width: 20rem;" data-toggle="modal" data-target="#myModal">
					<img src="${img}"  alt="...">
					<div class="card-body">
						<h5 class="card-title tituloTarjeta"><a href="#">${titulo}</a></h5>
						<p class="card-text textoTarjeta">${texto}</p>
					</div>
				</div>
				`
				const seccionConsolas = document.querySelector('#consolas:last-child');
				seccionConsolas.appendChild(divCard);
			}
			else{
				const li = document.createElement('li');
		
				li.innerHTML = `<li class="list-group-item titulosmall">${titulo}</li>`

				const seccionPC = document.querySelector('#titulosPc:last-child');
				seccionPC.appendChild(li);
			}
		})

		

	})

	$('#main-page').slideDown(1000)
	$('#consolas').slideDown(1000)
	$('#titulosPc').fadeIn(1000)
}



////--------OBJETOS PARA USAR PROXIMAMENTE-------------
// function Compra(productos, importe, metodoDePago,cantCuotas){
//     this.productos      = productos;
//     this.importe        = importe;
//     this.metodoDePago   = metodoDePago;
//     this.cantCuotas     = cantCuotas;
//     financiar = function(){
//         if (this.metodoDePago = 'C' && this.cantCuotas > 1){
//             importe = importe/cantCuotas
//         }
//     }
//     recibo = function(){
        

//         return `Productos ${Array.from(productos.nombre)}\n Importe final = ${importe} en ${cantCuotas}` 
//     }
// }

// function Noticia(titulo, subtitulo, cuerpo, imagenes, autor){
//     this.titulo     = titulo;
//     this.subtitulo  = subtitulo;
//     this.cuerpo     = cuerpo;
//     this.imagenes   = imagenes;
//     this.autor      = autor;
// }




////--------------------------------------------------------
