import {useState, useEffect }from 'react'
import Select from 'react-select'
import { useQuery, gql } from '@apollo/client'
import usePedidos from '../../hooks/usePedidos'

import Spinner from '../Spinner'

const OBTENER_PRODUCTOS = gql`
    query obtenerProductos {
        obtenerProductos {
            id
            nombre
            cantidad
            precio
        }
    }
`

const AsignarProductos = () => {

    const [productos, setProductos] = useState([]);

    const {data, loading, error} = useQuery(OBTENER_PRODUCTOS);

    const { agregarProductos } = usePedidos();

    useEffect( () => {
        agregarProductos(productos)
    }, [productos])

    const seleccionarProductos = productos => {
        setProductos(productos)
    }

    if (loading) return <Spinner />

    const {obtenerProductos: listaProductos} = data;

  return (
    <>
     <p className='mt-10 bg-white border-l-4 border-gray-800 text-gray-700 p-2 text-sm font-bold'>2.- Selecciona los productos del cliente</p> 

     <Select 
        className='mt-5'
        options={listaProductos}
        isMulti={true}
        onChange={productos => seleccionarProductos(productos)}
        getOptionValue={opciones => opciones.id}
        getOptionLabel={opciones => `Producto: ${opciones.nombre} - ${opciones.cantidad} Disponibles`}
        placeholder='Seleccione los productos'
        noOptionsMessage={() => 'No hay resultados'}
     />
    </>
  )
}

export default AsignarProductos
