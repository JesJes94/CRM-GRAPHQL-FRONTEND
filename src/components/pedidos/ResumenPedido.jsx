import React from 'react'
import usePedidos from '../../hooks/usePedidos'

import ProductoResumen from './ProductoResumen';

const ResumenPedido = () => {

    const {pedido: {productos}} = usePedidos();

  return (
    <div>
      <p className='mt-10 bg-white border-l-4 border-gray-800 text-gray-700 p-2 text-sm font-bold'>3.- Ajusta las cantidades del producto</p> 

        { productos.length > 0 ? (
                <>
                 {productos.map(producto => 
                   <ProductoResumen 
                    key={producto.id}
                    producto={producto}
                   /> 
                 )}
                </>
            )
        :
            (
                <p className='mt-5 text-sm text-center'>Aún no hay productos</p>
            )
        }
    </div>
  )
}

export default ResumenPedido
