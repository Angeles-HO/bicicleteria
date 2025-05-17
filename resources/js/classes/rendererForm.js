export class rendererForm {
    constructor(product, containerId = 'finalizar-compra') {
        this.product = product,
        this.container = document.getElementById(containerId);
    }

    /* 
        Guia:
        Mostrar Colores a seleccionar: ["colores"]
        Mostrar cantidad a comprar: ("en teoria si fuera una pagina de verdad se tebdria que hacer algo asi:
            si hay 20 en stock no se podrian comprar 20 de 1 solo color, habria que detallar que hay 4 negras 6 azules 10 verdes por ejemplo
            y si se selecciona mas de 1 ir añadiendo los radio justo con la cantidad de stock disponible con ese color
            pero lo dejo algo simple
        ")
        Mostrar metodos de pagos: ["efectivo": "3% de descuento", "tarjeta": "5% acreditar"]
        Opcion de seleccionar: ["envio a Domicilio": "5% acreditar", "retirar local": "nada"]
        Compra final: "Dependiendo de lo que fue seleccionando los usuarior ir agregando o disminuyendo la cantidad final"

        De alguna manera sin usar react demomento, mostrar una pantalla sobre todo para hacer una confirmacion de la compra, talvez en yt encuentre algo
    */
}