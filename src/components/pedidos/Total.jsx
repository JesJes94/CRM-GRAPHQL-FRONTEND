import { useEffect } from 'react'
import usePedidos from '../../hooks/usePedidos'

const Total = () => {

  const { pedido, actualizarTotal} = usePedidos();

  useEffect(() => {
    actualizarTotal();
  }, [pedido.productos])


  return (
    <div className=' flex items-center mt-5 p-2 justify-between bg-white border-solid border-2 border-gray-400'>
      <h2 className=' text-gray-800'>Total a pagar: </h2>
      <p className='text-gray-800 mt-0'>${pedido.total}</p>
    </div>
  )
}

export default Total
