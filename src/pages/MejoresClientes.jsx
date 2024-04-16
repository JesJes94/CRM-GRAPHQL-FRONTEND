import { useEffect } from 'react';
import { BarChart, Bar, Rectangle, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

import { useQuery, gql  } from '@apollo/client';
import { useLocation } from 'react-router-dom'
import Spinner from '../components/Spinner';

const MEJORES_CLIENTES = gql`
    query MejoresClientes {
        mejoresClientes {
            total
            cliente {
                nombre
                empresa
            }
        }
    }
`

const MejoresClientes = () => {

    const {pathname} = useLocation();
    localStorage.setItem('lastpath', pathname); 
    
    const {data, loading, error, startPolling, stopPolling} = useQuery(MEJORES_CLIENTES);

    useEffect( () => {
        startPolling(1000);
        return () => {
            stopPolling();
        }
    }, [startPolling, stopPolling])

    if(loading) return <Spinner />

    const { mejoresClientes } = data;

    const clienteGrafica = [];

    mejoresClientes.map((cliente, index) => {
        clienteGrafica[index] = {
            ...cliente.cliente[0],
            total: cliente.total 
        }
    })
    
  return (
    <div>
      <h2 className=' text-gray-800 text-2xl'>Mejores Clientes</h2>

      <BarChart
          className=' mt-10'
          width={500}
          height={300}
          data={clienteGrafica}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="nombre" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="total" fill="#16a34a" activeBar={<Rectangle fill="yellow" stroke="green" />} />
        </BarChart>
    </div>
  )
}

export default MejoresClientes
