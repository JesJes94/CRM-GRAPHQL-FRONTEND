import { createContext, useState } from "react";

const PedidosContext = createContext();

const PedidosProvider = ({children}) => {

    const [pedido, setPedido] = useState({
        cliente: {},
        productos: [],
        total: 0
    })

    const agregarCliente = cliente => {
        setPedido({...pedido, cliente})
    }

    const agregarProductos = productos => {

        let nuevoState

        if(productos.length > 0) {
            nuevoState = productos.map(producto => {
                const nuevoObjeto = pedido.productos.find(productoState => productoState.id === producto.id)
                return {...producto, ...nuevoObjeto}
            });

            setPedido({...pedido, productos: nuevoState})
        } else {
            setPedido({...pedido, productos})
        }
    }

    const actualizarCantidad = (id, producto) => {
        const productosActualizado = pedido.productos.map(productoState => 
              id === productoState.id ? producto : productoState  
        )

        setPedido({...pedido, productos: productosActualizado})
    }

    const actualizarTotal = () => {
        const total = pedido.productos.reduce((suma, producto) => producto.precio * producto.cantidad + suma, 0);

        setPedido({...pedido, total});
    }

    return (
        <PedidosContext.Provider
            value={{
                pedido,
                agregarCliente,
                agregarProductos,
                actualizarCantidad,
                actualizarTotal
            }}
        >  
            {children}
        </PedidosContext.Provider>
    )
}  

export {
    PedidosProvider
}

export default PedidosContext

