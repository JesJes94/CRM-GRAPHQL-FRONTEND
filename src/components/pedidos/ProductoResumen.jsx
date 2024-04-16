import { useState, useEffect } from 'react'
import usePedidos from '../../hooks/usePedidos'

const ProductoResumen = ({producto}) => {

  const [cantidad, setCantidad] = useState(0);

  const { actualizarCantidad } = usePedidos();

  const {nombre, precio, id} = producto

  useEffect( () => {
    const nuevoProducto = {...producto, cantidad: Number(cantidad)}
    actualizarCantidad(id, nuevoProducto);
  }, [cantidad]);


  return (
    <div className='md:flex md:justify-between md:items-center mt-5'>
      <div className='md:w-1/2 mb-2 md:mb-0'>
        <p className=' text-sm'>{nombre}</p>
        <p>${precio} MXN</p>
      </div>

      <input 
        type='number'
        placeholder='Cantidad'
        className=' appearance-none shadow border w-full py-2 px-3 text-gray-700 leading-tight focus:leading-none focus:shadow-outline md:ml-4'
        onChange={e => setCantidad(e.target.value) }
      />
    </div>
  )
}

export default ProductoResumen
