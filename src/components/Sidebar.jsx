import React from 'react'
import {Link, useLocation} from 'react-router-dom'

const Sidebar = () => {

  const { pathname } = useLocation();

  return (
    <aside className=' bg-gray-800 w-full md:w-1/4 xl:w-1/5 p-5'>
      <div>
        <p className='  text-white text-2xl font-bold text-center'>CRM - Clientes</p>
      </div>

      <nav className=' mt-10 list-none flex flex-col'>
        <li className={`mb-3 w-full p-2 rounded-sm text-center md:text-left ${pathname === '/usuario/clientes' ? 'bg-blue-800' : ''}`}>
            <Link to='/usuario/clientes' className=' text-white'>
                Clientes
            </Link>
        </li>
        <li className={`mb-3 w-full p-2 text-center rounded-sm md:text-left ${pathname === '/usuario/pedidos' ? 'bg-blue-800' : ''}`}>
            <Link to='/usuario/pedidos' className=' text-white'>
                Pedidos
            </Link>
        </li>
        <li className={`w-full p-2 text-center rounded-sm md:text-left ${pathname === '/usuario/productos' ? 'bg-blue-800' : ''}`}>
            <Link to='/usuario/productos' className=' text-white'>
                Productos
            </Link>
        </li>

        <div>
          <p className='  text-white text-2xl font-bold text-center my-5'>Otras opciones</p>
        </div>

        <li className={`mb-3 w-full p-2 text-center rounded-sm md:text-left ${pathname === '/usuario/mejoresvendedores' ? 'bg-blue-800' : ''}`}>
            <Link to='/usuario/mejoresvendedores' className=' text-white'>
                Mejores Vendedores
            </Link>
        </li>

        <li className={`mb-3 w-full p-2 text-center rounded-sm md:text-left ${pathname === '/usuario/mejoresclientes' ? 'bg-blue-800' : ''}`}>
            <Link to='/usuario/mejoresclientes' className=' text-white'>
                Mejores Clientes
            </Link>
        </li>

        
      </nav>
    </aside>
  )
}

export default Sidebar
