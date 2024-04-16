import { useState, useEffect } from 'react';
import Select from 'react-select';
import { useQuery, gql } from '@apollo/client' 
import usePedidos from '../../hooks/usePedidos';

import Spinner from '../Spinner'

const OBTENER_CLIENTES_USUARIO = gql`
  query obtenerClientesVendedor {
    obtenerClientesVendedor {
      id
      nombre
    }
  }
` 

const AsignarCliente = () => {

    const [cliente, setCliente] = useState([]);

    const { agregarCliente } = usePedidos();

    const {data, loading, error} = useQuery(OBTENER_CLIENTES_USUARIO);

    useEffect(() => {
        agregarCliente(cliente);
    }, [cliente])

    const seleccionarCliente = cliente => {
        setCliente(cliente);
    }

    if(loading) return <Spinner />

    const {obtenerClientesVendedor: clientes} = data;

  return (
    <>
      <p className=' bg-white border-l-4 border-gray-800 text-gray-700 p-2 text-sm font-bold'>1.- Asigna un cliente al pedido</p>

      <Select 
        className='mt-5'
        options={clientes}
        onChange={cliente => seleccionarCliente(cliente)}
        getOptionValue={opciones => opciones.id}
        getOptionLabel={opciones => opciones.nombre}
        placeholder='Seleccione un cliente'
        noOptionsMessage={() => 'No hay resultados'}
      />
    </>
  )
}

export default AsignarCliente
