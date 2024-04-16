import {BrowserRouter, Routes, Route} from 'react-router-dom'
import { ApolloProvider } from '@apollo/client'

import { AuthProvider } from './context/AuthContext'
import { PedidosProvider } from './context/PedidosContext'

import Layout from './layout/Layout'
import RutaProtegida from './layout/RutaProtegida'

import Login from './pages/Login'
import NuevaCuenta from './pages/NuevaCuenta'

import Clientes from './pages/Clientes'
import NuevoCliente from './pages/NuevoCliente'
import EditarCliente from './pages/EditarCliente'
import Pedidos from './pages/Pedidos'
import NuevoPedido from './pages/NuevoPedido'
import Productos from './pages/Productos'
import NuevoProducto from './pages/NuevoProducto'
import EditarProducto from './pages/EditarProducto'
import MejoresVendedores from './pages/MejoresVendedores'
import MejoresClientes from './pages/MejoresClientes'

import client from './config/apollo.js'

export default function App() {

  return (
    <ApolloProvider client={client}>
      <AuthProvider>
        <PedidosProvider>
          <BrowserRouter>
            <Routes>
              <Route path='/' element={<Layout />}>
                <Route index element={<Login />}/>
                <Route path='nuevacuenta' element={<NuevaCuenta />}/>
              </Route>

              <Route path='/usuario' element={<RutaProtegida />}>
                <Route path='clientes' element={<Clientes />} />
                <Route path='nuevocliente' element={<NuevoCliente />} />
                <Route path='editarcliente/:id' element={<EditarCliente />}/>
                <Route path='pedidos' element={<Pedidos />} />
                <Route path='nuevopedido' element={<NuevoPedido />}/>
                <Route path='productos' element={<Productos />} />
                <Route path='nuevoproducto' element={<NuevoProducto />}/>
                <Route path='editarproducto/:id' element={<EditarProducto />}/>
                <Route path='mejoresvendedores' element={<MejoresVendedores />}/>
                <Route path='mejoresclientes' element={<MejoresClientes />}/>
              </Route>
            </Routes>
          </BrowserRouter>
        </PedidosProvider>
      </AuthProvider>
    </ApolloProvider>
  )
}


